"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { submitReview } from "@/app/actions/reviews";

interface ReviewFormProps {
  productId: string;
  productName: string;
}

export function ReviewForm({ productId, productName }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("rating", String(rating));
    formData.append("title", title.trim() || "");
    formData.append("comment", comment.trim() || "");

    try {
      const result = await submitReview(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setRating(0);
        setTitle("");
        setComment("");
      }
    } catch (err) {
      setError("Failed to submit review. Please try again.");
      console.error("Review submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-sm p-6 text-center">
        <div className="flex items-center justify-center gap-2 text-green-700 mb-2">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="font-medium">Review submitted!</span>
        </div>
        <p className="text-sm text-green-700/80">
          Thank you for reviewing {productName}. Your review is pending moderation and will be visible once approved.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-ink/70 mb-2">
          Your Rating
        </label>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, i) => {
            const value = i + 1;
            const isFilled = value <= (hoveredRating || rating);
            return (
              <button
                key={i}
                type="button"
                onClick={() => setRating(value)}
                onMouseEnter={() => setHoveredRating(value)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 focus:outline-none focus:ring-2 focus:ring-ink/20 rounded"
                aria-label={`${value} star${value > 1 ? "s" : ""}`}
              >
                <Star
                  size={24}
                  fill={isFilled ? "currentColor" : "none"}
                  className={isFilled ? "text-yellow-500" : "text-line"}
                />
              </button>
            );
          })}
          {rating > 0 && (
            <span className="ml-2 text-sm text-ink/60">
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </span>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="review-title"
          className="block text-sm font-medium text-ink/70 mb-1"
        >
          Title (optional)
        </label>
        <input
          id="review-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          placeholder="Summarize your review"
          className="block w-full rounded-md border border-line bg-white px-3 py-2 text-sm ring-1 ring-inset ring-ink/30 focus:ring-2 focus:ring-ink focus:border-ink/60 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div>
        <label
          htmlFor="review-comment"
          className="block text-sm font-medium text-ink/70 mb-1"
        >
          Review (optional)
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={1000}
          rows={4}
          placeholder="Share your experience with this product"
          className="block w-full rounded-md border border-line bg-white px-3 py-2 text-sm ring-1 ring-inset ring-ink/30 focus:ring-2 focus:ring-ink focus:border-ink/60 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
        />
        <p className="mt-1 text-xs text-ink/50">{comment.length}/1000 characters</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-sm p-3 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || rating === 0}
        className="w-full flex items-center justify-center gap-2 bg-ink text-white px-4 py-2 rounded-sm text-sm font-medium hover:bg-ink/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
            <span>Submitting...</span>
          </>
        ) : (
          <span>Submit Review</span>
        )}
      </button>

      <p className="text-xs text-ink/50 text-center">
        Only customers who have purchased this product can leave a review.
      </p>
    </form>
  );
}
