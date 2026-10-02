import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionClient } from "./collection-client";
import { getAllCollections, getProductsByCollection } from "@/lib/shop-data";
import { brand } from "@/config/brand";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collections = await getAllCollections();
  const collection = collections.find(
    (c) => c.name.toLowerCase().replace(/\s+/g, "-") === slug
  );

  if (!collection) {
    return { title: "Collection not found" };
  }

  return {
    title: collection.name,
    description: collection.description,
    openGraph: {
      title: collection.name,
      description: collection.description,
      type: "website",
      images: collection.image ? [collection.image] : [],
      siteName: brand.name,
    },
    twitter: {
      card: "summary_large_image",
      title: collection.name,
      description: collection.description,
      images: collection.image ? [collection.image] : [],
    },
    alternates: {
      canonical: `/collection/${slug}`,
    },
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collections = await getAllCollections();
  const collection = collections.find(
    (c) => c.name.toLowerCase().replace(/\s+/g, "-") === slug
  );

  if (!collection) {
    notFound();
  }

  const products = await getProductsByCollection(collection.name);

  return (
    <CollectionClient
      collection={collection}
      products={products}
    />
  );
}
