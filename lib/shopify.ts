const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!

if (!domain || !storefrontAccessToken) {
  throw new Error("Missing Shopify environment variables")
}

const endpoint = `https://${domain}/api/2023-07/graphql.json`

// Enhanced Shopify Types
export interface ShopifyProduct {
  id: string
  title: string
  handle: string
  description: string
  vendor: string
  productType: string
  tags: string[]
  images: {
    edges: Array<{
      node: {
        id: string
        url: string
        altText: string | null
        width: number
        height: number
      }
    }>
  }
  variants: {
    edges: Array<{
      node: {
        id: string
        title: string
        price: {
          amount: string
          currencyCode: string
        }
        compareAtPrice?: {
          amount: string
          currencyCode: string
        } | null
        availableForSale: boolean
        quantityAvailable: number
        selectedOptions: Array<{
          name: string
          value: string
        }>
      }
    }>
  }
  priceRange: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
    maxVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
  compareAtPriceRange: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
    maxVariantPrice: {
      amount: string
      currencyCode: string
    }
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
  handle: string // Product handle is here
  vendor: string
  tags: string[]
}

export interface ShopifyCartLineMerchandise {
  id: string // This is ProductVariant ID
  title: string // ProductVariant title
  // handle: string // REMOVED: ProductVariant does not have a direct handle
  vendor: string // This should be product.vendor
  product: ShopifyCartLineMerchandiseProduct
  images: {
    edges: Array<{
      node: {
        id: string
        url: string
        altText: string | null
        width: number
        height: number
      }
    }>
  }
  price: {
    amount: string
    currencyCode: string
  }
  compareAtPrice?: {
    amount: string
    currencyCode: string
  } | null
  selectedOptions: Array<{
    name: string
    value: string
  }>
  availableForSale: boolean
  quantityAvailable: number
}

export interface ShopifyCartLine {
  id: string
  quantity: number
  cost: {
    totalAmount: {
      amount: string
      currencyCode: string
    }
    subtotalAmount: {
      amount: string
      currencyCode: string
    }
    compareAtAmountPerQuantity?: {
      amount: string
      currencyCode: string
    } | null
  }
  merchandise: ShopifyCartLineMerchandise
}

export interface ShopifyCart {
  id: string
  checkoutUrl: string
  totalQuantity: number
  lines: {
    edges: Array<{
      node: ShopifyCartLine
    }>
  }
  cost: {
    totalAmount: {
      amount: string
      currencyCode: string
    }
    subtotalAmount: {
      amount: string
      currencyCode: string
    }
    totalTaxAmount?: {
      amount: string
      currencyCode: string
    } | null
    totalDutyAmount?: {
      amount: string
      currencyCode: string
    } | null
  }
  createdAt: string
  updatedAt: string
}

// GraphQL Fragments
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

// ✅ FIXED CART_FRAGMENT
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
              id # ProductVariant ID
              title # ProductVariant title
              # handle # REMOVED - ProductVariant doesn't have a handle directly
              # vendor # REMOVED - Use product.vendor
              product { # Access parent product for these fields
                id
                title
                handle # Product handle is here
                vendor
                tags
              }
              images(first: 1) { # Image for the variant
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

async function shopifyFetch<T>({
  query,
  variables,
}: {
  query: string
  variables?: Record<string, any>
}): Promise<{ data: T; errors?: any[] }> {
  try {
    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      next: { revalidate: 60 }, // Cache for 1 minute
    })

    if (!result.ok) {
      throw new Error(`HTTP error! status: ${result.status}`)
    }

    const body: { data: T; errors?: Array<{ message: string }> } = await result.json()

    if (body.errors && body.errors.length > 0) {
      console.error("GraphQL errors:", body.errors) // Log all errors
      throw new Error(`GraphQL error: ${body.errors.map((e) => e.message).join(", ") || "Unknown error"}`)
    }

    return { data: body.data, errors: body.errors }
  } catch (error) {
    console.error("Shopify fetch error:", error)
    throw error
  }
}

