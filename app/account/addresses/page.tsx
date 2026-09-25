import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AddressList } from "./list";

export const metadata = {
  title: "Addresses — Nocturne Studio",
};

export default async function AddressesPage() {
  const session = await auth();

  if (!session?.user?.id) return null;

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return (
    <section>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "1px solid rgb(var(--color-line))", paddingBottom: "1rem", marginBottom: "2rem" }}>
        <h2 className="account-heading" style={{ borderBottom: "none", margin: 0, padding: 0 }}>Saved Addresses</h2>
        <Link href="/account/addresses/new" className="button button--dark" style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }}>
          <Plus size={14} /> <span>Add new</span>
        </Link>
      </div>

      {addresses.length === 0 ? (
        <div className="empty-state">
          <h3 className="empty-state__title">No addresses saved</h3>
          <p className="empty-state__description">We don&apos;t have any saved addresses for your account.</p>
          <Link href="/account/addresses/new" className="button button--dark">
            <span>Add an address</span>
          </Link>
        </div>
      ) : (
        <AddressList addresses={addresses} />
      )}
    </section>
  );
}