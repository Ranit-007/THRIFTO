import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionClient } from "./collection-client";
import { productsWithVariants, collections } from "@/lib/shop-data";
import { brand } from "@/config/brand";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return collections.map((collection) => ({
    slug: collection.name.toLowerCase().replace(/\s+/g, "-"),
  }));
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = collections.find(
    (c) => c.name.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase()
  );

  if (!collection) {
    return { title: "Collection not found" };
  }

  return {
    title: `${collection.name} | ${brand.name}`,
    description: collection.description,
    openGraph: {
      title: collection.name,
      description: collection.description,
      images: [collection.image],
    },
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = collections.find(
    (c) => c.name.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase()
  );

  if (!collection) {
    notFound();
  }

  const collectionProducts = productsWithVariants.filter(
    (p) => p.collection.toLowerCase() === collection.name.toLowerCase()
  );

  return (
    <CollectionClient
      collection={collection}
      products={collectionProducts}
    />
  );
}
