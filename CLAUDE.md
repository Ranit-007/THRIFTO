# CLAUDE.m
Each interactive page splits into a server page component and a `*-client.tsx` sibling:
- `app/shop/page.tsx` → passes `Product[]` to `shop-client.tsx` (filter/sort UI)
- `app/product/[slug]/page.tsx` → passes `Product` + related products to `product-client.tsx`
- `app/collection/[slug]/page.tsx` → server fetch, client rendering
- `app/[page]/page.tsx` — catch-all for static content pages (about, contact, etc.)

Client components carry `"use client"` and own all interactivity (Framer Motion, store hooks, router).

### State management

Two React Context providers in `components/providers/`, composed in `app/layout.tsx`:
- **`StoreProvider`** (`useStore()`) — cart (add/remove/update/clear, keyed by `productId+size+color`) and wishlist. Persists to localStorage under keys `nocturne-studio-cart` and `nocturne-studio-wishlist`.
- **`ToastProvider`** (`useToast()`) — ephemeral notifications (success/error/info), auto-dismiss 4.5 s, animated with `AnimatePresence`.

No external state library (Redux, Zustand, etc.).

### Data layer (static, no API routes)

Two parallel product data modules — pick the right one for context:
- **`lib/catalog.ts`** — original 12 products, 3 collections, social posts, hero/story images. Used by homepage sections.
- **`lib/shop-data.ts`** — extended 20-product catalog with full variant data (`ProductVariant`), material, GSM, fit, care, tags, and a `TSHIRT_SIZE_GUIDE`. Used by shop, product detail, and collection pages. Exports `getProductBySlug()`, `getProductsByCollection()`, `getProductsByCategory()`.

All product images are Unsplash URLs. There is no database or backend; all data is `as const` TypeScript objects.

### Types

Core types live in `types/store.ts`: `Product`, `ProductVariant`, `Collection`, `SocialPost`, `SizeGuideMeasurement`. Price is always stored in **cents** (integers); display formatting uses `brand.formatPrice()` (Intl.NumberFormat, locale `en-IN`, currency `INR`).

### Config layer

`config/brand.ts` — brand name, tagline, locale, colors, `formatPrice()` utility  
`config/store.ts` — announcement bar copy, hero promotion copy, newsletter copy (`as const`)  
`config/navigation.ts` — primary, mobile, and footer nav arrays (`as const`)

### Styling

All styles live in a single `app/globals.css` (~1800 lines). **Do not use CSS Modules or `<style>` tags.**

- Class names follow a BEM-like convention: `navbar`, `navbar__inner`, `navbar__logo`, etc.
- Tailwind is used for utilities only; semantic component classes are in `globals.css`.
- Design tokens are CSS custom properties on `:root`: `--color-canvas`, `--color-ink`, `--color-bone`, `--color-ash`, `--color-line`, `--color-ember`. Tailwind extends them via the `config/tailwind.config.ts` color map.
- Responsive breakpoints: 900 px (tablet) and 680 px (mobile). Uses `prefers-reduced-motion` media query for Framer Motion alternatives.

### Component conventions

- `components/ui/` — small primitives (ProductCard, ArrowLink, SectionHeading, Reveal)
- `components/site/` — layout chrome (Navbar, Footer, Logo, Newsletter)
- `components/home/` — homepage-specific sections
- `components/product/` — product detail sub-components (gallery, lightbox, selectors, accordion, etc.); barrel-exported from `components/product/index.ts`
- `components/cart/` — CartDrawer and CartItem (slide-in drawer, quantity controls)
- Path alias `@/*` resolves to the repo root (e.g. `@/components/…`, `@/lib/…`)
