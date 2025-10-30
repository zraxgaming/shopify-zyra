Zyra Custom Store

## Shopify theme integration

This project can be built and embedded into a Shopify theme. The repository includes a small, Liquid-safe `window.__SHOPIFY__` object injected into `index.html` which will be replaced by Shopify when the file is served from a theme. That object exposes common values such as shop domain, shop name, currency and theme id.

Quick steps to integrate into a Shopify theme:

1. Build the project (Vite):

```powershell
npm install
npm run build
```

2. Upload the built JS/CSS from `dist/` to your Shopify theme `assets` (or host them on a CDN).

3. In your Shopify theme (for example `layout/theme.liquid`) include a small snippet that references the uploaded assets and preserves the Liquid variables. Example snippet:

```liquid
<!-- Zyra storefront embed -->
<div id="root"></div>
<script>
	window.__SHOPIFY__ = {
		shop_domain: "{{ shop.permanent_domain | default: shop.domain | escape }}",
		shop_name: "{{ shop.name | escape }}",
		currency: "{{ shop.currency | escape }}",
		locale: "{{ localization.language.iso_code | default: 'en' }}",
		theme_id: "{{ theme.id }}",
		theme_name: "{{ theme.name | escape }}"
	};
</script>
<script src="{{ 'app.js' | asset_url }}" type="module"></script>
```

Replace `app.js` with the actual built file name uploaded to the theme assets.

Notes
- The repository previously included an internal admin panel implemented in React under `src/pages/admin` and `src/components/admin`. Those routes were removed from the public storefront to avoid duplicating Shopify admin functionality. The admin code is left in the repo if you want to extract or re-enable it later, but it is not included in the storefront bundle by default.
- Service worker registration is skipped automatically when the page is rendered inside a Shopify theme (to avoid scope and caching conflicts).

If you want, I can add a `snippets/zyra-embed.liquid` file to this repo that you can copy into your theme for convenience.