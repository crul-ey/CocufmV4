const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!

if (!domain || !storefrontAccessToken) {
  throw new Error("Missing Shopify environment variables")
}

const endpoint = `https://${domain}/api/2024-04/graphql.json` // Gebruik een recente API versie

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

export interface ShopifyProductOption {
  id: string
  name: string
  values: string[]
}

export interface ShopifyProduct {
  id: string
  title: string
  handle: string
  description: string
  descriptionHtml: string // Vaak handig voor rich text
  vendor: string
  productType: string
  tags: string[]
  options: ShopifyProductOption[] // Voor variantkeuze
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
  compareAtPriceRange?: {
    // Optioneel maken
    minVariantPrice: ShopifyMoneyV2
    maxVariantPrice: ShopifyMoneyV2
  } | null
  availableForSale: boolean
  totalInventory: number
  seo: {
    title: string | null
    description: string | null
  }
  createdAt: string // ISO 8601 date string
  updatedAt: string // ISO 8601 date string
  publishedAt: string | null // ISO 8601 date string
}

export interface ShopifyCartLineMerchandiseProduct {
  id: string
  title: string
  handle: string
  vendor: string
  tags: string[]
  images?: {
    edges: Array<{ node: ShopifyImageNode }>
  } | null
}

export interface ShopifyCartLineMerchandise {
  id: string
  title: string
  product: ShopifyCartLineMerchandiseProduct
  image?: ShopifyImageNode | null
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

interface ShopifyProductsResponseData {
  products: {
    edges: Array<{ node: ShopifyProduct }>
    pageInfo: {
      hasNextPage: boolean
      endCursor: string | null
    }
  }
}

interface ShopifySingleProductResponseData {
  product: ShopifyProduct | null
}

interface ShopifyCartCreateResponseData {
  cartCreate: {
    cart: { id: string }
    userErrors: Array<{ field: string[]; message: string }> // field is vaak string[]
  }
}

interface ShopifyCartResponseData {
  cart: ShopifyCart | null
}

interface ShopifyCartLinesAddResponseData {
  cartLinesAdd: {
    cart: ShopifyCart
    userErrors: Array<{ field: string[]; message: string }>
  }
}

interface ShopifyCartLinesRemoveResponseData {
  cartLinesRemove: {
    cart: ShopifyCart
    userErrors: Array<{ field: string[]; message: string }>
  }
}

interface ShopifyCartLinesUpdateResponseData {
  cartLinesUpdate: {
    cart: ShopifyCart
    userErrors: Array<{ field: string[]; message: string }>
  }
}

// --- GraphQL Fragments ---
const PRODUCT_FRAGMENT = `
  fragment ProductFragment on Product {
    id
    title
    handle
    description
    descriptionHtml
    vendor
    productType
    tags
    options { id name values }
    images(first: 10) { edges { node { id url altText width height } } }
    variants(first: 20) { # Meer varianten indien nodig
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
    publishedAt # Toegevoegd
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
              product {
                id
                title
                handle
                vendor
                tags
                images(first: 1) {
                  edges { node { id url altText width height } }
                }
              }
              image {
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
interface ShopifyFetchResponse<T> {
  data: T
  errors?: Array<{ message: string; locations?: any[]; path?: string[]; extensions?: any }>
}

async function shopifyFetch<T>({
  query,
  variables,
  cache = "force-cache", // Standaard caching strategie
}: {
  query: string
  variables?: Record<string, any>
  cache?: RequestCache // Voor meer controle over caching
}): Promise<ShopifyFetchResponse<T>> {
  try {
    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
      },
      body: JSON.stringify({ query, variables }),
      cache: cache, // Gebruik de meegegeven cache strategie
      // next: { revalidate: 60 } // Alternatief voor App Router specifieke revalidatie
    })

    if (!result.ok) {
      const errorBody = await result.text()
      console.error("Shopify API HTTP Error:", result.status, errorBody)
      throw new Error(`HTTP error! status: ${result.status}, body: ${errorBody}`)
    }

    const body: ShopifyFetchResponse<T> = await result.json()

    if (body.errors && body.errors.length > 0) {
      console.error("GraphQL errors:", JSON.stringify(body.errors, null, 2))
      // Overweeg of je hier wilt throwen of data wilt retourneren met errors
      // throw new Error(`GraphQL error: ${body.errors.map((e) => e.message).join(", ") || "Unknown error"}`);
    }
    return body
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

export async function getAllProducts(): Promise<ShopifyProduct[]> {
  let allProducts: ShopifyProduct[] = []
  let hasNextPage = true
  let cursor: string | null = null
  let pageCount = 0
  const maxPages = 10 // Limiteer voor de zekerheid, pas aan indien nodig

  console.log("🛍️ Starting to fetch ALL products from Shopify...")

  while (hasNextPage && pageCount < maxPages) {
    pageCount++
    const queryStr = `
      query getProducts($first: Int!, $after: String) {
        products(first: $first, after: $after, sortKey: CREATED_AT, reverse: true) { # Sorteer op nieuwste
          edges { node { ...ProductFragment } }
          pageInfo { hasNextPage endCursor }
        }
      }
      ${PRODUCT_FRAGMENT}
    `
    try {
      const response: ShopifyFetchResponse<ShopifyProductsResponseData> = await shopifyFetch<ShopifyProductsResponseData>({
        query: queryStr,
        variables: { first: 50, after: cursor }, // Haal batches van 50 op
        cache: "no-store", // Geen cache voor getAllProducts om altijd verse data te hebben
      })

      if (!response.data || !response.data.products) {
        console.warn(`No data or products returned for page ${pageCount}. Response:`, JSON.stringify(response, null, 2))
        hasNextPage = false
        continue
      }

      const productsData = response.data.products
      const products = productsData.edges.map((edge: { node: ShopifyProduct }) => edge.node)
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
  if (pageCount >= maxPages && hasNextPage)
    console.warn(`⚠️ Reached max page limit (${maxPages}) for getAllProducts. Not all products may have been fetched.`)
  return allProducts
}

export async function getProducts(first = 20, sortKey = "CREATED_AT", reverse = true): Promise<ShopifyProduct[]> {
  const queryStr = `
    query getLimitedProducts($first: Int!, $sortKey: ProductSortKeys, $reverse: Boolean) {
      products(first: $first, sortKey: $sortKey, reverse: $reverse) { 
        edges { node { ...ProductFragment } } 
      }
    }
    ${PRODUCT_FRAGMENT}
  `
  const response = await shopifyFetch<ShopifyProductsResponseData>({
    query: queryStr,
    variables: { first, sortKey, reverse },
    cache: "force-cache",
  })
  if (!response.data || !response.data.products) {
    console.warn("No data or products returned for getProducts.")
    return []
  }
  return response.data.products.edges.map((edge: { node: ShopifyProduct }) => edge.node)
}

export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  const queryStr = `
    query getSingleProduct($handle: String!) {
      product(handle: $handle) { ...ProductFragment }
    }
    ${PRODUCT_FRAGMENT}
  `
  const response = await shopifyFetch<ShopifySingleProductResponseData>({
    query: queryStr,
    variables: { handle },
    cache: "force-cache", // Productdata kan agressiever gecached worden
  })
  if (!response.data) {
    console.warn(`No data returned for getProduct with handle: ${handle}`)
    return null
  }
  return response.data.product
}

export async function searchProducts(searchTerm: string, first = 20): Promise<ShopifyProduct[]> {
  if (!searchTerm || searchTerm.trim().length === 0) return []

  const cleanTerm = searchTerm.trim()
  // Uitgebreidere zoekquery, zoek in titel, tags, product type, vendor en description
  const shopifySearchQuery = `(title:*${cleanTerm}* OR tags:*${cleanTerm}* OR product_type:*${cleanTerm}* OR vendor:*${cleanTerm}* OR description:*${cleanTerm}*)`

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
      cache: "no-store", // Zoekresultaten niet te lang cachen
    })
    if (!response.data || !response.data.products) {
      console.warn(`No data or products returned for search term: ${searchTerm}`)
      return []
    }
    const results = response.data.products.edges.map((edge: { node: ShopifyProduct }) => edge.node)
    console.log(`✅ Found ${results.length} products for search: "${searchTerm}"`)
    return results
  } catch (error) {
    console.error(`Search failed for term "${searchTerm}" with query "${shopifySearchQuery}":`, error)
    return []
  }
}

// --- Cart Functions ---
function handleCartMutationResponse<
  T extends { cart: ShopifyCart; userErrors: Array<{ field: string[] | null; message: string }> },
>(response: ShopifyFetchResponse<{ [key: string]: T }>, mutationName: string): ShopifyCart {
  const mutationResult = response.data?.[mutationName]

  if (!mutationResult) {
    console.error(`Failed ${mutationName}, no data returned. Response:`, JSON.stringify(response, null, 2))
    throw new Error(`Failed ${mutationName}: No data returned from Shopify.`)
  }
  if (mutationResult.userErrors.length > 0) {
    console.error(`${mutationName} user errors:`, JSON.stringify(mutationResult.userErrors, null, 2))
    throw new Error(mutationResult.userErrors.map((e) => e.message).join(", "))
  }
  if (!mutationResult.cart) {
    console.error(`Failed ${mutationName}, cart data missing. Result:`, JSON.stringify(mutationResult, null, 2))
    throw new Error(`Failed ${mutationName}: Cart data is missing after operation.`)
  }
  return mutationResult.cart
}

export async function createCart(): Promise<string> {
  const queryStr = `
    mutation cartCreate($input: CartInput) { # input is optioneel maar kan gebruikt worden voor lines, attributes, etc.
      cartCreate(input: $input) { cart { id } userErrors { field message } }
    }`
  const response = await shopifyFetch<ShopifyCartCreateResponseData>({ query: queryStr, variables: { input: {} } }) // Lege input voor een lege cart

  const cartCreateData = response.data?.cartCreate
  if (!cartCreateData) {
    console.error("Failed to create cart, no cartCreate data. Response:", JSON.stringify(response, null, 2))
    throw new Error("Failed to create cart: No cartCreate data returned.")
  }
  if (cartCreateData.userErrors.length > 0) {
    console.error("CartCreate user errors:", JSON.stringify(cartCreateData.userErrors, null, 2))
    throw new Error(cartCreateData.userErrors.map((e) => e.message).join(", "))
  }
  if (!cartCreateData.cart || !cartCreateData.cart.id) {
    console.error("Failed to create cart, cart ID missing. Data:", JSON.stringify(cartCreateData, null, 2))
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
      console.warn(`No data for getCart ID: ${cartId}. Cart might be invalid/not found.`)
      return null
    }
    return response.data.cart
  } catch (error) {
    console.error(`Error fetching cart ID ${cartId}:`, error)
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

// Functie voor productaanbevelingen (voorbeeld)
export async function getProductRecommendations(productId: string, first = 5): Promise<ShopifyProduct[]> {
  const queryStr = `
    query getProductRecommendations($productId: ID!) {
      productRecommendations(productId: $productId, intent: RELATED) {
        ...ProductFragment
      }
    }
    ${PRODUCT_FRAGMENT}
  `

  interface ShopifyProductRecommendationsResponseData {
    productRecommendations: ShopifyProduct[] | null
  }

  try {
    const response = await shopifyFetch<ShopifyProductRecommendationsResponseData>({
      query: queryStr,
      variables: { productId }, // Verwijder first uit variables
      cache: "force-cache",
    })
    if (!response.data || !response.data.productRecommendations) {
      console.warn(`No recommendations found for product ID: ${productId}`)
      return []
    }
    // Filter de aanbevolen producten om het originele product uit te sluiten, indien nodig
    return response.data.productRecommendations.filter((p) => p.id !== productId).slice(0, first)
  } catch (error) {
    console.error(`Error fetching recommendations for product ID ${productId}:`, error)
    return []
  }
}
