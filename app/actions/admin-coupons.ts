"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const CreateCouponSchema = z.object({
  code: z.string().min(1, "Coupon code is required").max(50),
  discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]),
  discountValue: z.number().int().positive("Discount value must be positive"),
  maxDiscount: z.number().int().min(0).optional(),
  minOrderAmount: z.number().int().min(0).optional(),
  usageLimit: z.number().int().min(1).optional(),
  perUserLimit: z.number().int().min(1).optional(),
  startsAt: z.string().optional(),
  expiresAt: z.string().optional(),
  isActive: z.boolean().default(true),
  applicableProductIds: z.array(z.string()).optional(),
  applicableCategoryIds: z.array(z.string()).optional(),
});

export async function createCoupon(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const code = formData.get("code")?.toString()?.toUpperCase().trim();
  const discountType = formData.get("discountType")?.toString() || "PERCENTAGE";
  const discountValue = parseInt(formData.get("discountValue")?.toString() || "0", 10);
  const maxDiscount = formData.get("maxDiscount")?.toString();
  const minOrderAmount = formData.get("minOrderAmount")?.toString();
  const usageLimit = formData.get("usageLimit")?.toString();
  const perUserLimit = formData.get("perUserLimit")?.toString();
  const startsAt = formData.get("startsAt")?.toString();
  const expiresAt = formData.get("expiresAt")?.toString();
  const isActive = formData.get("isActive") === "true";

  // Validate percentage range
  if (discountType === "PERCENTAGE" && (discountValue < 1 || discountValue > 100)) {
    return { error: "Percentage discount must be between 1 and 100" };
  }

  // Validate fixed amount
  if (discountType === "FIXED_AMOUNT" && discountValue <= 0) {
    return { error: "Fixed discount must be a positive amount" };
  }

  // Check for duplicate code
  const existing = await prisma.coupon.findUnique({
    where: { code },
  });

  if (existing) {
    return { error: "A coupon with this code already exists" };
  }

  try {
    await prisma.coupon.create({
      data: {
        code: code || "",
        discountType,
        discountValue,
        maxDiscount: maxDiscount ? parseInt(maxDiscount, 10) : null,
        minOrderAmount: minOrderAmount ? parseInt(minOrderAmount, 10) : null,
        usageLimit: usageLimit ? parseInt(usageLimit, 10) : null,
        perUserLimit: perUserLimit ? parseInt(perUserLimit, 10) : null,
        startsAt: startsAt ? new Date(startsAt) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive,
        applicableProductIds: [],
        applicableCategoryIds: [],
      },
    });

    revalidatePath("/admin/coupons");
  } catch (error) {
    console.error("Error creating coupon:", error);
    return { error: "Failed to create coupon" };
  }

  redirect("/admin/coupons");
}

export async function updateCoupon(id: string, formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const code = formData.get("code")?.toString()?.toUpperCase().trim();
  const discountType = formData.get("discountType")?.toString() || "PERCENTAGE";
  const discountValue = parseInt(formData.get("discountValue")?.toString() || "0", 10);
  const maxDiscount = formData.get("maxDiscount")?.toString();
  const minOrderAmount = formData.get("minOrderAmount")?.toString();
  const usageLimit = formData.get("usageLimit")?.toString();
  const perUserLimit = formData.get("perUserLimit")?.toString();
  const startsAt = formData.get("startsAt")?.toString();
  const expiresAt = formData.get("expiresAt")?.toString();
  const isActive = formData.get("isActive") === "true";

  // Validate percentage range
  if (discountType === "PERCENTAGE" && (discountValue < 1 || discountValue > 100)) {
    return { error: "Percentage discount must be between 1 and 100" };
  }

  // Validate fixed amount
  if (discountType === "FIXED_AMOUNT" && discountValue <= 0) {
    return { error: "Fixed discount must be a positive amount" };
  }

  // Check for duplicate code (excluding current coupon)
  const existing = await prisma.coupon.findFirst({
    where: {
      code,
      NOT: { id },
    },
  });

  if (existing) {
    return { error: "A coupon with this code already exists" };
  }

  try {
    await prisma.coupon.update({
      where: { id },
      data: {
        code,
        discountType,
        discountValue,
        maxDiscount: maxDiscount ? parseInt(maxDiscount, 10) : null,
        minOrderAmount: minOrderAmount ? parseInt(minOrderAmount, 10) : null,
        usageLimit: usageLimit ? parseInt(usageLimit, 10) : null,
        perUserLimit: perUserLimit ? parseInt(perUserLimit, 10) : null,
        startsAt: startsAt ? new Date(startsAt) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive,
      },
    });

    revalidatePath("/admin/coupons");
    revalidatePath(`/admin/coupons/${id}`);
  } catch (error) {
    console.error("Error updating coupon:", error);
    return { error: "Failed to update coupon" };
  }

  redirect("/admin/coupons");
}

export async function toggleCouponStatus(id: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  try {
    const coupon = await prisma.coupon.findUnique({
      where: { id },
      select: { isActive: true },
    });

    if (!coupon) {
      return { error: "Coupon not found" };
    }

    await prisma.coupon.update({
      where: { id },
      data: { isActive: !coupon.isActive },
    });

    revalidatePath("/admin/coupons");
  } catch (error) {
    console.error("Error toggling coupon:", error);
    return { error: "Failed to update coupon status" };
  }
}

export async function deleteCoupon(id: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.coupon.delete({
      where: { id },
    });

    revalidatePath("/admin/coupons");
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return { error: "Failed to delete coupon" };
  }

  redirect("/admin/coupons");
}