// Get all products with pagination
export async function getAllProducts(): Promise<ShopifyProduct[]> {
  let allProducts: ShopifyProduct[] = []
  let hasNextPage = true
  let cursor: string | null = null
  let pageCount = 0
  const maxPages = 100 // Safety limit

  console.log("🛍️ Starting to fetch ALL products from Shopify...")

  while (hasNextPage && pageCount < maxPages) {
    pageCount++

    const query = `
      query getProducts($first: Int!, $after: String) {
        products(first: $first, after: $after) {
          edges {
            node {
              ...ProductFragment
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
      ${PRODUCT_FRAGMENT}
    `

    try {
      const fetchResult: { data: { products: { edges: Array<{ node: ShopifyProduct }>; pageInfo: { hasNextPage: boolean; endCursor: string } } }; errors?: any[] } = await shopifyFetch<{
        products: {
          edges: Array<{ node: ShopifyProduct }>
          pageInfo: {
            hasNextPage: boolean
            endCursor: string
          }
        }
      }>({
        query,
        variables: {
          first: 250, // Maximum allowed by Shopify
          after: cursor,
        },
      })
      const data = fetchResult.data

      const products = data.products.edges.map((edge: { node: ShopifyProduct }) => edge.node)
      allProducts = [...allProducts, ...products]

      hasNextPage = data.products.pageInfo.hasNextPage
      cursor = data.products.pageInfo.endCursor

      console.log(`✅ Page ${pageCount}: ${products.length} products (Total: ${allProducts.length})`)

      if (!hasNextPage) {
        console.log(`🎉 Finished! Total products fetched: ${allProducts.length}`)
      }
    } catch (error) {
      console.error(`❌ Error fetching page ${pageCount}:`, error)
      break
    }
  }

  if (pageCount >= maxPages) {
    console.warn(`⚠️ Reached maximum page limit (${maxPages}). There might be more products.`)
  }

  return allProducts
}

// Get products with limit (for backward compatibility)
export async function getProducts(first = 100): Promise<ShopifyProduct[]> {
  const query = `
    query getProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            ...ProductFragment
          }
        }
      }
    }
    ${PRODUCT_FRAGMENT}
  `

  const { data } = await shopifyFetch<{
    products: {
      edges: Array<{ node: ShopifyProduct }>
    }
  }>({
    query,
    variables: { first },
  })

  return data.products.edges.map((edge: { node: ShopifyProduct }) => edge.node)
}

// Get single product by handle
export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  const query = `
    query getProduct($handle: String!) {
      product(handle: $handle) {
        ...ProductFragment
      }
    }
    ${PRODUCT_FRAGMENT}
  `

  const { data } = await shopifyFetch<{
    product: ShopifyProduct | null
  }>({
    query,
    variables: { handle },
  })

  return data.product
}

// 🔍 ENHANCED SEARCH - Multiple search strategies
export async function searchProducts(searchTerm: string, first = 100): Promise<ShopifyProduct[]> {
  console.log(`🔍 Searching for: "${searchTerm}"`)

  if (!searchTerm || searchTerm.trim().length === 0) {
    console.log("❌ Empty search term")
    return []
  }

  const cleanTerm = searchTerm.trim().toLowerCase()

  // 🚀 Strategy 1: Direct Shopify search with multiple query formats
  const searchQueries = [
    // Exact title match
    `title:*${cleanTerm}*`,
    // Tag search
    `tag:*${cleanTerm}*`,
    // Product type search
    `product_type:*${cleanTerm}*`,
    // Vendor search
    `vendor:*${cleanTerm}*`,
    // Combined search
    `title:*${cleanTerm}* OR tag:*${cleanTerm}* OR product_type:*${cleanTerm}* OR vendor:*${cleanTerm}*`,
    // Partial word search
    cleanTerm
      .split(" ")
      .map((word) => `title:*${word}*`)
      .join(" OR "),
    // Simple search without wildcards
    cleanTerm,
  ]

  let allResults: ShopifyProduct[] = []

  for (const searchQuery of searchQueries) {
    try {
      console.log(`🔍 Trying search query: "${searchQuery}"`)

      const query = `
        query searchProducts($query: String!, $first: Int!) {
          products(first: $first, query: $query) {
            edges {
              node {
                ...ProductFragment
              }
            }
          }
        }
        ${PRODUCT_FRAGMENT}
      `

      const { data } = await shopifyFetch<{
        products: {
          edges: Array<{ node: ShopifyProduct }>
        }
      }>({
        query,
        variables: { query: searchQuery, first },
      })

      const results = data.products.edges.map((edge: { node: ShopifyProduct }) => edge.node)
      console.log(`✅ Found ${results.length} products with query: "${searchQuery}"`)

      if (results.length > 0) {
        // Add unique results
        results.forEach((product) => {
          if (!allResults.find((p) => p.id === product.id)) {
            allResults.push(product)
          }
        })
      }

      // If we found results with this query, we can break early
      if (results.length > 0) {
        break
      }
    } catch (error) {
      console.error(`❌ Search query failed: "${searchQuery}"`, error)
      continue
    }
  }

  // 🚀 Strategy 2: If no results, try client-side filtering on all products
  if (allResults.length === 0) {
    console.log("🔍 No direct search results, trying client-side filtering...")

    try {
      const allProducts = await getAllProducts()
      console.log(`📦 Got ${allProducts.length} total products for client-side search`)

      allResults = allProducts.filter((product) => {
        const searchableText = [
          product.title,
          product.description,
          product.vendor,
          product.productType,
          ...product.tags,
        ]
          .join(" ")
          .toLowerCase()

        // Check if search term matches any part of the searchable text
        const words = cleanTerm.split(" ")
        return words.some((word) => searchableText.includes(word))
      })

      console.log(`✅ Client-side filtering found ${allResults.length} products`)
    } catch (error) {
      console.error("❌ Client-side search failed:", error)
    }
  }

  console.log(`🎉 Total search results: ${allResults.length}`)
  return allResults
}

