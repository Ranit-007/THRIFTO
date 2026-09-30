import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Plus, Search, MoreHorizontal } from "lucide-react";

export const metadata: Metadata = {
  title: "Products — Admin",
};

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      _count: {
        select: { variants: true }
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Products</h1>
        
        <Link 
          href="/admin/products/new" 
          className="flex items-center gap-2 bg-ink text-white px-4 py-2 rounded-sm text-sm font-medium hover:bg-ink/90 transition-colors"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      <div className="bg-white border border-line rounded-sm overflow-hidden">
        <div className="p-4 border-b border-line flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" size={16} />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-9 pr-4 py-2 border border-line rounded-sm text-sm focus:outline-none focus:border-ink"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-canvas/50 border-b border-line">
              <tr>
                <th className="px-6 py-3 font-medium text-ink/70">Product</th>
                <th className="px-6 py-3 font-medium text-ink/70">Status</th>
                <th className="px-6 py-3 font-medium text-ink/70">Inventory</th>
                <th className="px-6 py-3 font-medium text-ink/70">Category</th>
                <th className="px-6 py-3 font-medium text-ink/70 text-right">Price</th>
                <th className="px-6 py-3 font-medium text-ink/70 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-ink/60">
                    No products found. Add a product to get started.
                  </td>
                </tr>
              ) : (
                products.map(product => (
                  <tr key={product.id} className="border-b border-line last:border-0 hover:bg-canvas/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-bone rounded-sm relative overflow-hidden flex-shrink-0">
                          {product.images[0] && (
                            <Image 
                              src={product.images[0]} 
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <Link href={`/admin/products/${product.id}`} className="font-medium hover:underline">
                            {product.name}
                          </Link>
                          <p className="text-xs text-ink/60 mt-0.5">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 text-[10px] rounded-sm font-mono uppercase ${
                        product.published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {product.published ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-ink/80">{product._count.variants} variants</span>
                    </td>
                    <td className="px-6 py-4 text-ink/80">
                      {product.category?.name || '—'}
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-ink/60 hover:text-ink">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
