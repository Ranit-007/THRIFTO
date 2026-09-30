import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { OrderStatusForm } from "./order-status-form";

export const metadata: Metadata = {
  title: "Order Details — Admin",
};

function statusColor(status: string) {
  if (["PAID", "PROCESSING", "SHIPPED", "DELIVERED"].includes(status))
    return "bg-green-100 text-green-800";
  if (status === "PENDING") return "bg-yellow-100 text-yellow-800";
  if (["CANCELLED", "FAILED"].includes(status))
    return "bg-red-100 text-red-800";
  return "bg-gray-100 text-gray-800";
}

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true } },
      orderItems: true,
      payments: true,
      statusHistory: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/orders"
          className="inline-flex items-center text-sm text-ink/60 hover:text-ink transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Orders
        </Link>
        <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Info */}
        <div className="bg-white border border-line rounded-sm p-6 space-y-4">
          <h2 className="font-semibold text-lg border-b border-line pb-4">
            Order Information
          </h2>
          <div className="space-y-1">
            <p className="text-sm font-medium text-ink/70">Order Number</p>
            <p className="font-bold">{order.orderNumber}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-ink/70">Customer</p>
            <p className="font-bold">{order.user.name || order.user.email}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-ink/70">Email</p>
            <p className="font-bold">{order.user.email}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-ink/70">Order Date</p>
            <p className="font-bold">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Billing & Payment */}
        <div className="bg-white border border-line rounded-sm p-6 space-y-4">
          <h2 className="font-semibold text-lg border-b border-line pb-4">
            Billing &amp; Payment
          </h2>
          <div className="space-y-1">
            <p className="text-sm font-medium text-ink/70">Amount</p>
            <p className="font-bold">{formatPrice(order.totalAmount)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-ink/70">Currency</p>
            <p className="font-bold">{order.currency}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-ink/70">Payment Status</p>
            <span
              className={`inline-flex px-2 py-0.5 text-[10px] rounded-sm font-mono uppercase ${
                order.payments.some((p) => p.status === "captured")
                  ? "bg-green-100 text-green-800"
                  : order.payments.some((p) => p.status === "failed")
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {order.payments[0]?.status || "pending"}
            </span>
          </div>
        </div>

        {/* Status */}
        <div className="bg-white border border-line rounded-sm p-6 space-y-4">
          <h2 className="font-semibold text-lg border-b border-line pb-4">
            Order Status
          </h2>
          <div className="space-y-2">
            <p className="text-sm font-medium text-ink/70">Current Status</p>
            <span
              className={`inline-flex px-3 py-1 text-[11px] rounded-sm font-mono uppercase ${statusColor(order.status)}`}
            >
              {order.status}
            </span>
          </div>

          <OrderStatusForm orderId={order.id} currentStatus={order.status} />
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white border border-line rounded-sm p-6">
        <h2 className="font-semibold text-lg border-b border-line pb-4 mb-4">
          Order Items
        </h2>
        {order.orderItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-canvas/50 border-b border-line">
                <tr>
                  <th className="px-6 py-3 font-medium text-ink/70">Product</th>
                  <th className="px-6 py-3 font-medium text-ink/70">Variant</th>
                  <th className="px-6 py-3 font-medium text-ink/70">Qty</th>
                  <th className="px-6 py-3 font-medium text-ink/70 text-right">
                    Price
                  </th>
                  <th className="px-6 py-3 font-medium text-ink/70 text-right">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-line last:border-0"
                  >
                    <td className="px-6 py-4">{item.productName}</td>
                    <td className="px-6 py-4 text-ink/80">
                      {item.variantSize && item.variantColor
                        ? `${item.variantSize.toUpperCase()} / ${item.variantColor}`
                        : "Default"}
                    </td>
                    <td className="px-6 py-4 text-center">{item.quantity}</td>
                    <td className="px-6 py-4 text-right font-medium">
                      {formatPrice(item.unitPrice)}
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      {formatPrice(item.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-ink/60">No items in this order.</p>
        )}
      </div>

      {/* Status History */}
      <div className="bg-white border border-line rounded-sm p-6">
        <h2 className="font-semibold text-lg border-b border-line pb-4 mb-4">
          Status History
        </h2>
        {order.statusHistory.length > 0 ? (
          <div className="space-y-3">
            {order.statusHistory.map((history) => (
              <div
                key={history.id}
                className="flex justify-between items-center p-3 border-b border-line last:border-0 last:pb-0"
              >
                <div>
                  <span
                    className={`inline-flex px-2 py-0.5 text-[10px] rounded-sm font-mono uppercase ${statusColor(history.status)}`}
                  >
                    {history.status}
                  </span>
                  <p className="text-xs text-ink/60 mt-1">
                    {new Date(history.createdAt).toLocaleString()}
                  </p>
                </div>
                {history.note && (
                  <p className="text-xs text-ink/60 italic">
                    &ldquo;{history.note}&rdquo;
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink/60">No status history yet.</p>
        )}
      </div>
    </div>
  );
}
