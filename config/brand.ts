export const brand = {
  name: "Baundule",
  legalName: "Baundule",
  isDemo: false,
  tagline: "Wear your story.",
  description:
    "Premium streetwear for people who move different.",
  locale: "en-IN",
  currency: "INR",
  currencyCode: "INR",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  contact: {
    email: "studio@baundule.example",
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
    canvas: "#f0eada",
    ink: "#56352d",
    bone: "#f9f6f0",
    ember: "#b4d3b2",
  },
} as const;

export function formatPrice(amount: number) {
  return new Intl.NumberFormat(brand.locale, {
    style: "currency",
    currency: brand.currencyCode,
    maximumFractionDigits: 0,
  }).format(amount);
}
