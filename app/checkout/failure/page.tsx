import { redirect } from "next/navigation";
import Link from "next/link";
import { XCircle, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function CheckoutFailurePage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  if (!orderId) {
    redirect("/");
  }

  // Verify order exists (discard result — page only needs the orderId for display)
  const orderExists = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true },
  });

  if (!orderExists) {
    redirect("/");
  }

  return (
    <main className="page-shell py-24 min-h-[70vh] flex items-center justify-center">
      <div className="max-w-xl mx-auto text-center border p-12 bg-gray-50 border-gray-200">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4">PAYMENT FAILED</h1>
        <p className="text-gray-600 mb-8">
          We couldn&apos;t process your payment for order <strong>#{orderId.slice(0, 8).toUpperCase()}</strong>.
          No charges were made to your account.
        </p>

        <Link href="/cart" className="button button--dark w-full mb-4">
          RETURN TO BAG TO TRY AGAIN
        </Link>
        <Link href="/shop" className="text-sm font-bold flex items-center justify-center gap-2 hover:underline">
          <ArrowLeft size={14} /> CONTINUE SHOPPING
        </Link>
      </div>
    </main>
  );
}
