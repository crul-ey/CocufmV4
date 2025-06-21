"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { useToast } from "@/hooks/use-toast";
import type { ShopifyProduct } from "@/lib/shopify";

interface EnhancedProductCardProps {
  product: ShopifyProduct;
  priority?: boolean;
}

export default function EnhancedProductCard({
  product,
  priority = false,
}: EnhancedProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  const formatPrice = (amount: string, currencyCode: string) => {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: currencyCode,
    }).format(Number.parseFloat(amount));
  };

  const mainImage = product.images.edges[0]?.node;
  const secondaryImage = product.images.edges[1]?.node;
  const currentVariant = product.variants.edges[0]?.node;

  // Check if product is in wishlist
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentVariant?.availableForSale) return;

    try {
      await addItem(currentVariant.id, 1);
      toast({
        title: "Toegevoegd aan winkelwagen! 🛒",
        description: `${product.title} is toegevoegd aan je winkelwagen.`,
        variant: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Fout",
        description: "Er ging iets mis bij het toevoegen aan de winkelwagen.",
        variant: "destructive",
      });
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      // Create wishlist item from product data
      const wishlistItem = {
        id: product.id,
        handle: product.handle,
        title: product.title,
        price: {
          amount: currentVariant?.price.amount || "0",
          currencyCode: currentVariant?.price.currencyCode || "EUR",
        },
        image: mainImage
          ? {
              url: mainImage.url,
              altText: mainImage.altText || product.title,
            }
          : undefined,
      };

      addToWishlist(wishlistItem);
    }
  };

  return (
    <Link href={`/product/${product.handle}`} className="group block">
      <div
        className="card card-hover relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="aspect-[4/5] relative bg-stone-50 dark:bg-stone-800 overflow-hidden rounded-t-3xl">
          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 loading-shimmer rounded-t-3xl" />
          )}

          {/* Main Image */}
          {mainImage && (
            <Image
              src={mainImage.url || "/placeholder.svg"}
              alt={mainImage.altText || product.title}
              fill
              className={`object-cover transition-all duration-700 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              } ${isHovered && secondaryImage ? "opacity-0" : "opacity-100"}`}
              onLoad={() => setImageLoaded(true)}
              priority={priority}
            />
          )}

          {/* Secondary Image (Hover Effect) */}
          {secondaryImage && (
            <Image
              src={secondaryImage.url || "/placeholder.svg"}
              alt={secondaryImage.altText || product.title}
              fill
              className={`object-cover transition-all duration-700 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.tags.includes("nieuw") && (
              <Badge className="badge-success px-3 py-1 text-xs font-medium">
                Nieuw
              </Badge>
            )}
            {product.tags.includes("eco") && (
              <Badge className="badge-info px-3 py-1 text-xs font-medium">
                Eco
              </Badge>
            )}
            {product.tags.includes("limited") && (
              <Badge className="badge-error px-3 py-1 text-xs font-medium">
                Limited
              </Badge>
            )}
            {product.tags.includes("sale") && (
              <Badge className="badge-warning px-3 py-1 text-xs font-medium">
                Sale
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div
            className={`absolute top-4 right-4 flex flex-col gap-2 transition-all duration-300 ${
              isHovered
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-4"
            }`}
          >
            {/* Wishlist Button */}
            <Button
              variant="secondary"
              size="sm"
              onClick={handleWishlist}
              className={`w-10 h-10 rounded-full p-0 shadow-lg border-0 transition-all duration-300 ${
                isWishlisted
                  ? "bg-red-500 hover:bg-red-600 text-white scale-110"
                  : "bg-white/95 hover:bg-white text-stone-700 hover:text-red-500"
              }`}
            >
              <Heart
                className={`w-4 h-4 transition-all duration-300 ${
                  isWishlisted ? "fill-white scale-110" : ""
                }`}
              />
            </Button>

            {/* Quick View Button */}
            <Button
              variant="secondary"
              size="sm"
              className="w-10 h-10 rounded-full p-0 bg-white/95 hover:bg-white text-stone-700 hover:text-blue-500 shadow-lg border-0"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>

          {/* Quick Add to Cart */}
          <div
            className={`absolute bottom-4 left-4 right-4 transition-all duration-300 ${
              isHovered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <Button
              onClick={handleAddToCart}
              disabled={!currentVariant?.availableForSale}
              className="w-full btn-summer flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                {currentVariant?.availableForSale ? "Toevoegen" : "Uitverkocht"}
              </span>
            </Button>
          </div>

          {/* Out of Stock Overlay */}
          {!currentVariant?.availableForSale && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-3xl">
              <Badge className="badge-error px-4 py-2 text-sm font-medium">
                Uitverkocht
              </Badge>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-6">
          {/* Rating */}
          <div className="flex items-center space-x-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 fill-yellow-400 text-yellow-400"
              />
            ))}
            <span className="text-sm text-stone-500 dark:text-stone-400 ml-2">
              (24)
            </span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
            {product.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-stone-600 dark:text-stone-400 mb-4 line-clamp-2">
            {product.description}
          </p>

          {/* Price and Availability */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-stone-900 dark:text-stone-100">
                {formatPrice(
                  currentVariant?.price.amount || "0",
                  currentVariant?.price.currencyCode || "EUR"
                )}
              </span>
            </div>

            <div className="text-right flex items-center gap-2">
              {currentVariant?.availableForSale ? (
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  Op voorraad
                </span>
              ) : (
                <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                  Uitverkocht
                </span>
              )}

              {/* Wishlist indicator */}
              {isWishlisted && (
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
