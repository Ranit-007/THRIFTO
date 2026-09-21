"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, type KeyboardEvent } from "react";
import { useStore } from "@/components/providers/store-provider";
import { formatPrice } from "@/lib/utils";
import { CartItem } from "./CartItem";
import { ShippingProgress } from "./ShippingProgress";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cartItems, cartTotalQuantity, isStoreReady } = useStore();
  const shouldReduceMotion = useReducedMotion();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedElement.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 0);
    return () => {
      window.clearTimeout(focusTimer);
      previouslyFocusedElement.current?.focus();
    };
  }, [isOpen]);

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key !== "Tab") return;

    const focusableElements = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );

    if (focusableElements.length === 0) {
      event.preventDefault();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="cart-drawer__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.aside
            className="cart-drawer"
            initial={shouldReduceMotion ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.32, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
            tabIndex={-1}
            onKeyDown={handleKeyDown}
          >
            <header className="cart-drawer__header">
              <div>
                <h2 id="cart-drawer-title" className="cart-drawer__title">YOUR BAG</h2>
                <p className="cart-drawer__count">
                  {cartTotalQuantity} {cartTotalQuantity === 1 ? "ITEM" : "ITEMS"}
                </p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                className="cart-drawer__close"
                onClick={onClose}
                aria-label="Close cart"
              >
                <X aria-hidden="true" size={20} />
              </button>
            </header>

            {!isStoreReady ? (
              <div className="cart-drawer__loading" aria-live="polite">Loading your bag…</div>
            ) : cartItems.length === 0 ? (
              <div className="cart-drawer__empty">
                <p className="cart-drawer__empty-title">YOUR BAG IS EMPTY.</p>
                <p>Pieces you add will be kept here.</p>
                <Link href="/shop" className="button button--outline" onClick={onClose}>
                  CONTINUE SHOPPING
                </Link>
              </div>
            ) : (
              <>
                <div className="cart-drawer__items" aria-label="Items in your bag">
                  {cartItems.map((item) => (
                    <CartItem
                      key={`${item.productId}-${item.size}-${item.color}`}
                      item={item}
                      onProductLinkClick={onClose}
                    />
                  ))}
                </div>

                <footer className="cart-drawer__summary">
                  <div className="cart-drawer__summary-row">
                    <span>ITEMS</span>
                    <span>{cartTotalQuantity}</span>
                  </div>
                  <div className="cart-drawer__summary-row cart-drawer__summary-row--subtotal">
                    <span>SUBTOTAL</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>

                  <ShippingProgress subtotal={subtotal} />

                  <div className="cart-drawer__actions">
                    <Link href="/cart" className="button button--outline cart-drawer__view-bag" onClick={onClose}>
                      VIEW BAG <ArrowRight aria-hidden="true" size={16} />
                    </Link>
                    <button type="button" className="button button--dark cart-drawer__checkout" disabled>
                      CHECKOUT — COMING SOON
                    </button>
                  </div>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
