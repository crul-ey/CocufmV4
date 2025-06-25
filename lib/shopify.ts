const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!

if (!domain || !storefrontAccessToken) {
  throw new Error("Missing Shopify environment variables")
}

const endpoint = `https://${domain}/api/2023-07/graphql.json`

// --- Shopify Types (Interfaces) ---
export interface ShopifyImageNode {
  id: string
  url: string
  altText: string | null
  width: number
  height: number
}

export interface ShopifyMoneyV2 {
  amount: string
  currencyCode: string
}

export interface ShopifyProductVariantNode {
  id: string
  title: string
  price: ShopifyMoneyV2
  compareAtPrice?: ShopifyMoneyV2 | null
  availableForSale: boolean
  quantityAvailable: number
  selectedOptions: Array<{
    name: string
    value: string
  }>
  image?: ShopifyImageNode | null // ✅ Variant can have one specific image
}

export interface ShopifyProduct {
  id: string
  title: string
  handle: string
  description: string
  vendor: string
  productType: string
  tags: string[]
  images: {
    // Product has a collection of images
    edges: Array<{ node: ShopifyImageNode }>
  }
  variants: {
    edges: Array<{ node: ShopifyProductVariantNode }>
  }
  priceRange: {
    minVariantPrice: ShopifyMoneyV2
    maxVariantPrice: ShopifyMoneyV2
  }
  compareAtPriceRange: {
    minVariantPrice: ShopifyMoneyV2
    maxVariantPrice: ShopifyMoneyV2
  }
  availableForSale: boolean
  totalInventory: number
  seo: {
    title: string | null
    description: string | null
  }
  createdAt: string
  updatedAt: string
}

export interface ShopifyCartLineMerchandiseProduct {
  id: string
  title: string
  handle: string
  vendor: string
  tags: string[]
}

export interface ShopifyCartLineMerchandise {
  id: string // ProductVariant ID
  title: string // ProductVariant title
  product: ShopifyCartLineMerchandiseProduct
  image?: ShopifyImageNode | null // ✅ Variant image (singular)
  price: ShopifyMoneyV2
  compareAtPrice?: ShopifyMoneyV2 | null
  selectedOptions: Array<{
    name: string
    value: string
  }>
  availableForSale: boolean
  quantityAvailable: number
}

export interface ShopifyCartLineNode {
  // Renamed from ShopifyCartLine for clarity
  id: string
  quantity: number
  cost: {
    totalAmount: ShopifyMoneyV2
    subtotalAmount: ShopifyMoneyV2
    compareAtAmountPerQuantity?: ShopifyMoneyV2 | null
  }
  merchandise: ShopifyCartLineMerchandise
}

export interface ShopifyCart {
  id: string
  checkoutUrl: string
  totalQuantity: number
  lines: {
    edges: Array<{ node: ShopifyCartLineNode }>
  }
  cost: {
    totalAmount: ShopifyMoneyV2
    subtotalAmount: ShopifyMoneyV2
    totalTaxAmount?: ShopifyMoneyV2 | null
    totalDutyAmount?: ShopifyMoneyV2 | null
  }
  createdAt: string
  updatedAt: string
}

// --- Response Types for shopifyFetch (simplified for brevity, expand as needed) ---
interface ShopifyProductsResponse {
  products: {
    edges: Array<{ node: ShopifyProduct }>
    pageInfo: {
      hasNextPage: boolean
      endCursor: string | null
    }
  }
}

interface ShopifySingleProductResponse {
  product: ShopifyProduct | null
}

interface ShopifyCartCreateResponse {
  cartCreate: {
    cart: { id: string }
    userErrors: Array<{ field: string; message: string }>
  }
}

interface ShopifyCartResponse {
  cart: ShopifyCart | null
}

interface ShopifyCartLinesAddResponse {
  cartLinesAdd: {
    cart: ShopifyCart
    userErrors: Array<{ field: string; message: string }>
  }
}

interface ShopifyCartLinesRemoveResponse {
  cartLinesRemove: {
    cart: ShopifyCart
    userErrors: Array<{ field: string; message: string }>
  }
}

