import { auth } from "@/auth";

export const metadata = {
  title: "Account Dashboard — Nocturne Studio",
};

export default async function AccountPage() {
  const session = await auth();

  return (
    <section>
      <h2 className="account-heading">Welcome, {session?.user?.name || "Guest"}.</h2>

      <div className="account-section" style={{ maxWidth: "100%" }}>
        <p style={{ color: "rgb(var(--color-ash))", marginBottom: "2rem" }}>
          From your account dashboard you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details.
        </p>
      </div>
    </section>
  );
}