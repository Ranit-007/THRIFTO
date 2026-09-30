"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { OrderStatus } from "@prisma/client";

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  try {
    // Update the order status
    await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });

    // Add to status history
    await prisma.orderStatusHistory.create({
      data: {
        orderId,
        status
      }
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
  } catch (error) {
    console.error("Error updating order status:", error);
    throw new Error("Failed to update order status");
  }
}

export async function deleteOrder(orderId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  try {
    // Note: In a real system, we might not delete orders but mark them as cancelled or archived.
    // For now, we'll allow deletion for simplicity, but be cautious with foreign keys.
    // Since we have cascades set up, deleting an order will delete related items, payments, history.
    await prisma.order.delete({
      where: { id: orderId }
    });

    revalidatePath("/admin/orders");
  } catch (error) {
    console.error("Error deleting order:", error);
    throw new Error("Failed to delete order");
  }

  redirect("/admin/orders");
}