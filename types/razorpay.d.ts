/* eslint-disable @typescript-eslint/no-explicit-any */

interface RazorpaySuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayFailedResponse {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: Record<string, string>;
  };
}

interface Window {
  Razorpay: any;
}
