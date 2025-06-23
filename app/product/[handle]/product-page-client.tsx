"use client";

import Image from "next/image";
import { notFound } from "next/navigation";
import { Star, ChevronLeft, ChevronRight, X } from "lucide-react";
import { getProduct } from "@/lib/shopify";
import EnhancedHeader from "@/components/header";
import EnhancedCartDrawer from "@/components/cart-drawer";
import AddToCart from "./add-to-cart-client";
import StructuredData from "@/components/seo/structured-data";
import { useState, useEffect } from "react";

export const dynamic = "force-dynamic";

interface ProductPageClientProps {
  handle: string;
}

export default function ProductPageClient({ handle }: ProductPageClientProps) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const fetchedProduct = await getProduct(handle);
        setProduct(fetchedProduct);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [handle]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const currentVariant = product.variants?.edges?.[0]?.node;
  const images = product.images?.edges || [];

  const formatPrice = (amount: string, currencyCode: string) =>
    new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: currencyCode,
    }).format(+amount);

  // Breadcrumb data for structured data
  const breadcrumbData = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: product.title, href: `/product/${product.handle}` },
  ];

  return (
    <>
      {/* SEO Structured Data */}
      <StructuredData type="product" product={product} />
      <StructuredData type="breadcrumb" data={breadcrumbData} />

      <EnhancedHeader />
      <EnhancedCartDrawer />

      {/* 🎯 FIXED: Proper spacing to avoid navbar overlap */}
      <main className="pt-24 lg:pt-32 pb-8 lg:pb-12 min-h-screen bg-gradient-to-br from-stone-50 to-white dark:from-stone-950 dark:to-stone-900">
        {/* Breadcrumb Navigation */}
        <div className="container">
          <nav
            className="flex items-center space-x-2 text-sm text-stone-600 dark:text-stone-400 mb-6"
            aria-label="Breadcrumb"
          >
            <a
              href="/"
              className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors duration-200"
            >
              Home
            </a>
            <span>/</span>
            <a
              href="/shop"
              className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors duration-200"
            >
              Shop
            </a>
            <span>/</span>
            <span
              className="text-stone-900 dark:text-stone-100 font-medium"
              aria-current="page"
            >
              {product.title}
            </span>
          </nav>
        </div>

        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Interactive Image Gallery */}
          <div className="space-y-4">
            {/* Main Image Display */}
            <div className="aspect-square relative bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-900 rounded-3xl overflow-hidden shadow-xl group">
              {images[selectedImageIndex] && (
                <>
                  <Image
                    src={
                      images[selectedImageIndex].node.url || "/placeholder.svg"
                    }
                    alt={
                      images[selectedImageIndex].node.altText ?? product.title
                    }
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700 cursor-zoom-in"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    onClick={() => setIsImageModalOpen(true)}
                  />
                  {/* Gradient overlay for luxury effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

                  {/* Navigation Arrows for Main Image */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setSelectedImageIndex((prev) =>
                            prev > 0 ? prev - 1 : images.length - 1
                          )
                        }
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 dark:bg-black/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white dark:hover:bg-black"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-5 h-5 text-stone-900 dark:text-white" />
                      </button>
                      <button
                        onClick={() =>
                          setSelectedImageIndex((prev) =>
                            prev < images.length - 1 ? prev + 1 : 0
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 dark:bg-black/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white dark:hover:bg-black"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-5 h-5 text-stone-900 dark:text-white" />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  {images.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {selectedImageIndex + 1} / {images.length}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((image: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square relative bg-stone-100 dark:bg-stone-800 rounded-2xl overflow-hidden transition-all duration-300 ${
                      selectedImageIndex === index
                        ? "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-stone-900"
                        : "hover:ring-2 hover:ring-stone-300 dark:hover:ring-stone-600 hover:ring-offset-2 dark:hover:ring-offset-stone-900"
                    }`}
                  >
                    <Image
                      src={image.node.url || "/placeholder.svg"}
                      alt={
                        image.node.altText ?? `${product.title} ${index + 1}`
                      }
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 25vw, 12vw"
                    />
                    {selectedImageIndex === index && (
                      <div className="absolute inset-0 bg-blue-500/20" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Full Screen Image Modal */}
          {isImageModalOpen && (
            <div
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={() => setIsImageModalOpen(false)}
            >
              <div className="relative max-w-4xl max-h-full">
                <button
                  onClick={() => setIsImageModalOpen(false)}
                  className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-8 h-8" />
                </button>

                <div className="relative aspect-square max-h-[80vh]">
                  <Image
                    src={
                      images[selectedImageIndex]?.node.url || "/placeholder.svg"
                    }
                    alt={
                      images[selectedImageIndex]?.node.altText ?? product.title
                    }
                    fill
                    className="object-contain"
                    sizes="80vw"
                  />

                  {/* Modal Navigation */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImageIndex((prev) =>
                            prev > 0 ? prev - 1 : images.length - 1
                          );
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-6 h-6 text-white" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImageIndex((prev) =>
                            prev < images.length - 1 ? prev + 1 : 0
                          );
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-6 h-6 text-white" />
                      </button>
                    </>
                  )}
                </div>

                {/* Modal Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
                  {selectedImageIndex + 1} / {images.length}
                </div>
              </div>
            </div>
          )}

          {/* Product Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="font-serif text-3xl lg:text-5xl font-bold text-stone-900 dark:text-stone-100 leading-tight">
                {product.title}
              </h1>

              <div className="flex items-center space-x-3">
                <div
                  className="flex items-center"
                  role="img"
                  aria-label="5 van 5 sterren"
                >
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
                {currentVariant &&
                  formatPrice(
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
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.slice(0, 5).map((tag: string) => (
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
                  Vanaf €75
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
