import { AddressForm } from "@/components/account/address-form";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Edit Address — Nocturne Studio",
};

export default async function EditAddressPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const addressId = (await params).id;

  if (!session?.user?.id) {
    // Redirect handled by layout, but extra safety
    return null;
  }

  const address = await prisma.address.findUnique({
    where: { id: addressId },
  });

  if (!address || address.userId !== session.user.id) {
    notFound();
  }

  return (
    <section>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h2 className="account-heading">Edit address</h2>
        <Link href="/account/addresses" className="button button--light" style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }}>
          <span>Cancel</span>
        </Link>
      </div>

      <div className="account-section">
        <AddressForm address={address} />
      </div>
    </section>
  );
}