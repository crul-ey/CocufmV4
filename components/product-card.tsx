// EnhancedProductCard.tsx
"use client";

import type React from "react";
import { useState, useCallback } from "react"; // useCallback toegevoegd
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart, CartInitializationError, CartModificationError } from "@/contexts/cart-context"; // Importeer de custom error classes
import { useWishlist } from "@/contexts/wishlist-context";
import { useToast } from "@/hooks/use-toast";
import type { ShopifyProduct } from "@/lib/shopify"; // Zorg ervoor dat ShopifyProduct goed is gedefinieerd

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
  const { addItem } = useCart(); // Hier wordt addItem opgehaald
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  const formatPrice = useCallback((amount: string, currencyCode: string) => {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: currencyCode,
    }).format(Number.parseFloat(amount));
  }, []); // useCallback toegevoegd

  const mainImage = product.images.edges[0]?.node;
  // Gebruik een fallback voor secondaryImage om fouten te voorkomen als het ontbreekt
  const secondaryImage = product.images.edges[1]?.node || mainImage; 
  
  // Zorg ervoor dat currentVariant altijd de eerste variant is zoals bedoeld
  // De probleemvariant (wijnstopper) heeft maar 1 variant, dus dit zou goed moeten zijn.
  const currentVariant = product.variants.edges[0]?.node;

  // Check if product is in wishlist
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Extra log voor alle relevante info direct voordat we proberen toe te voegen
    console.log("🛒📦 Attempting Add to Cart for Product:", {
      productId: product.id,
      productTitle: product.title,
      productHandle: product.handle,
      variantId: currentVariant?.id,
      variantAvailableForSale: currentVariant?.availableForSale,
      variantPrice: currentVariant?.price,
      productTags: product.tags,
      // Voeg hier evt. meer product/variant details toe die nuttig zijn voor debuggen
    });

    if (!currentVariant) {
      console.error("❌ Geen variant object gevonden voor product:", product.title);
      toast({
        title: "Fout",
        description: "Productvariant details ontbreken. Kan niet toevoegen.",
        variant: "destructive",
      });
      return;
    }

    if (!currentVariant.availableForSale) {
      console.log(`❌ Product ${product.title} (Variant ID: ${currentVariant.id}) is niet beschikbaar voor verkoop.`);
      toast({
        title: "Niet beschikbaar",
        description: "Dit product is momenteel niet beschikbaar.",
        variant: "destructive",
      });
      return;
    }

    if (!currentVariant.id) {
      console.error("❌ Geen variant ID gevonden voor product:", product.title, currentVariant);
      toast({
        title: "Fout",
        description: "Product variant ID niet gevonden. Kan niet toevoegen.",
        variant: "destructive",
      });
      return;
    }

    try {
      // DEZE LOG IS CRUCIAAL VOOR JOUW DEBUGGING:
      // Deze logt de variant ID direct voordat deze naar de useCart hook wordt gestuurd.
      // Als deze log verschijnt in je browserconsole (op een pc), dan weten we dat de ID wordt doorgegeven.
      // Als deze NIET verschijnt, ligt het probleem *voor* deze aanroep.
      console.log("🧪 selectedVariant.id (doorgegeven aan addItem):", currentVariant.id);
      
      await addItem(currentVariant.id, 1);
      toast({
        title: "Toegevoegd aan winkelwagen! 🛒",
        description: `${product.title} is toegevoegd aan je winkelwagen.`,
        variant: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("❌ Fout bij toevoegen aan winkelwagen in EnhancedProductCard:", error);

      let errorMessage = "Er ging iets mis bij het toevoegen aan de winkelwagen.";
      if (error instanceof CartInitializationError) {
        errorMessage = "Winkelwagen kon niet geïnitialiseerd worden. Probeer later opnieuw.";
        // Voor meer specifieke debug, log hier de details van de error.message
        console.error("CartInitializationError details:", error.message);
      } else if (error instanceof CartModificationError) {
        // Shopify specifieke fouten (uit lib/shopify.ts) komen hier door
        errorMessage = `Fout: ${error.message}`;
        console.error("CartModificationError details:", error.message);
      } else if (error instanceof Error) {
        errorMessage = `Fout: ${error.message}`;
      }

      toast({
        title: "Fout",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [product, currentVariant, addItem, toast]); // Afhankelijkheden voor useCallback

  const handleWishlist = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast({
        title: "Verwijderd uit verlanglijst",
        description: `${product.title} is verwijderd uit je verlanglijst.`,
        variant: "default",
        duration: 2000,
      });
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
      toast({
        title: "Toegevoegd aan verlanglijst ❤️",
        description: `${product.title} is toegevoegd aan je verlanglijst.`,
        variant: "success",
        duration: 2000,
      });
    }
  }, [product, isWishlisted, removeFromWishlist, addToWishlist, currentVariant, mainImage, toast]); // Afhankelijkheden voor useCallback

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
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Optimalisatie voor Next/Image
            />
          )}

          {/* Secondary Image (Hover Effect) */}
          {secondaryImage && secondaryImage !== mainImage && ( // Zorg ervoor dat de secondary image echt anders is
            <Image
              src={secondaryImage.url || "/placeholder.svg"}
              alt={secondaryImage.altText || product.title}
              fill
              className={`object-cover transition-all duration-700 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Optimalisatie voor Next/Image
            />
          )}

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10"> {/* Z-index toegevoegd */}
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
            {/* Shopify collectie toevoegen als badge? (optioneel) */}
            {product.vendor && (
              <Badge className="badge-default px-3 py-1 text-xs font-medium">
                {product.vendor}
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div
            className={`absolute top-4 right-4 flex flex-col gap-2 transition-all duration-300 z-10 ${ // Z-index toegevoegd
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

            {/* Quick View Button (dit is nu een placeholder, voeg functionaliteit toe indien gewenst) */}
            <Button
              variant="secondary"
              size="sm"
              className="w-10 h-10 rounded-full p-0 bg-white/95 hover:bg-white text-stone-700 hover:text-blue-500 shadow-lg border-0"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); /* Voeg hier quick view functionaliteit toe */ }}
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>

          {/* Quick Add to Cart */}
          <div
            className={`absolute bottom-4 left-4 right-4 transition-all duration-300 z-10 ${ // Z-index toegevoegd
              isHovered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <Button
              onClick={handleAddToCart}
              // Disabled status gecontroleerd op basis van beschikbaarheid van de variant
              disabled={!currentVariant?.availableForSale || !currentVariant?.id} 
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
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-3xl z-20"> {/* Z-index toegevoegd */}
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
              (24) {/* Dit is een hardcoded waarde, overweeg dit dynamisch te maken */}
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
