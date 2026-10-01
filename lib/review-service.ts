import { prisma } from "@/lib/prisma";

/**
 * Checks if a user is eligible to review a product.
 * Eligibility requires a verified purchase (completed order containing the product).
 */
export async function canUserReviewProduct(
  userId: string,
  productId: string
): Promise<{ eligible: boolean; reason?: string }> {
  // Check if user has already reviewed this product
  const existingReview = await prisma.review.findUnique({
    where: {
      userId_productId: { userId, productId },
    },
  });

  if (existingReview) {
    return { eligible: false, reason: "You have already reviewed this product" };
  }

  // Check if user has purchased this product in a completed order
  const purchasedItem = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: {
        userId,
        status: { in: ["PAID", "DELIVERED"] },
      },
    },
    include: {
      order: {
        select: { status: true, orderNumber: true },
      },
    },
  });

  if (!purchasedItem) {
    return {
      eligible: false,
      reason: "Only customers who have purchased this product can leave a review",
    };
  }

  return { eligible: true };
}

/**
 * Updates product rating aggregates after a review change.
 * Only counts APPROVED reviews.
 */
export async function updateProductRatingAggregates(
  productId: string
): Promise<void> {
  const stats = await prisma.review.aggregate({
    where: { productId, status: "APPROVED" },
    _avg: { rating: true },
    _count: true,
  });

  await prisma.product.update({
    where: { id: productId },
    data: {
      rating: stats._avg.rating ?? null,
      reviewCount: stats._count,
    },
  });
}

/**
 * Gets review statistics for a product.
 */
export async function getProductReviewStats(productId: string): Promise<{
  averageRating: number | null;
  totalReviews: number;
  ratingDistribution: Record<number, number>;
}> {
  const stats = await prisma.review.aggregate({
    where: { productId, status: "APPROVED" },
    _avg: { rating: true },
    _count: true,
  });

  // Get rating distribution
  const distribution = await prisma.review.groupBy({
    by: ["rating"],
    where: { productId, status: "APPROVED" },
    _count: true,
  });

  const ratingDistribution: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  for (const row of distribution) {
    ratingDistribution[row.rating] = row._count;
  }

  return {
    averageRating: stats._avg.rating ?? null,
    totalReviews: stats._count,
    ratingDistribution,
  };
}
