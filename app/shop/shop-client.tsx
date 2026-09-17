"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Grid3x3, LayoutGrid, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/ui/product-card";
import type { Product, Collection } from "@/types/store";

type SortOption = "newest" | "price-asc" | "price-desc" | "rating" | "name";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "name", label: "Name A-Z" },
];

const CATEGORIES = [
  "All",
  "T-Shirts",
  "Graphic Tees",
  "Essentials",
  "Oversized",
  "Premium",
  "Longsleeve",
  "Tops",
];

interface ShopClientProps {
  initialProducts: Product[];
  initialCollections: Collection[];
  initialCollection?: string;
  initialCategory?: string;
  initialSort: string;
}

export function ShopClient({
  initialProducts,
  initialCollections,
  initialCollection,
  initialCategory,
  initialSort,
}: ShopClientProps) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  const [filterOpen, setFilterOpen] = useState(false);
  const [gridView, setGridView] = useState<"grid" | "compact">("grid");
  const [activeCollection, setActiveCollection] = useState<string | null>(initialCollection || null);
  const [activeCategory, setActiveCategory] = useState<string | null>(initialCategory || null);
  const [activeSort, setActiveSort] = useState<SortOption>((initialSort as SortOption) || "newest");

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Filter by collection
    if (activeCollection) {
      result = result.filter(
        (p) => p.collection.toLowerCase().replace(/\s+/g, "-") === activeCollection.toLowerCase()
      );
    }

    // Filter by category
    if (activeCategory && activeCategory !== "All") {
      result = result.filter(
        (p) => p.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    // Sort
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
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
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
  }, [initialProducts, activeCollection, activeCategory, activeSort]);

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams();

      if (updates.collection !== null && updates.collection !== undefined) {
        params.set("collection", updates.collection);
      }
      if (updates.category !== null && updates.category !== undefined && updates.category !== "All") {
        params.set("category", updates.category);
      }
      if (updates.sort) {
        params.set("sort", updates.sort);
      }

      const queryString = params.toString();
      router.push(queryString ? `/shop?${queryString}` : "/shop", { scroll: false });
    },
    [router]
  );

  const handleSortChange = (sort: SortOption) => {
    setActiveSort(sort);
    updateParams({ sort, collection: activeCollection, category: activeCategory });
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category === "All" ? null : category);
    updateParams({ category: category === "All" ? null : category, collection: activeCollection, sort: activeSort });
  };

  const handleCollectionClick = (collectionSlug: string) => {
    setActiveCollection(collectionSlug);
    setFilterOpen(false);
    updateParams({ collection: collectionSlug, category: activeCategory, sort: activeSort });
  };

  const clearFilters = () => {
    setActiveCollection(null);
    setActiveCategory(null);
    router.push("/shop", { scroll: false });
    setFilterOpen(false);
  };

  const activeCollectionName = useMemo(() => {
    if (!activeCollection) return null;
    const collection = initialCollections.find(
      (c) => c.name.toLowerCase().replace(/\s+/g, "-") === activeCollection.toLowerCase()
    );
    return collection?.name || null;
  }, [activeCollection, initialCollections]);

  return (
    <main className="shop-page">
      <div className="page-shell">
        {/* Shop Header */}
        <header className="shop-header">
          <div className="shop-header__content">
            <h1>
              {activeCollectionName ? (
                <>
                  <span className="eyebrow">Collection</span>
                  {activeCollectionName}
                </>
              ) : (
                <>
                  <span className="eyebrow">The collection</span>
                  Shop all pieces
                </>
              )}
            </h1>
            <p className="shop-header__count">
              {filteredProducts.length} {filteredProducts.length === 1 ? "piece" : "pieces"}
            </p>
          </div>
        </header>

        {/* Category Navigation */}
        <nav className="shop-categories" aria-label="Product categories">
          <div className="shop-categories__scroll">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                className={`shop-categories__item ${
                  (activeCategory === category || (!activeCategory && category === "All"))
                    ? "shop-categories__item--active"
                    : ""
                }`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </nav>

        {/* Shop Controls */}
        <div className="shop-controls">
          <button
            type="button"
            className="shop-controls__filter-toggle"
            onClick={() => setFilterOpen(true)}
            aria-expanded={filterOpen}
          >
            <SlidersHorizontal aria-hidden="true" size={16} />
            <span>Filters</span>
            {(activeCollection || (activeCategory && activeCategory !== "All")) && (
              <span className="shop-controls__filter-count">
                {[activeCollection, activeCategory !== "All" ? activeCategory : null].filter(Boolean).length}
              </span>
            )}
          </button>

          <div className="shop-controls__sort">
            <label htmlFor="sort-select" className="sr-only">
              Sort products
            </label>
            <select
              id="sort-select"
              value={activeSort}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              className="shop-controls__select"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="shop-controls__view">
            <button
              type="button"
              className={gridView === "grid" ? "shop-controls__view-active" : ""}
              onClick={() => setGridView("grid")}
              aria-label="Grid view"
            >
              <LayoutGrid aria-hidden="true" size={18} />
            </button>
            <button
              type="button"
              className={gridView === "compact" ? "shop-controls__view-active" : ""}
              onClick={() => setGridView("compact")}
              aria-label="Compact view"
            >
              <Grid3x3 aria-hidden="true" size={18} />
            </button>
          </div>
        </div>

        {/* Active Filters */}
        {(activeCollection || (activeCategory && activeCategory !== "All")) && (
          <div className="shop-active-filters">
            <span>Filtered by:</span>
            {activeCollection && (
              <button
                type="button"
                className="shop-active-filters__tag"
                onClick={() => updateParams({ collection: null })}
              >
                {activeCollectionName}
                <X aria-hidden="true" size={12} />
              </button>
            )}
            {activeCategory && activeCategory !== "All" && (
              <button
                type="button"
                className="shop-active-filters__tag"
                onClick={() => updateParams({ category: null })}
              >
                {activeCategory}
                <X aria-hidden="true" size={12} />
              </button>
            )}
            <button
              type="button"
              className="shop-active-filters__clear"
              onClick={clearFilters}
            >
              Clear all
            </button>
          </div>
        )}

        {/* Product Grid */}
        <div className={`shop-grid shop-grid--${gridView}`}>
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.3,
                  delay: shouldReduceMotion ? 0 : Math.min(index * 0.03, 0.3),
                }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
          <div className="shop-empty">
            <p>No products match your current filters.</p>
            <button
              type="button"
              className="button button--dark"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Collection Quick Links */}
        {!activeCollection && (
          <section className="shop-collections">
            <h2>Shop by collection</h2>
            <div className="shop-collections__grid">
              {initialCollections.map((collection) => (
                <Link
                  key={collection.name}
                  href={collection.href}
                  className={`shop-collections__card ${collection.span === "wide" ? "shop-collections__card--wide" : ""}`}
                >
                  {/* Note: Using next/image would require knowing dimensions, so we keep img for collection cards */}
                  <img src={collection.image} alt="" loading="lazy" className="w-full h-48 object-cover" />
                  <div className="shop-collections__card-content">
                    <h3>{collection.name}</h3>
                    <p>{collection.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        collections={initialCollections}
        activeCollection={activeCollection}
        onCollectionClick={handleCollectionClick}
        onClear={clearFilters}
      />
    </main>
  );
}

function FilterDrawer({
  isOpen,
  onClose,
  collections,
  activeCollection,
  onCollectionClick,
  onClear,
}: {
  isOpen: boolean;
  onClose: () => void;
  collections: Collection[];
  activeCollection: string | null;
  onCollectionClick: (slug: string) => void;
  onClear: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="filter-drawer__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="filter-drawer"
            initial={shouldReduceMotion ? false : { x: "-100%" }}
            animate={{ x: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { x: "-100%" }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="filter-drawer__header">
              <h2>Filters</h2>
              <button type="button" onClick={onClose} aria-label="Close filters">
                <X aria-hidden="true" size={20} />
              </button>
            </div>

            <div className="filter-drawer__content">
              <div className="filter-drawer__section">
                <h3>Collections</h3>
                <div className="filter-drawer__options">
                  {collections.map((collection) => {
                    const slug = collection.name.toLowerCase().replace(/\s+/g, "-");
                    const isActive = activeCollection === slug;
                    return (
                      <button
                        key={collection.name}
                        type="button"
                        className={`filter-drawer__option ${isActive ? "filter-drawer__option--active" : ""}`}
                        onClick={() => onCollectionClick(slug)}
                      >
                        <span>{collection.name}</span>
                        {isActive && <span className="filter-drawer__check">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="filter-drawer__footer">
              <button type="button" className="button button--light" onClick={onClear}>
                Clear all
              </button>
              <button type="button" className="button button--dark" onClick={onClose}>
                Show results
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
