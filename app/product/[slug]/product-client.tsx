"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Heart, Share2, Truck, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ui/product-card";
import { useToast } from "@/components/providers/toast-provider";
import { useStore } from "@/components/providers/store-provider";
import type { Product } from "@/types/store";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductLightbox } from "@/components/product/product-lightbox";
import { ColorSelector } from "@/components/product/color-selector";
import { SizeSelector } from "@/components/product/size-selector";
import { QuantitySelector } from "@/components/product/quantity-selector";
import { SizeGuide } from "@/components/product/size-guide";
import { ProductAccordion } from "@/components/product/product-accordion";
import { DeliveryEstimator } from "@/components/product/delivery-estimator";
import { RecentlyViewed, trackRecentlyViewed } from "@/components/product/recently-viewed";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const shouldReduceMotion = useReducedMotion();
  const { toast } = useToast();
  const { addToCart, toggleWishlist, isInWishlist } = useStore();

  // State
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(() => isInWishlist(product.id));
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  // Get available sizes for selected color (if variant data exists)
  const availableSizes = product.variants
    ? product.variants
        .filter((v) => v.color === selectedColor && v.available)
        .map((v) => v.size)
    : product.sizes;

  // Get unavailable sizes for selected color
  const unavailableSizes = product.variants
    ? product.variants
        .filter((v) => v.color === selectedColor && !v.available)
        .map((v) => v.size)
    : [];

  // Get unavailable colors (colors where all sizes are sold out)
  const unavailableColors = product.variants
    ? product.colors
        .filter((color) =>
          product.variants!.filter((v) => v.color === color.name && v.available).length === 0
        )
        .map((c) => c.name)
    : [];

  // Check if currently selected size is available
  const isSelectedSizeAvailable = !unavailableSizes.includes(selectedSize || "");

  // Determine if product is in stock (at least one variant available)
  const hasAvailableVariants = product.variants
    ? product.variants.some((v) => v.available)
    : product.stockStatus !== "sold_out";

  const lowStock = product.stockStatus === "low_stock";

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price / 100);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({ title: "Please select a size", type: "error" });
      return;
    }
    if (!isSelectedSizeAvailable) {
      toast({ title: "This size is not available", type: "error" });
      return;
    }
    setQuickAddOpen(true);
  };

  const handleQuickAddConfirm = () => {
    if (selectedSize && selectedColor) {
      // Add to cart via store provider
      addToCart({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        size: selectedSize,
        color: selectedColor,
        price: product.price,
        image: product.images[0],
        quantity: quantity
      });

      toast({
        title: `Added ${quantity} × ${product.name} (${selectedSize}, ${selectedColor}) to cart`,
        type: "success"
      });
      setQuickAddOpen(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied to clipboard", type: "success" });
    }
  };

  const handleWishlistToggle = () => {
    toggleWishlist(product.id);
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      type: "success"
    });
  };

  useEffect(() => {
    if (lightboxOpen || sizeGuideOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxOpen, sizeGuideOpen]);

  // Reset selected size when color changes
  useEffect(() => {
    setSelectedSize(null);
  }, [selectedColor]);

  // Track recently viewed
  useEffect(() => {
    trackRecentlyViewed(product);
  }, [product]);

  return (
    <main className="product-detail">
      <div className="product-detail__container page-shell">
        {/* Breadcrumb */}
        <nav className="product-detail__breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/shop">Shop</Link>
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        <div className="product-detail__grid">
          {/* Image Gallery */}
          <div className="product-gallery">
            <ProductGallery
              images={product.images}
              productName={product.name}
              onImageClick={(idx) => {
                setSelectedImage(idx);
                setLightboxOpen(true);
              }}
            />
            {product.badge && (
              <span className="product-gallery__badge">{product.badge}</span>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="product-info__header">
              <p className="eyebrow">{product.collection}</p>
              <h1>{product.name}</h1>

              <div className="product-info__pricing">
                <span className="product-info__price">{formatPrice(product.price)}</span>
                {product.compareAtPrice && (
                  <span className="product-info__compare-price">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>

              {product.rating && (
                <div className="product-info__rating">
                  <span className="product-info__stars">
                    {"★".repeat(Math.round(product.rating))}
                    {"☆".repeat(5 - Math.round(product.rating))}
                  </span>
                  <span>{product.rating}</span>
                  <span>({product.reviewCount} reviews)</span>
                </div>
              )}
            </div>

            <p className="product-info__description">{product.description}</p>

            {/* Color Selector */}
            {product.colors.length > 1 && (
              <div className="product-info__section">
                <ColorSelector
                  colors={product.colors}
                  selectedColor={selectedColor}
                  onColorSelect={setSelectedColor}
                  unavailableColors={unavailableColors}
                />
              </div>
            )}

            {/* Size Selector */}
            <div className="product-info__section">
              <SizeSelector
                sizes={availableSizes}
                selectedSize={selectedSize}
                onSizeSelect={setSelectedSize}
                unavailableSizes={unavailableSizes}
                onSizeGuideClick={() => setSizeGuideOpen(true)}
              />
            </div>

            {/* Quantity & Add to Cart */}
            <div className="product-info__actions">
              <QuantitySelector
                quantity={quantity}
                onQuantityChange={setQuantity}
                min={1}
                max={10}
              />

              <button
                type="button"
                className="button button--dark product-info__add-to-cart"
                onClick={handleAddToCart}
                disabled={!hasAvailableVariants || !selectedSize || !isSelectedSizeAvailable}
              >
                {!hasAvailableVariants
                  ? "Sold out"
                  : lowStock
                  ? "Add to cart (low stock)"
                  : !selectedSize
                  ? "Select a size"
                  : !isSelectedSizeAvailable
                  ? "Size unavailable"
                  : "Add to cart"}
              </button>
            </div>

            {/* Secondary Actions */}
            <div className="product-info__secondary-actions">
              <button
                type="button"
                className={`product-info__action ${isWishlisted ? "product-info__action--active" : ""}`}
                onClick={handleWishlistToggle}
              >
                <Heart aria-hidden="true" size={18} fill={isWishlisted ? "currentColor" : "none"} />
                <span>{isWishlisted ? "Wishlisted" : "Add to wishlist"}</span>
              </button>
              <button type="button" className="product-info__action" onClick={handleShare}>
                <Share2 aria-hidden="true" size={18} />
                <span>Share</span>
              </button>
            </div>

            {/* Stock Status */}
            {!hasAvailableVariants && (
              <p className="product-info__stock-status product-info__stock-status--out">
                This item is currently sold out
              </p>
            )}
            {lowStock && hasAvailableVariants && (
              <p className="product-info__stock-status">Only a few items left</p>
            )}

            {/* Shipping Info */}
            <div className="product-info__shipping">
              <Truck aria-hidden="true" size={18} />
              <div>
                <p>Free shipping on orders over {formatPrice(5000)}</p>
                <p>Ships within 2-3 business days</p>
              </div>
            </div>

            {/* Delivery Estimator */}
            <DeliveryEstimator estimatedDays="3-5 business days" />

            {/* Product Details Accordions */}
            {product.shortDescription || product.material || product.fit || product.care || product.gsm ? (
              <ProductAccordion
                sections={[
                  ...(product.shortDescription
                    ? [{ title: "Details", content: <p>{product.shortDescription}</p> }]
                    : []),
                  ...(product.material
                    ? [{ title: "Material", content: <p>{product.material}</p> }]
                    : []),
                  ...(product.fit
                    ? [{ title: "Fit", content: <p>{product.fit}</p> }]
                    : []),
                  ...(product.gsm
                    ? [{ title: "Weight", content: <p>{product.gsm} GSM</p> }]
                    : []),
                  ...(product.care
                    ? [
                        {
                          title: "Care",
                          content: (
                            <ul className="product-accordion__care-list">
                              {product.care.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          ),
                        },
                      ]
                    : []),
                ]}
              />
            ) : null}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="product-related">
            <div className="product-related__header">
              <h2>You might also like</h2>
              <Link href="/shop" className="product-related__view-all">
                View all <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>
            <div className="product-related__grid">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}

        {/* Recently Viewed */}
        <RecentlyViewed currentProductId={product.id} />
      </div>

      {/* Lightbox */}
      <ProductLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={product.images}
        productName={product.name}
        initialIndex={selectedImage}
      />

      {/* Size Guide Modal */}
      <SizeGuide
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        productType="T-Shirt"
      />

      {/* Quick Add Confirmation */}
      <AnimatePresence>
        {quickAddOpen && (
          <motion.div
            className="quick-add-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="quick-add-modal"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
            >
              <button
                type="button"
                className="quick-add-modal__close"
                onClick={() => setQuickAddOpen(false)}
                aria-label="Close"
              >
                <X aria-hidden="true" size={20} />
              </button>

              <div className="quick-add-modal__content">
                <Image src={product.images[0]} alt={product.name} width={80} height={100} style={{ objectFit: "cover" }} />
                <div>
                  <h3>Added to cart</h3>
                  <p>{product.name}</p>
                  <p className="quick-add-modal__details">
                    {selectedSize} / {selectedColor} × {quantity}
                  </p>
                  <p className="quick-add-modal__total">
                    {formatPrice(product.price * quantity)}
                  </p>
                </div>
              </div>

              <div className="quick-add-modal__actions">
                <button
                  type="button"
                  className="button button--light"
                  onClick={() => setQuickAddOpen(false)}
                >
                  Continue shopping
                </button>
                <button
                  type="button"
                  className="button button--dark"
                  onClick={handleQuickAddConfirm}
                >
                  View cart <ArrowUpRight aria-hidden="true" size={16} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}