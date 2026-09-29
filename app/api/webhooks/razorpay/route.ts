import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

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

    // Implement idempotency by finding first if we've already handled this event?
    // Often Razorpay sends multiple identical webhooks, but our DB updates are idempotent.

    switch (event.event) {
      case "payment.captured": {
        const paymentData = event.payload.payment.entity;
        const razorpayOrderId = paymentData.order_id;
        const razorpayPaymentId = paymentData.id;

        // Find payment record
        const payment = await prisma.payment.findUnique({
          where: { providerOrderId: razorpayOrderId }
        });

        if (payment && payment.status !== "captured") {
          await prisma.payment.update({
            where: { id: payment.id },
            data: {
              providerPaymentId: razorpayPaymentId,
              status: "captured"
            }
          });

          await prisma.order.update({
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
        }
        break;
      }
      case "payment.failed": {
        const paymentData = event.payload.payment.entity;
        const razorpayOrderId = paymentData.order_id;
        const razorpayPaymentId = paymentData.id;

        const payment = await prisma.payment.findUnique({
          where: { providerOrderId: razorpayOrderId }
        });

        if (payment && payment.status !== "failed") {
          await prisma.payment.update({
            where: { id: payment.id },
            data: {
              providerPaymentId: razorpayPaymentId,
              status: "failed"
            }
          });

          await prisma.order.update({
            where: { id: payment.orderId },
            data: { 
        status: "FAILED",
        statusHistory: {
          create: {
            status: "FAILED",
            note: "Payment failed",
          }
        }
      }
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
