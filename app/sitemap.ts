// app/sitemap.xml/route.ts
import type { MetadataRoute } from "next"
import { getProductsByTag } from "@/lib/shopify"

// Helper: universele fallback als 'getProducts' niet (meer) bestaat
async function getProducts(first = 250) {
  // Lege tag betekent: geen filter, dus ALLE producten
  return getProductsByTag("", first);
}

// Helper om geldige ISO-datum te krijgen
function getValidIsoDate(dateInput: string | Date | null | undefined): string {
  try {
    let dateToProcess: Date;
    if (dateInput instanceof Date) {
      dateToProcess = dateInput;
    } else if (typeof dateInput === 'string' && dateInput) {
      dateToProcess = new Date(dateInput);
    } else {
      dateToProcess = new Date();
    }
    if (isNaN(dateToProcess.getTime())) {
      console.warn(`Sitemap generation: Invalid date found, falling back to current time for input: ${dateInput}`);
      return new Date().toISOString();
    }
    return dateToProcess.toISOString();
  } catch (e) {
    console.error(`Sitemap generation: Error processing date input "${dateInput}", falling back to current time. Error: ${e}`);
    return new Date().toISOString();
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://cocufum.com";

  // Haal alle producten op, ongeacht tag
  const products = await getProducts(250);

  const staticPages = [
    {
      url: baseUrl,
      lastModified: getValidIsoDate(new Date()),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: getValidIsoDate(new Date()),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cadeaus`,
      lastModified: getValidIsoDate(new Date()),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: getValidIsoDate(new Date()),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: getValidIsoDate(new Date()),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
    // Voeg evt. andere statische pagina's toe
  ];

  const productPages = products.map((product) => ({
    url: `${baseUrl}/product/${product.handle}`,
    lastModified: getValidIsoDate(product.updatedAt || product.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const allTags = [...new Set(products.flatMap((product) => product.tags))];
  const categoryPages = allTags.slice(0, 20).map((tag: string) => ({
    url: `${baseUrl}/shop?category=${encodeURIComponent(tag.toLowerCase())}`,
    lastModified: getValidIsoDate(new Date()),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...productPages, ...categoryPages];
}
