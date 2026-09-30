import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { productsWithVariants as products, collections } from "@/lib/shop-data-static";

export async function POST() {
  try {
    const session = await auth();

    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Starting seed process...");

    // Extract categories uniquely
    const uniqueCategoryNames = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
    const categories = uniqueCategoryNames.map(name => ({
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      description: `Collection of ${name}`,
    }));

    // 1. Seed Categories
    for (const cat of categories) {
      await prisma.category.upsert({
        where: { slug: cat.slug },
        update: {
          name: cat.name,
          description: cat.description,
        },
        create: {
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
        }
      });
    }
    console.log(`Seeded ${categories.length} categories.`);

    // 2. Seed Collections
    for (const col of collections) {
      const slug = col.name.toLowerCase().replace(/\s+/g, "-");
      await prisma.collection.upsert({
        where: { slug },
        update: {
          name: col.name,
          description: col.description,
          image: col.image,
          span: col.span ?? "standard",
        },
        create: {
          name: col.name,
          slug,
          description: col.description,
          image: col.image,
          span: col.span ?? "standard",
        }
      });
    }
    console.log(`Seeded ${collections.length} collections.`);

    // Read saved categories and collections to get IDs
    const dbCategories = await prisma.category.findMany();
    const dbCollections = await prisma.collection.findMany();

    // 3. Seed Products
    for (const p of products) {
      const categoryId = p.category
        ? dbCategories.find(c => c.name.toLowerCase() === p.category.toLowerCase())?.id || null
        : null;

      const collectionId = p.collection
        ? dbCollections.find(c => c.name.toLowerCase() === p.collection.toLowerCase())?.id || null
        : null;

      const product = await prisma.product.upsert({
        where: { slug: p.slug },
        update: {
          name: p.name,
          description: p.description,
          shortDescription: p.shortDescription || p.description.substring(0, 150),
          price: p.price,
          compareAtPrice: p.compareAtPrice,
          categoryId,
          collectionId,
          images: p.images,
          colors: p.colors || [],
          sizes: p.sizes || [],
          badge: p.badge,
          stockStatus: p.stockStatus,
          featured: p.featured || false,
          bestSeller: p.bestSeller || false,
          newArrival: p.newArrival || false,
          rating: p.rating || 5,
          reviewCount: p.reviewCount || 0,
          material: p.material || "100% Premium Cotton",
          gsm: p.gsm || 240,
          fit: p.fit || "Relaxed Fit",
          care: p.care || [],
          tags: p.tags || [],
        },
        create: {
          slug: p.slug,
          name: p.name,
          description: p.description,
          shortDescription: p.shortDescription || p.description.substring(0, 150),
          price: p.price,
          compareAtPrice: p.compareAtPrice,
          categoryId,
          collectionId,
          images: p.images,
          colors: p.colors || [],
          sizes: p.sizes || [],
          badge: p.badge,
          stockStatus: p.stockStatus || "in_stock",
          featured: p.featured || false,
          bestSeller: p.bestSeller || false,
          newArrival: p.newArrival || false,
          rating: p.rating || 5,
          reviewCount: p.reviewCount || 0,
          material: p.material || "100% Premium Cotton",
          gsm: p.gsm || 240,
          fit: p.fit || "Relaxed Fit",
          care: p.care || [],
          tags: p.tags || [],
        }
      });

      // 4. Seed Variants
      if (p.variants && p.variants.length > 0) {
        for (const v of p.variants) {
          const sku = v.sku || `${p.slug}-${v.color.replace(/\s+/g, '-').toLowerCase()}-${v.size.toLowerCase()}`;
          await prisma.productVariant.upsert({
            where: { sku },
            update: {
              size: v.size,
              color: v.color,
              colorHex: v.colorHex || "#000000",
              price: v.price || p.price,
              stock: v.stock || 10,
              available: v.available ?? true,
              images: v.images || [],
            },
            create: {
              productId: product.id,
              size: v.size,
              color: v.color,
              colorHex: v.colorHex || "#000000",
              price: v.price || p.price,
              stock: v.stock || 10,
              sku,
              available: v.available ?? true,
              images: v.images || [],
            }
          });
        }
      }
    }
    console.log(`Seeded ${products.length} products with variants.`);

    return NextResponse.json({ success: true, message: "Database seeded successfully" });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}
