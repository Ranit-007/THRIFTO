import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Search, Plus, Trash2, XCircle, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Coupons — Admin",
};

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Coupons</h1>

        <Link
          href="/admin/coupons/new"
          className="flex items-center gap-2 bg-ink text-white px-4 py-2 rounded-sm text-sm font-medium hover:bg-ink/90 transition-colors"
        >
          <Plus size={16} />
          Create Coupon
        </Link>
      </div>

      <div className="bg-white border border-line rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-canvas/50 border-b border-line">
              <tr>
                <th className="px-6 py-3 font-medium text-ink/70">Code</th>
                <th className="px-6 py-3 font-medium text-ink/70">Discount</th>
                <th className="px-6 py-3 font-medium text-ink/70">Active</th>
                <th className="px-6 py-3 font-medium text-ink/70">Usage</th>
                <th className="px-6 py-3 font-medium text-ink/70">Expires</th>
                <th className="px-6 py-3 font-medium text-ink/70 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-ink/60">
                    No coupons found. Create your first coupon.
                  </td>
                </tr>
              ) : (
                coupons.map(coupon => (
                  <tr key={coupon.id} className="border-b border-line last:border-0 hover:bg-canvas/30">
                    <td className="px-6 py-4 font-medium">
                      {coupon.code}
                    </td>
                    <td className="px-6 py-4">
                      {coupon.discountType === "PERCENTAGE"
                        ? `${coupon.discountValue}%${coupon.maxDiscount ? ` (max ₹${formatPrice(coupon.maxDiscount)})` : ""}`
                        : `₹${formatPrice(coupon.discountValue)}`}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 text-[10px] rounded-sm font-mono uppercase ${
                        coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {coupon.usageCount} / {coupon.usageLimit ?? '∞'}
                    </td>
                    <td className="px-6 py-4 text-ink/80">
                      {coupon.expiresAt ? (
                        <span className={coupon.expiresAt < new Date() ? 'text-red-600' : 'text-ink/60'}>
                          {new Date(coupon.expiresAt).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-ink/60">Never</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/coupons/${coupon.id}`}
                          className="text-ink/60 hover:text-ink"
                        >
                          <XCircle size={16} />
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            if (
                              confirm(
                                `Are you sure you want to delete coupon "${coupon.code}"? This action cannot be undone.`
                              )
                            ) {
                              // TODO: implement delete coupon action
                              alert("Delete coupon not implemented yet.");
                            }
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
