import { prisma } from "@/lib/prisma";

export type CouponValidationResult =
  | { valid: true; coupon: { id: string; code: string; discountType: string; discountValue: number; maxDiscount: number | null }; discount: number }
  | { valid: false; error: string };

/**
 * Validates a coupon code and calculates the discount amount.
 * All validation happens server-side. Never trust client-submitted discount values.
 */
export async function validateCoupon(
  code: string,
  userId: string,
  cartSubtotal: number,
  productIds: string[],
  categoryIds: string[]
): Promise<CouponValidationResult> {
  // Normalize code to uppercase for case-insensitive matching
  const normalizedCode = code.toUpperCase().trim();

  if (!normalizedCode) {
    return { valid: false, error: "Please enter a coupon code" };
  }

  // Find the coupon
  const coupon = await prisma.coupon.findUnique({
    where: { code: normalizedCode },
  });

  if (!coupon) {
    return { valid: false, error: "Invalid coupon code" };
  }

  // Check if active
  if (!coupon.isActive) {
    return { valid: false, error: "This coupon is no longer active" };
  }

  const now = new Date();

  // Check start date
  if (coupon.startsAt && new Date(coupon.startsAt) > now) {
    return { valid: false, error: "This coupon is not yet valid" };
  }

  // Check expiry date
  if (coupon.expiresAt && new Date(coupon.expiresAt) < now) {
    return { valid: false, error: "This coupon has expired" };
  }

  // Check minimum order amount
  if (coupon.minOrderAmount && cartSubtotal < coupon.minOrderAmount) {
    return {
      valid: false,
      error: `Minimum order amount of ₹${(coupon.minOrderAmount / 100).toLocaleString("en-IN")} required`,
    };
  }

  // Check total usage limit
  if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
    return { valid: false, error: "This coupon has reached its usage limit" };
  }

  // Check per-user limit
  if (coupon.perUserLimit !== null) {
    const userUsageCount = await prisma.couponUsage.count({
      where: { couponId: coupon.id, userId },
    });

    if (userUsageCount >= coupon.perUserLimit) {
      return { valid: false, error: "You have already used this coupon the maximum number of times" };
    }
  }

  // Check applicable products (if restricted)
  if (coupon.applicableProductIds.length > 0) {
    const hasApplicableProduct = productIds.some((id) =>
      coupon.applicableProductIds.includes(id)
    );
    if (!hasApplicableProduct) {
      return { valid: false, error: "This coupon is not applicable to items in your cart" };
    }
  }

  // Check applicable categories (if restricted)
  if (coupon.applicableCategoryIds.length > 0) {
    const hasApplicableCategory = categoryIds.some((id) =>
      coupon.applicableCategoryIds.includes(id)
    );
    if (!hasApplicableCategory) {
      return { valid: false, error: "This coupon is not applicable to items in your cart" };
    }
  }

  // Calculate discount
  const discount = calculateDiscount(coupon, cartSubtotal);

  return {
    valid: true,
    coupon: {
      id: coupon.id,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      maxDiscount: coupon.maxDiscount,
    },
    discount,
  };
}

/**
 * Calculates the discount amount in paise.
 * For PERCENTAGE: discountValue is 1-100, maxDiscount caps the result.
 * For FIXED_AMOUNT: discountValue is the exact discount in paise.
 */
export function calculateDiscount(
  coupon: { discountType: string; discountValue: number; maxDiscount: number | null },
  subtotal: number
): number {
  if (coupon.discountType === "PERCENTAGE") {
    const percentage = Math.min(100, Math.max(0, coupon.discountValue));
    let discount = Math.floor((subtotal * percentage) / 100);

    // Apply max discount cap if set
    if (coupon.maxDiscount !== null) {
      discount = Math.min(discount, coupon.maxDiscount);
    }

    return discount;
  }

  if (coupon.discountType === "FIXED_AMOUNT") {
    // Fixed amount in paise, cannot exceed subtotal
    return Math.min(coupon.discountValue, subtotal);
  }

  return 0;
}

/**
 * Records coupon usage after successful payment.
 * Should be called within the same transaction as inventory decrement.
 */
export async function recordCouponUsage(
  tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
  couponId: string,
  userId: string,
  orderId: string
): Promise<void> {
  // Check if already recorded (idempotency)
  const existing = await tx.couponUsage.findUnique({
    where: { orderId },
  });

  if (existing) return;

  // Create usage record
  await tx.couponUsage.create({
    data: {
      couponId,
      userId,
      orderId,
    },
  });

  // Increment usage count on coupon
  await tx.coupon.update({
    where: { id: couponId },
    data: { usageCount: { increment: 1 } },
  });
}
