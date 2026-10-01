"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { updateProductRatingAggregates } from "@/lib/review-service";

export async function approveReview(reviewId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { productId: true, status: true },
    });

    if (!review) {
      return { error: "Review not found" };
    }

    if (review.status === "APPROVED") {
      return { error: "Review is already approved" };
    }

    await prisma.review.update({
      where: { id: reviewId },
      data: { status: "APPROVED" },
    });

    // Update product rating aggregates
    await updateProductRatingAggregates(review.productId);

    revalidatePath("/admin/reviews");
    revalidatePath(`/admin/reviews/${reviewId}`);

    return { success: true };
  } catch (error) {
    console.error("Error approving review:", error);
    return { error: "Failed to approve review" };
  }
}

export async function rejectReview(reviewId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { productId: true, status: true },
    });

    if (!review) {
      return { error: "Review not found" };
    }

    if (review.status === "REJECTED") {
      return { error: "Review is already rejected" };
    }

    const previousStatus = review.status;

    await prisma.review.update({
      where: { id: reviewId },
      data: { status: "REJECTED" },
    });

    // If review was previously approved, update product aggregates
    if (previousStatus === "APPROVED") {
      await updateProductRatingAggregates(review.productId);
    }

    revalidatePath("/admin/reviews");
    revalidatePath(`/admin/reviews/${reviewId}`);

    return { success: true };
  } catch (error) {
    console.error("Error rejecting review:", error);
    return { error: "Failed to reject review" };
  }
}

export async function flagReview(reviewId: string, reason?: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { productId: true, status: true },
    });

    if (!review) {
      return { error: "Review not found" };
    }

    const previousStatus = review.status;

    await prisma.review.update({
      where: { id: reviewId },
      data: { status: "FLAGGED" },
    });

    // If review was previously approved, update product aggregates
    if (previousStatus === "APPROVED") {
      await updateProductRatingAggregates(review.productId);
    }

    revalidatePath("/admin/reviews");
    revalidatePath(`/admin/reviews/${reviewId}`);

    return { success: true };
  } catch (error) {
    console.error("Error flagging review:", error);
    return { error: "Failed to flag review" };
  }
}

export async function deleteReview(reviewId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { productId: true, status: true },
    });

    if (!review) {
      return { error: "Review not found" };
    }

    const previousStatus = review.status;

    await prisma.review.delete({
      where: { id: reviewId },
    });

    // If review was approved, update product aggregates
    if (previousStatus === "APPROVED") {
      await updateProductRatingAggregates(review.productId);
    }

    revalidatePath("/admin/reviews");

    return { success: true };
  } catch (error) {
    console.error("Error deleting review:", error);
    return { error: "Failed to delete review" };
  }
}
