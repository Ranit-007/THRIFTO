"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CartItem } from "@/components/cart/CartItem";
import { ShippingProgress } from "@/components/cart/ShippingProgress";
import { useStore } from "@/components/providers/store-provider";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { cartItems, cartTotalQuantity, isStoreReady } = useStore();
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <main className="cart-page">
      <div className="page-shell cart-page__container">
        <nav className="cart-page__breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/shop">Shop</Link>
          <span>/</span>
          <span aria-current="page">Your bag</span>
        </nav>

        {!isStoreReady ? (
          <div className="cart-page__loading" aria-live="polite">Loading your bag…</div>
        ) : cartItems.length === 0 ? (
          <section className="cart-page__empty" aria-labelledby="empty-bag-title">
            <p className="eyebrow">Your bag</p>
            <h1 id="empty-bag-title">NOTHING<br />IN YOUR BAG.</h1>
            <p>Find a piece that feels like yours.</p>
            <Link href="/shop" className="button button--outline">
              EXPLORE THE COLLECTION <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </section>
        ) : (
          <>
            <header className="cart-page__heading">
              <p className="eyebrow">Selected pieces</p>
              <div>
                <h1>YOUR<br />BAG</h1>
                <p>{cartTotalQuantity} {cartTotalQuantity === 1 ? "ITEM" : "ITEMS"}</p>
              </div>
            </header>

            <div className="cart-page__grid">
              <section className="cart-page__items" aria-label="Items in your bag">
                {cartItems.map((item) => (
                  <CartItem key={`${item.productId}-${item.size}-${item.color}`} item={item} />
                ))}
              </section>

              <aside className="cart-page__summary" aria-labelledby="order-summary-title">
                <h2 id="order-summary-title">ORDER SUMMARY</h2>
                <div className="cart-page__summary-row">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="cart-page__summary-row cart-page__summary-row--total">
                  <span>BAG TOTAL</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <ShippingProgress subtotal={subtotal} />

                <button type="button" className="button button--dark cart-page__checkout" disabled>
                  CHECKOUT — COMING SOON
                </button>
                <Link href="/shop" className="cart-page__continue-shopping">
                  CONTINUE SHOPPING <ArrowRight aria-hidden="true" size={15} />
                </Link>
              </aside>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
