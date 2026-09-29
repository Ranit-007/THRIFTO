# Graph Report - tshirt  (2026-09-28)

## Corpus Check
- 93 files · ~1,050,703 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: .graphify-bak 1, .example 1, (none) 1)

## Summary
- 401 nodes · 831 edges · 17 communities (12 shown, 5 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2f012f8c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- homepage.tsx
- product-client.tsx
- package.json
- navbar.tsx
- next
- shop-data.ts
- compilerOptions
- checkout-client.tsx
- eslint.config.mjs
- next-env.d.ts
- postcss.config.mjs
- auth.actions.ts
- dependencies
- razorpay.d.ts
- orders/page.tsx
- { GET, POST }
- ref_lib_utils

## God Nodes (most connected - your core abstractions)
1. `next` - 39 edges
2. `lucide-react` - 35 edges
3. `auth` - 25 edges
4. `react` - 25 edges
5. `useStore()` - 18 edges
6. `compilerOptions` - 16 edges
7. `useToast()` - 14 edges
8. `formatPrice()` - 13 edges
9. `Product` - 13 edges
10. `prisma` - 12 edges

## Surprising Connections (you probably didn't know these)
- `State management` --references--> `useToast()`  [INFERRED]
  CLAUDE.md → components/providers/toast-provider.tsx
- `State management` --references--> `StoreProvider()`  [INFERRED]
  CLAUDE.md → components/providers/store-provider.tsx
- `State management` --references--> `useStore()`  [INFERRED]
  CLAUDE.md → components/providers/store-provider.tsx
- `State management` --references--> `ToastProvider()`  [INFERRED]
  CLAUDE.md → components/providers/toast-provider.tsx
- `Types` --references--> `formatPrice()`  [INFERRED]
  CLAUDE.md → config/brand.ts

## Import Cycles
- None detected.

## Communities (17 total, 5 thin omitted)

### Community 0 - "homepage.tsx"
Cohesion: 0.08
Nodes (19): HeroSlider(), Homepage(), Newsletter(), ArrowLink(), ArrowLinkProps, Reveal(), SectionHeading(), SectionHeadingProps (+11 more)

### Community 1 - "product-client.tsx"
Cohesion: 0.11
Nodes (29): ProfileForm(), ProductDetailClient(), ColorSelector(), ColorSelectorProps, DeliveryEstimator(), DeliveryEstimatorProps, ProductAccordion(), ProductAccordionProps (+21 more)

### Community 2 - "package.json"
Cohesion: 0.06
Nodes (33): devDependencies, autoprefixer, eslint, eslint-config-next, postcss, tailwindcss, @types/bcryptjs, @types/node (+25 more)

### Community 3 - "navbar.tsx"
Cohesion: 0.07
Nodes (23): app_globals, metadata, RootLayout(), viewport, PageKey, pages, generateMetadata(), ProductPage() (+15 more)

### Community 4 - "next"
Cohesion: 0.05
Nodes (45): EditAddressPage(), metadata, AddressList(), metadata, AddressesPage(), metadata, AccountLayout(), AccountPage() (+37 more)

### Community 5 - "shop-data.ts"
Cohesion: 0.07
Nodes (33): CollectionClient(), CollectionClientProps, SORT_OPTIONS, SortOption, CollectionPageProps, ProductDetailClientProps, metadata, CATEGORIES (+25 more)

### Community 6 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 7 - "checkout-client.tsx"
Cohesion: 0.13
Nodes (24): verifyPayment(), VerifyPaymentInput, CartPage(), CheckoutClient(), CheckoutClientProps, CheckoutSuccessPage(), State management, CartDrawer() (+16 more)

### Community 8 - "eslint.config.mjs"
Cohesion: 0.25
Nodes (7): compat, __dirname, eslintConfig, __filename, ref_eslint_eslintrc, ref_path, ref_url

### Community 11 - "auth.actions.ts"
Cohesion: 0.08
Nodes (20): ForgotPasswordForm(), metadata, LoginForm(), metadata, RegisterForm(), metadata, authConfig, signIn (+12 more)

### Community 12 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, @auth/prisma-adapter, bcryptjs, framer-motion, lucide-react, next, next-auth, prisma (+5 more)

### Community 13 - "razorpay.d.ts"
Cohesion: 0.50
Nodes (3): RazorpayFailedResponse, RazorpaySuccessResponse, Window

## Knowledge Gaps
- **141 isolated node(s):** `pages`, `PageKey`, `metadata`, `metadata`, `metadata` (+136 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 190 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `homepage.tsx`, `product-client.tsx`, `package.json`, `navbar.tsx`, `shop-data.ts`, `checkout-client.tsx`, `auth.actions.ts`?**
  _High betweenness centrality (0.234) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `product-client.tsx` to `homepage.tsx`, `package.json`, `navbar.tsx`, `next`, `shop-data.ts`, `checkout-client.tsx`, `auth.actions.ts`?**
  _High betweenness centrality (0.137) - this node is a cross-community bridge._
- **Why does `react` connect `product-client.tsx` to `homepage.tsx`, `package.json`, `navbar.tsx`, `next`, `shop-data.ts`, `checkout-client.tsx`, `auth.actions.ts`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **What connects `pages`, `PageKey`, `metadata` to the rest of the system?**
  _141 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `homepage.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08258258258258258 - nodes in this community are weakly interconnected._
- **Should `product-client.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11498257839721254 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._