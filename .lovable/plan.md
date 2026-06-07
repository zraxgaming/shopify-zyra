## Goal
Make Shopify the source of truth for products, collections, cart, and customer accounts. Remove admin UI from the live site (kept in repo, just unlinked).

## 1. Collections → Categories
- Extend `src/services/shopifyService.ts` with `fetchShopifyCollections()` and `fetchProductsByCollection(handle)` (Storefront GraphQL `collections` + `collectionByHandle`).
- Add hook `src/hooks/use-shopify-collections.ts`.
- Rewrite:
  - `src/pages/Categories.tsx` → grid of Shopify collections (image, title, handle → `/category/:handle`).
  - `src/pages/CategoryPage.tsx` → fetch collection by handle, render `ShopifyProductGrid`.
  - `src/components/home/Categories.tsx` / `CategoryShowcase.tsx` → top 4–6 Shopify collections.
- Remove Supabase category hooks from these pages.

## 2. Cart everywhere (Shopify only)
- Delete usages of legacy `CartProvider`/`CartDrawer` from storefront UI:
  - `src/pages/Cart.tsx` → render from `useCartStore` with line edit/remove + "Checkout on Shopify" button (links to `checkoutUrl`).
  - `src/components/cart/AddToCartButton.tsx` → call `addToCart(variantId, qty)` from `shopifyCart` service.
  - `src/pages/ShopifyProductDetail.tsx` → confirm uses Shopify cart (already does).
- Remove `<CartProvider>` wrapper from `App.tsx` (keep file but unused) since Shopify cart store is global.
- Navbar badge already reads from cart store — verify.

## 3. Customer accounts (Shopify Storefront customer API)
- New `src/services/shopifyCustomer.ts` with mutations: `customerCreate`, `customerAccessTokenCreate`, `customerAccessTokenDelete`, query `customer(customerAccessToken)` for profile + orders.
- New `src/contexts/ShopifyAuthContext.tsx` storing `accessToken` (localStorage) + `customer` object; exposes `login`, `register`, `logout`, `loading`.
- Wrap `App.tsx` in `<ShopifyAuthProvider>` and remove `<AuthProvider>` from storefront routes (Supabase auth stays only for admin routes, which we are hiding).
- Rewrite pages to use Shopify auth:
  - `src/pages/Login.tsx`, `src/pages/Register.tsx`, `src/pages/Auth.tsx` (single form variants).
  - `src/pages/Account.tsx` / `Profile.tsx` → show Shopify customer info + recent orders from `customer.orders`.
  - `src/pages/OrderTracking.tsx` → look up by order name within Shopify customer orders.
- Pass `buyerIdentity.customerAccessToken` to Shopify cart on login so checkout is pre-filled.
- Navbar account menu → Shopify auth state.

## 4. Search + product detail polish
- `src/components/search/SearchBar.tsx` → query Shopify `products(query: $q)` with debounce, dropdown of matches linking to `/product/:handle`.
- `src/pages/ShopifyProductDetail.tsx`: SEO meta, breadcrumbs, related products from same collection, better gallery + variant pickers per option.
- Remove old `src/pages/ProductDetail.tsx` / `ProductDetails.tsx` routes from `App.tsx`.

## 5. Stash admin pages
- Remove all `/admin/*` routes from `src/App.tsx` (files stay on disk untouched).
- Remove admin links from `Navbar`, `Footer`, `Dashboard` (any "Admin" entry points).
- Keep `AdminLayout` + pages in repo so nothing is deleted, just unreachable.

## 6. Cleanup
- Delete Supabase-product hooks usage from storefront (`use-products`, `use-featured-products`, `use-shop-products`) — replaced by Shopify equivalents. Files remain but unused.
- Update `FeaturedProducts`, `Home` hero CTAs to point at Shopify data (already partly done).

## Technical notes
- All Shopify calls go through Storefront API at `v75dhd-ys.myshopify.com` with existing token in `shopifyService.ts`.
- Customer access tokens are stored in `localStorage` under `shopify_customer_token` with `expiresAt`; auto-logout on expiry.
- Cart store gains `setBuyerIdentity(token)` calling `cartBuyerIdentityUpdate` mutation.
- No DB migrations; Supabase remains only for things we are not touching (e.g. legacy admin), but storefront no longer depends on it.

## Out of scope (ask later if wanted)
- Password reset / social login via Shopify (Storefront customer API doesn't natively support OAuth; would need Shopify Customer Account API + OAuth setup).
- Migrating existing Supabase users to Shopify customers.
- Removing the admin files from disk.
