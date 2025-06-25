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
  image?: ShopifyImageNode | null
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
  images?: {
    // ✅ Added images for the parent product in cart line
    edges: Array<{ node: ShopifyImageNode }>
  } | null
}

export interface ShopifyCartLineMerchandise {
  id: string // ProductVariant ID
  title: string // ProductVariant title
  product: ShopifyCartLineMerchandiseProduct
  image?: ShopifyImageNode | null // Specific variant image
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

// --- Response Types for shopifyFetch ---
interface ShopifyProductsResponseData {
  // Renamed for clarity
  products: {
    edges: Array<{ node: ShopifyProduct }>
    pageInfo: {
      hasNextPage: boolean
      endCursor: string | null
    }
  }
}

interface ShopifySingleProductResponseData {
  // Renamed for clarity
  product: ShopifyProduct | null
}

interface ShopifyCartCreateResponseData {
  // Renamed for clarity
  cartCreate: {
    cart: { id: string }
    userErrors: Array<{ field: string; message: string }>
  }
}

interface ShopifyCartResponseData {
  // Renamed for clarity
  cart: ShopifyCart | null
}

interface ShopifyCartLinesAddResponseData {
  // Renamed for clarity
  cartLinesAdd: {
    cart: ShopifyCart
    userErrors: Array<{ field: string; message: string }>
  }
}

interface ShopifyCartLinesRemoveResponseData {
  // Renamed for clarity
  cartLinesRemove: {
    cart: ShopifyCart
    userErrors: Array<{ field: string; message: string }>
  }
}

interface ShopifyCartLinesUpdateResponseData {
  // Renamed for clarity
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
    images(first: 10) { edges { node { id url altText width height } } }
    variants(first: 10) {
      edges {
        node {
          id
          title
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
          availableForSale
          quantityAvailable
          selectedOptions { name value }
          image { id url altText width height }
        }
      }
    }
    priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }
    compareAtPriceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }
    availableForSale
    totalInventory
    seo { title description }
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
          cost { totalAmount { amount currencyCode } subtotalAmount { amount currencyCode } compareAtAmountPerQuantity { amount currencyCode } }
          merchandise {
            ... on ProductVariant {
              id
              title
              product { # Access parent product
                id
                title
                handle
                vendor
                tags
                images(first: 1) { # ✅ Fetch first image of the parent product
                  edges { node { id url altText width height } }
                }
              }
              image { # Specific variant image
                id
                url
                altText
                width
                height
              }
              price { amount currencyCode }
              compareAtPrice { amount currencyCode }
              selectedOptions { name value }
              availableForSale
              quantityAvailable
            }
          }
        }
      }
    }
    cost { totalAmount { amount currencyCode } subtotalAmount { amount currencyCode } totalTaxAmount { amount currencyCode } totalDutyAmount { amount currencyCode } }
    createdAt
    updatedAt
  }
