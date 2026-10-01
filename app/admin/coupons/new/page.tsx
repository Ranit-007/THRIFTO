import { Metadata } from "next";
import { CouponCreateForm } from "./coupon-create-form";

export const metadata: Metadata = {
  title: "Create Coupon — Admin",
};

export default function NewCouponPage() {
  return <CouponCreateForm />;
}
