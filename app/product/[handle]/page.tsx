import { getProduct } from "@/lib/shopify";
import { generateSEOMetadata } from "@/components/seo/seo-head";
import ProductPageClient from "./product-page-client";

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = await getProduct(handle);

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
    image: mainImage?.url || "/og-product.jpg",
    url: `/product/${product.handle}`,
    type: "product",
    price: currentVariant?.price.amount,
    currency: currentVariant?.price.currencyCode || "EUR",
    brand: "Cocúfum",
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  return <ProductPageClient handle={handle} />;
}
