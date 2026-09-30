"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const price = parseInt(formData.get("price") as string);
  const compareAtPriceStr = formData.get("compareAtPrice") as string;
  const compareAtPrice = compareAtPriceStr ? parseInt(compareAtPriceStr) : null;
  const description = formData.get("description") as string;
  const shortDescription = formData.get("shortDescription") as string || null;

  const categoryId = formData.get("categoryId") as string || null;
  const collectionId = formData.get("collectionId") as string || null;

  const stockStatus = formData.get("stockStatus") as string || "in_stock";
  const published = formData.get("published") === "on";
  const featured = formData.get("featured") === "on";

  // JSON arrays
  const images = (formData.get("images") as string)?.split(",").map(s => s.trim()).filter(Boolean) || [];
  const sizes = (formData.get("sizes") as string)?.split(",").map(s => s.trim()).filter(Boolean) || [];
  const tags = (formData.get("tags") as string)?.split(",").map(s => s.trim()).filter(Boolean) || [];

  try {
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        price,
        compareAtPrice,
        description,
        shortDescription,
        categoryId: categoryId || null,
        collectionId: collectionId || null,
        stockStatus,
        published,
        featured,
        images,
        sizes,
        tags
      }
    });

    revalidatePath("/admin/products");
    revalidatePath("/shop");
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product");
  }

  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const price = parseInt(formData.get("price") as string);
  const compareAtPriceStr = formData.get("compareAtPrice") as string;
  const compareAtPrice = compareAtPriceStr ? parseInt(compareAtPriceStr) : null;
  const description = formData.get("description") as string;
  const shortDescription = formData.get("shortDescription") as string || null;

  const categoryId = formData.get("categoryId") as string || null;
  const collectionId = formData.get("collectionId") as string || null;

  const stockStatus = formData.get("stockStatus") as string || "in_stock";
  const published = formData.get("published") === "on";
  const featured = formData.get("featured") === "on";

  // JSON arrays
  const images = (formData.get("images") as string)?.split(",").map(s => s.trim()).filter(Boolean) || [];
  const sizes = (formData.get("sizes") as string)?.split(",").map(s => s.trim()).filter(Boolean) || [];
  const tags = (formData.get("tags") as string)?.split(",").map(s => s.trim()).filter(Boolean) || [];

  try {
    await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        price,
        compareAtPrice,
        description,
        shortDescription,
        categoryId: categoryId || null,
        collectionId: collectionId || null,
        stockStatus,
        published,
        featured,
        images,
        sizes,
        tags
      }
    });

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}`);
    revalidatePath("/shop");
    revalidatePath(`/product/${slug}`);
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Failed to update product");
  }

  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.product.delete({
      where: { id }
    });

    revalidatePath("/admin/products");
    revalidatePath("/shop");
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Failed to delete product");
  }

  redirect("/admin/products");
}
