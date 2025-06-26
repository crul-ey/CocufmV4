import { notFound } from "next/navigation";
import { getProduct, getProductRecommendations } from "@/lib/shopify";
import { generateSEOMetadata } from "@/components/seo/seo-head";
import ProductPageClient from "./product-page-client";
import EnhancedProductCard from "@/components/product-card";

// Revalidate deze pagina elke 60 minuten (1 uur) voor ISR
export const revalidate = 3600;

interface ProductPageProps {
  params: Promise<{ handle: string }>; // Async params in Next.js 15
}

export async function generateMetadata({ params }: ProductPageProps) {
  const resolvedParams = await params; // Await params eerst
  const product = await getProduct(resolvedParams.handle);

  if (!product) {
    return generateSEOMetadata({
      title: "Product niet gevonden",
      description: "Het opgevraagde product kon niet worden gevonden.",
    });
  }

  const currentVariant = product.variants.edges[0]?.node;
  const mainImage = product.images.edges[0]?.node;

  return generateSEOMetadata({
    title: `${product.title} - Premium Kwaliteit`,
    description:
      product.description ||
      `Ontdek ${
        product.title
      } - Premium kwaliteit lifestyle product van Cocúfum. ${product.tags
        .slice(0, 3)
        .join(", ")}.`,
    keywords: `${product.title}, ${product.tags.join(
      ", "
    )}, premium kwaliteit, cocufum`,
    image: mainImage?.url || "/placeholder.svg?width=1200&height=630",
    url: `/product/${product.handle}`,
    type: "product",
    price: currentVariant?.price.amount,
    currency: currentVariant?.price.currencyCode || "EUR",
    brand: product.vendor || "Cocúfum",
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params; // Await params eerst
  const product = await getProduct(resolvedParams.handle);

  if (!product) {
    notFound();
  }

  // Haal ook aanbevolen producten op
  const recommendedProducts = await getProductRecommendations(product.id);

  return (
    <div className="bg-white dark:bg-stone-950 min-h-screen">
      <ProductPageClient product={product} />

      {recommendedProducts && recommendedProducts.length > 0 && (
        <section
          aria-labelledby="related-products-heading"
          className="py-16 lg:py-24 bg-stone-50 dark:bg-stone-900"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              id="related-products-heading"
              className="text-3xl font-bold tracking-tight text-center text-stone-900 dark:text-white mb-12"
            >
              Misschien vind je dit ook leuk
            </h2>
            <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 xl:gap-x-8">
              {recommendedProducts.slice(0, 4).map((recommendedProduct) => (
                <EnhancedProductCard
                  key={recommendedProduct.id}
                  product={recommendedProduct}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
