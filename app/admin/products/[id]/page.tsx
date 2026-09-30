import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductForm } from "../product-form";

export const metadata: Metadata = {
  title: "Edit Product — Admin",
};

export default async function EditProductPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  const [product, categories, collections] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { variants: true }
    }),
    prisma.category.findMany(),
    prisma.collection.findMany()
  ]);

  if (!product) {
    notFound();
  }

  return (
    <ProductForm
      initialData={product}
      categories={categories}
      collections={collections}
    />
  );
}
