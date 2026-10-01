import { prisma } from '@/lib/prisma'
import type { Product, Collection, ProductVariant, SizeGuideMeasurement } from '@/types/store'

export const TSHIRT_SIZE_GUIDE: SizeGuideMeasurement[] = [
  { size: "XS", chest: "34-36\"", length: "26\"", shoulder: "16\"", sleeve: "7.5\"" },
  { size: "S", chest: "36-38\"", length: "27\"", shoulder: "17\"", sleeve: "8\"" },
  { size: "M", chest: "38-40\"", length: "28\"", shoulder: "18\"", sleeve: "8.5\"" },
  { size: "L", chest: "40-42\"", length: "29\"", shoulder: "19\"", sleeve: "9\"" },
  { size: "XL", chest: "42-44\"", length: "30\"", shoulder: "20\"", sleeve: "9.5\"" },
  { size: "XXL", chest: "44-46\"", length: "31\"", shoulder: "21\"", sleeve: "10\"" },
]

// Helper to create variant data deterministically (kept for compatibility, though not used in DB flow)
export const createVariantData = (
  sizes: string[],
  colors: { name: string; hex: string }[],
  unavailableCombos: { size?: string; color?: string }[] = []
): ProductVariant[] => {
  const variants: ProductVariant[] = []
  let variantId = 1

  sizes.forEach((size, sIdx) => {
    colors.forEach((color, cIdx) => {
      const isUnavailable = unavailableCombos.some(
        (u) => (u.size === undefined || u.size === size) && (u.color === undefined || u.color === color.name)
      )
      const stock = isUnavailable ? 0 : ((sIdx * 3 + cIdx * 5 + 7) % 15) + 3
      const available = stock > 0

      variants.push({
        id: `variant-${variantId++}`,
        size,
        color: color.name,
        colorHex: color.hex,
        stock,
        sku: `${size.toUpperCase()}-${color.name.toUpperCase().substring(0, 3)}`,
        available,
      })
    })
  })

  return variants
}

// DB-backed functions with mapping to static types
export const getProductById = async (id: string): Promise<Product | null> => {
  const dbProduct = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      collection: true,
      variants: true,
    }
  })

  if (!dbProduct) return null

  const product: Product = {
    id: dbProduct.id,
    slug: dbProduct.slug,
    name: dbProduct.name,
    description: dbProduct.description,
    shortDescription: dbProduct.shortDescription,
    price: dbProduct.price,
    compareAtPrice: dbProduct.compareAtPrice,
    category: dbProduct.category?.name ?? '',
    collection: dbProduct.collection?.name ?? '',
    images: dbProduct.images,
    colors: (dbProduct.colors as { name: string; hex: string }[]) ?? [],
    sizes: dbProduct.sizes,
    variants: dbProduct.variants?.map(variant => ({
      ...variant,
      images: variant.images ?? [],
    })) ?? [],
    badge: dbProduct.badge,
    stockStatus: dbProduct.stockStatus as 'in_stock' | 'low_stock' | 'sold_out',
    featured: dbProduct.featured,
    bestSeller: dbProduct.bestSeller,
    newArrival: dbProduct.newArrival,
    rating: dbProduct.rating,
    reviewCount: dbProduct.reviewCount,
    material: dbProduct.material,
    gsm: dbProduct.gsm,
    fit: dbProduct.fit,
    care: dbProduct.care,
    tags: dbProduct.tags,
  }

  return product
}

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  const dbProduct = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      collection: true,
      variants: true,
    }
  })

  if (!dbProduct) return null

  const product: Product = {
    id: dbProduct.id,
    slug: dbProduct.slug,
    name: dbProduct.name,
    description: dbProduct.description,
    shortDescription: dbProduct.shortDescription,
    price: dbProduct.price,
    compareAtPrice: dbProduct.compareAtPrice,
    category: dbProduct.category?.name ?? '',
    collection: dbProduct.collection?.name ?? '',
    images: dbProduct.images,
    colors: (dbProduct.colors as { name: string; hex: string }[]) ?? [],
    sizes: dbProduct.sizes,
    variants: dbProduct.variants?.map(variant => ({
      ...variant,
      images: variant.images ?? [],
    })) ?? [],
    badge: dbProduct.badge,
    stockStatus: dbProduct.stockStatus as 'in_stock' | 'low_stock' | 'sold_out',
    featured: dbProduct.featured,
    bestSeller: dbProduct.bestSeller,
    newArrival: dbProduct.newArrival,
    rating: dbProduct.rating,
    reviewCount: dbProduct.reviewCount,
    material: dbProduct.material,
    gsm: dbProduct.gsm,
    fit: dbProduct.fit,
    care: dbProduct.care,
    tags: dbProduct.tags,
  }

  return product
}

