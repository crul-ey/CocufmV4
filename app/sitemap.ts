import type { MetadataRoute } from "next"
import { getProducts } from "@/lib/shopify"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://cocufum.com"

  // Fetch all products for dynamic sitemap
  const products = await getProducts(250) // Get more products for complete sitemap

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cadeaus`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
  ]

  // Dynamic product pages
  const productPages = products.map((product: any) => ({
    url: `${baseUrl}/product/${product.handle}`,
    lastModified: new Date(product.updatedAt || product.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  // Category pages (based on product tags)
  const allTags = [...new Set(products.flatMap((product: any) => product.tags))]
  const categoryPages = allTags.slice(0, 20).map((tag: string) => ({
    url: `${baseUrl}/shop?category=${encodeURIComponent(tag.toLowerCase())}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  return [...staticPages, ...productPages, ...categoryPages]
}
