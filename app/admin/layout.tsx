import { ReactNode } from "react";
import Link from "next/link";
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, LogOut } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "./admin-sidebar";
import { signOut } from "@/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col md:flex-row">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 md:p-12 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
