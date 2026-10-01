import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Star, CheckCircle, XCircle, Flag, Trash2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Reviews — Admin",
};

interface AdminReviewsPageProps {
  searchParams: Promise<{
    status?: string;
    rating?: string;
    page?: string;
  }>;
}

export default async function AdminReviewsPage({ searchParams }: AdminReviewsPageProps) {
  const params = await searchParams;
  const status = params.status || "all";
  const rating = params.rating ? parseInt(params.rating, 10) : undefined;
  const page = parseInt(params.page || "1", 10);
  const pageSize = 20;
  const skip = (page - 1) * pageSize;

  // Build where clause
  const where: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
  if (status !== "all") {
    where.status = status.toUpperCase();
  }
  if (rating) {
    where.rating = rating;
  }

  // Fetch reviews with pagination
  const [reviews, totalCount] = await Promise.all([
    prisma.review.findMany({
      where,
      include: {
        product: {
          select: { id: true, name: true, slug: true },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
        images: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.review.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  // Get counts for each status for filter tabs
  const statusCounts = await prisma.review.groupBy({
    by: ["status"],
    _count: true,
  });

  const counts = {
    all: totalCount,
    PENDING: statusCounts.find((s) => s.status === "PENDING")?._count || 0,
    APPROVED: statusCounts.find((s) => s.status === "APPROVED")?._count || 0,
    REJECTED: statusCounts.find((s) => s.status === "REJECTED")?._count || 0,
    FLAGGED: statusCounts.find((s) => s.status === "FLAGGED")?._count || 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Reviews</h1>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "all", label: "All", count: counts.all },
          { key: "PENDING", label: "Pending", count: counts.PENDING },
          { key: "APPROVED", label: "Approved", count: counts.APPROVED },
          { key: "REJECTED", label: "Rejected", count: counts.REJECTED },
          { key: "FLAGGED", label: "Flagged", count: counts.FLAGGED },
        ].map((tab) => (
          <Link
            key={tab.key}
            href={`/admin/reviews?status=${tab.key}`}
            className={`px-3 py-1.5 text-sm rounded-sm ${
              status === tab.key
                ? "bg-ink text-white"
                : "bg-canvas text-ink/70 hover:bg-line/50"
            }`}
          >
            {tab.label} ({tab.count})
          </Link>
        ))}
      </div>

      <div className="bg-white border border-line rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-canvas/50 border-b border-line">
              <tr>
                <th className="px-6 py-3 font-medium text-ink/70">Product</th>
                <th className="px-6 py-3 font-medium text-ink/70">Customer</th>
                <th className="px-6 py-3 font-medium text-ink/70">Rating</th>
                <th className="px-6 py-3 font-medium text-ink/70">Review</th>
                <th className="px-6 py-3 font-medium text-ink/70">Status</th>
                <th className="px-6 py-3 font-medium text-ink/70">Date</th>
                <th className="px-6 py-3 font-medium text-ink/70 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-ink/60">
                    No reviews found.
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr
                    key={review.id}
                    className="border-b border-line last:border-0 hover:bg-canvas/30"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/product/${review.product.slug}`}
                        className="text-ink hover:text-ink/70"
                      >
                        {review.product.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{review.user.name || "Anonymous"}</p>
                        <p className="text-xs text-ink/60">{review.user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Star
                          size={14}
                          fill="currentColor"
                          className="text-yellow-500"
                        />
                        <span>{review.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      {review.title && (
                        <p className="font-medium mb-1">{review.title}</p>
                      )}
                      {review.comment && (
                        <p className="text-ink/70 text-sm line-clamp-2">
                          {review.comment}
                        </p>
                      )}
                      {review.images.length > 0 && (
                        <p className="text-xs text-ink/50 mt-1">
                          {review.images.length} image(s)
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
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
                        <span className="block text-[9px] text-ink/50 mt-0.5">
                          Verified Purchase
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-ink/60">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/reviews/${review.id}`}
                          className="text-ink/60 hover:text-ink text-xs"
                        >
                          View
                        </Link>
                        {review.status === "PENDING" && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                // TODO: implement approve action
                                alert("Approve review action to be implemented");
                              }}
                              className="text-green-600 hover:text-green-700"
                              title="Approve"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                // TODO: implement reject action
                                alert("Reject review action to be implemented");
                              }}
                              className="text-red-600 hover:text-red-700"
                              title="Reject"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/reviews?status=${status}${rating ? `&rating=${rating}` : ""}&page=${p}`}
              className={`px-3 py-1.5 text-sm rounded-sm ${
                p === page
                  ? "bg-ink text-white"
                  : "bg-canvas text-ink/70 hover:bg-line/50"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
