// app/sitemap.xml/route.ts
import type { MetadataRoute } from "next"
import { getProducts } from "@/lib/shopify" // Zorg ervoor dat getProducts correct is geïmporteerd

// Aangepaste functie om een geldige ISO 8601 datumstring te garanderen
// Dit voorkomt 'RangeError: Invalid time value' door een fallback te bieden
function getValidIsoDate(dateInput: string | Date | null | undefined): string {
  try {
    let dateToProcess: Date;

    // Als dateInput al een Date object is, gebruik dat.
    // Anders, probeer het te parsen. Als het null/undefined is, gebruik Date.now().
    if (dateInput instanceof Date) {
      dateToProcess = dateInput;
    } else if (typeof dateInput === 'string' && dateInput) {
      dateToProcess = new Date(dateInput);
    } else {
      dateToProcess = new Date(); // Fallback naar huidige datum/tijd als input ongeldig is
    }

    // Controleer of de geparseerde datum geldig is
    if (isNaN(dateToProcess.getTime())) {
      // Als new Date(dateInput) resulteerde in een ongeldige datum, val terug op nu
      console.warn(`Sitemap generation: Invalid date found, falling back to current time for input: ${dateInput}`);
      return new Date().toISOString();
    }
    
    return dateToProcess.toISOString();
  } catch (e) {
    // Vang ook eventuele onverwachte errors op tijdens het proces
    console.error(`Sitemap generation: Error processing date input "${dateInput}", falling back to current time. Error: ${e}`);
    return new Date().toISOString();
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://cocufum.com"; // Zorg ervoor dat dit je daadwerkelijke productiedomein is

  // Fetch all products for dynamic sitemap
  // Overweeg een hogere limiet als je meer dan 250 producten hebt, of implementeer paginering
  const products = await getProducts(250); 

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: getValidIsoDate(new Date()), // Gebruik de helper
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: getValidIsoDate(new Date()), // Gebruik de helper
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cadeaus`,
      lastModified: getValidIsoDate(new Date()), // Gebruik de helper
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: getValidIsoDate(new Date()), // Gebruik de helper
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: getValidIsoDate(new Date()), // Gebruik de helper
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
    // Overweeg hier ook je privacy-policy, algemene-voorwaarden, cookie-policy toe te voegen
    // Bijvoorbeeld:
    // {
    //   url: `${baseUrl}/algemene-voorwaarden`,
    //   lastModified: getValidIsoDate(new Date()),
    //   changeFrequency: "monthly" as const,
    //   priority: 0.5,
    // },
    // {
    //   url: `${baseUrl}/privacy-policy`,
    //   lastModified: getValidIsoDate(new Date()),
    //   changeFrequency: "monthly" as const,
    //   priority: 0.5,
    // },
    // {
    //   url: `${baseUrl}/cookie-policy`,
    //   lastModified: getValidIsoDate(new Date()),
    //   changeFrequency: "monthly" as const,
    //   priority: 0.5,
    // },
  ];

  // Dynamic product pages
  const productPages = products.map((product) => ({ // product type is al ShopifyProduct, dus geen 'any' nodig
    url: `${baseUrl}/product/${product.handle}`,
    // Gebruik de helper functie om een geldige datum te garanderen
    lastModified: getValidIsoDate(product.updatedAt || product.createdAt), 
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Category pages (based on product tags)
  const allTags = [...new Set(products.flatMap((product) => product.tags))];
  const categoryPages = allTags.slice(0, 20).map((tag: string) => ({
    url: `${baseUrl}/shop?category=${encodeURIComponent(tag.toLowerCase())}`,
    lastModified: getValidIsoDate(new Date()), // Gebruik de helper
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...productPages, ...categoryPages];
}
