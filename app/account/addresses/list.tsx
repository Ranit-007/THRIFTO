"use client";

import { useTransition } from "react";
import { type Address } from "@prisma/client";
import { deleteAddress, setDefaultAddress } from "@/lib/actions/account.actions";
import { useToast } from "@/components/providers/toast-provider";
import Link from "next/link";

export function AddressList({ addresses }: { addresses: Address[] }) {
  const { toast: addToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      startTransition(async () => {
        const result = await deleteAddress(id);
        if (result.success) {
          addToast({ type: "success", title: "Address deleted" });
        } else if (result.error) {
          addToast({ type: "error", title: "Error", description: result.error });
        }
      });
    }
  };

  const handleSetDefault = (id: string) => {
    startTransition(async () => {
      const result = await setDefaultAddress(id);
      if (result.success) {
        addToast({ type: "success", title: "Default address updated" });
      } else if (result.error) {
        addToast({ type: "error", title: "Error", description: result.error });
      }
    });
  };

  return (
    <div className="address-grid" style={{ opacity: isPending ? 0.6 : 1, transition: "opacity 200ms ease" }}>
      {addresses.map((address) => (
        <div key={address.id} className="address-card">
          {address.isDefault && <span className="address-card__default-badge">Default</span>}

          <div className="address-card__content">
            <strong>{address.fullName}</strong>
            {address.addressLine1}
            {address.addressLine2 && <><br />{address.addressLine2}</>}
            <br />
            {address.city}, {address.state} {address.postalCode}
            <br />
            {address.country}
            <br />
            <br />
            Phone: {address.phone}
          </div>

          <div className="address-card__actions">
            <Link href={`/account/addresses/${address.id}`} className="address-card__action">Edit</Link>
            {!address.isDefault && (
              <button
                type="button"
                className="address-card__action"
                onClick={() => handleSetDefault(address.id)}
              >
                Set as default
              </button>
            )}
            <button
              type="button"
              className="address-card__action address-card__action--danger"
              onClick={() => handleDelete(address.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}