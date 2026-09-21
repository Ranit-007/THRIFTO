"use client";

import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/components/providers/store-provider";
import { QuantitySelector } from "@/components/product/quantity-selector";
import type { CartItem } from "@/components/providers/store-provider";
import { formatPrice } from "@/lib/utils";

interface CartItemProps {
  item: CartItem;
  onProductLinkClick?: () => void;
}

export function CartItem({ item, onProductLinkClick }: CartItemProps) {
  const { updateCartItemQuantity, removeFromCart } = useStore();

  const handleQuantityChange = (quantity: number) => {
    updateCartItemQuantity(item.productId, item.size, item.color, quantity);
  };

  const handleRemove = () => {
    removeFromCart(item.productId, item.size, item.color);
  };

  return (
    <article className="cart-item">
      <div className="cart-item__image">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 680px) 88px, 144px"
        />
      </div>
      <div className="cart-item__details">
        <h3 className="cart-item__name"><Link href={`/product/${item.slug}`} onClick={onProductLinkClick}>{item.name}</Link></h3>
        <p className="cart-item__variant">
          {item.color} / {item.size}
        </p>
        <p className="cart-item__price">{formatPrice(item.price)}</p>
        <div className="cart-item__controls">
          <QuantitySelector
            quantity={item.quantity}
            onQuantityChange={handleQuantityChange}
            min={1}
            max={10}
            label={`Quantity for ${item.name}`}
            hideLabel
          />
          <button
            type="button"
            className="cart-item__remove"
            onClick={handleRemove}
            aria-label={`Remove ${item.name} from cart`}
          >
            <Trash2 aria-hidden="true" size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}
