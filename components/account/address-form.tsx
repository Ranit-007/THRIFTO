"use client";

import { useActionState, useEffect } from "react";
import { type Address } from "@prisma/client";
import { addAddress, updateAddress } from "@/lib/actions/account.actions";
import { ArrowUpRight, LoaderCircle } from "lucide-react";
import { useToast } from "@/components/providers/toast-provider";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function AddressForm({ address }: { address?: Address }) {
  const router = useRouter();
  const { toast: addToast } = useToast();

  // Create bound action for update
  const action = address ? updateAddress.bind(null, address.id) : addAddress;
  const [state, formAction, isPending] = useActionState(action, null);

  useEffect(() => {
    if (state?.success) {
      addToast({ type: "success", title: address ? "Address updated" : "Address added" });
      router.push("/account/addresses");
    } else if (state?.error) {
      addToast({ type: "error", title: "Action failed", description: state.error });
    }
  }, [state, router, addToast, address]);

  return (
    <form className="auth-form" action={formAction}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <div className="auth-form__group">
          <label className="auth-form__label" htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            className="auth-form__input"
            defaultValue={address?.fullName}
            aria-invalid={!!state?.validationErrors?.fullName}
            required
          />
          {state?.validationErrors?.fullName && <p className="auth-form__error">{state.validationErrors.fullName[0]}</p>}
        </div>

        <div className="auth-form__group">
          <label className="auth-form__label" htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="auth-form__input"
            defaultValue={address?.phone}
            aria-invalid={!!state?.validationErrors?.phone}
            required
          />
          {state?.validationErrors?.phone && <p className="auth-form__error">{state.validationErrors.phone[0]}</p>}
        </div>
      </div>

      <div className="auth-form__group">
        <label className="auth-form__label" htmlFor="addressLine1">Address Line 1</label>
        <input
          type="text"
          id="addressLine1"
          name="addressLine1"
          className="auth-form__input"
          defaultValue={address?.addressLine1}
          aria-invalid={!!state?.validationErrors?.addressLine1}
          required
        />
        {state?.validationErrors?.addressLine1 && <p className="auth-form__error">{state.validationErrors.addressLine1[0]}</p>}
      </div>

      <div className="auth-form__group">
        <label className="auth-form__label" htmlFor="addressLine2">Address Line 2 (Optional)</label>
        <input
          type="text"
          id="addressLine2"
          name="addressLine2"
          className="auth-form__input"
          defaultValue={address?.addressLine2 ?? ""}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <div className="auth-form__group">
          <label className="auth-form__label" htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            name="city"
            className="auth-form__input"
            defaultValue={address?.city}
            aria-invalid={!!state?.validationErrors?.city}
            required
          />
          {state?.validationErrors?.city && <p className="auth-form__error">{state.validationErrors.city[0]}</p>}
        </div>

        <div className="auth-form__group">
          <label className="auth-form__label" htmlFor="state">State</label>
          <input
            type="text"
            id="state"
            name="state"
            className="auth-form__input"
            defaultValue={address?.state}
            aria-invalid={!!state?.validationErrors?.state}
            required
          />
          {state?.validationErrors?.state && <p className="auth-form__error">{state.validationErrors.state[0]}</p>}
        </div>

        <div className="auth-form__group">
          <label className="auth-form__label" htmlFor="postalCode">Postal Code</label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            className="auth-form__input"
            defaultValue={address?.postalCode}
            aria-invalid={!!state?.validationErrors?.postalCode}
            required
          />
          {state?.validationErrors?.postalCode && <p className="auth-form__error">{state.validationErrors.postalCode[0]}</p>}
        </div>

        <div className="auth-form__group">
          <label className="auth-form__label" htmlFor="country">Country</label>
          <input
            type="text"
            id="country"
            name="country"
            className="auth-form__input"
            defaultValue={address?.country || "India"}
            aria-invalid={!!state?.validationErrors?.country}
            required
          />
          {state?.validationErrors?.country && <p className="auth-form__error">{state.validationErrors.country[0]}</p>}
        </div>
      </div>

      <div className="auth-form__group" style={{ flexDirection: "row", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
        <input
          type="checkbox"
          id="isDefault"
          name="isDefault"
          defaultChecked={address?.isDefault}
        />
        <label htmlFor="isDefault" style={{ fontSize: "0.85rem" }}>Set as default address</label>
      </div>

      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <button
          type="submit"
          className="button button--dark"
          style={{ width: "auto" }}
          disabled={isPending}
        >
          <span>{isPending ? "Saving..." : address ? "Update address" : "Save address"}</span>
          {isPending ? <LoaderCircle size={16} className="animate-spin" /> : <ArrowUpRight size={16} />}
        </button>
        <Link href="/account/addresses" className="button button--light" style={{ width: "auto" }}>
          Cancel
        </Link>
      </div>
    </form>
  );
}