// lib/shopify.ts
// Shopify Storefront helpers
// All calls run on the SERVER so your credentials stay safe

/* -------------------------------------------------------------------- */
/* ❗ 1. ENVIRONMENT VARIABLES CHECK                                    */
/* -------------------------------------------------------------------- */
const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!SHOPIFY_DOMAIN || !SHOPIFY_TOKEN) {
  // Gebruik console.error en een duidelijkere, actievere foutmelding
  console.error(
    "⚠️ Missing Shopify env vars. Add NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN."
  );
  throw new Error(
    "Configuration Error: Missing Shopify environment variables. Please check your .env file."
  );
}

/* -------------------------------------------------------------------- */
/* 2. TYPES                                                            */
/* -------------------------------------------------------------------- */
// Gebruik 'readonly' voor immuutbare eigenschappen waar van toepassing
export interface ShopifyVariant {
  readonly id: string;
  readonly title: string;
  readonly price: { amount: string; currencyCode: string };
  readonly availableForSale: boolean;
  readonly quantityAvailable?: number;
}

export interface ShopifyProduct {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly descriptionHtml: string;
  readonly handle: string;
  readonly vendor?: string;
  readonly images: {
    readonly edges: ReadonlyArray<{ readonly node: { url: string; altText: string | null } }>;
  };
  readonly priceRange: {
    readonly minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  readonly variants: {
    readonly edges: ReadonlyArray<{
      readonly node: ShopifyVariant;
    }>;
  };
  readonly tags: ReadonlyArray<string>; // Gebruik ReadonlyArray
}

export interface ShopifyCart {
  readonly id: string;
  readonly lines: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly quantity: number;
        readonly merchandise: {
          readonly id: string;
          readonly title: string;
          readonly product: {
            readonly title: string;
            readonly handle: string;
            readonly vendor?: string;
            readonly images: {
              readonly edges: ReadonlyArray<{ readonly node: { url: string; altText: string | null } }>;
            };
            readonly tags: ReadonlyArray<string>;
          };
          readonly price: { amount: string; currencyCode: string };
        };
      };
    }>;
  };
  readonly cost: { readonly totalAmount: { amount: string; currencyCode: string } };
  readonly checkoutUrl: string;
}

/* -------------------------------------------------------------------- */
/* 3. LOW-LEVEL fetch WRAPPER                                          */
/* -------------------------------------------------------------------- */
const SHOPIFY_ENDPOINT = `https://${SHOPIFY_DOMAIN}/api/2023-10/graphql.json`;

async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  cacheRevalidate?: number // Optionele cache revalidatie tijd
): Promise<T> {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN!, // Non-null assertion is hier veilig door de initiële check
    },
    body: JSON.stringify({ query, variables }),
  };

  // Cache beleid toevoegen
  if (cacheRevalidate !== undefined) {
    options.next = { revalidate: cacheRevalidate };
  } else {
    options.cache = "no-store"; // Standaard: geen cache voor mutaties/real-time data
  }

  const res = await fetch(SHOPIFY_ENDPOINT, options);

  if (!res.ok) {
    const errorBody = await res.text();
    const errorMessage = `Shopify API Error ${res.status} (${res.statusText}): ${errorBody}`;
    console.error("Shopify API Error Response:", errorMessage);
    // Gooi een meer specifieke fout die kan worden onderschept
    throw new Error(`ShopifyFetchError: ${errorMessage}`);
  }

  const { data, errors } = (await res.json()) as {
    data: T;
    errors?: Array<{ message: string; extensions?: any }>;
  };

  if (errors?.length) {
    const formattedErrors = JSON.stringify(errors, null, 2);
    console.error("Shopify GraphQL Errors:", formattedErrors);
    const errorMessages = errors
      .map((err) => {
        let msg = err.message;
        if (err.extensions?.problems) {
          msg += ` Problems: ${JSON.stringify(err.extensions.problems)}`;
        }
        return msg;
      })
      .join("; ");
    // Gooi een meer specifieke fout die kan worden onderschept
    throw new Error(`ShopifyGraphQLError: ${errorMessages}`);
  }
  return data;
}

