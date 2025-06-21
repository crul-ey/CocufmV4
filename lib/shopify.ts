//
//  Shopify Storefront helpers
//  All calls run on the SERVER so your credentials stay safe
//

/* -------------------------------------------------------------------- */
/*  ❗ 1. ENVIRONMENT VARIABLES CHECK                                    */
/* -------------------------------------------------------------------- */
const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const SHOPIFY_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN

if (!SHOPIFY_DOMAIN || !SHOPIFY_TOKEN) {
  throw new Error(
    "⚠️  Missing Shopify env vars. Add NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN.",
  )
}

/* -------------------------------------------------------------------- */
/*  2. TYPES                                                            */
/* -------------------------------------------------------------------- */
export interface ShopifyVariant {
  id: string
  title: string
  price: { amount: string; currencyCode: string }
  availableForSale: boolean
  quantityAvailable?: number
}

export interface ShopifyProduct {
  id: string
  title: string
  description: string
  handle: string
  images: {
    edges: Array<{ node: { url: string; altText: string | null } }>
  }
  priceRange: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
  variants: {
    edges: Array<{
      node: ShopifyVariant
    }>
  }
  tags: string[]
}

export interface ShopifyCart {
  id: string
  lines: {
    edges: Array<{
      node: {
        id: string
        quantity: number
        merchandise: {
          id: string
          title: string
          product: {
            title: string
            handle: string
            images: { edges: Array<{ node: { url: string; altText: string | null } }> }
          }
          price: { amount: string; currencyCode: string }
        }
      }
    }>
  }
  cost: { totalAmount: { amount: string; currencyCode: string } }
  checkoutUrl: string
}

/* -------------------------------------------------------------------- */
/*  3. LOW-LEVEL fetch WRAPPER                                          */
/* -------------------------------------------------------------------- */
const SHOPIFY_ENDPOINT = `https://${SHOPIFY_DOMAIN}/api/2023-10/graphql.json`

async function shopifyFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(SHOPIFY_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN!,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  })

  if (!res.ok) throw new Error(`Shopify error ${res.status}`)

  const { data, errors } = (await res.json()) as { data: T; errors?: Array<{ message: string }> }

  if (errors?.length) throw new Error(errors[0].message)

  return data
}

/* -------------------------------------------------------------------- */
/*  4. PRODUCT QUERIES                                                  */
/* -------------------------------------------------------------------- */
export async function getProducts(first = 20): Promise<ShopifyProduct[]> {
  const query = /* GraphQL */ `
    query ($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            description
            handle
            images(first: 5) { edges { node { url altText } } }
            priceRange { minVariantPrice { amount currencyCode } }
            variants(first: 1) {
              edges {
                node {
                  id
                  title
                  price { amount currencyCode }
                  availableForSale
                }
              }
            }
            tags
          }
        }
      }
    }
  `
  const data = await shopifyFetch<{ products: { edges: Array<{ node: ShopifyProduct }> } }>(query, { first })
  return data.products.edges.map((e) => e.node)
}

export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  const query = /* GraphQL */ `
    query ($handle: String!) {
      product(handle: $handle) {
        id
        title
        description
        handle
        images(first: 10) { edges { node { url altText } } }
        priceRange { minVariantPrice { amount currencyCode } }
        variants(first: 10) {
          edges {
            node {
              id
              title
              price { amount currencyCode }
              availableForSale
            }
          }
        }
        tags
      }
    }
  `
  const data = await shopifyFetch<{ product: ShopifyProduct | null }>(query, { handle })
  return data.product
}

export async function searchProducts(query: string, first = 20): Promise<ShopifyProduct[]> {
  const searchQuery = /* GraphQL */ `
    query ($query: String!, $first: Int!) {
      products(first: $first, query: $query) {
        edges {
          node {
            id
            title
            description
            handle
            images(first: 5) { edges { node { url altText } } }
            priceRange { minVariantPrice { amount currencyCode } }
            variants(first: 1) {
              edges {
                node {
                  id
                  title
                  price { amount currencyCode }
                  availableForSale
                }
              }
            }
            tags
          }
        }
      }
    }
  `

  // Format the search query for Shopify
  const formattedQuery = `title:*${query}* OR tag:*${query}* OR product_type:*${query}*`

  const data = await shopifyFetch<{ products: { edges: Array<{ node: ShopifyProduct }> } }>(searchQuery, {
    query: formattedQuery,
    first,
  })

  return data.products.edges.map((e) => e.node)
}

/* -------------------------------------------------------------------- */
/*  5. CART MUTATIONS / QUERIES                                         */
/* -------------------------------------------------------------------- */
export async function createCart(): Promise<string> {
  const query = /* GraphQL */ `
    mutation {
      cartCreate {
        cart { id }
        userErrors { field message }
      }
    }
  `
  const data = await shopifyFetch<{ cartCreate: { cart: { id: string } } }>(query)
  return data.cartCreate.cart.id
}

export async function addToCart(cartId: string, variantId: string, quantity = 1): Promise<ShopifyCart> {
  const query = /* GraphQL */ `
    mutation ($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }

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
                  images(first: 1) { edges { node { url altText } } }
                }
              }
            }
          }
        }
      }
    }
  `
  const variables = { cartId, lines: [{ merchandiseId: variantId, quantity }] }
  const data = await shopifyFetch<{ cartLinesAdd: { cart: ShopifyCart } }>(query, variables)
  return data.cartLinesAdd.cart
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const query = /* GraphQL */ `
    query ($cartId: ID!) {
      cart(id: $cartId) {
        ...CartFields
      }
    }

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
                  images(first: 1) { edges { node { url altText } } }
                }
              }
            }
          }
        }
      }
    }
  `
  const data = await shopifyFetch<{ cart: ShopifyCart | null }>(query, { cartId })
  return data.cart
}

export async function removeFromCart(cartId: string, lineId: string): Promise<ShopifyCart> {
  const query = /* GraphQL */ `
    mutation ($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }

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
                  images(first: 1) { edges { node { url altText } } }
                }
              }
            }
          }
        }
      }
    }
  `
  const variables = { cartId, lineIds: [lineId] }
  const data = await shopifyFetch<{ cartLinesRemove: { cart: ShopifyCart } }>(query, variables)
  return data.cartLinesRemove.cart
}

export async function updateCartLine(cartId: string, lineId: string, quantity: number): Promise<ShopifyCart> {
  const query = /* GraphQL */ `
    mutation ($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }

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
                  images(first: 1) { edges { node { url altText } } }
                }
              }
            }
          }
        }
      }
    }
  `
  const variables = { cartId, lines: [{ id: lineId, quantity }] }
  const data = await shopifyFetch<{ cartLinesUpdate: { cart: ShopifyCart } }>(query, variables)
  return data.cartLinesUpdate.cart
}