// Cart functions
export async function createCart(): Promise<string> {
  const query = `
    mutation cartCreate {
      cartCreate {
        cart {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const { data } = await shopifyFetch<{
    cartCreate: {
      cart: { id: string }
      userErrors: Array<{ field: string; message: string }>
    }
  }>({ query })

  if (data.cartCreate.userErrors.length > 0) {
    throw new Error(data.cartCreate.userErrors.map((e) => e.message).join(", "))
  }

  return data.cartCreate.cart.id
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const query = `
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        ...CartFragment
      }
    }
    ${CART_FRAGMENT}
  `

  try {
    const { data } = await shopifyFetch<{
      cart: ShopifyCart | null
    }>({
      query,
      variables: { cartId },
    })

    return data.cart
  } catch (error) {
    console.error("Error fetching cart:", error)
    // If getCart fails (e.g. cart ID no longer valid), it's better to return null
    // so initializeCart can create a new one.
    return null
  }
}

export async function addToCart(cartId: string, variantId: string, quantity: number): Promise<ShopifyCart> {
  const query = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFragment
        }
        userErrors {
          field
          message
        }
      }
    }
    ${CART_FRAGMENT}
  `

  const { data } = await shopifyFetch<{
    cartLinesAdd: {
      cart: ShopifyCart
      userErrors: Array<{ field: string; message: string }>
    }
  }>({
    query,
    variables: {
      cartId,
      lines: [
        {
          merchandiseId: variantId,
          quantity,
        },
      ],
    },
  })

  if (data.cartLinesAdd.userErrors.length > 0) {
    throw new Error(data.cartLinesAdd.userErrors.map((e) => e.message).join(", "))
  }

  return data.cartLinesAdd.cart
}

export async function removeFromCart(cartId: string, lineId: string): Promise<ShopifyCart> {
  const query = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          ...CartFragment
        }
        userErrors {
          field
          message
        }
      }
    }
    ${CART_FRAGMENT}
  `

  const { data } = await shopifyFetch<{
    cartLinesRemove: {
      cart: ShopifyCart
      userErrors: Array<{ field: string; message: string }>
    }
  }>({
    query,
    variables: {
      cartId,
      lineIds: [lineId],
    },
  })

  if (data.cartLinesRemove.userErrors.length > 0) {
    throw new Error(data.cartLinesRemove.userErrors.map((e) => e.message).join(", "))
  }

  return data.cartLinesRemove.cart
}

export async function updateCartLine(cartId: string, lineId: string, quantity: number): Promise<ShopifyCart> {
  const query = `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFragment
        }
        userErrors {
          field
          message
        }
      }
    }
    ${CART_FRAGMENT}
  `

  const { data } = await shopifyFetch<{
    cartLinesUpdate: {
      cart: ShopifyCart
      userErrors: Array<{ field: string; message: string }>
    }
  }>({
    query,
    variables: {
      cartId,
      lines: [
        {
          id: lineId,
          quantity,
        },
      ],
    },
  })

  if (data.cartLinesUpdate.userErrors.length > 0) {
    throw new Error(data.cartLinesUpdate.userErrors.map((e) => e.message).join(", "))
  }

  return data.cartLinesUpdate.cart
}
