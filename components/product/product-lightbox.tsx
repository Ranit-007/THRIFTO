"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { type KeyboardEvent, useEffect } from "react";

interface ProductLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  productName: string;
  initialIndex?: number;
}

export function ProductLightbox({
  isOpen,
  onClose,
  images,
  productName,
  initialIndex = 0,
}: ProductLightboxProps) {
  const shouldReduceMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  const navigateImage = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    } else {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowLeft") navigateImage("prev");
    if (event.key === "ArrowRight") navigateImage("next");
    if (event.key === "Escape") onClose();
  };

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
        <motion.div
          className="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
          tabIndex={-1}
        >
          {/* Backdrop */}
          <motion.div
            className="lightbox__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Close button */}
          <button
            type="button"
            className="lightbox__close"
            onClick={onClose}
            aria-label="Close lightbox"
          >
            <X aria-hidden="true" size={24} />
          </button>

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                className="lightbox__nav lightbox__nav--prev"
                onClick={() => navigateImage("prev")}
                aria-label="Previous image"
              >
                <ChevronLeft aria-hidden="true" size={32} />
              </button>

              <button
                type="button"
                className="lightbox__nav lightbox__nav--next"
                onClick={() => navigateImage("next")}
                aria-label="Next image"
              >
                <ChevronRight aria-hidden="true" size={32} />
              </button>
            </>
          )}

          {/* Image */}
          <div className="lightbox__image-wrapper">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                className="relative w-full h-full flex items-center justify-center"
              >
                <Image
                  src={images[currentIndex]}
                  alt={`${productName} - Image ${currentIndex + 1}`}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Counter */}
          <div className="lightbox__counter">
            {currentIndex + 1} / {images.length}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
import { useState } from "react";

