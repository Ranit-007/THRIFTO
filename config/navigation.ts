export const primaryNavigation = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const mobileNavigation = [
  ...primaryNavigation,
  { label: "New arrivals", href: "/#latest-drop" },
  { label: "Best sellers", href: "/#best-sellers" },
] as const;

export const footerNavigation = {
  explore: [
    { label: "Latest drop", href: "/#latest-drop" },
    { label: "Collections", href: "/collections" },
    { label: "Best sellers", href: "/#best-sellers" },
    { label: "Our story", href: "/about" },
  ],
  care: [
    { label: "Size & fit", href: "/size-guide" },
    { label: "Shipping", href: "/shipping" },
    { label: "Returns", href: "/returns" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
} as const;
