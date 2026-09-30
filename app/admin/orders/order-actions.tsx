"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteOrder } from "@/app/actions/admin-orders";
import { RefreshCw, Trash2 } from "lucide-react";
import Link from "next/link";

interface OrderActionsProps {
  orderId: string;
  orderNumber: string;
}

export function OrderActions({ orderId, orderNumber }: OrderActionsProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (
      confirm(
        `Are you sure you want to delete order ${orderNumber}? This action cannot be undone.`
      )
    ) {
      startTransition(async () => {
        try {
          await deleteOrder(orderId);
        } catch (error) {
          console.error("Error deleting order:", error);
          alert("Failed to delete order");
        }
      });
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Link
        href={`/admin/orders/${orderId}`}
        className="text-ink/60 hover:text-ink"
        title="View & update status"
      >
        <RefreshCw size={16} />
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="text-red-600 hover:text-red-700 disabled:opacity-50"
        title="Delete order"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
