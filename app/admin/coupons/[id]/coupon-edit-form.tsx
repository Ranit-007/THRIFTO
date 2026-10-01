"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateCoupon } from "@/app/actions/admin-coupons";
import { formatPrice } from "@/lib/utils";
import { X, Check, AlertTriangle, Plus, Hash } from "lucide-react";

interface CouponEditFormProps {
  coupon: {
    id: string;
    code: string;
    discountType: string;
    discountValue: number;
    maxDiscount: number | null;
    minOrderAmount: number | null;
    usageLimit: number | null;
    perUserLimit: number | null;
    startsAt: Date | null;
    expiresAt: Date | null;
    isActive: boolean;
    applicableProductIds: string[];
    applicableCategoryIds: string[];
  };
}

export function CouponEditForm({ coupon }: CouponEditFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: String(coupon.discountValue),
    maxDiscount: coupon.maxDiscount ? String(coupon.maxDiscount) : "",
    minOrderAmount: coupon.minOrderAmount ? String(coupon.minOrderAmount) : "",
    usageLimit: coupon.usageLimit ? String(coupon.usageLimit) : "",
    perUserLimit: coupon.perUserLimit ? String(coupon.perUserLimit) : "",
    startsAt: coupon.startsAt
      ? new Date(coupon.startsAt).toISOString().slice(0, 16)
      : "",
    expiresAt: coupon.expiresAt
      ? new Date(coupon.expiresAt).toISOString().slice(0, 16)
      : "",
    isActive: coupon.isActive,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const data = new FormData();
    data.append("code", formData.code.trim().toUpperCase());
    data.append("discountType", formData.discountType);
    data.append("discountValue", formData.discountValue);
    data.append("maxDiscount", formData.maxDiscount || "");
    data.append("minOrderAmount", formData.minOrderAmount || "");
    data.append("usageLimit", formData.usageLimit || "");
    data.append("perUserLimit", formData.perUserLimit || "");
    data.append("startsAt", formData.startsAt || "");
    data.append("expiresAt", formData.expiresAt || "");
    data.append("isActive", formData.isActive ? "true" : "false");

    try {
      const result = await updateCoupon(coupon.id, data);
      if (result.error) {
        setErrors({ submit: result.error });
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin/coupons");
        }, 1500);
      }
    } catch (error) {
      setErrors({ submit: "An unexpected error occurred" });
      console.error("Failed to update coupon:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Edit Coupon</h1>
        <button
          type="button"
          onClick={() => router.push("/admin/coupons")}
          className="flex items-center gap-2 text-sm text-ink/60 hover:text-ink"
        >
          <X size={16} />
          Back to List
        </button>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-sm p-4 flex items-start gap-3">
          <Check size={20} className="flex-shrink-0" />
          <div>
            <h3 className="font-medium">Coupon updated successfully!</h3>
            <p className="text-sm">You&apos;ll be redirected to the coupon list.</p>
          </div>
        </div>
      )}

      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-sm p-4 flex items-start gap-3">
          <AlertTriangle size={20} className="flex-shrink-0" />
          <div>
            <h3 className="font-medium">Please fix the following errors:</h3>
            <ul className="list-disc list-inside text-sm mt-1">
              {Object.values(errors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" aria-busy={loading}>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="code"
              className="block text-sm font-medium text-ink/70 mb-1"
            >
              Coupon Code
            </label>
            <input
              id="code"
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="block w-full rounded-md border border-line bg-white px-3 py-2 text-sm ring-1 ring-inset ring-ink/30 focus:ring-2 focus:ring-ink focus:border-ink/60 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="e.g., WELCOME10"
              required
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="discountType"
                className="block text-sm font-medium text-ink/70 mb-1"
              >
                Discount Type
              </label>
              <select
                id="discountType"
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                className="block w-full rounded-md border border-line bg-white px-3 py-2 text-sm ring-1 ring-inset ring-ink/30 focus:ring-2 focus:ring-ink focus:border-ink/60 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="PERCENTAGE">Percentage</option>
                <option value="FIXED_AMOUNT">Fixed Amount</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="discountValue"
                className="block text-sm font-medium text-ink/70 mb-1"
              >
                Discount Value
              </label>
              <input
                id="discountValue"
                type="number"
                name="discountValue"
                value={formData.discountValue}
                onChange={handleChange}
                className="block w-full rounded-md border border-line bg-white px-3 py-2 text-sm ring-1 ring-inset ring-ink/30 focus:ring-2 focus:ring-ink focus:border-ink/60 disabled:cursor-not-allowed disabled:opacity-50"
                min="0"
                placeholder="Enter value"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="maxDiscount"
                className="block text-sm font-medium text-ink/70 mb-1"
              >
                Maximum Discount (optional)
              </label>
              <input
                id="maxDiscount"
                type="number"
                name="maxDiscount"
                value={formData.maxDiscount}
                onChange={handleChange}
                className="block w-full rounded-md border border-line bg-white px-3 py-2 text-sm ring-1 ring-inset ring-ink/30 focus:ring-2 focus:ring-ink focus:border-ink/60 disabled:cursor-not-allowed disabled:opacity-50"
                min="0"
                placeholder="Max discount amount"
              />
              {formData.discountType === "PERCENTAGE" &&
                formData.maxDiscount && (
                  <p className="mt-1 text-xs text-ink/60">
                    Maximum discount of ₹
                    {formatPrice(parseInt(formData.maxDiscount))} will apply
                  </p>
                )}
            </div>

            <div>
              <label
                htmlFor="minOrderAmount"
                className="block text-sm font-medium text-ink/70 mb-1"
              >
                Minimum Order Amount (optional)
              </label>
              <input
                id="minOrderAmount"
                type="number"
                name="minOrderAmount"
                value={formData.minOrderAmount}
                onChange={handleChange}
                className="block w-full rounded-md border border-line bg-white px-3 py-2 text-sm ring-1 ring-inset ring-ink/30 focus:ring-2 focus:ring-ink focus:border-ink/60 disabled:cursor-not-allowed disabled:opacity-50"
                min="0"
                placeholder="Minimum order subtotal"
              />
              {formData.minOrderAmount && (
                <p className="mt-1 text-xs text-ink/60">
                  Orders must be at least ₹
                  {formatPrice(parseInt(formData.minOrderAmount))} to use this
                  coupon
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="usageLimit"
                className="block text-sm font-medium text-ink/70 mb-1"
              >
                Usage Limit (optional)
              </label>
              <input
                id="usageLimit"
                type="number"
                name="usageLimit"
                value={formData.usageLimit}
                onChange={handleChange}
                className="block w-full rounded-md border border-line bg-white px-3 py-2 text-sm ring-1 ring-inset ring-ink/30 focus:ring-2 focus:ring-ink focus:border-ink/60 disabled:cursor-not-allowed disabled:opacity-50"
                min="1"
                placeholder="Total usage limit"
              />
            </div>

            <div>
              <label
                htmlFor="perUserLimit"
                className="block text-sm font-medium text-ink/70 mb-1"
              >
                Per-User Limit (optional)
              </label>
              <input
                id="perUserLimit"
                type="number"
                name="perUserLimit"
                value={formData.perUserLimit}
                onChange={handleChange}
                className="block w-full rounded-md border border-line bg-white px-3 py-2 text-sm ring-1 ring-inset ring-ink/30 focus:ring-2 focus:ring-ink focus:border-ink/60 disabled:cursor-not-allowed disabled:opacity-50"
                min="1"
                placeholder="Max uses per customer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="startsAt"
                className="block text-sm font-medium text-ink/70 mb-1"
              >
                Start Date (optional)
              </label>
              <input
                id="startsAt"
                type="datetime-local"
                name="startsAt"
                value={formData.startsAt}
                onChange={handleChange}
                className="block w-full rounded-md border border-line bg-white px-3 py-2 text-sm ring-1 ring-inset ring-ink/30 focus:ring-2 focus:ring-ink focus:border-ink/60 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="expiresAt"
                className="block text-sm font-medium text-ink/70 mb-1"
              >
                Expiry Date (optional)
              </label>
              <input
                id="expiresAt"
                type="datetime-local"
                name="expiresAt"
                value={formData.expiresAt}
                onChange={handleChange}
                className="block w-full rounded-md border border-line bg-white px-3 py-2 text-sm ring-1 ring-inset ring-ink/30 focus:ring-2 focus:ring-ink focus:border-ink/60 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex items-start">
              <input
                id="isActive"
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-ink focus:ring-ink border-line rounded"
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="isActive"
                className="text-sm font-medium text-ink/70"
              >
                Active
              </label>
              <p className="text-xs text-ink/60">
                Inactive coupons cannot be used by customers
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-line">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-ink text-white px-4 py-2 rounded-sm text-sm font-medium hover:bg-ink/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                <span>Updating coupon...</span>
              </>
            ) : (
              <>
                <Hash size={16} />
                <span>Update Coupon</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