interface ShopifyCartLinesUpdateResponse {
  cartLinesUpdate: {
    cart: ShopifyCart
    userErrors: Array<{ field: string; message: string }>
  }
}

// --- GraphQL Fragments ---
const PRODUCT_FRAGMENT = `
  fragment ProductFragment on Product {
    id
    title
    handle
    description
    vendor
    productType
    tags
    images(first: 10) {
      edges {
        node {
          id
          url
          altText
          width
          height
        }
      }
    }
    variants(first: 10) {
      edges {
        node {
          id
          title
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          availableForSale
          quantityAvailable
          selectedOptions {
            name
            value
          }
          image { # ✅ Fetch the single image for the variant
            id
            url
            altText
            width
            height
          }
        }
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    availableForSale
    totalInventory
    seo {
      title
      description
    }
    createdAt
    updatedAt
  }
`

const CART_FRAGMENT = `
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
            compareAtAmountPerQuantity {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              product {
                id
                title
                handle
                vendor
                tags
              }
              image { # ✅ FIXED: Query singular 'image' for ProductVariant
                id
                url
                altText
                width
                height
              }
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
              availableForSale
              quantityAvailable
            }
          }
        }
      }
    }
    cost {
      totalAmount {
        amount
        currencyCode
      }
      subtotalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
      totalDutyAmount {
        amount
        currencyCode
      }
    }
    createdAt
    updatedAt
  }
`

// --- Shopify Fetch Function ---
async function shopifyFetch<T>({
  query,
  variables,
}: {
  query: string
  variables?: Record<string, any>
}): Promise<{ data: T; errors?: Array<{ message: string }> }> {
  try {
    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 60 }, // Cache for 1 minute
    })

    if (!result.ok) {
      const errorBody = await result.text()
      console.error("Shopify API HTTP Error:", result.status, errorBody)
      throw new Error(`HTTP error! status: ${result.status}, body: ${errorBody}`)
    }

    const body = (await result.json()) as { data: T; errors?: Array<{ message: string }> }

    if (body.errors && body.errors.length > 0) {
      console.error("GraphQL errors:", JSON.stringify(body.errors, null, 2))
      throw new Error(`GraphQL error: ${body.errors.map((e) => e.message).join(", ") || "Unknown error"}`)
    }
    if (!body.data && !(body.errors && body.errors.length > 0)) {
      // This case can happen if there are no GraphQL errors but data is still null/undefined
      console.warn(
        "Shopify fetch returned no data and no errors. Query:",
        query,
        "Variables:",
        variables,
        "Response body:",
        body,
      )
      // Potentially throw an error or return a specific structure indicating no data
      // For now, returning as is, but this might need specific handling by callers.
    }

    return { data: body.data, errors: body.errors }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Shopify fetch error:", error.message, error.stack)
      throw error
    } else {
      const unknownError = new Error(`An unknown error occurred during Shopify fetch: ${String(error)}`)
      console.error("Shopify fetch unknown error:", unknownError)
      throw unknownError
    }
  }
}

// --- Product Functions ---
export async function getAllProducts(): Promise<ShopifyProduct[]> {
  let allProducts: ShopifyProduct[] = []
  let hasNextPage = true
  let cursor: string | null = null
  let pageCount = 0
  const maxPages = 100

  console.log("🛍️ Starting to fetch ALL products from Shopify...")

  while (hasNextPage && pageCount < maxPages) {
    pageCount++
    const query = `
      query getProducts($first: Int!, $after: String) {
        products(first: $first, after: $after) {
          edges { node { ...ProductFragment } }
          pageInfo { hasNextPage endCursor }
        }
      }
      ${PRODUCT_FRAGMENT}
    `
    try {
      const response: { data: ShopifyProductsResponse; errors?: Array<{ message: string }> } = await shopifyFetch<ShopifyProductsResponse>({
        query,
        variables: { first: 250, after: cursor },
      })

      if (!response.data || !response.data.products) {
        console.warn(`No data or products returned for page ${pageCount}. Response:`, response)
        hasNextPage = false
        continue
      }

      const products = response.data.products.edges.map((edge: { node: ShopifyProduct }) => edge.node)
      allProducts = [...allProducts, ...products]
      hasNextPage = response.data.products.pageInfo.hasNextPage
      cursor = response.data.products.pageInfo.endCursor
      console.log(`✅ Page ${pageCount}: ${products.length} products (Total: ${allProducts.length})`)
      if (!hasNextPage) console.log(`🎉 Finished! Total products fetched: ${allProducts.length}`)
    } catch (error) {
      console.error(`❌ Error fetching page ${pageCount}:`, error)
      break
    }
  }
  if (pageCount >= maxPages) console.warn(`⚠️ Reached max page limit (${maxPages}).`)
  return allProducts
}

