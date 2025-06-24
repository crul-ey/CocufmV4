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
  descriptionHtml: string // <-- TOEGEVOEGD
  handle: string
  vendor?: string
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
            vendor?: string
            images: { edges: Array<{ node: { url: string; altText: string | null } }> }
            tags: string[]
            // descriptionHtml is niet per se nodig in cart items, tenzij je het daar wilt tonen
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

  if (!res.ok) {
    const errorBody = await res.text()
    console.error("Shopify API Error Response:", errorBody)
    throw new Error(`Shopify error ${res.status}: ${errorBody}`)
  }

  const { data, errors } = (await res.json()) as { data: T; errors?: Array<{ message: string; extensions?: any }> }

  if (errors?.length) {
    console.error("Shopify GraphQL Errors:", JSON.stringify(errors, null, 2))
    const errorMessages = errors
      .map((err) => {
        let msg = err.message
        if (err.extensions && err.extensions.problems) {
          msg += ` Problems: ${JSON.stringify(err.extensions.problems)}`
        }
        return msg
      })
      .join("; ")
    throw new Error(errorMessages)
  }
  return data
}

/* -------------------------------------------------------------------- */
/*  4. PRODUCT QUERIES                                                  */
/* -------------------------------------------------------------------- */
const ProductFragment = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    title
    description
    descriptionHtml # <-- TOEGEVOEGD
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
`

export async function getProducts(first = 20): Promise<ShopifyProduct[]> {
  const query = /* GraphQL */ `
    query getProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            ...ProductFields
          }
        }
      }
    }
    ${ProductFragment}
  `
  const data = await shopifyFetch<{ products: { edges: Array<{ node: ShopifyProduct }> } }>(query, { first })
  return data.products.edges.map((e) => e.node)
}

export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  const query = /* GraphQL */ `
    query getProduct($handle: String!) {
      product(handle: $handle) {
        ...ProductFields
      }
    }
    ${ProductFragment}
  `
  const data = await shopifyFetch<{ product: ShopifyProduct | null }>(query, { handle })
  return data.product
}

export async function searchProducts(queryText: string, first = 20): Promise<ShopifyProduct[]> {
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
  `
  const formattedQuery = `title:*${queryText}* OR tag:*${queryText}* OR product_type:*${queryText}*`
  const data = await shopifyFetch<{ products: { edges: Array<{ node: ShopifyProduct }> } }>(searchQuery, {
    query: formattedQuery,
    first,
  })
  return data.products.edges.map((e) => e.node)
}

/* -------------------------------------------------------------------- */
/*  5. CART MUTATIONS / QUERIES                                         */
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
`

export async function createCart(): Promise<string> {
  console.log("🛒 Creating new Shopify cart...")
  const query = /* GraphQL */ `
    mutation cartCreate {
      cartCreate {
        cart { id }
        userErrors { field message code }
      }
    }
  `
  const data = await shopifyFetch<{ cartCreate: { cart: { id: string }; userErrors: any[] } }>(query)
  if (data.cartCreate.userErrors?.length) {
    console.error("❌ Shopify cartCreate UserErrors:", data.cartCreate.userErrors)
    throw new Error(data.cartCreate.userErrors.map((e) => e.message).join(", "))
  }
  console.log("✅ New Shopify cart created:", data.cartCreate.cart.id)
  return data.cartCreate.cart.id
}

export async function addToCart(cartId: string, variantId: string, quantity = 1): Promise<ShopifyCart> {
  console.log("🔗 Shopify addToCart called:", { cartId, variantId, quantity })
  const query = /* GraphQL */ `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ...CartFields }
        userErrors { field message code }
      }
    }
    ${CartFieldsFragment}
  `
  const variables = { cartId, lines: [{ merchandiseId: variantId, quantity }] }
  const data = await shopifyFetch<{ cartLinesAdd: { cart: ShopifyCart; userErrors: any[] } }>(query, variables)

  if (data.cartLinesAdd.userErrors?.length) {
    console.error("❌ Shopify cartLinesAdd UserErrors:", data.cartLinesAdd.userErrors)
    const errorMessages = data.cartLinesAdd.userErrors
      .map((e) => `${e.code}: ${e.message} (Field: ${e.field})`)
      .join(", ")
    throw new Error(errorMessages)
  }
  console.log("✅ Shopify addToCart success for cart:", cartId)
  return data.cartLinesAdd.cart
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  console.log("🛒 Getting Shopify cart:", cartId)
  const query = /* GraphQL */ `
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        ...CartFields
      }
    }
    ${CartFieldsFragment}
  `
  try {
    const data = await shopifyFetch<{ cart: ShopifyCart | null }>(query, { cartId })
    if (data.cart) {
      console.log("✅ Shopify cart retrieved:", cartId)
    } else {
      console.warn("⚠️ Shopify cart not found or invalid:", cartId)
    }
    return data.cart
  } catch (error) {
    console.error("❌ Error fetching Shopify cart:", cartId, error)
    return null
  }
}

export async function removeFromCart(cartId: string, lineId: string): Promise<ShopifyCart> {
  console.log("🗑️ Removing from Shopify cart:", { cartId, lineId })
  const query = /* GraphQL */ `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ...CartFields }
        userErrors { field message code }
      }
    }
    ${CartFieldsFragment}
  `
  const variables = { cartId, lineIds: [lineId] }
  const data = await shopifyFetch<{ cartLinesRemove: { cart: ShopifyCart; userErrors: any[] } }>(query, variables)
  if (data.cartLinesRemove.userErrors?.length) {
    console.error("❌ Shopify cartLinesRemove UserErrors:", data.cartLinesRemove.userErrors)
    throw new Error(data.cartLinesRemove.userErrors.map((e) => e.message).join(", "))
  }
  console.log("✅ Shopify removeFromCart success for cart:", cartId)
  return data.cartLinesRemove.cart
}

export async function updateCartLine(cartId: string, lineId: string, quantity: number): Promise<ShopifyCart> {
  console.log("🔄 Updating Shopify cart line:", { cartId, lineId, quantity })
  const query = /* GraphQL */ `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ...CartFields }
        userErrors { field message code }
      }
    }
    ${CartFieldsFragment}
  `
  const variables = { cartId, lines: [{ id: lineId, quantity }] }
  const data = await shopifyFetch<{ cartLinesUpdate: { cart: ShopifyCart; userErrors: any[] } }>(query, variables)
  if (data.cartLinesUpdate.userErrors?.length) {
    console.error("❌ Shopify cartLinesUpdate UserErrors:", data.cartLinesUpdate.userErrors)
    throw new Error(data.cartLinesUpdate.userErrors.map((e) => e.message).join(", "))
  }
  console.log("✅ Shopify updateCartLine success for cart:", cartId)
  return data.cartLinesUpdate.cart
}
