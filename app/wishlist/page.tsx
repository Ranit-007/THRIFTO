"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/ui/product-card";
import { useStore } from "@/components/providers/store-provider";
import { productsWithVariants } from "@/lib/shop-data";

export default function WishlistPage() {
  const { wishlistItems, isStoreReady } = useStore();
  const productsById = new Map(productsWithVariants.map((product) => [product.id, product]));
  const savedProducts = wishlistItems.flatMap((item) => {
    const product = productsById.get(item.productId);
    return product ? [product] : [];
  });

  return (
    <main className="wishlist-page">
      <div className="page-shell wishlist-page__container">
        <nav className="wishlist-page__breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/shop">Shop</Link>
          <span>/</span>
          <span aria-current="page">Wishlist</span>
        </nav>

        {!isStoreReady ? (
          <div className="wishlist-page__loading" aria-live="polite">Loading your saved pieces…</div>
        ) : savedProducts.length === 0 ? (
          <section className="wishlist-page__empty" aria-labelledby="empty-wishlist-title">
            <p className="eyebrow">Wishlist</p>
            <h1 id="empty-wishlist-title">NOTHING<br />SAVED YET.</h1>
            <p>Keep the pieces you want close.</p>
            <Link href="/shop" className="button button--outline">
              EXPLORE THE COLLECTION <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </section>
        ) : (
          <>
            <header className="wishlist-page__heading">
              <p className="eyebrow">Saved for later</p>
              <div>
                <h1>YOUR<br />WISHLIST</h1>
                <p>{savedProducts.length} {savedProducts.length === 1 ? "PIECE" : "PIECES"}</p>
              </div>
            </header>

            <div className="wishlist-page__grid">
              {savedProducts.map((product) => (
                <div key={product.id} className="wishlist-page__item">
                  <ProductCard product={product} quickAddLabel="ADD TO BAG" />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
