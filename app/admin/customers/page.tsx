import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Search, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Customers — Admin",
};

export default async function AdminCustomersPage() {
  // Fetch customers with their orders count and total spent
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      _count: {
        select: { orders: true }
      },
      orders: {
        select: {
          totalAmount: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  // Process customers to add totalSpent
  const customersWithStats = customers.map(customer => {
    const totalSpent = customer.orders.reduce((sum, order) => sum + order.totalAmount, 0);
    return {
      ...customer,
      orderCount: customer._count.orders,
      totalSpent
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Customers</h1>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search customers..."
            className="w-64 px-3 py-2 border border-line rounded-sm text-sm focus:outline-none focus:border-ink"
          />
          <Link
            href="/admin/customers/new"
            className="flex items-center gap-2 bg-ink text-white px-4 py-2 rounded-sm text-sm font-medium hover:bg-ink/90 transition-colors"
          >
            <Users size={16} />
            Add Customer
          </Link>
        </div>
      </div>

      <div className="bg-white border border-line rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-canvas/50 border-b border-line">
              <tr>
                <th className="px-6 py-3 font-medium text-ink/70">Customer</th>
                <th className="px-6 py-3 font-medium text-ink/70">Email</th>
                <th className="px-6 py-3 font-medium text-ink/70">Joined</th>
                <th className="px-6 py-3 font-medium text-ink/70">Orders</th>
                <th className="px-6 py-3 font-medium text-ink/70">Spent</th>
                <th className="px-6 py-3 font-medium text-ink/70 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customersWithStats.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-ink/60">
                    No customers found.
                  </td>
                </tr>
              ) : (
                customersWithStats.map(customer => (
                  <tr key={customer.id} className="border-b border-line last:border-0 hover:bg-canvas/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {customer.image ? (
                          <img
                            src={customer.image}
                            alt={customer.name || ''}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 flex items-center justify-center bg-line/30 rounded-full text-sm font-medium">
                            {(customer.name || customer.email).charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <Link href={`/admin/customers/${customer.id}`} className="font-medium hover:underline">
                            {customer.name || "Unnamed"}
                          </Link>
                          <p className="text-xs text-ink/60">{customer.email ?? ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-ink/80">
                      {customer.email ?? ''}
                    </td>
                    <td className="px-6 py-4 text-ink/80">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center font-medium">
                      {customer.orderCount}
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      {formatPrice(customer.totalSpent)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/customers/${customer.id}`}
                          className="text-ink/60 hover:text-ink"
                        >
                          <Users size={16} className="mr-1" />
                          Details
                        </Link>
                        {/*
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete customer ${customer.name}? This will also delete their orders and associated data.`)) {
                              // TODO: implement delete customer action
                              alert("Delete customer not implemented yet.");
                            }
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                         */}
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