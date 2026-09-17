"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { TSHIRT_SIZE_GUIDE } from "@/lib/shop-data";

interface SizeGuideProps {
  isOpen: boolean;
  onClose: () => void;
  productType?: string;
}

export function SizeGuide({ isOpen, onClose, productType = "T-Shirt" }: SizeGuideProps) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="size-guide__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="size-guide__modal"
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="size-guide-title"
          >
            <div className="size-guide__header">
              <h2 id="size-guide-title">Size Guide</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close size guide"
                className="size-guide__close"
              >
                <X aria-hidden="true" size={20} />
              </button>
            </div>

            <div className="size-guide__content">
              <p className="size-guide__subtitle">{productType} Measurements</p>

              <div className="size-guide__table-wrapper">
                <table className="size-guide__table">
                  <thead>
                    <tr>
                      <th>Size</th>
                      <th>Chest</th>
                      <th>Length</th>
                      <th>Shoulder</th>
                      <th>Sleeve</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TSHIRT_SIZE_GUIDE.map((row) => (
                      <tr key={row.size}>
                        <td className="font-semibold">{row.size}</td>
                        <td>{row.chest}</td>
                        <td>{row.length}</td>
                        <td>{row.shoulder}</td>
                        <td>{row.sleeve}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="size-guide__notes">
                <h3>How to Measure</h3>
                <ul>
                  <li><strong>Chest:</strong> Measure around the fullest part of your chest, keeping the tape horizontal.</li>
                  <li><strong>Length:</strong> Measure from the highest point of the shoulder to the bottom hem.</li>
                  <li><strong>Shoulder:</strong> Measure from shoulder seam to shoulder seam across the back.</li>
                  <li><strong>Sleeve:</strong> Measure from shoulder seam to cuff.</li>
                </ul>
              </div>

              <div className="size-guide__tip">
                <p>💡 <strong>Tip:</strong> If you&apos;re between sizes, we recommend sizing up for a more relaxed fit.</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