export async function getProducts(first = 100): Promise<ShopifyProduct[]> {
  const query = `
    query getLimitedProducts($first: Int!) {
      products(first: $first) { edges { node { ...ProductFragment } } }
    }
    ${PRODUCT_FRAGMENT}
  `
  const response = await shopifyFetch<ShopifyProductsResponse>({ query, variables: { first } })
  if (!response.data || !response.data.products) {
    console.warn("No data or products returned for getProducts.")
    return []
  }
  return response.data.products.edges.map((edge) => edge.node)
}

export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  const query = `
    query getSingleProduct($handle: String!) {
      product(handle: $handle) { ...ProductFragment }
    }
    ${PRODUCT_FRAGMENT}
  `
  const response = await shopifyFetch<ShopifySingleProductResponse>({ query, variables: { handle } })
  if (!response.data) {
    console.warn(`No data returned for getProduct with handle: ${handle}`)
    return null
  }
  return response.data.product
}

export async function searchProducts(searchTerm: string, first = 100): Promise<ShopifyProduct[]> {
  console.log(`🔍 Searching for: "${searchTerm}"`)
  if (!searchTerm || searchTerm.trim().length === 0) {
    console.log("❌ Empty search term")
    return []
  }
  const cleanTerm = searchTerm.trim().toLowerCase()

  const shopifySearchQuery = `title:*${cleanTerm}* OR tag:*${cleanTerm}* OR product_type:*${cleanTerm}* OR vendor:*${cleanTerm}*`
  // For more complex scenarios, you might iterate through different query strategies as in your attached file.
  // For this version, sticking to a common combined query.

  const query = `
    query searchStoreProducts($query: String!, $first: Int!) {
      products(first: $first, query: $query) { edges { node { ...ProductFragment } } }
    }
    ${PRODUCT_FRAGMENT}
  `
  try {
    const response = await shopifyFetch<ShopifyProductsResponse>({
      query,
      variables: { query: shopifySearchQuery, first },
    })
    if (!response.data || !response.data.products) {
      console.warn(`No data or products returned for search term: ${searchTerm}`)
      return []
    }
    const results = response.data.products.edges.map((edge) => edge.node)
    console.log(`✅ Found ${results.length} products with query: "${shopifySearchQuery}"`)
    return results
  } catch (error) {
    console.error(`Search failed for term "${searchTerm}" with query "${shopifySearchQuery}":`, error)
    // Fallback or more advanced search strategies could be added here if needed.
    // For now, return empty on error.
    return []
  }
}

