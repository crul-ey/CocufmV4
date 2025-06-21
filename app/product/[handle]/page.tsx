import Image from "next/image";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { getProduct } from "@/lib/shopify";
import EnhancedHeader from "@/components/header";
import EnhancedCartDrawer from "@/components/cart-drawer";
import AddToCart from "./add-to-cart-client";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) {
    notFound();
  }

  const currentVariant = product.variants.edges[0]?.node;
  const images = product.images.edges;

  const formatPrice = (amount: string, currencyCode: string) =>
    new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: currencyCode,
    }).format(+amount);

  return (
    <>
      <EnhancedHeader />
      <EnhancedCartDrawer />

      {/* 🎯 FIXED: Proper spacing to avoid navbar overlap */}
      <main className="pt-24 lg:pt-32 pb-8 lg:pb-12 min-h-screen bg-gradient-to-br from-stone-50 to-white dark:from-stone-950 dark:to-stone-900">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square relative bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-900 rounded-3xl overflow-hidden shadow-xl">
              {images[0] && (
                <Image
                  src={images[0].node.url || "/placeholder.svg"}
                  alt={images[0].node.altText ?? product.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  priority
                />
              )}
              {/* Gradient overlay for luxury effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </div>

            {/* Additional images if available */}
            {images.length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {images.slice(1, 4).map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square relative bg-stone-100 dark:bg-stone-800 rounded-2xl overflow-hidden"
                  >
                    <Image
                      src={image.node.url || "/placeholder.svg"}
                      alt={
                        image.node.altText ?? `${product.title} ${index + 2}`
                      }
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="font-serif text-3xl lg:text-5xl font-bold text-stone-900 dark:text-stone-100 leading-tight">
                {product.title}
              </h1>

              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-stone-600 dark:text-stone-400 text-sm font-medium">
                  (24 reviews)
                </span>
                <span className="text-stone-400 dark:text-stone-500">•</span>
                <span className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
                  In voorraad
                </span>
              </div>

              <p className="text-4xl font-bold text-stone-900 dark:text-stone-100 font-serif">
                {formatPrice(
                  currentVariant.price.amount,
                  currentVariant.price.currencyCode
                )}
              </p>
            </div>

            <div className="prose prose-stone dark:prose-invert max-w-none">
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed text-lg">
                {product.description}
              </p>
            </div>

            {/* Product Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.slice(0, 5).map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Add to Cart Component - Fixed sticky positioning */}
            <div className="sticky top-28 lg:top-36">
              <AddToCart product={product} />
            </div>

            {/* Product Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-stone-200 dark:border-stone-700">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-emerald-600 dark:text-emerald-400 text-xl">
                    🚚
                  </span>
                </div>
                <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                  Gratis Verzending
                </p>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  Vanaf €50
                </p>
              </div>

              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 dark:text-blue-400 text-xl">
                    🔄
                  </span>
                </div>
                <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                  30 Dagen Retour
                </p>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  Geld terug garantie
                </p>
              </div>

              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-600 dark:text-purple-400 text-xl">
                    ⚡
                  </span>
                </div>
                <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                  Snelle Levering
                </p>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  2-3 werkdagen
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
