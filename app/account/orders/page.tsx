import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Orders — Baundule",
};

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      orderItems: true,
      payments: true,
    },
  });

  return (
    <section>
      <h2 className="text-2xl font-medium mb-8">My Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center py-16 px-6 bg-bone rounded-sm">
          <h3 className="text-xl mb-2">Your first drop is waiting.</h3>
          <p className="text-sm opacity-70 mb-6 font-mono">
            Once you place an order, you&apos;ll find it here.
          </p>
          <Link href="/shop" className="btn btn--solid">
            EXPLORE SHOP
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => {
            const firstItem = order.orderItems[0];
            const itemCount = order.orderItems.reduce((acc, item) => acc + item.quantity, 0);

            let paymentStatus = "PENDING";
            if (order.payments.length > 0) {
                // Determine payment status based on last payment record or check if any captured
                const captured = order.payments.find(p => p.status === "captured" || p.status === "PAID");
                if (captured) paymentStatus = "PAID";
                else paymentStatus = order.payments[order.payments.length - 1].status.toUpperCase();
            }

            return (
              <div key={order.id} className="border border-line p-5 rounded-[2px]">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4 pb-4 border-b border-line">
                  <div>
                    <p className="text-sm font-mono opacity-60 mb-1">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="font-medium">{order.orderNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(order.totalAmount)}</p>
                    <p className="text-sm font-mono opacity-60 mt-1">
                      {itemCount} item{itemCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {firstItem && (
                      <div className="relative w-16 h-16 bg-bone rounded-[2px] overflow-hidden shrink-0">
                        <Image 
                          src={firstItem.images[0]} 
                          alt={firstItem.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <div className="flex gap-2 items-center mb-1">
                         <span className="text-xs font-mono uppercase px-2 py-0.5 bg-bone rounded-[2px]">
                           {order.status}
                         </span>
                         <span className="text-xs font-mono uppercase px-2 py-0.5 bg-bone rounded-[2px]">
                           {paymentStatus}
                         </span>
                      </div>
                      <p className="text-sm">
                        {firstItem?.productName}
                        {order.orderItems.length > 1 && ` + ${order.orderItems.length - 1} more`}
                      </p>
                    </div>
                  </div>
                  
                  <Link href={`/account/orders/${order.id}`} className="text-sm font-mono underline underline-offset-4 hover:opacity-70 transition-opacity whitespace-nowrap">
                    VIEW ORDER
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
