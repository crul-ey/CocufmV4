import type { Metadata } from "next";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "product" | "article";
  price?: string;
  currency?: string;
  availability?: "in stock" | "out of stock";
  brand?: string;
}

export function generateSEOMetadata({
  title = "Cocúfum - Premium Lifestyle & Zomerproducten",
  description = "Ontdek onze luxe collectie van strandhanddoeken, lifestyle producten en zomer essentials. Premium kwaliteit voor jouw perfecte zomer.",
  keywords = "strandhanddoeken, zomerproducten, lifestyle, premium kwaliteit, strand accessoires",
  image = "/og-image.jpg",
  url = "https://cocufum.com",
  type = "website",
  price,
  currency = "EUR",
  availability = "in stock",
  brand = "Cocúfum",
}: SEOProps): Metadata {
  const baseUrl = "https://cocufum.com";
  const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;
  const fullImageUrl = image.startsWith("http") ? image : `${baseUrl}${image}`;

  return {
    title,
    description,
    keywords,
    authors: [{ name: "Cocúfum" }],
    creator: "Cocúfum",
    publisher: "Cocúfum",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      type: "website",
      locale: "nl_NL",
      url: fullUrl,
      title,
      description,
      siteName: "Cocúfum",
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === "product" &&
        price && {
          // @ts-ignore - OpenGraph product properties
          "product:price:amount": price,
          "product:price:currency": currency,
          "product:availability": availability,
          "product:brand": brand,
        }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [fullImageUrl],
      creator: "@cocufum",
      site: "@cocufum",
    },
    other: {
      ...(price !== undefined ? { price } : {}),
      priceCurrency: currency,
      availability: availability,
      brand: brand,
    },
  };
}
