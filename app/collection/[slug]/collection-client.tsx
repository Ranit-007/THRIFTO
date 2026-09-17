"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ui/product-card";
import type { Product, Collection } from "@/types/store";

type SortOption = "newest" | "price-asc" | "price-desc" | "rating";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

interface CollectionClientProps {
  collection: Collection;
  products: Product[];
}

export function CollectionClient({ collection, products }: CollectionClientProps) {
  const shouldReduceMotion = useReducedMotion();
  const [activeSort, setActiveSort] = useState<SortOption>("newest");

  const sortedProducts = useMemo(() => {
    const result = [...products];

    switch (activeSort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
      default:
        result.sort((a, b) => {
          if (a.newArrival && !b.newArrival) return -1;
          if (!a.newArrival && b.newArrival) return 1;
          return 0;
        });
        break;
    }

    return result;
  }, [products, activeSort]);

  const handleSortChange = (sort: SortOption) => {
    setActiveSort(sort);
  };

  return (
    <main className="collection-page">
      {/* Hero Section */}
      <section className="collection-hero">
        <div className="collection-hero__image">
          <img src={collection.image} alt="" />
          <div className="collection-hero__overlay" />
        </div>
        <div className="collection-hero__content page-shell">
          <nav className="collection-hero__breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/shop">Shop</Link>
            <span>/</span>
            <span>{collection.name}</span>
          </nav>
          <h1>{collection.name}</h1>
          <p>{collection.description}</p>
          <p className="collection-hero__count">
            {products.length} {products.length === 1 ? "piece" : "pieces"}
          </p>
        </div>
      </section>

      {/* Sort Controls */}
      <div className="collection-controls page-shell">
        <div className="collection-controls__sort">
          <label htmlFor="sort-select" className="sr-only">
            Sort products
          </label>
          <select
            id="sort-select"
            value={activeSort}
            onChange={(e) => handleSortChange(e.target.value as SortOption)}
            className="collection-controls__select"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="collection-grid page-shell">
        <AnimatePresence mode="popLayout">
          {sortedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              layout
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.3,
                delay: shouldReduceMotion ? 0 : Math.min(index * 0.04, 0.4),
              }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {sortedProducts.length === 0 && (
        <div className="collection-empty page-shell">
          <p>No products in this collection yet.</p>
          <Link href="/shop" className="button button--dark">
            Browse all products
          </Link>
        </div>
      )}

      {/* Other Collections */}
      <section className="collection-others page-shell">
        <h2>Explore other collections</h2>
        <div className="collection-others__links">
          <Link href="/shop" className="collection-others__link">
            <span>View all products</span>
            <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
