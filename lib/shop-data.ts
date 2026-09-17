// We are going to update the Shadow Weight Tee to have variant data.
// We'll keep the existing fields and add a variants array.

import type { Product, Collection, ProductVariant, SizeGuideMeasurement } from "@/types/store";

export const TSHIRT_SIZE_GUIDE: SizeGuideMeasurement[] = [
  { size: "XS", chest: "34-36\"", length: "26\"", shoulder: "16\"", sleeve: "7.5\"" },
  { size: "S", chest: "36-38\"", length: "27\"", shoulder: "17\"", sleeve: "8\"" },
  { size: "M", chest: "38-40\"", length: "28\"", shoulder: "18\"", sleeve: "8.5\"" },
  { size: "L", chest: "40-42\"", length: "29\"", shoulder: "19\"", sleeve: "9\"" },
  { size: "XL", chest: "42-44\"", length: "30\"", shoulder: "20\"", sleeve: "9.5\"" },
  { size: "XXL", chest: "44-46\"", length: "31\"", shoulder: "21\"", sleeve: "10\"" },
];

// Helper to create variant data deterministically
export const createVariantData = (
  sizes: string[],
  colors: { name: string; hex: string }[],
  unavailableCombos: { size?: string; color?: string }[] = []
): ProductVariant[] => {
  const variants: ProductVariant[] = [];
  let variantId = 1;

  sizes.forEach((size, sIdx) => {
    colors.forEach((color, cIdx) => {
      const isUnavailable = unavailableCombos.some(
        (u) => (u.size === undefined || u.size === size) && (u.color === undefined || u.color === color.name)
      );
      const stock = isUnavailable ? 0 : ((sIdx * 3 + cIdx * 5 + 7) % 15) + 3;
      const available = stock > 0;

      variants.push({
        id: `variant-${variantId++}`,
        size,
        color: color.name,
        colorHex: color.hex,
        stock,
        sku: `${size.toUpperCase()}-${color.name.toUpperCase().substring(0, 3)}`,
        available,
      });
    });
  });

  return variants;
};

