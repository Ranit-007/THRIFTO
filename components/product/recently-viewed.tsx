"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ui/product-card";
import type { Product } from "@/types/store";

interface RecentlyViewedProps {
  currentProductId: string;
  maxItems?: number;
}

export function RecentlyViewed({ currentProductId, maxItems = 4 }: RecentlyViewedProps) {
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Get recently viewed from localStorage
    try {
      const stored = localStorage.getItem("recentlyViewed");
      if (stored) {
        const parsed = JSON.parse(stored) as Product[];
        // Filter out current product and limit count
        const filtered = parsed
          .filter((p) => p.id !== currentProductId)
          .slice(0, maxItems);
        setRecentProducts(filtered);
      }
    } catch (error) {
      console.error("Failed to load recently viewed:", error);
    }
  }, [currentProductId, maxItems]);

  if (recentProducts.length === 0) {
    return null;
  }

  return (
    <section className="recently-viewed">
      <div className="page-shell">
        <h2>Recently Viewed</h2>
        <div className="recently-viewed__grid">
          {recentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Helper to track recently viewed products
export function trackRecentlyViewed(product: Product) {
  try {
    const stored = localStorage.getItem("recentlyViewed");
    let recentProducts: Product[] = stored ? JSON.parse(stored) : [];

    // Remove if already exists
    recentProducts = recentProducts.filter((p) => p.id !== product.id);

    // Add to beginning
    recentProducts.unshift(product);

    // Keep only last 10
    recentProducts = recentProducts.slice(0, 10);

    localStorage.setItem("recentlyViewed", JSON.stringify(recentProducts));
  } catch (error) {
    console.error("Failed to track recently viewed:", error);
  }
}
