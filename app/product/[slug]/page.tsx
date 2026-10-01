import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "./product-client";
import { getProductBySlug, getAllProducts } from "@/lib/shop-data";
import { brand } from "@/config/brand";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getProductReviewStats, canUserReviewProduct } from "@/lib/review-service";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product not found" };
  }

  return {
    title: `${product.name} | ${brand.name}`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images.length > 0 ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Related products: get products from same collection or category, excluding current product
  const allProducts = await getAllProducts({ collection: product.collection || undefined });
  let relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 4);

  if (relatedProducts.length < 4) {
    const fallbackProducts = await getAllProducts();
    const additional = fallbackProducts.filter(
      (p) => p.id !== product.id && !relatedProducts.some((r) => r.id === p.id)
    );
    relatedProducts = [...relatedProducts, ...additional].slice(0, 4);
  }

  // Fetch reviews and auth data
  const session = await auth();
  const userId = session?.user?.id;

  const [reviews, reviewStats, reviewEligibility] = await Promise.all([
    prisma.review.findMany({
      where: { productId: product.id, status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true } },
        images: true,
      },
    }),
    getProductReviewStats(product.id),
    userId
      ? canUserReviewProduct(userId, product.id)
      : Promise.resolve({ eligible: false, reason: "You must be logged in to review" }),
  ]);

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
      reviews={reviews}
      reviewStats={reviewStats}
      canReview={reviewEligibility.eligible}
    />
  );
}
