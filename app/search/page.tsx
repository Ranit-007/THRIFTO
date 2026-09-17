import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { brand } from "@/config/brand";

export const metadata: Metadata = {
  title: `Search | ${brand.name}`,
  description: "Search our collection.",
};

export default function SearchPage() {
  return (
    <main className="placeholder-page">
      <div className="placeholder-page__grid" aria-hidden="true" />
      <div className="placeholder-page__content page-shell">
        <p className="eyebrow">Storefront search</p>
        <h1>Search results.</h1>
        <p>The dedicated search route with advanced filtering, facets and sorting is planned for the catalog phase. For now, use the global search panel in the navigation to find products.</p>
        <Link className="button button--light" href="/#latest-drop">Explore new arrivals <ArrowUpRight aria-hidden="true" size={16} /></Link>
      </div>
    </main>
  );
}
