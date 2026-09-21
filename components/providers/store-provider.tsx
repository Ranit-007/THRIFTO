"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  size: string;
  color: string;
  quantity: number;
  price: number; // in cents
  image: string;
};

type WishlistItem = {
  productId: string;
};

type StoreContextType = {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateCartItemQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  cartTotalQuantity: number;
  isStoreReady: boolean;
  wishlistItems: WishlistItem[];
  toggleWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const CART_STORAGE_KEY = "nocturne-studio-cart";
const WISHLIST_STORAGE_KEY = "nocturne-studio-wishlist";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readCartItems(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (
      !isRecord(item) ||
      typeof item.productId !== "string" ||
      typeof item.slug !== "string" ||
      typeof item.name !== "string" ||
      typeof item.size !== "string" ||
      typeof item.color !== "string" ||
      typeof item.image !== "string" ||
      typeof item.price !== "number" ||
      !Number.isFinite(item.price) ||
      typeof item.quantity !== "number" ||
      !Number.isFinite(item.quantity)
    ) {
      return [];
    }

    return [{
      productId: item.productId,
      slug: item.slug,
      name: item.name,
      size: item.size,
      color: item.color,
      image: item.image,
      price: item.price,
      quantity: Math.max(1, Math.floor(item.quantity)),
    }];
  });
}

function readWishlistItems(value: unknown): WishlistItem[] {
  if (!Array.isArray(value)) return [];

  const productIds = new Set<string>();
  return value.flatMap((item) => {
    if (!isRecord(item) || typeof item.productId !== "string" || productIds.has(item.productId)) {
      return [];
    }

    productIds.add(item.productId);
    return [{ productId: item.productId }];
  });
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isStoreReady, setIsStoreReady] = useState(false);

  // Load from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setCartItems(readCartItems(JSON.parse(savedCart)));
      }
    } catch {
      setCartItems([]);
    }

    try {
      const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (savedWishlist) {
        setWishlistItems(readWishlistItems(JSON.parse(savedWishlist)));
      }
    } catch {
      setWishlistItems([]);
    }

    setIsStoreReady(true);
  }, []);

  // Save to localStorage whenever cart or wishlist changes
  useEffect(() => {
    if (!isStoreReady) return;

    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Storage can be unavailable in private browsing or restricted contexts.
    }
  }, [cartItems, isStoreReady]);

  useEffect(() => {
    if (!isStoreReady) return;

    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems));
    } catch {
      // Storage can be unavailable in private browsing or restricted contexts.
    }
  }, [wishlistItems, isStoreReady]);

  const addToCart = (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    setCartItems((prev) => {
      const { productId, size, color, quantity: newQuantity = 1 } = item;
      const existingIndex = prev.findIndex(
        (cartItem) =>
          cartItem.productId === productId &&
          cartItem.size === size &&
          cartItem.color === color
      );

      if (existingIndex >= 0) {
        // Update quantity of existing item
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + newQuantity,
        };
        return updated;
      } else {
        // Add new item
        return [
          ...prev,
          {
            ...item,
            quantity: newQuantity,
          },
        ];
      }
    });
  };

  const removeFromCart = (productId: string, size: string, color: string) => {
    setCartItems((prev) =>
      prev.filter(
        (cartItem) =>
          !(cartItem.productId === productId &&
            cartItem.size === size &&
            cartItem.color === color)
      )
    );
  };

  const updateCartItemQuantity = (
    productId: string,
    size: string,
    color: string,
    quantity: number
  ) => {
    const nextQuantity = Math.max(1, Math.floor(quantity));

    setCartItems((prev) =>
      prev.map((cartItem) =>
        cartItem.productId === productId &&
          cartItem.size === size &&
          cartItem.color === color
          ? { ...cartItem, quantity: nextQuantity }
          : cartItem
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  const toggleWishlist = (productId: string) => {
    setWishlistItems((prev) => {
      const exists = prev.some((item) => item.productId === productId);
      if (exists) {
        return prev.filter((item) => item.productId !== productId);
      } else {
        return [...prev, { productId }];
      }
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some((item) => item.productId === productId);
  };

  return (
    <StoreContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        cartTotalQuantity,
        isStoreReady,
        wishlistItems,
        toggleWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
