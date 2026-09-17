"use client";

interface ColorSelectorProps {
  colors: Array<{ name: string; hex: string }>;
  selectedColor: string | null;
  onColorSelect: (colorName: string) => void;
  unavailableColors?: string[];
}

export function ColorSelector({
  colors,
  selectedColor,
  onColorSelect,
  unavailableColors = [],
}: ColorSelectorProps) {
  return (
    <div className="color-selector">
      <div className="color-selector__header">
        <span className="color-selector__label">Color</span>
        {selectedColor && <span className="color-selector__selected">{selectedColor}</span>}
      </div>

      <div className="color-selector__swatches" role="radiogroup" aria-label="Select color">
        {colors.map((color) => {
          const isUnavailable = unavailableColors.includes(color.name);
          const isSelected = selectedColor === color.name;

          return (
            <button
              key={color.name}
              type="button"
              onClick={() => !isUnavailable && onColorSelect(color.name)}
              disabled={isUnavailable}
              className={`color-selector__swatch ${
                isSelected ? "color-selector__swatch--active" : ""
              } ${isUnavailable ? "color-selector__swatch--unavailable" : ""}`}
              style={{ backgroundColor: color.hex }}
              role="radio"
              aria-checked={isSelected}
              aria-label={`${color.name}${isUnavailable ? " (unavailable)" : ""}`}
              aria-disabled={isUnavailable}
            >
              {isSelected && (
                <span className="color-selector__check" aria-hidden="true">
                  ✓
                </span>
              )}
              {isUnavailable && (
                <span className="color-selector__unavailable-indicator" aria-hidden="true">
                  /
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
