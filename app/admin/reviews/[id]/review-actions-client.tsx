"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { approveReview, rejectReview, flagReview, deleteReview } from "@/app/actions/admin-reviews";
import { CheckCircle, XCircle, Flag, Trash2 } from "lucide-react";

interface ReviewModerationActionsProps {
  reviewId: string;
  status: string;
  productId: string;
}

export function ReviewModerationActions({
  reviewId,
  status,
  productId,
}: ReviewModerationActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (
    action: string,
    actionFn: () => Promise<{ success?: boolean; error?: string }>
  ) => {
    if (!confirm(`Are you sure you want to ${action} this review?`)) {
      return;
    }

    setLoading(action);
    try {
      const result = await actionFn();
      if (result.error) {
        alert(result.error);
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error(`Failed to ${action} review:`, error);
      alert(`Failed to ${action} review`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {status === "PENDING" && (
        <>
          <button
            type="button"
            onClick={() =>
              handleAction("approve", () => approveReview(reviewId))
            }
            disabled={loading !== null}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-green-600 text-white rounded-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle size={14} />
            {loading === "approve" ? "Approving..." : "Approve"}
          </button>
          <button
            type="button"
            onClick={() =>
              handleAction("reject", () => rejectReview(reviewId))
            }
            disabled={loading !== null}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-red-600 text-white rounded-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <XCircle size={14} />
            {loading === "reject" ? "Rejecting..." : "Reject"}
          </button>
        </>
      )}

      {status === "APPROVED" && (
        <button
          type="button"
          onClick={() =>
            handleAction("reject", () => rejectReview(reviewId))
          }
          disabled={loading !== null}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-sm hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <XCircle size={14} />
          {loading === "reject" ? "Rejecting..." : "Reject"}
        </button>
      )}

      {status === "REJECTED" && (
        <button
          type="button"
          onClick={() =>
            handleAction("approve", () => approveReview(reviewId))
          }
          disabled={loading !== null}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-sm hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckCircle size={14} />
          {loading === "approve" ? "Approving..." : "Approve"}
        </button>
      )}

      {status !== "FLAGGED" && (
        <button
          type="button"
          onClick={() =>
            handleAction("flag", () => flagReview(reviewId))
          }
          disabled={loading !== null}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-orange-100 text-orange-700 rounded-sm hover:bg-orange-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Flag size={14} />
          {loading === "flag" ? "Flagging..." : "Flag"}
        </button>
      )}

      <button
        type="button"
        onClick={() =>
          handleAction("delete", () => deleteReview(reviewId))
        }
        disabled={loading !== null}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-line text-ink rounded-sm hover:bg-red-100 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Trash2 size={14} />
        {loading === "delete" ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
}
