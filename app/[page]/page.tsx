import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { brand } from "@/config/brand";

const pages = {
  shop: {
    eyebrow: "Storefront / coming next",
    title: "Shop the collection.",
    copy: "The full catalogue, filtering and product discovery experience is planned for the next storefront phase. The latest edit is ready to explore now.",
    cta: "Explore new arrivals",
    href: "/#latest-drop",
  },
  collections: {
    eyebrow: "Collections",
    title: "Made in chapters.",
    copy: "The Uniform, Graphic Studies and Washed World are configured as our temporary collection system. Their full browse experience is arriving with the shop release.",
    cta: "See the edit",
    href: "/#collections",
  },
  about: {
    eyebrow: "The studio",
    title: "Built for the different.",
    copy: "Véloce is a temporary brand identity for this storefront foundation. The real brand story, editorial content and history will replace this demo copy when supplied.",
    cta: "Read the point of view",
    href: "/#story",
  },
  contact: {
    eyebrow: "Contact",
    title: "Start a conversation.",
    copy: `For the Phase 1–2 demo, reach the studio at ${brand.contact.email}. A validated contact form will be connected when the communications backend is added.`,
    cta: "Email the studio",
    href: `mailto:${brand.contact.email}`,
  },
  faq: {
    eyebrow: "Support",
    title: "Frequently asked questions.",
    copy: "Our comprehensive FAQ covering shipping, returns, sizing and garment care is being compiled. Please contact the studio directly for any immediate inquiries.",
    cta: "Contact the studio",
    href: "/contact",
  },
  shipping: {
    eyebrow: "Customer care",
    title: "Shipping information.",
    copy: "Shipping rules and carrier handling have not been configured for this demo. They will be connected to real checkout and order data in a later phase.",
    cta: "Back to the drop",
    href: "/#latest-drop",
  },
  returns: {
    eyebrow: "Customer care",
    title: "Returns information.",
    copy: "The final returns policy will be supplied with the production store rules. No purchase or return flow is enabled in this demo.",
    cta: "Back to the drop",
    href: "/#latest-drop",
  },
  "size-guide": {
    eyebrow: "Customer care",
    title: "Size and fit.",
    copy: "Product-level measurements and fit guidance are planned alongside the full product-detail experience. The temporary product data already supports configurable sizes.",
    cta: "View latest pieces",
    href: "/#latest-drop",
  },
  privacy: {
    eyebrow: "Legal",
    title: "Privacy.",
    copy: "This local demo does not collect account, checkout or newsletter data. A production privacy policy will be added with the corresponding services.",
    cta: "Back home",
    href: "/",
  },
  terms: {
    eyebrow: "Legal",
    title: "Terms.",
    copy: "Production terms will be published before customer accounts, checkout and payments are enabled. This is a visual storefront demonstration only.",
    cta: "Back home",
    href: "/",
  },
} as const;

type PageKey = keyof typeof pages;

export function generateStaticParams() {
  return Object.keys(pages).map((page) => ({ page }));
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const { page } = await params;
  const content = pages[page as PageKey];
  return content ? { title: `${content.title} | ${brand.name}`, description: content.copy } : {};
}

export default async function StorefrontPlaceholderPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const content = pages[page as PageKey];
  if (!content) notFound();

  return (
    <main className="placeholder-page">
      <div className="placeholder-page__grid" aria-hidden="true" />
      <div className="placeholder-page__content page-shell">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1>{content.title}</h1>
        <p>{content.copy}</p>
        <Link className="button button--light" href={content.href}>{content.cta}<ArrowUpRight aria-hidden="true" size={16} /></Link>
      </div>
    </main>
  );
}
