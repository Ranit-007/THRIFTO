"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Plus, Star } from "lucide-react";
import { formatPrice } from "@/config/brand";
import type { Product } from "@/types/store";
import { useStore } from "@/components/providers/store-provider";

type ProductCardProps = {
  product: Product;
  priority?: boolean;
  showRating?: boolean;
  loading?: boolean;
  quickAddLabel?: string;
};

export function ProductCard({
  product,
  priority = false,
  showRating = false,
  loading = false,
  quickAddLabel = "Quick add",
}: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useStore();
  const router = useRouter();
  const isWishlisted = isInWishlist(product.id);

  if (loading) {
    return (
      <article className="product-card product-card--loading" aria-busy="true" aria-label="Loading product">
        <div className="product-card__image-wrap" />
        <div className="product-card__loading-line product-card__loading-line--title" />
        <div className="product-card__loading-line" />
      </article>
    );
  }

  const productHref = `/product/${product.slug}`;
  const alternateImage = product.images[1] ?? product.images[0];
  const isSoldOut = product.stockStatus === "sold_out";

  function handleAddToCart() {
    // Navigate to product page for variant selection instead of blind add
    // This respects the requirement that quick-add should not add products blindly
    // when variant selection is required
    router.push(`/product/${product.slug}`);
  }

  return (
    <article className="product-card group">
      <div className="product-card__image-wrap">
        {product.badge ? <span className="product-card__badge">{product.badge}</span> : null}
        {isSoldOut ? <span className="product-card__badge product-card__badge--sold-out">Sold out</span> : null}
        <Link href={productHref} className="product-card__media-link" aria-label={`View ${product.name}`}>
          <Image
            className="product-card__image product-card__image--primary"
            src={product.images[0]}
            alt={`${product.name} in ${product.category}`}
            fill
            priority={priority}
            sizes="(max-width: 680px) 86vw, (max-width: 1023px) 43vw, 24vw"
          />
          <Image
            className="product-card__image product-card__image--alternate"
            src={alternateImage}
            alt=""
            fill
            sizes="(max-width: 680px) 86vw, (max-width: 1023px) 43vw, 24vw"
          />
        </Link>
        <button
          className={`product-card__heart ${isWishlisted ? "is-active" : ""}`}
          type="button"
          aria-pressed={isWishlisted}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          onClick={() => {
            toggleWishlist(product.id);
          }}
        >
          <Heart aria-hidden="true" size={17} strokeWidth={1.5} fill={isWishlisted ? "currentColor" : "none"} />
        </button>

        {!isSoldOut && (
          <button
            type="button"
            className="product-card__quick-add"
            onClick={handleAddToCart}
            aria-label={`Select options for ${product.name}`}
          >
            <Plus size={16} aria-hidden="true" />
            <span>{quickAddLabel}</span>
          </button>
        )}
      </div>
      <div className="product-card__details">
        <div>
          <Link href={productHref}><h3>{product.name}</h3></Link>
          <p>{product.category}</p>
        </div>
        <p className="product-card__price">
          {formatPrice(product.price)}
          {product.compareAtPrice ? <del>{formatPrice(product.compareAtPrice)}</del> : null}
        </p>
      </div>
      <div className="product-card__meta">
        <span className="product-card__swatch" style={{ backgroundColor: product.colors[0]?.hex }} aria-label={product.colors[0]?.name} />
        {showRating && product.rating && product.reviewCount ? (
          <span className="product-card__rating">
            <Star aria-hidden="true" size={13} fill="currentColor" strokeWidth={1.4} />
            {product.rating} <span>({product.reviewCount})</span>
          </span>
        ) : (
          <span>{product.collection}</span>
        )}
      </div>
    </article>
  );
}
