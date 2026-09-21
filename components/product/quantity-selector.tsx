"use client";

import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
  label?: string;
  hideLabel?: boolean;
}

export function QuantitySelector({
  quantity,
  onQuantityChange,
  min = 1,
  max = 10,
  label = "Quantity",
  hideLabel = false,
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
    <div className={`quantity-selector ${hideLabel ? "quantity-selector--compact" : ""}`}>
      <span className={hideLabel ? "sr-only" : "quantity-selector__label"}>{label}</span>

      <div className="quantity-selector__controls">
        <button
          type="button"
          onClick={decrease}
          disabled={quantity <= min}
          className="quantity-selector__button"
          aria-label={`Decrease ${label.toLowerCase()}`}
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
          aria-label={`Increase ${label.toLowerCase()}`}
        >
          <Plus aria-hidden="true" size={16} />
        </button>
      </div>
    </div>
  );
}
