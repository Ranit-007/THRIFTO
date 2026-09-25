"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function AccountSidebar() {
  const pathname = usePathname();

  return (
    <aside className="account-sidebar">
      <h1 className="account-sidebar__title">My Account</h1>

      <nav className="account-nav">
        <Link
          href="/account"
          className="account-nav__link"
          aria-current={pathname === "/account" ? "page" : undefined}
        >
          Dashboard
        </Link>
        <Link
          href="/account/orders"
          className="account-nav__link"
          aria-current={pathname.startsWith("/account/orders") ? "page" : undefined}
        >
          Orders
        </Link>
        <Link
          href="/account/profile"
          className="account-nav__link"
          aria-current={pathname === "/account/profile" ? "page" : undefined}
        >
          Profile
        </Link>
        <Link
          href="/account/addresses"
          className="account-nav__link"
          aria-current={pathname.startsWith("/account/addresses") ? "page" : undefined}
        >
          Addresses
        </Link>
        <Link
          href="/account/settings"
          className="account-nav__link"
          aria-current={pathname === "/account/settings" ? "page" : undefined}
        >
          Settings
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="account-nav__logout"
        >
          <LogOut size={16} /> Sign out
        </button>
      </nav>
    </aside>
  );
}