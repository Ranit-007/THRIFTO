"use client";

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string | null;
  onSizeSelect: (size: string) => void;
  unavailableSizes?: string[];
  onSizeGuideClick?: () => void;
}

export function SizeSelector({
  sizes,
  selectedSize,
  onSizeSelect,
  unavailableSizes = [],
  onSizeGuideClick,
}: SizeSelectorProps) {
  return (
    <div className="size-selector">
      <div className="size-selector__header">
        <span className="size-selector__label">Size</span>
        {onSizeGuideClick && (
          <button
            type="button"
            onClick={onSizeGuideClick}
            className="size-selector__guide-link"
          >
            Size guide
          </button>
        )}
      </div>

      <div className="size-selector__options" role="radiogroup" aria-label="Select size">
        {sizes.map((size) => {
          const isUnavailable = unavailableSizes.includes(size);
          const isSelected = selectedSize === size;

          return (
            <button
              key={size}
              type="button"
              onClick={() => !isUnavailable && onSizeSelect(size)}
              disabled={isUnavailable}
              className={`size-selector__option ${
                isSelected ? "size-selector__option--active" : ""
              } ${isUnavailable ? "size-selector__option--unavailable" : ""}`}
              role="radio"
              aria-checked={isSelected}
              aria-label={`${size}${isUnavailable ? " (unavailable)" : ""}`}
              aria-disabled={isUnavailable}
            >
              {size}
              {isUnavailable && (
                <span className="size-selector__unavailable-text" aria-hidden="true">
                  Sold out
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
