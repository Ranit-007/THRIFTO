"use client";

import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
}

export function QuantitySelector({
  quantity,
  onQuantityChange,
  min = 1,
  max = 10,
}: QuantitySelectorProps) {
  const decrease = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1);
    }
  };

  const increase = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1);
    }
  };

  return (
    <div className="quantity-selector">
      <span className="quantity-selector__label">Quantity</span>

      <div className="quantity-selector__controls">
        <button
          type="button"
          onClick={decrease}
          disabled={quantity <= min}
          className="quantity-selector__button"
          aria-label="Decrease quantity"
        >
          <Minus aria-hidden="true" size={16} />
        </button>

        <span className="quantity-selector__value" aria-live="polite" aria-atomic="true">
          {quantity}
        </span>

        <button
          type="button"
          onClick={increase}
          disabled={quantity >= max}
          className="quantity-selector__button"
          aria-label="Increase quantity"
        >
          <Plus aria-hidden="true" size={16} />
        </button>
      </div>
    </div>
  );
}