// --- Cart Functions ---
export async function createCart(): Promise<string> {
  const query = `
    mutation cartCreate {
      cartCreate { cart { id } userErrors { field message } }
    }`
  const response = await shopifyFetch<ShopifyCartCreateResponse>({ query })
  if (!response.data || !response.data.cartCreate) {
    console.error("Failed to create cart, no data returned from Shopify.", response)
    throw new Error("Failed to create cart: No data returned from Shopify.")
  }
  if (response.data.cartCreate.userErrors.length > 0) {
    throw new Error(response.data.cartCreate.userErrors.map((e) => e.message).join(", "))
  }
  if (!response.data.cartCreate.cart || !response.data.cartCreate.cart.id) {
    console.error("Failed to create cart, cart ID is missing.", response.data.cartCreate)
    throw new Error("Failed to create cart: Cart ID is missing.")
  }
  return response.data.cartCreate.cart.id
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const query = `
    query getStoreCart($cartId: ID!) {
      cart(id: $cartId) { ...CartFragment }
    }
    ${CART_FRAGMENT}
  `
  try {
    const response = await shopifyFetch<ShopifyCartResponse>({ query, variables: { cartId } })
    if (!response.data) {
      // This can happen if the cart ID is invalid or expired.
      // Returning null allows the CartContext to attempt creating a new cart.
      console.warn(`No data returned for getCart with ID: ${cartId}. Cart might be invalid or not found.`)
      return null
    }
    return response.data.cart
  } catch (error) {
    // Catching errors here (e.g., network issues, or GraphQL errors not caught by shopifyFetch's primary error check)
    console.error(`Error fetching cart with ID ${cartId}:`, error)
    return null // Indicate failure to fetch the cart
  }
}

export async function addToCart(cartId: string, variantId: string, quantity: number): Promise<ShopifyCart> {
  const query = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ...CartFragment } userErrors { field message } }
    }
    ${CART_FRAGMENT}
  `
  const response = await shopifyFetch<ShopifyCartLinesAddResponse>({
    query,
    variables: { cartId, lines: [{ merchandiseId: variantId, quantity }] },
  })
  if (!response.data || !response.data.cartLinesAdd) {
    console.error("Failed to add to cart, no data returned from Shopify.", response)
    throw new Error("Failed to add to cart: No data returned from Shopify.")
  }
  if (response.data.cartLinesAdd.userErrors.length > 0) {
    throw new Error(response.data.cartLinesAdd.userErrors.map((e) => e.message).join(", "))
  }
  if (!response.data.cartLinesAdd.cart) {
    console.error("Failed to add to cart, cart data is missing after operation.", response.data.cartLinesAdd)
    throw new Error("Failed to add to cart: Cart data is missing after operation.")
  }
  return response.data.cartLinesAdd.cart
}

export async function removeFromCart(cartId: string, lineId: string): Promise<ShopifyCart> {
  const query = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ...CartFragment } userErrors { field message } }
    }
    ${CART_FRAGMENT}
  `
  const response = await shopifyFetch<ShopifyCartLinesRemoveResponse>({
    query,
    variables: { cartId, lineIds: [lineId] },
  })
  if (!response.data || !response.data.cartLinesRemove) {
    console.error("Failed to remove from cart, no data returned from Shopify.", response)
    throw new Error("Failed to remove from cart: No data returned from Shopify.")
  }
  if (response.data.cartLinesRemove.userErrors.length > 0) {
    throw new Error(response.data.cartLinesRemove.userErrors.map((e) => e.message).join(", "))
  }
  if (!response.data.cartLinesRemove.cart) {
    console.error("Failed to remove from cart, cart data is missing after operation.", response.data.cartLinesRemove)
    throw new Error("Failed to remove from cart: Cart data is missing after operation.")
  }
  return response.data.cartLinesRemove.cart
}

export async function updateCartLine(cartId: string, lineId: string, quantity: number): Promise<ShopifyCart> {
  const query = `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ...CartFragment } userErrors { field message } }
    }
    ${CART_FRAGMENT}
  `
  const response = await shopifyFetch<ShopifyCartLinesUpdateResponse>({
    query,
    variables: { cartId, lines: [{ id: lineId, quantity }] },
  })
  if (!response.data || !response.data.cartLinesUpdate) {
    console.error("Failed to update cart line, no data returned from Shopify.", response)
    throw new Error("Failed to update cart line: No data returned from Shopify.")
  }
  if (response.data.cartLinesUpdate.userErrors.length > 0) {
    throw new Error(response.data.cartLinesUpdate.userErrors.map((e) => e.message).join(", "))
  }
  if (!response.data.cartLinesUpdate.cart) {
    console.error("Failed to update cart line, cart data is missing after operation.", response.data.cartLinesUpdate)
    throw new Error("Failed to update cart line: Cart data is missing after operation.")
  }
  return response.data.cartLinesUpdate.cart
}
