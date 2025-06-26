"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Home,
  Store,
} from "lucide-react";
import type { ShopifyProduct } from "@/lib/shopify";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import AddToCartClientSide from "./add-to-cart-client";

interface ProductPageClientProps {
  product: ShopifyProduct;
}

export default function ProductPageClient({ product }: ProductPageClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants.edges.find((v) => v.node.availableForSale)?.node ||
      product.variants.edges[0]?.node
  );

  const images = product.images.edges.map((edge) => edge.node);
  const currentImage = images[selectedImageIndex];

  const formatPrice = (amount: string, currencyCode: string) => {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: currencyCode,
    }).format(Number.parseFloat(amount));
  };

  const handleVariantChange = (variantId: string) => {
    const newVariant = product.variants.edges.find(
      (edge) => edge.node.id === variantId
    )?.node;
    if (newVariant) {
      setSelectedVariant(newVariant);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-stone-950">
      {/* Breadcrumb Navigation */}
      <div className="bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/" className="flex items-center gap-1">
                      <Home className="w-4 h-4" />
                      Home
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/shop" className="flex items-center gap-1">
                      <Store className="w-4 h-4" />
                      Shop
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-medium truncate max-w-[200px]">
                    {product.title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <Button variant="outline" size="sm" asChild>
              <Link href="/shop" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Terug naar Shop
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Product Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images - Beperkte hoogte */}
          <div className="space-y-4">
            <div className="relative aspect-square max-h-[500px] bg-stone-100 dark:bg-stone-800 rounded-2xl overflow-hidden">
              {currentImage ? (
                <Image
                  src={currentImage.url || "/placeholder.svg"}
                  alt={currentImage.altText || product.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-400">
                  Geen afbeelding beschikbaar
                </div>
              )}

              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={() =>
                      setSelectedImageIndex((prev) =>
                        prev === 0 ? images.length - 1 : prev - 1
                      )
                    }
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={() =>
                      setSelectedImageIndex((prev) =>
                        prev === images.length - 1 ? 0 : prev + 1
                      )
                    }
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                      index === selectedImageIndex
                        ? "border-blue-500"
                        : "border-stone-200 dark:border-stone-700 hover:border-stone-300"
                    }`}
                  >
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt={image.altText || `${product.title} ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-4">
                {product.title}
              </h1>

              {selectedVariant && (
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl font-bold text-stone-900 dark:text-stone-100">
                    {formatPrice(
                      selectedVariant.price.amount,
                      selectedVariant.price.currencyCode
                    )}
                  </span>
                  {selectedVariant.compareAtPrice && (
                    <span className="text-xl text-stone-500 line-through">
                      {formatPrice(
                        selectedVariant.compareAtPrice.amount,
                        selectedVariant.compareAtPrice.currencyCode
                      )}
                    </span>
                  )}
                </div>
              )}

              {product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.tags.slice(0, 5).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Product Description */}
            {product.description && (
              <div className="prose prose-stone dark:prose-invert max-w-none">
                <div
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            )}

            {/* Add to Cart Component */}
            <AddToCartClientSide
              product={product}
              selectedVariantProp={selectedVariant}
              onVariantChangeAction={handleVariantChange}
            />

            {/* Product Details */}
            <div className="border-t border-stone-200 dark:border-stone-800 pt-6">
              <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
                Productdetails
              </h3>
              <div className="space-y-2 text-sm text-stone-600 dark:text-stone-400">
                {product.vendor && (
                  <div className="flex justify-between">
                    <span>Merk:</span>
                    <span className="font-medium">{product.vendor}</span>
                  </div>
                )}
                {/* SKU is not available on ShopifyProductVariantNode, so this section is removed */}
                <div className="flex justify-between">
                  <span>Beschikbaarheid:</span>
                  <span
                    className={`font-medium ${
                      selectedVariant?.availableForSale
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {selectedVariant?.availableForSale
                      ? "Op voorraad"
                      : "Uitverkocht"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
