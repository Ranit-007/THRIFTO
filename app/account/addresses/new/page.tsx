import { AddressForm } from "@/components/account/address-form";

export const metadata = {
  title: "Add Address — Nocturne Studio",
};

export default function NewAddressPage() {
  return (
    <section>
      <h2 className="account-heading">Add a new address</h2>

      <div className="account-section">
        <AddressForm />
      </div>
    </section>
  );
}

// We'll create a shared component for the form in components/account/address-form.tsx