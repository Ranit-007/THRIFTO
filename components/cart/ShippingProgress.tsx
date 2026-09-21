import { store } from "@/config/store";
import { formatPrice } from "@/lib/utils";

interface ShippingProgressProps {
  subtotal: number;
}

export function ShippingProgress({ subtotal }: ShippingProgressProps) {
  const threshold = store.shipping.freeThreshold;
  const isUnlocked = subtotal >= threshold;
  const amountRemaining = Math.max(threshold - subtotal, 0);
  const progress = Math.min((subtotal / threshold) * 100, 100);

  return (
    <div className="shipping-progress">
      <p className="shipping-progress__message">
        {isUnlocked
          ? "FREE SHIPPING UNLOCKED"
          : `ADD ${formatPrice(amountRemaining)} MORE FOR FREE SHIPPING`}
      </p>
      <div
        className="shipping-progress__track"
        role="progressbar"
        aria-label="Progress toward free shipping"
        aria-valuemin={0}
        aria-valuemax={threshold}
        aria-valuenow={Math.min(subtotal, threshold)}
      >
        <span style={{ width: `${progress}%` }} />
      </div>
      <p className="shipping-progress__detail">
        {isUnlocked ? "Your order qualifies for free shipping." : `Free shipping at ${formatPrice(threshold)}.`}
      </p>
    </div>
  );
}
