const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const categories = [
  {
    name: "T-Shirts",
    slug: "t-shirts",
    description: "Premium cotton t-shirts with unique designs.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1400",
  },
  {
    name: "Hoodies",
    slug: "hoodies",
    description: "Cozy and stylish hoodies for all seasons.",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1400",
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "Caps, bags, and more to complete your look.",
    image: "https://images.unsplash.com/photo-1520316587275-5e4f06f68971?auto=format&fit=crop&q=80&w=1400",
  },
];

const collections = [
  {
    name: "Summer 24",
    slug: "summer-24",
    description: "Lightweight fabrics and vibrant colors for the sunny days ahead.",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=1400",
    span: "featured",
  },
  {
    name: "Essentials",
    slug: "essentials",
    description: "Everyday basics that form the foundation of any wardrobe.",
    image: "https://images.unsplash.com/photo-1434389678278-be4d41a6b872?auto=format&fit=crop&q=80&w=1400",
    span: "standard",
  },
  {
    name: "Collaborations",
    slug: "collaborations",
    description: "Limited edition pieces designed with artists and creators.",
    image: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&q=80&w=1400",
    span: "standard",
  },
];

// Reusing a sample structure for seed speed
const sampleProducts = [
  {
    slug: "midnight-run-tee",
    name: "Midnight Run Tee",
    description: "A dark, atmospheric design perfect for night owls. Made from 100% premium combed cotton for ultimate comfort.",
    shortDescription: "Dark atmospheric design for night owls.",
    price: 189900, // 1899 INR
    compareAtPrice: 249900,
    categoryId: "t-shirts",
    collectionId: "summer-24",
    images: ["https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=1400"],
    colors: [{ name: "Black", hex: "#000000" }],
    sizes: ["S", "M", "L", "XL"],
    badge: "Bestseller",
    stockStatus: "in_stock",
    featured: true,
    bestSeller: true,
  },
  {
    slug: "crimson-wave-hoodie",
    name: "Crimson Wave Hoodie",
    description: "Stay warm in style with our Crimson Wave hoodie. Features a bold wave motif embroidered on the chest.",
    shortDescription: "Bold wave motif embroidered on the chest.",
    price: 349900,
    categoryId: "hoodies",
    collectionId: "essentials",
    images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1400"],
    colors: [{ name: "Crimson", hex: "#dc143c" }],
    sizes: ["M", "L", "XL"],
    stockStatus: "low_stock",
    newArrival: true,
  }
];

async function main() {
  console.log('Starting seed...');

  // 1. Seed Categories
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log(`Seeded categories.`);

  // 2. Seed Collections
  for (const col of collections) {
    await prisma.collection.upsert({
      where: { slug: col.slug },
      update: col,
      create: col,
    });
  }
  console.log(`Seeded collections.`);

  const dbCats = await prisma.category.findMany();
  const dbCols = await prisma.collection.findMany();

  // 3. Seed Products
  for (const p of sampleProducts) {
    const categoryId = p.categoryId ? dbCats.find(c => c.slug === p.categoryId)?.id : null;
    const collectionId = p.collectionId ? dbCols.find(c => c.slug === p.collectionId)?.id : null;

    const data = {
      name: p.name,
      description: p.description,
      shortDescription: p.shortDescription,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      categoryId,
      collectionId,
      images: p.images,
      colors: p.colors,
      sizes: p.sizes,
      badge: p.badge,
      stockStatus: p.stockStatus,
      featured: p.featured,
      bestSeller: p.bestSeller,
      newArrival: p.newArrival,
      rating: 5,
      reviewCount: Math.floor(Math.random() * 50) + 5,
    };

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: data,
      create: { slug: p.slug, ...data },
    });

    // 4. Seed Variants
    for (const size of p.sizes) {
      for (const color of p.colors) {
        const sku = `${p.slug}-${color.name.toLowerCase()}-${size.toLowerCase()}`;
        await prisma.productVariant.upsert({
          where: { sku },
          update: {
            size,
            color: color.name,
            colorHex: color.hex,
            stock: 10,
            price: p.price,
          },
          create: {
            productId: product.id,
            sku,
            size,
            color: color.name,
            colorHex: color.hex,
            stock: 10,
            price: p.price,
            images: p.images,
          }
        });
      }
    }
  }

  console.log('Seed completed successfully.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
