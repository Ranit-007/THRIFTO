import { auth } from "@/auth";
import { ProfileForm } from "./form";

export const metadata = {
  title: "Profile — Nocturne Studio",
};

export default async function ProfilePage() {
  const session = await auth();

  return (
    <section>
      <h2 className="account-heading">Profile Details</h2>

      <div className="account-section">
        <ProfileForm initialName={session?.user?.name || ""} />
      </div>
    </section>
  );
}