export const getProductsByCollection = async (collectionName: string): Promise<Product[]> => {
  const dbProducts = await prisma.product.findMany({
    where: {
      collection: {
        name: collectionName,
      },
    },
    include: {
      category: true,
      collection: true,
      variants: true,
    },
    orderBy: { createdAt: 'desc' }
  })

  return dbProducts.map(dbProduct => ({
    id: dbProduct.id,
    slug: dbProduct.slug,
    name: dbProduct.name,
    description: dbProduct.description,
    shortDescription: dbProduct.shortDescription,
    price: dbProduct.price,
    compareAtPrice: dbProduct.compareAtPrice,
    category: dbProduct.category?.name ?? '',
    collection: dbProduct.collection?.name ?? '',
    images: dbProduct.images,
    colors: (dbProduct.colors as { name: string; hex: string }[]) ?? [],
    sizes: dbProduct.sizes,
    variants: dbProduct.variants?.map(variant => ({
      ...variant,
      images: variant.images ?? [],
    })) ?? [],
    badge: dbProduct.badge,
    stockStatus: dbProduct.stockStatus as 'in_stock' | 'low_stock' | 'sold_out',
    featured: dbProduct.featured,
    bestSeller: dbProduct.bestSeller,
    newArrival: dbProduct.newArrival,
    rating: dbProduct.rating,
    reviewCount: dbProduct.reviewCount,
    material: dbProduct.material,
    gsm: dbProduct.gsm,
    fit: dbProduct.fit,
    care: dbProduct.care,
    tags: dbProduct.tags,
  }))
}

export const getProductsByCategory = async (categoryName: string): Promise<Product[]> => {
  const dbProducts = await prisma.product.findMany({
    where: {
      category: {
        name: categoryName,
      },
    },
    include: {
      category: true,
      collection: true,
      variants: true,
    },
    orderBy: { createdAt: 'desc' }
  })

  return dbProducts.map(dbProduct => ({
    id: dbProduct.id,
    slug: dbProduct.slug,
    name: dbProduct.name,
    description: dbProduct.description,
    shortDescription: dbProduct.shortDescription,
    price: dbProduct.price,
    compareAtPrice: dbProduct.compareAtPrice,
    category: dbProduct.category?.name ?? '',
    collection: dbProduct.collection?.name ?? '',
    images: dbProduct.images,
    colors: (dbProduct.colors as { name: string; hex: string }[]) ?? [],
    sizes: dbProduct.sizes,
    variants: dbProduct.variants?.map(variant => ({
      ...variant,
      images: variant.images ?? [],
    })) ?? [],
    badge: dbProduct.badge,
    stockStatus: dbProduct.stockStatus as 'in_stock' | 'low_stock' | 'sold_out',
    featured: dbProduct.featured,
    bestSeller: dbProduct.bestSeller,
    newArrival: dbProduct.newArrival,
    rating: dbProduct.rating,
    reviewCount: dbProduct.reviewCount,
    material: dbProduct.material,
    gsm: dbProduct.gsm,
    fit: dbProduct.fit,
    care: dbProduct.care,
    tags: dbProduct.tags,
  }))
}

export const getAllProducts = async (options: {
  collection?: string
  category?: string
  sort?: string
} = {}): Promise<Product[]> => {
  const where: any = {} // eslint-disable-line @typescript-eslint/no-explicit-any

  if (options.collection) {
    where.collection = {
      name: options.collection,
    }
  }

  if (options.category) {
    where.category = {
      name: options.category,
    }
  }

  const orderBy: any = { createdAt: 'desc' } // eslint-disable-line @typescript-eslint/no-explicit-any
  if (options.sort === 'price-low-high') {
    orderBy.price = 'asc'
  } else if (options.sort === 'price-high-low') {
    orderBy.price = 'desc'
  } else if (options.sort === 'name-az') {
    orderBy.name = 'asc'
  } else if (options.sort === 'name-za') {
    orderBy.name = 'desc'
  }

  const dbProducts = await prisma.product.findMany({
    where,
    include: {
      category: true,
      collection: true,
      variants: true,
    },
    orderBy,
  })

  return dbProducts.map(dbProduct => ({
    id: dbProduct.id,
    slug: dbProduct.slug,
    name: dbProduct.name,
    description: dbProduct.description,
    shortDescription: dbProduct.shortDescription,
    price: dbProduct.price,
    compareAtPrice: dbProduct.compareAtPrice,
    category: dbProduct.category?.name ?? '',
    collection: dbProduct.collection?.name ?? '',
    images: dbProduct.images,
    colors: (dbProduct.colors as { name: string; hex: string }[]) ?? [],
    sizes: dbProduct.sizes,
    variants: dbProduct.variants?.map(variant => ({
      ...variant,
      images: variant.images ?? [],
    })) ?? [],
    badge: dbProduct.badge,
    stockStatus: dbProduct.stockStatus as 'in_stock' | 'low_stock' | 'sold_out',
    featured: dbProduct.featured,
    bestSeller: dbProduct.bestSeller,
    newArrival: dbProduct.newArrival,
    rating: dbProduct.rating,
    reviewCount: dbProduct.reviewCount,
    material: dbProduct.material,
    gsm: dbProduct.gsm,
    fit: dbProduct.fit,
    care: dbProduct.care,
    tags: dbProduct.tags,
  }))
}

export const getAllCollections = async (): Promise<Collection[]> => {
  const dbCollections = await prisma.collection.findMany({
    orderBy: { name: 'asc' }
  })

  return dbCollections.map(c => ({
    name: c.name,
    description: c.description ?? '',
    image: c.image ?? '',
    href: `/shop?collection=${c.name.toLowerCase().replace(/\s+/g, '-')}`,
    span: c.span as 'wide' | 'standard' ?? 'standard',
  }))
}