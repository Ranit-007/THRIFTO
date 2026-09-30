import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "../product-form";

export const metadata: Metadata = {
  title: "New Product — Admin",
};

export default async function NewProductPage() {
  const [categories, collections] = await Promise.all([
    prisma.category.findMany(),
    prisma.collection.findMany()
  ]);

  return (
    <ProductForm
      categories={categories}
      collections={collections}
    />
  );
}
