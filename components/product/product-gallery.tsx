"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  onImageClick?: (index: number) => void;
}

export function ProductGallery({ images, productName, onImageClick }: ProductGalleryProps) {
  const shouldReduceMotion = useReducedMotion();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const navigateImage = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    } else {
      setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <div className="product-gallery">
      {/* Main Image */}
      <div
        className="product-gallery__main"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          type="button"
          className="product-gallery__image-wrapper"
          onClick={() => onImageClick?.(selectedImage)}
          aria-label="Open image in fullscreen"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedImage}
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
              className="product-gallery__image-container"
            >
              <Image
                src={images[selectedImage]}
                alt={`${productName} - Image ${selectedImage + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                priority={selectedImage === 0}
                className={`object-cover transition-transform duration-500 ${
                  isHovered ? "scale-105" : "scale-100"
                }`}
              />
            </motion.div>
          </AnimatePresence>

          {/* Zoom indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="product-gallery__zoom-indicator"
          >
            <ZoomIn size={20} />
            <span>Click to zoom</span>
          </motion.div>
        </button>

        {images.length > 1 && (
          <>
            <button
              type="button"
              className="product-gallery__nav product-gallery__nav--prev"
              onClick={() => navigateImage("prev")}
              aria-label="Previous image"
            >
              <ChevronLeft aria-hidden="true" size={24} />
            </button>
            <button
              type="button"
              className="product-gallery__nav product-gallery__nav--next"
              onClick={() => navigateImage("next")}
              aria-label="Next image"
            >
              <ChevronRight aria-hidden="true" size={24} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="product-gallery__thumbnails">
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              className={`product-gallery__thumbnail ${
                selectedImage === index ? "product-gallery__thumbnail--active" : ""
              }`}
              onClick={() => setSelectedImage(index)}
              aria-label={`View image ${index + 1}`}
              aria-current={selectedImage === index ? "true" : undefined}
            >
              <Image
                src={image}
                alt=""
                width={80}
                height={80}
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
