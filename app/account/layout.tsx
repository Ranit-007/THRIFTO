import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AccountSidebar } from "./sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="account-layout">
      <AccountSidebar />
      <div className="account-content">
        {children}
      </div>
    </main>
  );
}