/* -------------------------------------------------------------------- */
/* 4. PRODUCT QUERIES                                                  */
/* -------------------------------------------------------------------- */
const ProductFragment = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    title
    description
    descriptionHtml
    handle
    vendor
    images(first: 10) { edges { node { url altText } } }
    priceRange { minVariantPrice { amount currencyCode } }
    variants(first: 10) {
      edges {
        node {
          id
          title
          price { amount currencyCode }
          availableForSale
          quantityAvailable
        }
      }
    }
    tags
  }
`;

export async function getProductsByTag(tag: string, first = 100): Promise<ShopifyProduct[]> {
  const query = /* GraphQL */ `
    query getProducts($first: Int!, $query: String!) {
      products(first: $first, query: $query) {
        edges {
          node {
            ...ProductFields
          }
        }
      }
    }
    ${ProductFragment}
  `;
  const data = await shopifyFetch<{
    products: { edges: Array<{ node: ShopifyProduct }> };
  }>(query, { first, query: `tag:${tag}` }, 3600);
  return data.products.edges.map((e) => e.node);
}

export async function getProduct(
  handle: string
): Promise<ShopifyProduct | null> {
  const query = /* GraphQL */ `
    query getProduct($handle: String!) {
      product(handle: $handle) {
        ...ProductFields
      }
    }
    ${ProductFragment}
  `;
  // Gebruik cache revalidatie voor individuele producten
  const data = await shopifyFetch<{ product: ShopifyProduct | null }>(query, {
    handle,
  }, 3600); // Revalidate elke uur
  return data.product;
}

export async function searchProducts(
  queryText: string,
  first = 250
): Promise<ShopifyProduct[]> {
  const searchQuery = /* GraphQL */ `
    query searchProducts($query: String!, $first: Int!) {
      products(first: $first, query: $query) {
        edges {
          node {
            ...ProductFields
          }
        }
      }
    }
    ${ProductFragment}
  `;
  const formattedQuery = `title:*${queryText}* OR tag:*${queryText}* OR product_type:*${queryText}*`;
  // Gebruik cache revalidatie voor zoekopdrachten
  const data = await shopifyFetch<{
    products: { edges: Array<{ node: ShopifyProduct }> };
  }>(searchQuery, {
    query: formattedQuery,
    first,
  }, 300); // Revalidate elke 5 minuten
  return data.products.edges.map((e) => e.node);
}

/* -------------------------------------------------------------------- */
/* 5. CART MUTATIONS / QUERIES                                         */
/* -------------------------------------------------------------------- */
const CartFieldsFragment = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    cost { totalAmount { amount currencyCode } }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              price { amount currencyCode }
              product {
                title
                handle
                vendor
                tags
                images(first: 1) { edges { node { url altText } } }
              }
            }
          }
        }
      }
    }
  }
`;

