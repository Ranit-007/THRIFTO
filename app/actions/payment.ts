"use server";

import crypto from "crypto";
import { prisma } from "@/lib/prisma";

import { recordCouponUsage } from "@/lib/coupon-service";

export type VerifyPaymentInput = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export async function verifyPayment(
  data: VerifyPaymentInput
): Promise<{ success: boolean; error?: string; orderId?: string }> {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return { success: false, error: "Missing required payment details" };
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error("RAZORPAY_KEY_SECRET is not set.");
      return { success: false, error: "Server configuration error" };
    }

    // Hash the combination of order_id and payment_id using secret
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    // Verify signature
    if (generatedSignature !== razorpay_signature) {
      console.error("Invalid signature detected for order", razorpay_order_id);
      return { success: false, error: "Invalid payment signature" };
    }

    // Find the payment record
    const payment = await prisma.payment.findUnique({
      where: { providerOrderId: razorpay_order_id },
      include: {
        order: {
          include: {
            orderItems: true,
          }
        }
      }
    });

    if (!payment) {
      console.error("Payment record not found for provider order ID", razorpay_order_id);
      return { success: false, error: "Payment record not found" };
    }

    // Use transaction for atomic operations
    await prisma.$transaction(async (tx) => {
      // Update payment record
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          providerPaymentId: razorpay_payment_id,
          providerSignature: razorpay_signature,
          status: "captured",
        },
      });

      // Update order status to PAID
      await tx.order.update({
        where: { id: payment.orderId },
        data: {
          status: "PAID",
          statusHistory: {
            create: {
              status: "PAID",
              note: "Payment successfully captured",
            }
          }
        }
      });

      // Check if inventory already processed (idempotency)
      const order = await tx.order.findUnique({
        where: { id: payment.orderId },
        select: { inventoryProcessedAt: true, couponCode: true },
      });

      if (order && !order.inventoryProcessedAt) {
        // Decrement inventory for each order item
        for (const item of payment.order.orderItems) {
          if (item.variantId) {
            // Atomic conditional update
            const result = await tx.productVariant.updateMany({
              where: {
                id: item.variantId,
                stock: { gte: item.quantity },
              },
              data: {
                stock: { decrement: item.quantity },
                inventoryUpdatedAt: new Date(),
              },
            });

            if (result.count === 0) {
              console.error(
                `Insufficient stock for variant ${item.variantId} during inventory decrement`
              );
            }
          }
        }

        // Mark inventory as processed
        await tx.order.update({
          where: { id: payment.orderId },
          data: { inventoryProcessedAt: new Date() },
        });

        // Record coupon usage if applicable
        if (order.couponCode) {
          const coupon = await tx.coupon.findUnique({
            where: { code: order.couponCode },
          });

          if (coupon) {
            await recordCouponUsage(tx, coupon.id, payment.order.userId, payment.orderId);
          }
        }
      }
    });

    return { success: true, orderId: payment.orderId };
  } catch (error: unknown) {
    console.error("Payment verification error:", error);
    return { success: false, error: "An unexpected error occurred during verification" };
  }
}
