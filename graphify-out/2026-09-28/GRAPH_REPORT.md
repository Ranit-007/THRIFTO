# Graph Report - tshirt  (2026-09-19)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 248 nodes · 469 edges · 11 communities (9 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ac696e1b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- homepage.tsx
- product-client.tsx
- package.json
- navbar.tsx
- brand.ts
- product-card.tsx
- compilerOptions
- CartDrawer.tsx
- eslint.config.mjs
- next-env.d.ts
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `lucide-react` - 21 edges
2. `next` - 20 edges
3. `react` - 16 edges
4. `compilerOptions` - 16 edges
5. `framer-motion` - 12 edges
6. `Product` - 11 edges
7. `brand` - 11 edges
8. `ProductCard()` - 10 edges
9. `useStore()` - 10 edges
10. `Collection` - 7 edges

## Surprising Connections (you probably didn't know these)
- `ProductDetailClientProps` --references--> `Product`  [EXTRACTED]
  app/product/[slug]/product-client.tsx → types/store.ts
- `ProductDetailClient()` --calls--> `useStore()`  [EXTRACTED]
  app/product/[slug]/product-client.tsx → components/providers/store-provider.tsx
- `CollectionClientProps` --references--> `Collection`  [EXTRACTED]
  app/collection/[slug]/collection-client.tsx → types/store.ts
- `CollectionClientProps` --references--> `Product`  [EXTRACTED]
  app/collection/[slug]/collection-client.tsx → types/store.ts
- `ShopClientProps` --references--> `Collection`  [EXTRACTED]
  app/shop/shop-client.tsx → types/store.ts

## Import Cycles
- None detected.

## Communities (11 total, 2 thin omitted)

### Community 0 - "homepage.tsx"
Cohesion: 0.08
Nodes (19): metadata, Homepage(), Newsletter(), ArrowLink(), ArrowLinkProps, Reveal(), SectionHeading(), SectionHeadingProps (+11 more)

### Community 1 - "product-client.tsx"
Cohesion: 0.12
Nodes (27): ProductDetailClient(), ColorSelector(), ColorSelectorProps, DeliveryEstimator(), DeliveryEstimatorProps, ProductAccordion(), ProductAccordionProps, ProductGallery() (+19 more)

### Community 2 - "package.json"
Cohesion: 0.05
Nodes (36): dependencies, framer-motion, lucide-react, next, react, react-dom, devDependencies, autoprefixer (+28 more)

### Community 3 - "navbar.tsx"
Cohesion: 0.09
Nodes (18): app_globals, metadata, viewport, components_cart_cartdrawer_cartdrawer, ToastProvider(), Footer(), Logo(), LogoProps (+10 more)

### Community 4 - "brand.ts"
Cohesion: 0.09
Nodes (13): CollectionPageProps, PageKey, pages, generateMetadata(), ProductPage(), ProductPageProps, metadata, metadata (+5 more)

### Community 5 - "product-card.tsx"
Cohesion: 0.13
Nodes (17): CollectionClient(), CollectionClientProps, SORT_OPTIONS, SortOption, ProductDetailClientProps, CATEGORIES, ShopClientProps, SORT_OPTIONS (+9 more)

### Community 6 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 7 - "CartDrawer.tsx"
Cohesion: 0.26
Nodes (10): CartDrawerProps, CartItem(), CartItemProps, CartItem, StoreContext, StoreContextType, StoreProvider(), useStore() (+2 more)

### Community 8 - "eslint.config.mjs"
Cohesion: 0.25
Nodes (7): compat, __dirname, eslintConfig, __filename, ref_eslint_eslintrc, ref_path, ref_url

## Knowledge Gaps
- **92 isolated node(s):** `ArrowLinkProps`, `SectionHeadingProps`, `ColorSelectorProps`, `DeliveryEstimatorProps`, `ProductAccordionProps` (+87 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 135 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `navbar.tsx` to `homepage.tsx`, `product-client.tsx`, `package.json`, `brand.ts`, `product-card.tsx`, `CartDrawer.tsx`?**
  _High betweenness centrality (0.188) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `product-client.tsx` to `homepage.tsx`, `package.json`, `navbar.tsx`, `brand.ts`, `product-card.tsx`, `CartDrawer.tsx`?**
  _High betweenness centrality (0.132) - this node is a cross-community bridge._
- **What connects `ArrowLinkProps`, `SectionHeadingProps`, `ColorSelectorProps` to the rest of the system?**
  _92 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `homepage.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07557354925775979 - nodes in this community are weakly interconnected._
- **Should `product-client.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12280701754385964 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05263157894736842 - nodes in this community are weakly interconnected._
- **Should `navbar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08669354838709678 - nodes in this community are weakly interconnected._