"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct, deleteProduct } from "@/app/actions/admin-products";
import { Save, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

type ProductFormProps = {
  initialData?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  categories: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  collections: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
};

export function ProductForm({ initialData, categories, collections }: ProductFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const isEditing = !!initialData;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        if (isEditing) {
          await updateProduct(initialData.id, formData);
        } else {
          await createProduct(formData);
        }
      } catch (error) {
        console.error("Form error", error);
        alert("An error occurred");
      }
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this product?")) {
      startTransition(async () => {
        try {
          await deleteProduct(initialData.id);
        } catch (error) {
          console.error("Delete error", error);
        }
      });
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <Link href="/admin/products" className="inline-flex items-center text-sm text-ink/60 hover:text-ink transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to products
        </Link>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">{isEditing ? "Edit Product" : "Add Product"}</h1>
        {isEditing && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-sm text-sm font-medium transition-colors"
          >
            <Trash2 size={16} />
            Delete
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white border border-line p-6 rounded-sm space-y-6">
              <h2 className="font-semibold text-lg border-b border-line pb-4">Basic Details</h2>

              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <input
                  id="name"
                  name="name"
                  required
                  defaultValue={initialData?.name}
                  className="w-full px-3 py-2 border border-line rounded-sm focus:outline-none focus:border-ink"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="slug" className="text-sm font-medium">Slug</label>
                <input
                  id="slug"
                  name="slug"
                  required
                  defaultValue={initialData?.slug}
                  className="w-full px-3 py-2 border border-line rounded-sm focus:outline-none focus:border-ink font-mono text-sm"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  defaultValue={initialData?.description}
                  className="w-full px-3 py-2 border border-line rounded-sm focus:outline-none focus:border-ink"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="shortDescription" className="text-sm font-medium">Short Description</label>
                <textarea
                  id="shortDescription"
                  name="shortDescription"
                  rows={2}
                  defaultValue={initialData?.shortDescription}
                  className="w-full px-3 py-2 border border-line rounded-sm focus:outline-none focus:border-ink"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="images" className="text-sm font-medium">Images (Comma separated URLs)</label>
                <textarea
                  id="images"
                  name="images"
                  rows={3}
                  defaultValue={initialData?.images?.join(", ")}
                  className="w-full px-3 py-2 border border-line rounded-sm focus:outline-none focus:border-ink font-mono text-sm"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="bg-white border border-line p-6 rounded-sm space-y-6">
              <h2 className="font-semibold text-lg border-b border-line pb-4">Pricing</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <label htmlFor="price" className="text-sm font-medium">Price (in paise)</label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    required
                    defaultValue={initialData?.price}
                    className="w-full px-3 py-2 border border-line rounded-sm focus:outline-none focus:border-ink"
                  />
                  <p className="text-xs text-ink/60">e.g., 299900 for ₹2,999.00</p>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="compareAtPrice" className="text-sm font-medium">Compare at Price (in paise)</label>
                  <input
                    id="compareAtPrice"
                    name="compareAtPrice"
                    type="number"
                    min="0"
                    defaultValue={initialData?.compareAtPrice}
                    className="w-full px-3 py-2 border border-line rounded-sm focus:outline-none focus:border-ink"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white border border-line p-6 rounded-sm space-y-6">
              <h2 className="font-semibold text-lg border-b border-line pb-4">Status & Organization</h2>

              <div className="flex items-center justify-between">
                <label htmlFor="published" className="text-sm font-medium">Published</label>
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  defaultChecked={initialData ? initialData.published : true}
                  className="w-4 h-4 accent-ink"
                />
              </div>

              <div className="flex items-center justify-between">
                <label htmlFor="featured" className="text-sm font-medium">Featured</label>
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  defaultChecked={initialData?.featured}
                  className="w-4 h-4 accent-ink"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="stockStatus" className="text-sm font-medium">Status</label>
                <select
                  id="stockStatus"
                  name="stockStatus"
                  defaultValue={initialData?.stockStatus || "in_stock"}
                  className="w-full px-3 py-2 border border-line rounded-sm focus:outline-none focus:border-ink bg-transparent"
                >
                  <option value="in_stock">In Stock</option>
                  <option value="low_stock">Low Stock</option>
                  <option value="sold_out">Sold Out</option>
                </select>
              </div>

              <div className="grid gap-2">
                <label htmlFor="categoryId" className="text-sm font-medium">Category</label>
                <select
                  id="categoryId"
                  name="categoryId"
                  defaultValue={initialData?.categoryId || ""}
                  className="w-full px-3 py-2 border border-line rounded-sm focus:outline-none focus:border-ink bg-transparent"
                >
                  <option value="">None</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2">
                <label htmlFor="collectionId" className="text-sm font-medium">Collection</label>
                <select
                  id="collectionId"
                  name="collectionId"
                  defaultValue={initialData?.collectionId || ""}
                  className="w-full px-3 py-2 border border-line rounded-sm focus:outline-none focus:border-ink bg-transparent"
                >
                  <option value="">None</option>
                  {collections.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-white border border-line p-6 rounded-sm space-y-6">
              <h2 className="font-semibold text-lg border-b border-line pb-4">Attributes</h2>

              <div className="grid gap-2">
                <label htmlFor="sizes" className="text-sm font-medium">Sizes (Comma separated)</label>
                <input
                  id="sizes"
                  name="sizes"
                  defaultValue={initialData?.sizes?.join(", ")}
                  className="w-full px-3 py-2 border border-line rounded-sm focus:outline-none focus:border-ink font-mono text-sm"
                  placeholder="S, M, L, XL"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="tags" className="text-sm font-medium">Tags (Comma separated)</label>
                <input
                  id="tags"
                  name="tags"
                  defaultValue={initialData?.tags?.join(", ")}
                  className="w-full px-3 py-2 border border-line rounded-sm focus:outline-none focus:border-ink font-mono text-sm"
                  placeholder="summer, limited, basics"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 bg-ink text-white px-4 py-3 rounded-sm font-medium hover:bg-ink/90 transition-colors disabled:opacity-70"
            >
              <Save size={18} />
              {isPending ? "Saving..." : "Save Product"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
