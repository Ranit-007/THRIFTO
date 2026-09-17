export type ProductVariant = {
  id: string;
  size: string;
  color: string;
  colorHex: string;
  price?: number; // Optional variant-specific price
  stock: number;
  sku: string;
  available: boolean;
  images?: string[]; // Optional variant-specific images
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  collection: string;
  images: [string, ...string[]];
  colors: { name: string; hex: string }[];
  sizes: string[];
  variants?: ProductVariant[]; // Optional detailed variant data
  badge?: string;
  stockStatus: "in_stock" | "low_stock" | "sold_out";
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  rating?: number;
  reviewCount?: number;
  // Phase 4 additions
  material?: string;
  gsm?: number;
  fit?: "Regular Fit" | "Oversized Fit" | "Relaxed Fit" | "Slim Fit" | "Cropped Fit";
  care?: string[];
  tags?: string[];
};

export type Collection = {
  name: string;
  description: string;
  image: string;
  href: string;
  span?: "wide" | "standard";
};

export type SocialPost = {
  alt: string;
  image: string;
  href?: string;
};

// Size guide measurements
export type SizeGuideMeasurement = {
  size: string;
  chest: string;
  length: string;
  shoulder: string;
  sleeve?: string;
};
