import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { recordCouponUsage } from "@/lib/coupon-service";

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (webhookSecret) {
      // Validate signature if secret is present
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(bodyText)
        .digest("hex");

      if (expectedSignature !== signature) {
        console.error("Invalid webhook signature");
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    } else {
      console.warn("RAZORPAY_WEBHOOK_SECRET is not configured. Trusting payload unconditionally (DANGEROUS IN PRODUCTION).");
    }

    const event = JSON.parse(bodyText);

    switch (event.event) {
      case "payment.captured": {
        const paymentData = event.payload.payment.entity;
        const razorpayOrderId = paymentData.order_id;
        const razorpayPaymentId = paymentData.id;

        // Find payment record
        const payment = await prisma.payment.findUnique({
          where: { providerOrderId: razorpayOrderId },
          include: {
            order: {
              include: {
                orderItems: true,
              },
            },
          },
        });

        if (!payment) {
          console.error(`Payment not found for Razorpay order: ${razorpayOrderId}`);
          return NextResponse.json({ error: "Payment not found" }, { status: 404 });
        }

        // Check if already captured (idempotency)
        if (payment.status === "captured") {
          return NextResponse.json({ received: true });
        }

        // Use transaction for atomic operations
        await prisma.$transaction(async (tx) => {
          // Update payment status
          await tx.payment.update({
            where: { id: payment.id },
            data: {
              providerPaymentId: razorpayPaymentId,
              status: "captured",
            },
          });

          // Update order status
          await tx.order.update({
            where: { id: payment.orderId },
            data: {
              status: "PAID",
              statusHistory: {
                create: {
                  status: "PAID",
                  note: "Payment successfully captured",
                },
              },
            },
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
                // Atomic conditional update - only decrement if stock is sufficient
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
                  // Stock was insufficient - this shouldn't happen if validation was correct
                  // But we handle it gracefully
                  console.error(
                    `Insufficient stock for variant ${item.variantId} during inventory decrement`
                  );
                  // We don't throw here because the payment already succeeded
                  // In production, you'd want to alert and handle this case
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

        break;
      }
      case "payment.failed": {
        const paymentData = event.payload.payment.entity;
        const razorpayOrderId = paymentData.order_id;
        const razorpayPaymentId = paymentData.id;

        const payment = await prisma.payment.findUnique({
          where: { providerOrderId: razorpayOrderId },
        });

        if (payment && payment.status !== "failed") {
          await prisma.payment.update({
            where: { id: payment.id },
            data: {
              providerPaymentId: razorpayPaymentId,
              status: "failed",
            },
          });

          await prisma.order.update({
            where: { id: payment.orderId },
            data: {
              status: "FAILED",
              statusHistory: {
                create: {
                  status: "FAILED",
                  note: "Payment failed",
                },
              },
            },
          });
        }
        break;
      }

      // We can handle more events later if needed
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
