import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { OrderActions } from "./order-actions";

export const metadata: Metadata = {
  title: "Orders — Admin",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>

      <div className="bg-white border border-line rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-canvas/50 border-b border-line">
              <tr>
                <th className="px-6 py-3 font-medium text-ink/70">
                  Order Number
                </th>
                <th className="px-6 py-3 font-medium text-ink/70">Customer</th>
                <th className="px-6 py-3 font-medium text-ink/70">Date</th>
                <th className="px-6 py-3 font-medium text-ink/70">Amount</th>
                <th className="px-6 py-3 font-medium text-ink/70">Status</th>
                <th className="px-6 py-3 font-medium text-ink/70 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-ink/60"
                  >
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-line last:border-0 hover:bg-canvas/30"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-medium hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      {order.user.name || order.user.email}
                    </td>
                    <td className="px-6 py-4 text-ink/80">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-0.5 text-[10px] rounded-sm font-mono uppercase ${
                          order.status === "PAID" ||
                          order.status === "PROCESSING" ||
                          order.status === "SHIPPED" ||
                          order.status === "DELIVERED"
                            ? "bg-green-100 text-green-800"
                            : order.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "CANCELLED" ||
                                  order.status === "FAILED"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <OrderActions
                        orderId={order.id}
                        orderNumber={order.orderNumber}
                      />
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
