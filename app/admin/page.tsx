import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Package, ShoppingBag, Users, TrendingUp } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin Dashboard — Baundule",
};

export default async function AdminDashboardPage() {
  // Mock data for initial render until we have more real data
  const totalOrders = await prisma.order.count();
  const successfulOrders = await prisma.order.findMany({
    where: { status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] } }
  });
  
  const totalRevenue = successfulOrders.reduce((acc, order) => acc + order.totalAmount, 0);
  
  const totalCustomers = await prisma.user.count({
    where: { role: "CUSTOMER" }
  });

  const totalProducts = await prisma.product.count();

  // Get recent orders
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: true }
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Revenue" 
          value={formatPrice(totalRevenue)} 
          icon={TrendingUp} 
        />
        <MetricCard 
          title="Total Orders" 
          value={totalOrders.toString()} 
          icon={ShoppingBag} 
        />
        <MetricCard 
          title="Customers" 
          value={totalCustomers.toString()} 
          icon={Users} 
        />
        <MetricCard 
          title="Products" 
          value={totalProducts.toString()} 
          icon={Package} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-line rounded-sm p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm underline">View all</Link>
          </div>
          
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map(order => (
                <div key={order.id} className="flex justify-between items-center pb-4 border-b border-line last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-sm">{order.orderNumber}</p>
                    <p className="text-xs text-ink/60">{order.user.name || order.user.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{formatPrice(order.totalAmount)}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-bone font-mono uppercase">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink/60">No orders yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon }: { title: string, value: string, icon: React.ElementType }) {
  return (
    <div className="bg-white border border-line rounded-sm p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-ink/70">{title}</h3>
        <Icon size={20} className="text-ink/40" />
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
