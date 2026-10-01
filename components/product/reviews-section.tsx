"use client";

import { useState } from "react";
import { Star, ChevronDown } from "lucide-react";
import { ReviewForm } from "./review-form";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  isVerified: boolean;
  createdAt: Date;
  user: {
    name: string | null;
  };
  images: Array<{ id: string; url: string }>;
}

interface ReviewsSectionProps {
  productId: string;
  productName: string;
  reviews: Review[];
  averageRating: number | null;
  totalReviews: number;
  ratingDistribution: Record<number, number>;
  canReview?: boolean;
}

export function ReviewsSection({
  productId,
  productName,
  reviews,
  averageRating,
  totalReviews,
  ratingDistribution,
  canReview = false,
}: ReviewsSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

  const toggleExpanded = (reviewId: string) => {
    setExpandedReviews((prev) => {
      const next = new Set(prev);
      if (next.has(reviewId)) {
        next.delete(reviewId);
      } else {
        next.add(reviewId);
      }
      return next;
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <section className="product-reviews">
      <div className="product-reviews__header">
        <h2 className="text-xl font-bold">Customer Reviews</h2>
        {canReview && !showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="text-sm text-ink/70 hover:text-ink underline"
          >
            Write a review
          </button>
        )}
      </div>

      {/* Rating Summary */}
      {totalReviews > 0 && (
        <div className="product-reviews__summary">
          <div className="product-reviews__average">
            <div className="product-reviews__stars">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  size={20}
                  fill={i < Math.round(averageRating || 0) ? "currentColor" : "none"}
                  className={i < Math.round(averageRating || 0) ? "text-yellow-500" : "text-line"}
                />
              ))}
            </div>
            <span className="product-reviews__rating-value">
              {averageRating?.toFixed(1) || "0.0"}
            </span>
            <span className="product-reviews__count">
              Based on {totalReviews} review{totalReviews !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="product-reviews__distribution">
            {Array.from({ length: 5 }, (_, i) => {
              const stars = 5 - i;
              const count = ratingDistribution[stars] || 0;
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <div key={stars} className="product-reviews__distribution-row">
                  <span className="product-reviews__distribution-label">
                    {stars} star{stars !== 1 ? "s" : ""}
                  </span>
                  <div className="product-reviews__distribution-bar">
                    <div
                      className="product-reviews__distribution-fill"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="product-reviews__distribution-count">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Review Form */}
      {showForm && canReview && (
        <div className="product-reviews__form-container">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Write a Review</h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-sm text-ink/60 hover:text-ink"
            >
              Cancel
            </button>
          </div>
          <ReviewForm productId={productId} productName={productName} />
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="product-reviews__list">
          {reviews.map((review) => {
            const isExpanded = expandedReviews.has(review.id);
            const shouldTruncate = review.comment && review.comment.length > 300;

            return (
              <article key={review.id} className="product-reviews__item">
                <div className="product-reviews__item-header">
                  <div className="product-reviews__item-meta">
                    <div className="product-reviews__item-stars">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < review.rating ? "currentColor" : "none"}
                          className={i < review.rating ? "text-yellow-500" : "text-line"}
                        />
                      ))}
                    </div>
                    <span className="product-reviews__item-author">
                      {review.user.name || "Anonymous"}
                    </span>
                    {review.isVerified && (
                      <span className="product-reviews__verified-badge">
                        Verified Purchase
                      </span>
                    )}
                    <span className="product-reviews__item-date">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                </div>

                {review.title && (
                  <h4 className="product-reviews__item-title">{review.title}</h4>
                )}

                {review.comment && (
                  <div className="product-reviews__item-content">
                    <p className={(!isExpanded && shouldTruncate) ? "line-clamp-3" : ""}>
                      {review.comment}
                    </p>
                    {shouldTruncate && (
                      <button
                        type="button"
                        onClick={() => toggleExpanded(review.id)}
                        className="product-reviews__item-expand"
                      >
                        {isExpanded ? "Show less" : "Read more"}
                        <ChevronDown
                          size={14}
                          className={isExpanded ? "rotate-180" : ""}
                        />
                      </button>
                    )}
                  </div>
                )}

                {review.images.length > 0 && (
                  <div className="product-reviews__item-images">
                    {review.images.map((image) => (
                      <a
                        key={image.id}
                        href={image.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="product-reviews__item-image"
                      >
                        <img src={image.url} alt="Review image" />
                      </a>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="product-reviews__empty">
          <p className="text-ink/60">
            No reviews yet. Be the first to review this product!
          </p>
        </div>
      )}
    </section>
  );
}
