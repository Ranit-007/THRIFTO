import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import CheckoutClient from "./checkout-client";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your order.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CheckoutPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/checkout");
  }

  // Fetch saved addresses to pass to the client
  const savedAddresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return <CheckoutClient savedAddresses={savedAddresses} />;
}