export const productsWithVariants: Product[] = [
  {
    id: "shadow-01",
    slug: "shadow-weight-tee",
    name: "Shadow Weight Tee",
    shortDescription: "Garment-dyed charcoal cotton with double-stitched seams.",
    description: "A relaxed heavyweight tee in garment-dyed charcoal cotton. Double-stitched seams and a high ribbed collar create a refined silhouette that improves with wear.",
    price: 2490,
    compareAtPrice: 2890,
    category: "T-Shirts",
    collection: "The Uniform",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1600&q=85"
    ],
    colors: [{ name: "Charcoal", hex: "#282725" }],
    sizes: ["XS", "S", "M", "L", "XL"],
    badge: "New",
    stockStatus: "in_stock",
    featured: true,
    bestSeller: true,
    newArrival: true,
    rating: 4.8,
    reviewCount: 42,
    material: "100% Garment-Dyed Cotton",
    gsm: 280,
    fit: "Relaxed Fit",
    care: ["Machine wash cold", "Wash inside out", "Do not bleach", "Tumble dry low", "Iron on reverse if needed"],
    tags: ["heavyweight", "garment-dyed", "premium"],
    // Adding variant data for demonstration
    variants: createVariantData(["XS", "S", "M", "L", "XL"], [{ name: "Charcoal", hex: "#282725" }]),
  },
  {
    id: "signal-02",
    slug: "signal-study-tee",
    name: "Signal Study Tee",
    shortDescription: "Clean bone tee with subtle chest graphic.",
    description: "A clean bone tee with a restrained chest graphic. Lightweight 180gsm cotton perfect for layering. Screen printed with water-based inks.",
    price: 2690,
    compareAtPrice: 2990,
    category: "T-Shirts",
    collection: "Graphic Studies",
    images: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1600&q=85"
    ],
    colors: [{ name: "Bone", hex: "#e9e4da" }],
    sizes: ["XS", "S", "M", "L", "XL"],
    badge: "New",
    stockStatus: "in_stock",
    featured: true,
    bestSeller: false,
    newArrival: true,
    rating: 4.6,
    reviewCount: 18,
    material: "100% Organic Cotton",
    gsm: 180,
    fit: "Regular Fit",
    care: ["Machine wash cold", "Wash inside out", "Do not bleach", "Tumble dry low"],
    tags: ["graphic", "lightweight", "organic"],
  },
  // We'll leave the rest of the products as they are for now, but we can add variants to a few more if needed.
  // For brevity, we'll just update the first product and leave the rest without variants (they will fall back to product-level stock).
  {
    id: "archive-03",
    slug: "archive-no-03",
    name: "Archive No. 03",
    shortDescription: "Oversized washed ink graphic tee.",
    description: "A washed ink graphic tee with an oversized shape. Screen printed with environmentally friendly inks. Pre-washed for a lived-in feel.",
    price: 2890,
    category: "Graphic Tees",
    collection: "Graphic Studies",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=85"
    ],
    colors: [{ name: "Washed ink", hex: "#464540" }],
    sizes: ["S", "M", "L", "XL", "XXL"],
    badge: "Limited",
    stockStatus: "low_stock",
    featured: true,
    bestSeller: false,
    newArrival: true,
    rating: 5.0,
    reviewCount: 12,
    material: "100% Cotton Jersey",
    gsm: 240,
    fit: "Oversized Fit",
    care: ["Machine wash cold", "Wash inside out", "Do not bleach", "Hang dry recommended"],
    tags: ["graphic", "oversized", "limited-edition"],
  },
  {
    id: "static-04",
    slug: "static-oversized-tee",
    name: "Static Oversized Tee",
    shortDescription: "Dropped-shoulder oversized tee in deep coal.",
    description: "A generous, dropped-shoulder tee in deep coal jersey. Designed to drape rather than cling. Heavyweight construction for structure.",
    price: 2490,
    category: "Oversized",
    collection: "The Uniform",
    images: [
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=85"
    ],
    colors: [{ name: "Coal", hex: "#151515" }],
    sizes: ["XS", "S", "M", "L", "XL"],
    stockStatus: "in_stock",
    featured: false,
    bestSeller: false,
    newArrival: true,
    rating: 4.5,
    reviewCount: 28,
    material: "100% Cotton Jersey",
    gsm: 260,
    fit: "Oversized Fit",
    care: ["Machine wash cold", "Wash inside out", "Do not bleach", "Tumble dry low"],
    tags: ["oversized", "heavyweight", "dropped-shoulder"],
  },
  {
    id: "mono-05",
    slug: "monochrome-pocket-tee",
    name: "Monochrome Pocket Tee",
    shortDescription: "Refined pocket tee in soft ecru cotton.",
    description: "A refined pocket tee in soft ecru cotton. Subtle branding tab on the seam. Perfect for everyday wear.",
    price: 2290,
    category: "Essentials",
    collection: "The Uniform",
    images: [
      "https://images.unsplash.com/photo-1527719327859-c6ce80353573?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1600&q=85"
    ],
    colors: [{ name: "Ecru", hex: "#ded9cf" }],
    sizes: ["S", "M", "L", "XL"],
    stockStatus: "in_stock",
    featured: false,
    bestSeller: true,
    newArrival: false,
    rating: 4.9,
    reviewCount: 84,
    material: "100% Cotton",
    gsm: 200,
    fit: "Regular Fit",
    care: ["Machine wash cold", "Wash inside out", "Do not bleach", "Tumble dry low"],
    tags: ["pocket", "essential", "classic"],
  },
  {
    id: "line-06",
    slug: "linework-heavy-tee",
    name: "Linework Heavy Tee",
    description: "A high-density black tee printed with an abstract line study.",
    price: 2690,
    category: "Graphic Tees",
    collection: "Graphic Studies",
    images: [
      "https://images.unsplash.com/photo-1563630423918-b58f07336ac9?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=85"
    ],
    colors: [{ name: "Ink", hex: "#20201e" }],
    sizes: ["S", "M", "L", "XL", "XXL"],
    badge: "Best seller",
    stockStatus: "in_stock",
    featured: true,
    bestSeller: true,
    newArrival: false,
    rating: 4.8,
    reviewCount: 51,
  },
  {
    id: "still-07",
    slug: "still-life-tee",
    name: "Still Life Tee",
    description: "A faded ash tee with a relaxed, lived-in finish. Pre-washed to eliminate shrinkage.",
    price: 2490,
    compareAtPrice: 2690,
    category: "Essentials",
    collection: "Washed World",
    images: [
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=85"
    ],
    colors: [{ name: "Ash", hex: "#aaa69f" }],
    sizes: ["S", "M", "L", "XL"],
    stockStatus: "low_stock",
    featured: false,
    bestSeller: true,
    newArrival: false,
    rating: 4.9,
    reviewCount: 36,
  },
  {
    id: "core-08",
    slug: "core-box-tee",
    name: "Core Box Tee",
    description: "A wide, cropped silhouette in optic white.",
    price: 2090,
    category: "Essentials",
    collection: "The Uniform",
    images: [
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85"
    ],
    colors: [{ name: "White", hex: "#f8f9fa" }],
    sizes: ["XS", "S", "M", "L"],
    stockStatus: "in_stock",
    featured: false,
    bestSeller: false,
    newArrival: false,
    rating: 4.4,
    reviewCount: 15,
  },
  {
    id: "sage-09",
    slug: "botanical-dye-tee",
    name: "Botanical Dye Tee",
    description: "Pigment dyed using natural botanical extracts, giving a unique washed sage colour.",
    price: 2990,
    category: "Essentials",
    collection: "Washed World",
    images: [
      "https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1600&q=85"
    ],
    colors: [{ name: "Sage", hex: "#7a8a76" }],
    sizes: ["S", "M", "L", "XL"],
    stockStatus: "sold_out",
    featured: false,
    bestSeller: false,
    newArrival: true,
    rating: 4.7,
    reviewCount: 6,
  },
  {
    id: "night-10",
    slug: "midnight-heavyweight",
    name: "Midnight Heavyweight",
    description: "Our thickest jersey cotton in a deep navy that appears black under low light.",
    price: 3290,
    category: "Premium",
    collection: "The Uniform",
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1600&q=85"
    ],
    colors: [{ name: "Midnight", hex: "#161b22" }],
    sizes: ["S", "M", "L", "XL", "XXL"],
    badge: "Premium",
    stockStatus: "in_stock",
    featured: false,
    bestSeller: false,
    newArrival: false,
    rating: 4.9,
    reviewCount: 22,
  },
  {
    id: "raw-11",
    slug: "raw-edge-tee",
    name: "Raw Edge Tee",
    description: "Unfinished hemlines that gracefully roll with wear. Vintage wash treatment.",
    price: 2790,
    category: "Essentials",
    collection: "Washed World",
    images: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85"
    ],
    colors: [{ name: "Cement", hex: "#b4b2ac" }],
    sizes: ["S", "M", "L", "XL"],
    stockStatus: "low_stock",
    featured: false,
    bestSeller: false,
    newArrival: false,
    rating: 4.3,
    reviewCount: 11,
  },
  {
    id: "form-12",
    slug: "form-study-longsleeve",
    name: "Form Study Longsleeve",
    description: "A heavyweight longsleeve tee with ribbed cuffs and subtle architectural graphics.",
    price: 3490,
    category: "Longsleeve",
    collection: "Graphic Studies",
    images: [
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1563630423918-b58f07336ac9?auto=format&fit=crop&w=1200&q=85"
    ],
    colors: [{ name: "Concrete", hex: "#8b8b8b" }],
    sizes: ["S", "M", "L", "XL"],
    stockStatus: "in_stock",
    featured: false,
    bestSeller: false,
    newArrival: true,
    rating: 5.0,
    reviewCount: 8,
  },
  // Additional products for better variety
  {
    id: "urban-13",
    slug: "urban-utility-tee",
    name: "Urban Utility Tee",
    description: "A functional tee with utility pockets and reinforced stitching for active lifestyles.",
    price: 2890,
    category: "T-Shirts",
    collection: "Graphic Studies",
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=85"
    ],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Olive", hex: "#6b8e23" },
      { name: "Navy", hex: "#000080" }
    ],
    sizes: ["S", "M", "L", "XL"],
    badge: "New",
    stockStatus: "in_stock",
    featured: false,
    bestSeller: false,
    newArrival: true,
    rating: 4.5,
    reviewCount: 14,
  },
  {
    id: "vintage-14",
    slug: "vintage-wash-tee",
    name: "Vintage Wash Tee",
    description: "Soft, vintage-washed cotton with a relaxed fit and lived-in feel from first wear.",
    price: 2390,
    category: "Essentials",
    collection: "Washed World",
    images: [
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=85"
    ],
    colors: [
      { name: "Fade Black", hex: "#2d2d2d" },
      { name: "Fade White", hex: "#f0f0f0" },
      { name: "Fade Grey", hex: "#808080" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    stockStatus: "in_stock",
    featured: false,
    bestSeller: false,
    newArrival: false,
    rating: 4.6,
    reviewCount: 22,
  },
  {
    id: "crop-15",
    slug: "crop-top-tee",
    name: "Crop Top Tee",
    description: "A shortened silhouette that hits at the waist for layered styling.",
    price: 2190,
    category: "Tops",
    collection: "The Uniform",
    images: [
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85"
    ],
    colors: [{ name: "White", hex: "#ffffff" }],
    sizes: ["XS", "S", "M", "L"],
    stockStatus: "in_stock",
    featured: false,
    bestSeller: false,
    newArrival: true,
    rating: 4.2,
    reviewCount: 8,
  },
  {
    id: "tech-16",
    slug: "tech-fabric-tee",
    name: "Tech Fabric Tee",
    description: "Performance-oriented tee with moisture-wicking and anti-odor treatment.",
    price: 2990,
    category: "T-Shirts",
    collection: "Graphic Studies",
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=85"
    ],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Blue", hex: "#0066cc" },
      { name: "Grey", hex: "#666666" }
    ],
    sizes: ["S", "M", "L", "XL"],
    badge: "Performance",
    stockStatus: "in_stock",
    featured: false,
    bestSeller: false,
    newArrival: true,
    rating: 4.4,
    reviewCount: 16,
  },
  {
    id: "pocket-17",
    slug: "utility-pocket-tee",
    name: "Utility Pocket Tee",
    description: "Chest pocket with pen slot and reinforced corners for everyday utility.",
    price: 2590,
    category: "Essentials",
    collection: "The Uniform",
    images: [
      "https://images.unsplash.com/photo-1527719327859-c6ce80353573?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1600&q=85"
    ],
    colors: [
      { name: "Olive", hex: "#6b8e23" },
      { name: "Beige", hex: "#f5f5dc" },
      { name: "Navy", hex: "#000080" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    stockStatus: "in_stock",
    featured: false,
    bestSeller: false,
    newArrival: false,
    rating: 4.3,
    reviewCount: 19,
  },
  {
    id: "retro-18",
    slug: "retro-stripe-tee",
    name: "Retro Stripe Tee",
    description: "Vintage-inspired horizontal stripe tee in soft cotton jersey.",
    price: 2390,
    category: "Tops",
    collection: "Washed World",
    images: [
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=85"
    ],
    colors: [
      { name: "Red/White", hex: "#cc0000" },
      { name: "Navy/White", hex: "#000080" },
      { name: "Black/White", hex: "#000000" }
    ],
    sizes: ["S", "M", "L", "XL"],
    stockStatus: "in_stock",
    featured: false,
    bestSeller: false,
    newArrival: true,
    rating: 4.5,
    reviewCount: 11,
  },
  {
    id: "heavy-19",
    slug: "heavyweight-pocket-tee",
    name: "Heavyweight Pocket Tee",
    description: "8oz heavyweight cotton with chest pocket and double-stitched seams.",
    price: 3190,
    category: "Premium",
    collection: "The Uniform",
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1600&q=85"
    ],
    colors: [
      { name: "Charcoal", hex: "#282725" },
      { name: "Forest", hex: "#228b22" },
      { name: "Burgundy", hex: "#800020" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    badge: "Heavyweight",
    stockStatus: "in_stock",
    featured: true,
    bestSeller: false,
    newArrival: false,
    rating: 4.7,
    reviewCount: 13,
  },
  {
    id: "minimal-20",
    slug: "minimal-stitch-tee",
    name: "Minimal Stitch Tee",
    description: "Clean minimalist tee with tonal stitching and no visible branding.",
    price: 2290,
    category: "Essentials",
    collection: "Essentials",
    images: [
      "https://images.unsplash.com/photo-1527719327859-c6ce80353573?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1200&q=85"
    ],
    colors: [
      { name: "White", hex: "#ffffff" },
      { name: "Black", hex: "#000000" },
      { name: "Stone", hex: "#eae0d5" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    stockStatus: "in_stock",
    featured: false,
    bestSeller: true,
    newArrival: false,
    rating: 4.8,
    reviewCount: 27,
  }
];

export const collections: Collection[] = [
  {
    name: "The uniform",
    description: "Weight, proportion and repeat wear.",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1600&q=85",
    href: "/shop?collection=the-uniform",
    span: "wide",
  },
  {
    name: "Graphic studies",
    description: "Marks made to outlast a season.",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=85",
    href: "/shop?collection=graphic-studies",
  },
  {
    name: "Washed world",
    description: "Colour with a lived-in memory.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=85",
    href: "/shop?collection=washed-world",
  },
  {
    name: "Essentials",
    description: "Timeless pieces for everyday wear.",
    image: "https://images.unsplash.com/photo-1527719327859-c6ce80353573?auto=format&fit=crop&w=1200&q=85",
    href: "/shop?collection=essentials",
  },
  {
    name: "Oversized",
    description: "Relaxed fits for effortless style.",
    image: "https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?auto=format&fit=crop&w=1200&q=85",
    href: "/shop?collection=oversized",
  }
];

export const getProductBySlug = (slug: string) => {
  return productsWithVariants.find((product) => product.slug === slug);
};

export const getProductsByCollection = (collectionName: string) => {
  return productsWithVariants.filter(product => product.collection.toLowerCase() === collectionName.toLowerCase());
};

export const getProductsByCategory = (categoryName: string) => {
  return productsWithVariants.filter(product => product.category.toLowerCase() === categoryName.toLowerCase());
};