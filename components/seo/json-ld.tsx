interface ProductJsonLdProps {
  product: {
    id: string;
    name: string;
    description: string;
    slug: string;
    price: number;
    compareAtPrice?: number | null;
    images: string[];
    rating?: number | null;
    reviewCount?: number;
    stockStatus: string;
    material?: string | null;
    brand?: string;
  };
  hasVariants: boolean;
  availableVariants: Array<{
    size: string;
    color: string;
    price?: number | null;
    available: boolean;
    stock: number;
  }>;
  reviewStats?: {
    averageRating: number | null;
    totalReviews: number;
  };
}

export function ProductJsonLd({ product, hasVariants, availableVariants, reviewStats }: ProductJsonLdProps) {
  const baseUrl = "https://baundule.com";

  const offers = hasVariants
    ? availableVariants
        .filter(v => v.available && v.stock > 0)
        .map(variant => ({
          "@type": "Offer",
          "name": `${product.name} - ${variant.size} / ${variant.color}`,
          "price": ((variant.price ?? product.price) / 100).toFixed(2),
          "priceCurrency": "INR",
          "availability": variant.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "url": `${baseUrl}/product/${product.slug}`,
          "itemCondition": "https://schema.org/NewCondition",
          "seller": {
            "@type": "Organization",
            "name": "Baundule"
          }
        }))
    : [{
        "@type": "Offer",
        "price": (product.price / 100).toFixed(2),
        "priceCurrency": "INR",
        "availability": product.stockStatus === "in_stock"
          ? "https://schema.org/InStock"
          : product.stockStatus === "low_stock"
          ? "https://schema.org/LimitedAvailability"
          : "https://schema.org/OutOfStock",
        "url": `${baseUrl}/product/${product.slug}`,
        "itemCondition": "https://schema.org/NewCondition",
        "seller": {
          "@type": "Organization",
          "name": "Baundule"
        }
      }];

  const aggregateRating = (reviewStats?.averageRating && reviewStats.totalReviews > 0)
    ? {
        "@type": "AggregateRating",
        "ratingValue": reviewStats.averageRating.toFixed(1),
        "reviewCount": reviewStats.totalReviews,
        "bestRating": "5",
        "worstRating": "1"
      }
    : undefined;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.images.map(img => img.startsWith("http") ? img : `${baseUrl}${img}`),
    "brand": {
      "@type": "Brand",
      "name": product.brand || "Baundule"
    },
    "sku": product.id,
    "material": product.material || undefined,
    "offers": offers.length === 1 ? offers[0] : offers,
    ...(aggregateRating && { aggregateRating })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
    />
  );
}

interface BreadcrumbJsonLdProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const baseUrl = "https://baundule.com";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url.startsWith("http") ? item.url : `${baseUrl}${item.url}`
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  );
}

export function OrganizationJsonLd() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Baundule",
    "url": "https://baundule.com",
    "logo": "https://baundule.com/images/brand/icon.svg",
    "description": "Premium streetwear and T-shirt brand offering high-quality, thoughtfully designed apparel.",
    "sameAs": [
      "https://instagram.com/baundule",
      "https://twitter.com/baundule"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "hello@baundule.com",
      "availableLanguage": ["English"]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
  );
}
