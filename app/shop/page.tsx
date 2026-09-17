import type { Metadata } from "next";
import { ShopClient } from "./shop-client";
import { productsWithVariants, collections } from "@/lib/shop-data";
import { brand } from "@/config/brand";

export const metadata: Metadata = {
  title: `Shop | ${brand.name}`,
  description: "Browse our collection of premium T-shirts and streetwear.",
};

export default function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return <ShopClientWrapper searchParams={searchParams} />;
}

async function ShopClientWrapper({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const collection = typeof params.collection === "string" ? params.collection : undefined;
  const category = typeof params.category === "string" ? params.category : undefined;
  const sort = typeof params.sort === "string" ? params.sort : "newest";

  return (
    <ShopClient
      initialProducts={productsWithVariants}
      initialCollections={collections}
      initialCollection={collection}
      initialCategory={category}
      initialSort={sort}
    />
  );
}
