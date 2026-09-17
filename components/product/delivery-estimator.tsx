"use client";

import { useState } from "react";
import { Truck } from "lucide-react";
import { useToast } from "@/components/providers/toast-provider";

interface DeliveryEstimatorProps {
  estimatedDays?: string;
}

export function DeliveryEstimator({ estimatedDays = "3-5 business days" }: DeliveryEstimatorProps) {
  const [pincode, setPincode] = useState("");
  const [showEstimate, setShowEstimate] = useState(false);
  const { toast } = useToast();

  const handleCheck = () => {
    if (!pincode || pincode.length !== 6) {
      toast({ title: "Please enter a valid 6-digit pincode", type: "error" });
      return;
    }

    // Demo: Simulate delivery estimate lookup
    setShowEstimate(true);
  };

  return (
    <div className="delivery-estimator">
      <div className="delivery-estimator__header">
        <Truck aria-hidden="true" size={18} />
        <span>Delivery Options</span>
      </div>

      <div className="delivery-estimator__input-group">
        <input
          type="text"
          placeholder="Enter pincode"
          value={pincode}
          onChange={(e) => {
            setPincode(e.target.value.replace(/\D/g, "").slice(0, 6));
            setShowEstimate(false);
          }}
          maxLength={6}
          className="delivery-estimator__input"
          aria-label="Enter delivery pincode"
        />
        <button
          type="button"
          onClick={handleCheck}
          className="delivery-estimator__check-button"
          aria-label="Check delivery availability"
        >
          Check
        </button>
      </div>

      {showEstimate && (
        <div className="delivery-estimator__result">
          <p className="delivery-estimator__estimate">
            Estimated delivery: <strong>{estimatedDays}</strong>
          </p>
          <p className="delivery-estimator__note">
            Free shipping on orders above ₹3,000
          </p>
        </div>
      )}
    </div>
  );
}
