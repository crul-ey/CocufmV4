import Script from "next/script";

interface Product {
  id: string;
  title: string;
  description: string;
  handle: string;
  images: { edges: Array<{ node: { url: string; altText?: string } }> };
  variants: {
    edges: Array<{ node: { price: { amount: string; currencyCode: string } } }>;
  };
  tags: string[];
  vendor?: string;
}

interface StructuredDataProps {
  type: "website" | "product" | "organization" | "breadcrumb";
  data?: any;
  product?: Product;
}

export default function StructuredData({
  type,
  data,
  product,
}: StructuredDataProps) {
  const getStructuredData = () => {
    const baseUrl = "https://cocufum.com";

    switch (type) {
      case "website":
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Cocúfum",
          description:
            "Premium lifestyle en zomerproducten van de hoogste kwaliteit",
          url: baseUrl,
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${baseUrl}/search?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
          publisher: {
            "@type": "Organization",
            name: "Cocúfum",
            url: baseUrl,
            logo: `${baseUrl}/logo.png`,
            sameAs: [
              "https://instagram.com/cocufum",
              "https://facebook.com/cocufum",
              "https://tiktok.com/@cocufum",
            ],
          },
        };

      case "organization":
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Cocúfum",
          description: "Premium lifestyle en zomerproducten specialist",
          url: baseUrl,
          logo: `${baseUrl}/logo.png`,
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+31-20-123-4567",
            contactType: "customer service",
            availableLanguage: "Dutch",
            areaServed: "NL",
          },
          address: {
            "@type": "PostalAddress",
            addressCountry: "NL",
            addressLocality: "Amsterdam",
          },
          sameAs: [
            "https://instagram.com/cocufum",
            "https://facebook.com/cocufum",
            "https://tiktok.com/@cocufum",
          ],
        };

      case "product":
        if (!product) return null;

        const currentVariant = product.variants.edges[0]?.node;
        const mainImage = product.images.edges[0]?.node;

        return {
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.title,
          description: product.description,
          image: mainImage?.url ? [mainImage.url] : [],
          url: `${baseUrl}/product/${product.handle}`,
          sku: product.id,
          brand: {
            "@type": "Brand",
            name: product.vendor || "Cocúfum",
          },
          category: product.tags.join(", "),
          offers: {
            "@type": "Offer",
            price: currentVariant?.price.amount,
            priceCurrency: currentVariant?.price.currencyCode || "EUR",
            availability: "https://schema.org/InStock",
            seller: {
              "@type": "Organization",
              name: "Cocúfum",
            },
            shippingDetails: {
              "@type": "OfferShippingDetails",
              shippingRate: {
                "@type": "MonetaryAmount",
                value: "7.90",
                currency: "EUR",
              },
              deliveryTime: {
                "@type": "ShippingDeliveryTime",
                businessDays: {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                  ],
                },
                cutoffTime: "15:00",
                handlingTime: {
                  "@type": "QuantitativeValue",
                  minValue: 1,
                  maxValue: 2,
                  unitCode: "DAY",
                },
                transitTime: {
                  "@type": "QuantitativeValue",
                  minValue: 1,
                  maxValue: 3,
                  unitCode: "DAY",
                },
              },
            },
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            reviewCount: "24",
            bestRating: "5",
            worstRating: "1",
          },
        };

      case "breadcrumb":
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement:
            data?.map((item: any, index: number) => ({
              "@type": "ListItem",
              position: index + 1,
              name: item.name,
              item: `${baseUrl}${item.href}`,
            })) || [],
        };

      default:
        return null;
    }
  };

  const structuredData = getStructuredData();

  if (!structuredData) return null;

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