export async function createCart(): Promise<string> {
  console.log("🛒 Creating new Shopify cart...");
  const query = /* GraphQL */ `
    mutation cartCreate {
      cartCreate {
        cart { id }
        userErrors { field message code }
      }
    }
  `;
  // Geen cache voor mutaties
  const data = await shopifyFetch<{
    cartCreate: { cart: { id: string }; userErrors: any[] };
  }>(query);
  if (data.cartCreate.userErrors?.length) {
    const userErrorMessages = data.cartCreate.userErrors.map((e) => e.message).join(", ");
    console.error("❌ Shopify cartCreate UserErrors:", data.cartCreate.userErrors);
    throw new Error(`CartCreationError: ${userErrorMessages}`);
  }
  console.log("✅ New Shopify cart created:", data.cartCreate.cart.id);
  return data.cartCreate.cart.id;
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity = 1
): Promise<ShopifyCart> {
  console.log("🔗 Shopify addToCart called:", { cartId, variantId, quantity });

  // ➕ Sanity checks
  if (!variantId || !variantId.startsWith("gid://shopify/ProductVariant/")) {
    const msg = `❌ Invalid variantId provided: ${variantId}. Expected 'gid://shopify/ProductVariant/...'`;
    console.error(msg);
    throw new Error(`InputValidationError: ${msg}`);
  }

  if (!cartId || !cartId.startsWith("gid://shopify/Cart/")) {
    const msg = `❌ Invalid cartId provided: ${cartId}. Expected 'gid://shopify/Cart/...'`;
    console.error(msg);
    throw new Error(`InputValidationError: ${msg}`);
  }

  const query = /* GraphQL */ `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ...CartFields }
        userErrors { field message code }
      }
    }
    ${CartFieldsFragment}
  `;

  const variables = {
    cartId,
    lines: [
      {
        merchandiseId: variantId,
        quantity,
      },
    ],
  };

  // Deze log is voor debuggen van de ID die daadwerkelijk wordt doorgegeven aan Shopify
  console.log("🧪 variantId sent to Shopify:", variantId);

  // Geen cache voor mutaties
  const data = await shopifyFetch<{
    cartLinesAdd: { cart: ShopifyCart; userErrors: any[] };
  }>(query, variables);

  if (data.cartLinesAdd.userErrors?.length) {
    const errorMessages = data.cartLinesAdd.userErrors
      .map((e) => `${e.code || "unknown"}: ${e.message} (Field: ${e.field})`)
      .join("; ");
    console.error("❌ Shopify cartLinesAdd UserErrors:", data.cartLinesAdd.userErrors);
    throw new Error(`AddToCartError: ${errorMessages}`); // Specifieke foutnaam
  }
  console.log("✅ Shopify addToCart success for cart:", data.cartLinesAdd.cart.id);
  return data.cartLinesAdd.cart;
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  console.log("🛒 Getting Shopify cart:", cartId);
  const query = /* GraphQL */ `
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        ...CartFields
      }
    }
    ${CartFieldsFragment}
  `;
  try {
    // Geen cache voor de huidige winkelwagen status
    const data = await shopifyFetch<{ cart: ShopifyCart | null }>(query, {
      cartId,
    });
    if (data.cart) {
      console.log("✅ Shopify cart retrieved:", cartId);
    } else {
      console.warn("⚠️ Shopify cart not found or invalid:", cartId);
    }
    return data.cart;
  } catch (error) {
    // Log de fout, maar laat de functie null retourneren of de error doorgooien als je strikter wilt zijn
    console.error(`❌ Error fetching Shopify cart ${cartId}:`, error instanceof Error ? error.message : String(error));
    return null; // Retourneer null bij fout, laat de caller beslissen om opnieuw te initialiseren
  }
}

export async function removeFromCart(
  cartId: string,
  lineId: string
): Promise<ShopifyCart> {
  console.log("🗑️ Removing from Shopify cart:", { cartId, lineId });
  const query = /* GraphQL */ `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ...CartFields }
        userErrors { field message code }
      }
    }
    ${CartFieldsFragment}
  `;
  const variables = { cartId, lineIds: [lineId] };
  // Geen cache voor mutaties
  const data = await shopifyFetch<{
    cartLinesRemove: { cart: ShopifyCart; userErrors: any[] };
  }>(query, variables);
  if (data.cartLinesRemove.userErrors?.length) {
    const userErrorMessages = data.cartLinesRemove.userErrors.map((e) => e.message).join(", ");
    console.error("❌ Shopify cartLinesRemove UserErrors:", data.cartLinesRemove.userErrors);
    throw new Error(`RemoveFromCartError: ${userErrorMessages}`);
  }
  console.log("✅ Shopify removeFromCart success for cart:", cartId);
  return data.cartLinesRemove.cart;
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<ShopifyCart> {
  console.log("🔄 Updating Shopify cart line:", { cartId, lineId, quantity });
  const query = /* GraphQL */ `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ...CartFields }
        userErrors { field message code }
      }
    }
    ${CartFieldsFragment}
  `;
  const variables = { cartId, lines: [{ id: lineId, quantity }] };
  // Geen cache voor mutaties
  const data = await shopifyFetch<{
    cartLinesUpdate: { cart: ShopifyCart; userErrors: any[] };
  }>(query, variables);
  if (data.cartLinesUpdate.userErrors?.length) {
    const userErrorMessages = data.cartLinesUpdate.userErrors.map((e) => e.message).join(", ");
    console.error("❌ Shopify cartLinesUpdate UserErrors:", data.cartLinesUpdate.userErrors);
    throw new Error(`UpdateCartLineError: ${userErrorMessages}`);
  }
  console.log("✅ Shopify updateCartLine success for cart:", cartId);
  return data.cartLinesUpdate.cart;
}
