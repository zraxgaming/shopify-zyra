// Shopify Storefront Customer Account API
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

export interface ShopifyCustomer {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  displayName: string;
  createdAt: string;
}

export interface ShopifyOrder {
  id: string;
  name: string;
  orderNumber: number;
  processedAt: string;
  fulfillmentStatus: string;
  financialStatus: string | null;
  totalPrice: { amount: string; currencyCode: string };
  statusUrl: string;
  lineItems: Array<{
    title: string;
    quantity: number;
    variant: { title: string; image: { url: string } | null } | null;
  }>;
}

const CUSTOMER_CREATE = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer { id email firstName lastName }
      customerUserErrors { field message code }
    }
  }
`;

const TOKEN_CREATE = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken { accessToken expiresAt }
      customerUserErrors { field message code }
    }
  }
`;

const TOKEN_DELETE = `
  mutation customerAccessTokenDelete($customerAccessToken: String!) {
    customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
      deletedAccessToken userErrors { field message }
    }
  }
`;

const CUSTOMER_QUERY = `
  query Customer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id email firstName lastName phone displayName createdAt
      orders(first: 25, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id name orderNumber processedAt
            fulfillmentStatus financialStatus
            statusUrl
            totalPrice { amount currencyCode }
            lineItems(first: 10) {
              edges {
                node {
                  title quantity
                  variant { title image { url } }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const CUSTOMER_RECOVER = `
  mutation customerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors { field message code }
    }
  }
`;

const CUSTOMER_UPDATE = `
  mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer { id email firstName lastName phone }
      customerUserErrors { field message code }
    }
  }
`;

export async function shopifyRegister(input: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}) {
  const data = await req(CUSTOMER_CREATE, { input });
  const errs = data.customerCreate.customerUserErrors;
  if (errs.length) throw new Error(errs[0].message);
  return data.customerCreate.customer as ShopifyCustomer;
}

export async function shopifyLogin(email: string, password: string) {
  const data = await req(TOKEN_CREATE, { input: { email, password } });
  const errs = data.customerAccessTokenCreate.customerUserErrors;
  if (errs.length) throw new Error(errs[0].message);
  return data.customerAccessTokenCreate.customerAccessToken as {
    accessToken: string;
    expiresAt: string;
  };
}

export async function shopifyLogout(accessToken: string) {
  try {
    await req(TOKEN_DELETE, { customerAccessToken: accessToken });
  } catch (e) {
    console.error("logout error", e);
  }
}

export async function shopifyFetchCustomer(accessToken: string): Promise<{
  customer: ShopifyCustomer;
  orders: ShopifyOrder[];
} | null> {
  const data = await req(CUSTOMER_QUERY, { customerAccessToken: accessToken });
  if (!data.customer) return null;
  const c = data.customer;
  const orders: ShopifyOrder[] = c.orders.edges.map((e: any) => ({
    id: e.node.id,
    name: e.node.name,
    orderNumber: e.node.orderNumber,
    processedAt: e.node.processedAt,
    fulfillmentStatus: e.node.fulfillmentStatus,
    financialStatus: e.node.financialStatus,
    statusUrl: e.node.statusUrl,
    totalPrice: e.node.totalPrice,
    lineItems: e.node.lineItems.edges.map((le: any) => le.node),
  }));
  return {
    customer: {
      id: c.id,
      email: c.email,
      firstName: c.firstName,
      lastName: c.lastName,
      phone: c.phone,
      displayName: c.displayName,
      createdAt: c.createdAt,
    },
    orders,
  };
}

export async function shopifyRecoverPassword(email: string) {
  const data = await req(CUSTOMER_RECOVER, { email });
  const errs = data.customerRecover.customerUserErrors;
  if (errs.length) throw new Error(errs[0].message);
}

export async function shopifyUpdateCustomer(
  accessToken: string,
  customer: { firstName?: string; lastName?: string; phone?: string }
) {
  const data = await req(CUSTOMER_UPDATE, { customerAccessToken: accessToken, customer });
  const errs = data.customerUpdate.customerUserErrors;
  if (errs.length) throw new Error(errs[0].message);
  return data.customerUpdate.customer;
}
