import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Star, CheckCircle, XCircle, Flag, Trash2, ArrowLeft } from "lucide-react";
import { ReviewModerationActions } from "./review-actions-client";

export const metadata: Metadata = {
  title: "Review Details — Admin",
};

interface ReviewDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ReviewDetailPage({ params }: ReviewDetailPageProps) {
  const { id } = await params;

  const review = await prisma.review.findUnique({
    where: { id },
    include: {
      product: {
        select: { id: true, name: true, slug: true, images: true },
      },
      user: {
        select: { id: true, name: true, email: true },
      },
      images: true,
    },
  });

  if (!review) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/reviews"
            className="text-ink/60 hover:text-ink"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold">Review Details</h1>
        </div>
        <ReviewModerationActions
          reviewId={review.id}
          status={review.status}
          productId={review.productId}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Review Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-line rounded-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`inline-flex px-2 py-0.5 text-[10px] rounded-sm font-mono uppercase ${
                      review.status === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : review.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : review.status === "REJECTED"
                        ? "bg-red-100 text-red-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {review.status}
                  </span>
                  {review.isVerified && (
                    <span className="text-xs text-ink/60">
                      ✓ Verified Purchase
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 mb-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < review.rating ? "currentColor" : "none"}
                      className={i < review.rating ? "text-yellow-500" : "text-line"}
                    />
                  ))}
                  <span className="ml-2 font-medium">{review.rating}/5</span>
                </div>
              </div>
              <span className="text-sm text-ink/60">
                {new Date(review.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            {review.title && (
              <h2 className="text-lg font-medium mb-2">{review.title}</h2>
            )}

            {review.comment && (
              <p className="text-ink/80 whitespace-pre-wrap">{review.comment}</p>
            )}

            {review.images.length > 0 && (
              <div className="mt-4 pt-4 border-t border-line">
                <h3 className="text-sm font-medium text-ink/70 mb-2">
                  Review Images ({review.images.length})
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {review.images.map((image) => (
                    <a
                      key={image.id}
                      href={image.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block aspect-square bg-canvas rounded overflow-hidden"
                    >
                      <img
                        src={image.url}
                        alt="Review image"
                        className="w-full h-full object-cover"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Product Info */}
          <div className="bg-white border border-line rounded-sm p-4">
            <h3 className="text-sm font-medium text-ink/70 mb-3">Product</h3>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-canvas rounded overflow-hidden">
                <img
                  src={review.product.images[0] || "/placeholder.png"}
                  alt={review.product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/product/${review.product.slug}`}
                  className="font-medium text-ink hover:text-ink/70 line-clamp-2"
                >
                  {review.product.name}
                </Link>
                <Link
                  href={`/admin/products/${review.product.id}`}
                  className="text-xs text-ink/60 hover:text-ink mt-1 block"
                >
                  View in admin →
                </Link>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white border border-line rounded-sm p-4">
            <h3 className="text-sm font-medium text-ink/70 mb-3">Customer</h3>
            <div>
              <p className="font-medium">{review.user.name || "Anonymous"}</p>
              <p className="text-sm text-ink/60">{review.user.email}</p>
              <Link
                href={`/admin/customers/${review.user.id}`}
                className="text-xs text-ink/60 hover:text-ink mt-1 inline-block"
              >
                View customer →
              </Link>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-line rounded-sm p-4">
            <h3 className="text-sm font-medium text-ink/70 mb-3">Timeline</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ink/60">Created</span>
                <span>{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/60">Last updated</span>
                <span>{new Date(review.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
