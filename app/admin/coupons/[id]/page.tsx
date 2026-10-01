import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { CouponEditForm } from "./coupon-edit-form";

export const metadata: Metadata = {
  title: "Edit Coupon — Admin",
};

interface EditCouponPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCouponPage({ params }: EditCouponPageProps) {
  const { id } = await params;

  const coupon = await prisma.coupon.findUnique({
    where: { id },
  });

  if (!coupon) {
    notFound();
  }

  return <CouponEditForm coupon={coupon} />;
}
