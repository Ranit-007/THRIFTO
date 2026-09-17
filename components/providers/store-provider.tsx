"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type CartItem = {
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
  wishlistItems: WishlistItem[];
  toggleWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  // Load from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("nocturne-studio-cart");
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
    }

    try {
      const savedWishlist = localStorage.getItem("nocturne-studio-wishlist");
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error("Failed to load wishlist from localStorage:", error);
    }
  }, []);

  // Save to localStorage whenever cart or wishlist changes
  useEffect(() => {
    try {
      localStorage.setItem("nocturne-studio-cart", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem("nocturne-studio-wishlist", JSON.stringify(wishlistItems));
    } catch (error) {
      console.error("Failed to save wishlist to localStorage:", error);
    }
  }, [wishlistItems]);

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
    setCartItems((prev) =>
      prev.map((cartItem) =>
        cartItem.productId === productId &&
          cartItem.size === size &&
          cartItem.color === color
          ? { ...cartItem, quantity }
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