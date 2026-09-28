"use server";

import crypto from "crypto";
import { prisma } from "@/lib/prisma";

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
    });

    if (!payment) {
      console.error("Payment record not found for provider order ID", razorpay_order_id);
      return { success: false, error: "Payment record not found" };
    }

    // Update payment record
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        providerPaymentId: razorpay_payment_id,
        providerSignature: razorpay_signature,
        status: "captured",
      },
    });

    // Update order status to PAID
    await prisma.order.update({
      where: { id: payment.orderId },
      data: { status: "PAID" },
    });

    return { success: true, orderId: payment.orderId };
  } catch (error: unknown) {
    console.error("Payment verification error:", error);
    return { success: false, error: "An unexpected error occurred during verification" };
  }
}