`

// --- Shopify Fetch Function ---
// Adding a more specific type for the fetch response to help with type inference
interface ShopifyFetchResponse<T> {
  data: T
  errors?: Array<{ message: string; locations?: any[]; path?: string[]; extensions?: any }>
}

async function shopifyFetch<T>({
  query,
  variables,
}: {
  query: string
  variables?: Record<string, any>
}): Promise<ShopifyFetchResponse<T>> {
  // Return the full response object
  try {
    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 60 },
    })

    if (!result.ok) {
      const errorBody = await result.text()
      console.error("Shopify API HTTP Error:", result.status, errorBody)
      throw new Error(`HTTP error! status: ${result.status}, body: ${errorBody}`)
    }

    const body: ShopifyFetchResponse<T> = await result.json()

    if (body.errors && body.errors.length > 0) {
      console.error("GraphQL errors:", JSON.stringify(body.errors, null, 2))
      // It's often useful to still return data if available, even with errors.
      // The calling function can decide how to handle partial data + errors.
      // However, for critical errors, throwing might be appropriate.
      // For now, we'll throw if there are errors, as this has been the pattern.
      throw new Error(`GraphQL error: ${body.errors.map((e) => e.message).join(", ") || "Unknown error"}`)
    }

    // It's possible to have no data and no errors (e.g. for a mutation that returns nothing on success)
    // but for queries, data should generally be present.
    if (body.data === undefined && !(body.errors && body.errors.length > 0)) {
      console.warn(
        "Shopify fetch returned undefined data and no errors. Query:",
        query,
        "Variables:",
        variables,
        "Response body:",
        JSON.stringify(body, null, 2),
      )
    }

    return body // Return the full body which includes data and potentially errors
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
    const queryStr = `
      query getProducts($first: Int!, $after: String) {
        products(first: $first, after: $after) {
          edges { node { ...ProductFragment } }
          pageInfo { hasNextPage endCursor }
        }
      }
      ${PRODUCT_FRAGMENT}
    `
    try {
      // Explicitly type the expected data structure for shopifyFetch
      const response: ShopifyFetchResponse<ShopifyProductsResponseData> = await shopifyFetch<ShopifyProductsResponseData>({
        // ✅ Use specific data type
        query: queryStr,
        variables: { first: 250, after: cursor },
      })

      // ✅ Check if response.data and response.data.products exist
      if (!response.data || !response.data.products) {
        console.warn(`No data or products returned for page ${pageCount}. Response:`, JSON.stringify(response, null, 2))
        hasNextPage = false
        continue
      }

      const productsData = response.data.products
      const products = productsData.edges.map((edge: { node: ShopifyProduct }) => edge.node) // ✅ Type edge
      allProducts = [...allProducts, ...products]
      hasNextPage = productsData.pageInfo.hasNextPage
      cursor = productsData.pageInfo.endCursor
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
  const queryStr = `
    query getLimitedProducts($first: Int!) {
      products(first: $first) { edges { node { ...ProductFragment } } }
    }
    ${PRODUCT_FRAGMENT}
  `
  const response = await shopifyFetch<ShopifyProductsResponseData>({ query: queryStr, variables: { first } })
  if (!response.data || !response.data.products) {
    console.warn("No data or products returned for getProducts.")
    return []
  }
  return response.data.products.edges.map((edge: { node: ShopifyProduct }) => edge.node) // ✅ Type edge
}

export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  const queryStr = `
    query getSingleProduct($handle: String!) {
      product(handle: $handle) { ...ProductFragment }
    }
    ${PRODUCT_FRAGMENT}
  `
  const response = await shopifyFetch<ShopifySingleProductResponseData>({ query: queryStr, variables: { handle } })
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

  const queryStr = `
    query searchStoreProducts($query: String!, $first: Int!) {
      products(first: $first, query: $query) { edges { node { ...ProductFragment } } }
    }
    ${PRODUCT_FRAGMENT}
  `
  try {
    const response = await shopifyFetch<ShopifyProductsResponseData>({
      query: queryStr,
      variables: { query: shopifySearchQuery, first },
    })
    if (!response.data || !response.data.products) {
      console.warn(`No data or products returned for search term: ${searchTerm}`)
      return []
    }
    const results = response.data.products.edges.map((edge: { node: ShopifyProduct }) => edge.node) // ✅ Type edge
    console.log(`✅ Found ${results.length} products with query: "${shopifySearchQuery}"`)
    return results
  } catch (error) {
    console.error(`Search failed for term "${searchTerm}" with query "${shopifySearchQuery}":`, error)
    return []
  }
}

// --- Cart Functions ---
// Helper to extract data and handle user errors for cart mutations
function handleCartMutationResponse<
  T extends { cart: ShopifyCart; userErrors: Array<{ field: string; message: string }> },
>(
  response: ShopifyFetchResponse<{ [key: string]: T }>, // Expects a single key like 'cartCreate' or 'cartLinesAdd'
  mutationName: string,
): ShopifyCart {
  const mutationResult = response.data?.[mutationName]

  if (!mutationResult) {
    console.error(
      `Failed ${mutationName}, no data returned from Shopify. Full response:`,
      JSON.stringify(response, null, 2),
    )
    throw new Error(`Failed ${mutationName}: No data returned from Shopify.`)
  }
  if (mutationResult.userErrors.length > 0) {
    throw new Error(mutationResult.userErrors.map((e) => e.message).join(", "))
  }
  if (!mutationResult.cart) {
    console.error(
      `Failed ${mutationName}, cart data is missing after operation. Result:`,
      JSON.stringify(mutationResult, null, 2),
    )
    throw new Error(`Failed ${mutationName}: Cart data is missing after operation.`)
  }
  return mutationResult.cart
}

export async function createCart(): Promise<string> {
  const queryStr = `
    mutation cartCreate {
      cartCreate { cart { id } userErrors { field message } }
    }`
  const response = await shopifyFetch<ShopifyCartCreateResponseData>({ query: queryStr })

  const cartCreateData = response.data?.cartCreate
  if (!cartCreateData) {
    console.error("Failed to create cart, no cartCreate data returned from Shopify.", JSON.stringify(response, null, 2))
    throw new Error("Failed to create cart: No cartCreate data returned from Shopify.")
  }
  if (cartCreateData.userErrors.length > 0) {
    throw new Error(cartCreateData.userErrors.map((e) => e.message).join(", "))
  }
  if (!cartCreateData.cart || !cartCreateData.cart.id) {
    console.error("Failed to create cart, cart ID is missing.", JSON.stringify(cartCreateData, null, 2))
    throw new Error("Failed to create cart: Cart ID is missing.")
  }
  return cartCreateData.cart.id
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const queryStr = `
    query getStoreCart($cartId: ID!) {
      cart(id: $cartId) { ...CartFragment }
    }
    ${CART_FRAGMENT}
  `
  try {
    const response = await shopifyFetch<ShopifyCartResponseData>({ query: queryStr, variables: { cartId } })
    if (!response.data) {
      console.warn(`No data returned for getCart with ID: ${cartId}. Cart might be invalid or not found.`)
      return null
    }
    return response.data.cart
  } catch (error) {
    console.error(`Error fetching cart with ID ${cartId}:`, error)
    return null
  }
}

export async function addToCart(cartId: string, variantId: string, quantity: number): Promise<ShopifyCart> {
  const queryStr = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ...CartFragment } userErrors { field message } }
    }
    ${CART_FRAGMENT}
  `
  const response = await shopifyFetch<{ cartLinesAdd: ShopifyCartLinesAddResponseData["cartLinesAdd"] }>({
    // More specific type
    query: queryStr,
    variables: { cartId, lines: [{ merchandiseId: variantId, quantity }] },
  })
  return handleCartMutationResponse(response, "cartLinesAdd")
}

export async function removeFromCart(cartId: string, lineId: string): Promise<ShopifyCart> {
  const queryStr = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ...CartFragment } userErrors { field message } }
    }
    ${CART_FRAGMENT}
  `
  const response = await shopifyFetch<{ cartLinesRemove: ShopifyCartLinesRemoveResponseData["cartLinesRemove"] }>({
    query: queryStr,
    variables: { cartId, lineIds: [lineId] },
  })
  return handleCartMutationResponse(response, "cartLinesRemove")
}

export async function updateCartLine(cartId: string, lineId: string, quantity: number): Promise<ShopifyCart> {
  const queryStr = `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ...CartFragment } userErrors { field message } }
    }
    ${CART_FRAGMENT}
  `
  const response = await shopifyFetch<{ cartLinesUpdate: ShopifyCartLinesUpdateResponseData["cartLinesUpdate"] }>({
    query: queryStr,
    variables: { cartId, lines: [{ id: lineId, quantity }] },
  })
  return handleCartMutationResponse(response, "cartLinesUpdate")
}
