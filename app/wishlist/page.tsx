import type { Metadata } from "next";
import { WishlistClient } from "./wishlist-client";
import { getAllProducts } from "@/lib/shop-data";
import { brand } from "@/config/brand";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "View your saved favorite pieces.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function WishlistPage() {
  const allProducts = await getAllProducts();

  return <WishlistClient allProducts={allProducts} />;
}
