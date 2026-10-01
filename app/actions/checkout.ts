"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getProductById } from "@/lib/shop-data";
import { store } from "@/config/store";
import { razorpay } from "@/lib/razorpay";
import { validateCoupon } from "@/lib/coupon-service";
import { z } from "zod";
import crypto from "crypto";

const CartItemSchema = z.object({
  productId: z.string(),
  size: z.string(),
  color: z.string(),
  quantity: z.number().int().positive(),
});

const CheckoutAddressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  addressLine1: z.string().min(3, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(5, "Postal code is required"),
  country: z.string().default("India"),
});

const CreateOrderInputSchema = z.object({
  items: z.array(CartItemSchema).min(1, "Cart cannot be empty"),
  shippingAddress: CheckoutAddressSchema.nullable().optional(),
  addressId: z.string().optional(),
  couponCode: z.string().optional(),
});

export type CheckoutState = {
  success?: boolean;
  error?: string;
  orderId?: string;
  razorpayOrderId?: string;
  amount?: number;
  currency?: string;
  keyId?: string;
  customer?: {
    name: string;
    email: string;
    phone: string;
  };
  discount?: number;
  couponCode?: string;
};

export async function createCheckoutOrder(
  data: z.infer<typeof CreateOrderInputSchema>
): Promise<CheckoutState> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Authentication required to checkout" };
    }

    const userId = session.user.id;
    const parsed = CreateOrderInputSchema.safeParse(data);

    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message || "Invalid input data" };
    }

    const { items, shippingAddress, addressId, couponCode } = parsed.data;

    // Must have either an existing address or a new address
    if (!addressId && !shippingAddress) {
      return { error: "A shipping address is required" };
    }

    // Validate if an existing address was selected, ensure ownership
    let finalShipping = shippingAddress;
    if (addressId) {
      const savedAddress = await prisma.address.findFirst({
        where: { id: addressId, userId },
      });
      if (!savedAddress) {
        return { error: "Selected address not found or does not belong to your account" };
      }
      finalShipping = {
        fullName: savedAddress.fullName,
        phone: savedAddress.phone,
        addressLine1: savedAddress.addressLine1,
        addressLine2: savedAddress.addressLine2 || undefined,
        city: savedAddress.city,
        state: savedAddress.state,
        postalCode: savedAddress.postalCode,
        country: savedAddress.country,
      };
    }

    // Strictly validate items, check inventory, and compute subtotal on the server
    let subtotal = 0;
    const validatedItems: {
      productId: string;
      productName: string;
      variantId: string;
      variantSize: string;
      variantColor: string;
      unitPrice: number;
      quantity: number;
      totalPrice: number;
      images: string[];
    }[] = [];

    const productIds: string[] = [];
    const categoryIds: string[] = [];

    for (const item of items) {
      const product = await getProductById(item.productId);
      if (!product) {
        return { error: `Product with ID "${item.productId}" is not available.` };
      }

      productIds.push(product.id);
      // Look up the category ID for coupon applicability validation
      if (product.category) {
        const categoryRecord = await prisma.category.findFirst({
          where: { name: product.category },
          select: { id: true },
        });
        if (categoryRecord && !categoryIds.includes(categoryRecord.id)) {
          categoryIds.push(categoryRecord.id);
        }
      }

      // Find the variant and validate inventory
      let unitPrice = product.price;
      let variantId = "";
      let variantRecord = null;

      if (product.variants && product.variants.length > 0) {
        const variant = product.variants.find(
          (v) =>
            v.size.toLowerCase() === item.size.toLowerCase() &&
            v.color.toLowerCase() === item.color.toLowerCase()
        );

        if (!variant) {
          return { error: `Selected variant (${item.size} / ${item.color}) is not available for ${product.name}.` };
        }

        variantId = variant.id;
        variantRecord = await prisma.productVariant.findUnique({
          where: { id: variant.id },
          select: { stock: true, available: true, id: true },
        });

        if (!variantRecord) {
          return { error: `Variant not found for ${product.name}.` };
        }

        if (!variantRecord.available) {
          return { error: `${product.name} (${item.size} / ${item.color}) is currently unavailable.` };
        }

        if (variantRecord.stock < item.quantity) {
          return {
            error: `Insufficient stock for ${product.name} (${item.size} / ${item.color}). Only ${variantRecord.stock} available.`,
          };
        }

        if (variant.price !== null && variant.price !== undefined) {
          unitPrice = variant.price;
        }
      }

      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;

      validatedItems.push({
        productId: product.id,
        productName: product.name,
        variantId,
        variantSize: item.size,
        variantColor: item.color,
        unitPrice,
        quantity: item.quantity,
        totalPrice,
        images: product.images,
      });
    }

    // Validate coupon if provided
    let discountAmount = 0;
    let validatedCouponCode: string | null = null;

    if (couponCode && couponCode.trim()) {
      const couponResult = await validateCoupon(
        couponCode,
        userId,
        subtotal,
        productIds,
        categoryIds
      );

      if (!couponResult.valid) {
        return { error: couponResult.error };
      }

      discountAmount = couponResult.discount;
      validatedCouponCode = couponResult.coupon.code;
    }

    // Compute shipping server-side
    const shippingAmount =
      subtotal >= store.shipping.freeThreshold ? 0 : store.shipping.flatRate;

    // Final total: subtotal - discount + shipping
    const totalAmount = subtotal - discountAmount + shippingAmount;

    // finalShipping is guaranteed non-null here (guarded by early return above)
    if (!finalShipping) {
      return { error: "A shipping address is required" };
    }

    // Create Order in DB
    const dateStr = new Date().getFullYear();
    const randomHex = crypto.randomBytes(3).toString("hex").toUpperCase();
    const orderNumber = `BAU-${dateStr}-${randomHex}`;

    const order = await prisma.order.create({
      data: {
        userId,
        orderNumber,
        status: "PENDING",
        subtotal,
        shippingAmount,
        totalAmount,
        currency: "INR",
        couponCode: validatedCouponCode,
        discountAmount,
        shippingFullName: finalShipping.fullName,
        shippingPhone: finalShipping.phone,
        shippingAddressLine1: finalShipping.addressLine1,
        shippingAddressLine2: finalShipping.addressLine2,
        shippingCity: finalShipping.city,
        shippingState: finalShipping.state,
        shippingPostalCode: finalShipping.postalCode,
        shippingCountry: finalShipping.country,
        orderItems: {
          create: validatedItems.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            variantId: item.variantId || null,
            variantSize: item.variantSize,
            variantColor: item.variantColor,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            totalPrice: item.totalPrice,
            images: item.images,
          })),
        },
        statusHistory: {
          create: {
            status: "PENDING",
            note: "Order placed, awaiting payment",
          },
        },
      },
    });

    // Create Razorpay order
    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.create({
        amount: totalAmount, // amount in paise
        currency: "INR",
        receipt: `rcpt_${order.id.slice(0, 10)}`,
        notes: {
          orderId: order.id,
          userId: userId,
        },
      });
    } catch (rzpError: unknown) {
      console.error("Razorpay order creation failed:", rzpError);
      // Update order to FAILED
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "FAILED" },
      });
      return { error: "Failed to initialize payment gateway. Please try again." };
    }

    // Record Payment attempt
    await prisma.payment.create({
      data: {
        orderId: order.id,
        provider: "RAZORPAY",
        providerOrderId: razorpayOrder.id,
        amount: totalAmount,
        currency: "INR",
        status: "created",
      },
    });

    return {
      success: true,
      orderId: order.id,
      razorpayOrderId: razorpayOrder.id,
      amount: totalAmount,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID || "",
      customer: {
        name: finalShipping.fullName,
        email: session.user.email || "",
        phone: finalShipping.phone,
      },
      discount: discountAmount > 0 ? discountAmount : undefined,
      couponCode: validatedCouponCode || undefined,
    };
  } catch (error: unknown) {
    console.error("Error creating checkout order:", error);
    return { error: error instanceof Error ? error.message : "An unexpected error occurred" };
  }
}
