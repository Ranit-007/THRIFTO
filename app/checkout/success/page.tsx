import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  if (!orderId) {
    redirect("/");
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { orderItems: true },
  });

  if (!order) {
    redirect("/");
  }

  return (
    <main className="page-shell py-24 min-h-[70vh] flex items-center justify-center">
      <div className="max-w-xl mx-auto text-center border p-12 bg-gray-50 border-gray-200">
        <CheckCircle2 className="w-16 h-16 text-ember mx-auto mb-6" />
        <p className="eyebrow">Thank you</p>
        <h1 className="text-3xl font-bold mb-4">ORDER CONFIRMED</h1>
        <p className="text-gray-600 mb-8">
          Your order <strong>#{order.id.slice(0, 8).toUpperCase()}</strong> has been placed successfully.
          We&apos;ll send a confirmation email shortly.
        </p>

        <div className="bg-white border p-6 text-left mb-8">
          <h2 className="font-bold border-b pb-2 mb-4">ORDER DETAILS</h2>
          <div className="space-y-4 mb-4 border-b pb-4">
            {order.orderItems.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.quantity}x {item.productName} ({item.variantSize} / {item.variantColor})
                </span>
                <span>{formatPrice(item.totalPrice)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold">
            <span>TOTAL PAID</span>
            <span>{formatPrice(order.totalAmount)}</span>
          </div>
        </div>

        <Link href="/account/orders" className="button button--dark w-full mb-4">
          VIEW ORDER HISTORY
        </Link>
        <Link href="/shop" className="text-sm font-bold flex items-center justify-center gap-2 hover:underline">
          CONTINUE SHOPPING <ArrowRight size={14} />
        </Link>
      </div>
    </main>
  );
}
