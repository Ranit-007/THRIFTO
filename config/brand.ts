export const brand = {
  name: "THRIFTO",
  legalName: "Thrifto-Apperals",
  isDemo: true,
  tagline: "Wear your story.",
  description:
    "Temporary identity for premium streetwear, built for the ones who move different.",
  locale: "en-IN",
  currency: "INR",
  currencyCode: "INR",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  contact: {
    email: "studio@nocturne.example",
    location: "Kolkata / Worldwide",
  },
  social: {
    instagram: undefined,
    youtube: undefined,
    x: undefined,
  },
  fonts: {
    primary: "UI Sans / system fallback",
    editorial: "Georgia / serif fallback",
  },
  colors: {
    canvas: "#090b0d",
    ink: "#111416",
    bone: "#f5f4ef",
    ember: "#c9c9c3",
  },
} as const;

export function formatPrice(amount: number) {
  return new Intl.NumberFormat(brand.locale, {
    style: "currency",
    currency: brand.currencyCode,
    maximumFractionDigits: 0,
  }).format(amount);
}
