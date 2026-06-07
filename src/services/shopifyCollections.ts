// Shopify Storefront API: collections + product search
const SHOPIFY_API_VERSION = "2025-07";
const SHOPIFY_STORE_PERMANENT_DOMAIN = "v75dhd-ys.myshopify.com";
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
const SHOPIFY_STOREFRONT_TOKEN = "ff604df80351ecf88111e0620d7c7b40";

async function req(query: string, variables: any = {}) {
  const r = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const data = await r.json();
  if (data.errors) throw new Error(data.errors.map((e: any) => e.message).join(", "));
  return data.data;
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: { url: string; altText: string | null } | null;
  productsCount?: number;
}

const COLLECTIONS_QUERY = `
  query Collections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          image { url altText }
          products(first: 1) { edges { node { id } } }
        }
      }
    }
  }
`;

const PRODUCT_FIELDS = `
  id
  title
  description
  handle
  priceRange { minVariantPrice { amount currencyCode } }
  images(first: 5) { edges { node { url altText } } }
  variants(first: 10) {
    edges {
      node {
        id title availableForSale
        price { amount currencyCode }
        selectedOptions { name value }
      }
    }
  }
  options { name values }
`;

const COLLECTION_BY_HANDLE = `
  query CollectionByHandle($handle: String!) {
    collection(handle: $handle) {
      id title handle description
      image { url altText }
      products(first: 50) { edges { node { ${PRODUCT_FIELDS} } } }
    }
  }
`;

const PRODUCT_SEARCH = `
  query ProductSearch($query: String!) {
    products(first: 8, query: $query) {
      edges { node { id title handle images(first: 1) { edges { node { url altText } } } priceRange { minVariantPrice { amount currencyCode } } } }
    }
  }
`;

export async function fetchShopifyCollections(limit = 20): Promise<ShopifyCollection[]> {
  const data = await req(COLLECTIONS_QUERY, { first: limit });
  return (data.collections.edges || []).map((e: any) => ({
    id: e.node.id,
    title: e.node.title,
    handle: e.node.handle,
    description: e.node.description,
    image: e.node.image,
  }));
}

export async function fetchCollectionByHandle(handle: string) {
  const data = await req(COLLECTION_BY_HANDLE, { handle });
  if (!data.collection) return null;
  return {
    id: data.collection.id,
    title: data.collection.title,
    handle: data.collection.handle,
    description: data.collection.description,
    image: data.collection.image,
    products: data.collection.products.edges,
  };
}

export async function searchShopifyProducts(query: string) {
  if (!query.trim()) return [];
  const data = await req(PRODUCT_SEARCH, { query });
  return data.products.edges.map((e: any) => ({
    id: e.node.id,
    handle: e.node.handle,
    title: e.node.title,
    image: e.node.images.edges[0]?.node?.url || null,
    price: e.node.priceRange.minVariantPrice,
  }));
}
