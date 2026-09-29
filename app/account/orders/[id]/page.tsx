import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Order Details — Baundule",
};

export default async function OrderDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      orderItems: true,
      payments: true,
      statusHistory: {
        orderBy: { createdAt: "asc" }
      }
    }
  });

  if (!order || order.userId !== session.user.id) {
    notFound();
  }

  let paymentStatus = "PENDING";
  if (order.payments.length > 0) {
      const captured = order.payments.find(p => p.status === "captured" || p.status === "PAID");
      if (captured) paymentStatus = "PAID";
      else paymentStatus = order.payments[order.payments.length - 1].status.toUpperCase();
  }

  const getTimelineSteps = (): { label: string; key: string; isPast: boolean; isCurrent?: boolean; isError?: boolean }[] => {
    const steps = [
      { label: "Order Placed", key: "PENDING" },
      { label: "Confirmed", key: "PAID" },
      { label: "Processing", key: "PROCESSING" },
      { label: "Shipped", key: "SHIPPED" },
      { label: "Delivered", key: "DELIVERED" },
    ];

    // Check if cancelled or failed
    if (order.status === "CANCELLED" || order.status === "FAILED") {
       return [
         { label: "Order Placed", key: "PENDING", isPast: true },
         { label: order.status === "CANCELLED" ? "Cancelled" : "Failed", key: order.status, isPast: true, isError: true }
       ];
    }

    let currentIndex = 0;

    // Find current index based on status
    const statusIndex = steps.findIndex(s => s.key === order.status);
    if (statusIndex >= 0) currentIndex = statusIndex;

    return steps.map((step, idx) => ({
      ...step,
      isPast: idx <= currentIndex,
      isCurrent: idx === currentIndex
    }));
  };

  const timeline = getTimelineSteps();

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <Link href="/account/orders" className="text-sm font-mono opacity-70 hover:opacity-100 uppercase underline underline-offset-4 flex items-center gap-2">
          ← Back to Orders
        </Link>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-medium mb-1">
          Order {order.orderNumber}
        </h2>
        <p className="text-sm font-mono opacity-60">
          Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric"
          })}
        </p>
      </div>

      {/* Timeline */}
      <div className="mb-10 w-full overflow-x-auto pb-4">
         <div className="flex min-w-[500px]">
           {timeline.map((step, i) => (
             <div key={step.key} className="flex-1 relative">
               <div className="flex items-center">
                 <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2
                   ${step.isError ? "border-red-500 bg-red-500 text-white" :
                     step.isPast ? "border-ink bg-ink text-canvas" : "border-line bg-transparent"}`}>
                   {step.isError ? (
                     <span className="text-xs">✕</span>
                   ) : step.isPast ? (
                     <span className="text-xs">✓</span>
                   ) : null}
                 </div>
                 {i < timeline.length - 1 && (
                   <div className={`h-[2px] flex-1 mx-2 ${timeline[i + 1]?.isPast ? "bg-ink" : "bg-line"}`} />
                 )}
               </div>
               <p className={`mt-2 font-mono text-xs uppercase ${step.isPast ? "opacity-100" : "opacity-40"} ${step.isError ? "text-red-600" : ""}`}>
                 {step.label}
               </p>
             </div>
           ))}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <h3 className="font-medium mb-4 uppercase text-sm font-mono tracking-wider">Items</h3>
           <div className="border-t border-line pt-4 flex flex-col gap-6">
             {order.orderItems.map((item) => (
               <div key={item.id} className="flex flex-col sm:flex-row gap-4 justify-between border-b border-line pb-6 last:border-b-0">
                 <div className="flex gap-4">
                   {item.images[0] && (
                     <div className="relative w-24 h-32 bg-bone rounded-[2px] overflow-hidden shrink-0">
                       <Image
                         src={item.images[0]}
                         alt={item.productName}
                         fill
                         className="object-cover"
                       />
                     </div>
                   )}
                   <div>
                     <p className="font-medium mb-1">{item.productName}</p>
                     <p className="text-sm font-mono opacity-60">
                       {item.variantSize && `Size: ${item.variantSize}`}
                       {item.variantSize && item.variantColor && ` | `}
                       {item.variantColor && `Color: ${item.variantColor}`}
                     </p>
                     <p className="text-sm font-mono opacity-60 mt-1">Qty: {item.quantity}</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className="font-medium">{formatPrice(item.totalPrice)}</p>
                   {item.quantity > 1 && (
                     <p className="text-xs font-mono opacity-50 mt-1">{formatPrice(item.unitPrice)} each</p>
                   )}
                 </div>
               </div>
             ))}
           </div>
        </div>

        <div>
          <div className="bg-bone p-6 rounded-[2px] mb-6">
            <h3 className="font-medium mb-4 uppercase text-sm font-mono tracking-wider">Order Summary</h3>
            <div className="space-y-2 text-sm mb-4 pb-4 border-b border-line">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{order.shippingAmount === 0 ? "Free" : formatPrice(order.shippingAmount)}</span>
              </div>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            <div>
              <h3 className="font-medium mb-2 uppercase text-xs font-mono tracking-wider opacity-60">Shipping Address</h3>
              <div className="text-sm space-y-1">
                <p className="font-medium">{order.shippingFullName}</p>
                <p>{order.shippingAddressLine1}</p>
                {order.shippingAddressLine2 && <p>{order.shippingAddressLine2}</p>}
                <p>{order.shippingCity}, {order.shippingState} {order.shippingPostalCode}</p>
                <p>{order.shippingCountry}</p>
                <p className="opacity-70 mt-2 font-mono">Phone: {order.shippingPhone}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2 uppercase text-xs font-mono tracking-wider opacity-60">Payment</h3>
              <div className="text-sm space-y-2">
                <div className="flex gap-2 items-center">
                  <span className="text-xs font-mono uppercase px-2 py-0.5 bg-bone rounded-[2px]">
                    {paymentStatus}
                  </span>
                </div>
                {order.payments[0] && (
                  <p className="opacity-70 font-mono text-xs truncate" title={order.payments[order.payments.length - 1].providerOrderId}>
                    Ref: {order.payments[order.payments.length - 1].providerOrderId}
                  </p>
                )}
              </div>
            </div>
          </div>

          {order.statusHistory.length > 0 && (
             <div className="mt-8">
                <h3 className="font-medium mb-4 uppercase text-xs font-mono tracking-wider opacity-60">Status History</h3>
                <div className="space-y-4">
                  {order.statusHistory.map((history, idx) => (
                    <div key={idx} className="flex gap-3 text-sm">
                       <div className="mt-1 w-2 h-2 rounded-full bg-line shrink-0" />
                       <div>
                         <p className="font-mono text-xs opacity-70 mb-1">
                           {new Date(history.createdAt).toLocaleDateString("en-US", {
                             month: "short", day: "numeric",
                             hour: "numeric", minute: "2-digit"
                           })}
                         </p>
                         <p className="font-medium capitalize">{history.status.toLowerCase()}</p>
                         {history.note && <p className="opacity-70 text-xs mt-1">{history.note}</p>}
                       </div>
                    </div>
                  ))}
                </div>
             </div>
          )}
        </div>
      </div>
    </section>
  );
}
