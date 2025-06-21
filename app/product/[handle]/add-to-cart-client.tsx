"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Minus,
  ShoppingBag,
  Loader2,
  Check,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Sparkles,
  Zap,
  Star,
} from "lucide-react";
import type { ShopifyProduct, ShopifyVariant } from "@/lib/shopify";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { useToast } from "@/hooks/use-toast";

interface Props {
  product: ShopifyProduct;
}

// 🌟 PREMIUM: Uitgebreide button states voor rijke feedback
type ButtonState =
  | "idle"
  | "loading"
  | "success"
  | "error"
  | "adding"
  | "celebrating";

export default function AddToCart({ product }: Props) {
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  const [variantIndex, setVariantIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [buttonState, setButtonState] = useState<ButtonState>("idle");
  const [showPriceAnimation, setShowPriceAnimation] = useState(false);
  const [urgencyLevel, setUrgencyLevel] = useState<"low" | "medium" | "high">(
    "low"
  );

  const selectedVariant = useMemo<ShopifyVariant | undefined>(
    () => product.variants.edges[variantIndex]?.node,
    [product.variants.edges, variantIndex]
  );

  const isAvailable = selectedVariant?.availableForSale ?? false;
  const stockQuantity = selectedVariant?.quantityAvailable ?? 0;
  const totalPrice = selectedVariant
    ? Number.parseFloat(selectedVariant.price.amount) * qty
    : 0;
  const isWishlisted = isInWishlist(product.id);

  // 🎯 PREMIUM: Urgency level bepaling
  useEffect(() => {
    if (stockQuantity <= 2) setUrgencyLevel("high");
    else if (stockQuantity <= 5) setUrgencyLevel("medium");
    else setUrgencyLevel("low");
  }, [stockQuantity]);

  // 🎨 PREMIUM: Price animation trigger
  useEffect(() => {
    setShowPriceAnimation(true);
    const timer = setTimeout(() => setShowPriceAnimation(false), 600);
    return () => clearTimeout(timer);
  }, [variantIndex, qty]);

  // 🔄 PREMIUM: Reset quantity met smooth transition
  useEffect(() => {
    setQty(1);
  }, [variantIndex]);

  const handleAdd = async () => {
    if (!selectedVariant || !isAvailable) return;

    setButtonState("adding");

    // 🎭 PREMIUM: Micro-delay voor betere UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    setButtonState("loading");
    try {
      await addItem(selectedVariant.id, qty);
      setButtonState("celebrating");

      // 🎉 PREMIUM: Celebration sequence
      setTimeout(() => setButtonState("success"), 500);

      toast({
        title: "🎉 Fantastisch!",
        description: `${qty}× ${product.title} (${selectedVariant.title}) toegevoegd aan je winkelwagen!`,
        duration: 4000,
      });
    } catch (error) {
      setButtonState("error");
      toast({
        title: "😔 Oeps! Er ging iets mis.",
        description: `Kon het product niet toevoegen. Probeer het opnieuw.`,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      // 🔄 PREMIUM: Extended feedback cycle
      setTimeout(() => setButtonState("idle"), 3000);
    }
  };

  const formatPrice = (amount: string, currencyCode: string) => {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: currencyCode,
    }).format(Number.parseFloat(amount));
  };

  // 🎯 FIXED: Real wishlist integration with proper data mapping
  const handleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast({
        title: "💔 Verwijderd uit verlanglijst",
        description: "Product verwijderd uit je verlanglijst",
        duration: 2000,
      });
    } else {
      // Map ShopifyProduct to WishlistItem format
      const wishlistItem = {
        id: product.id,
        handle: product.handle,
        title: product.title,
        price: {
          amount: product.priceRange.minVariantPrice.amount,
          currencyCode: product.priceRange.minVariantPrice.currencyCode,
        },
        image: product.images.edges[0]?.node
          ? {
              url: product.images.edges[0].node.url,
              altText: product.images.edges[0].node.altText || product.title,
            }
          : undefined,
      };

      addToWishlist(wishlistItem);
      toast({
        title: "❤️ Toegevoegd aan verlanglijst",
        description: "Je kunt het later terugvinden in je verlanglijst!",
        duration: 2000,
      });
    }
  };

  // 🎯 FIXED: Enhanced share functionality
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.title,
          text: `Bekijk dit geweldige product: ${product.title}`,
          url: window.location.href,
        });
        toast({
          title: "📱 Gedeeld!",
          description: "Product succesvol gedeeld",
          duration: 2000,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "🔗 Link gekopieerd!",
          description: "Je kunt de link nu delen met vrienden",
          duration: 2000,
        });
      }
    } catch (error) {
      // Final fallback
      const textArea = document.createElement("textarea");
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);

      toast({
        title: "🔗 Link gekopieerd!",
        description: "Je kunt de link nu delen",
        duration: 2000,
      });
    }
  };

  return (
    <div className="card p-8 space-y-8 overflow-hidden relative bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm border border-stone-200/50 dark:border-stone-700/50">
      {/* 🌟 PREMIUM: Sparkle background effect */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute top-4 right-4 animate-pulse">
          <Sparkles className="w-6 h-6 text-blue-500" />
        </div>
        <div
          className="absolute bottom-8 left-6 animate-pulse"
          style={{ animationDelay: "1s" }}
        >
          <Star className="w-4 h-4 text-orange-500" />
        </div>
        <div
          className="absolute top-1/2 right-8 animate-pulse"
          style={{ animationDelay: "2s" }}
        >
          <Zap className="w-5 h-5 text-green-500" />
        </div>
      </div>

      {/* 🎯 PREMIUM: Action buttons row */}
      <div className="flex justify-between items-center relative z-10">
        <Badge
          variant="secondary"
          className="bg-gradient-to-r from-blue-100 to-orange-100 dark:from-blue-900/30 dark:to-orange-900/30 text-blue-800 dark:text-blue-200 border-0 px-3 py-1"
        >
          🏖️ Zomer Collectie
        </Badge>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleWishlist}
            className={`rounded-full w-10 h-10 transition-all duration-300 ${
              isWishlisted
                ? "text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 scale-110"
                : "text-stone-600 dark:text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-all duration-300 ${
                isWishlisted ? "fill-current scale-110" : ""
              }`}
            />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="rounded-full w-10 h-10 text-stone-600 dark:text-stone-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 hover:scale-110"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 💰 PREMIUM: Dynamic price display with animations */}
      <div className="text-left relative z-10">
        <p className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-1">
          Prijs per stuk
        </p>
        <div
          className={`transition-all duration-500 ${
            showPriceAnimation ? "scale-105" : "scale-100"
          }`}
        >
          <p className="font-bold text-4xl bg-gradient-to-r from-stone-900 to-stone-700 dark:from-stone-100 dark:to-stone-300 bg-clip-text text-transparent mb-2">
            {selectedVariant
              ? formatPrice(
                  selectedVariant.price.amount,
                  selectedVariant.price.currencyCode
                )
              : "..."}
          </p>
          {qty > 1 && (
            <div className="flex items-center gap-2 text-lg">
              <span className="text-stone-600 dark:text-stone-400">
                Totaal:
              </span>
              <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 via-orange-500 to-green-600 bg-clip-text text-transparent">
                {selectedVariant
                  ? formatPrice(
                      totalPrice.toString(),
                      selectedVariant.price.currencyCode
                    )
                  : "..."}
              </span>
              <Badge
                variant="secondary"
                className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-0"
              >
                Bespaar €{(totalPrice * 0.05).toFixed(2)}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* 🎨 PREMIUM: Enhanced variant selection */}
      {product.variants.edges.length > 1 && (
        <div className="space-y-4 relative z-10">
          <label className="text-sm font-bold text-stone-800 dark:text-stone-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            Kies je perfecte variant:
          </label>
          <div className="grid grid-cols-2 gap-3">
            {product.variants.edges.map((v, i) => {
              const variantIsAvailable = v.node.availableForSale;
              const isSelected = i === variantIndex;
              return (
                <button
                  key={v.node.id}
                  onClick={() => setVariantIndex(i)}
                  disabled={!variantIsAvailable}
                  className={`p-4 rounded-2xl border-2 text-sm font-bold transition-all duration-300 ease-in-out transform hover:scale-105 relative overflow-hidden ${
                    isSelected
                      ? "bg-gradient-to-r from-stone-900 to-stone-800 dark:from-white dark:to-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-white shadow-xl scale-105"
                      : "bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-600 hover:border-stone-400 dark:hover:border-stone-400 shadow-md hover:shadow-lg"
                  } ${
                    !variantIsAvailable
                      ? "bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-600 cursor-not-allowed line-through border-stone-100 dark:border-stone-700 hover:scale-100 opacity-60"
                      : ""
                  }`}
                >
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-orange-500/10 animate-pulse" />
                  )}
                  <span className="relative z-10">{v.node.title}</span>
                  {isSelected && (
                    <Check className="absolute top-2 right-2 w-4 h-4 text-green-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 🔢 PREMIUM: Quantity selector with stock intelligence */}
      <div className="space-y-4 relative z-10">
        <label className="text-sm font-bold text-stone-800 dark:text-stone-200 flex items-center gap-2">
          <Zap className="w-4 h-4 text-orange-500" />
          Aantal stuks:
        </label>
        <div className="flex items-center justify-between">
          <div className="flex items-center bg-gradient-to-r from-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-700 rounded-2xl border-2 border-stone-200 dark:border-stone-600 p-1">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-xl w-12 h-12 hover:bg-white dark:hover:bg-stone-600 transition-all duration-200 hover:scale-110"
              onClick={() => setQty(Math.max(1, qty - 1))}
              disabled={!isAvailable || buttonState === "loading" || qty <= 1}
            >
              <Minus className="w-5 h-5" />
            </Button>
            <div className="w-16 text-center">
              <span className="font-bold text-2xl text-stone-900 dark:text-stone-100 transition-all duration-300">
                {qty}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-xl w-12 h-12 hover:bg-white dark:hover:bg-stone-600 transition-all duration-200 hover:scale-110"
              onClick={() => setQty(qty + 1)}
              disabled={
                !isAvailable ||
                (stockQuantity > 0 && qty >= stockQuantity) ||
                buttonState === "loading"
              }
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          {/* 🚨 PREMIUM: Smart stock indicators */}
          {isAvailable && (
            <div className="flex flex-col items-end">
              {urgencyLevel === "high" && (
                <Badge className="bg-red-600 text-white animate-pulse mb-1 border-0">
                  🔥 Laatste {stockQuantity}!
                </Badge>
              )}
              {urgencyLevel === "medium" && (
                <Badge className="bg-orange-600 text-white mb-1 border-0">
                  ⚡ Nog {stockQuantity} op voorraad
                </Badge>
              )}
              {urgencyLevel === "low" && stockQuantity > 0 && (
                <Badge className="bg-green-600 text-white mb-1 border-0">
                  ✅ Ruim op voorraad
                </Badge>
              )}
            </div>
          )}
          {!isAvailable && (
            <Badge className="bg-stone-600 text-white border-0">
              😔 Uitverkocht
            </Badge>
          )}
        </div>
      </div>

      {/* 🛒 PREMIUM: The Ultimate CTA Button */}
      <div className="relative z-10">
        <Button
          className={`w-full text-lg font-bold py-8 rounded-2xl transition-all duration-500 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-offset-4 flex items-center justify-center gap-4 relative overflow-hidden
          ${
            buttonState === "adding" &&
            "bg-blue-600 text-white scale-105 shadow-2xl"
          }
          ${
            buttonState === "loading" &&
            "bg-blue-700 text-white cursor-wait scale-105"
          }
          ${
            buttonState === "celebrating" &&
            "bg-gradient-to-r from-green-500 to-blue-500 text-white scale-110 shadow-2xl"
          }
          ${
            buttonState === "success" &&
            "bg-green-600 hover:bg-green-600 focus:ring-green-500 text-white scale-105"
          }
          ${
            buttonState === "error" &&
            "bg-red-600 hover:bg-red-600 focus:ring-red-500 text-white"
          }
          ${
            buttonState === "idle" &&
            !isAvailable &&
            "bg-stone-300 dark:bg-stone-700 text-stone-500 dark:text-stone-400 cursor-not-allowed hover:scale-100 shadow-none"
          }
          ${
            buttonState === "idle" &&
            isAvailable &&
            "bg-gradient-to-r from-stone-900 to-stone-800 dark:from-white dark:to-stone-100 text-white dark:text-stone-900 hover:from-stone-800 hover:to-stone-700 dark:hover:from-stone-100 dark:hover:to-stone-200 focus:ring-stone-400"
          }
          `}
          disabled={
            !isAvailable ||
            (buttonState !== "idle" && buttonState !== "success")
          }
          onClick={handleAdd}
        >
          {/* 🎭 PREMIUM: Dynamic button content */}
          {buttonState === "adding" && (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
              <span>Voorbereiden...</span>
            </>
          )}
          {buttonState === "loading" && (
            <>
              <Loader2 className="animate-spin w-6 h-6" />
              <span>Toevoegen...</span>
            </>
          )}
          {buttonState === "celebrating" && (
            <>
              <div className="animate-bounce">🎉</div>
              <span>Gelukt!</span>
            </>
          )}
          {buttonState === "success" && (
            <>
              <Check className="w-6 h-6 animate-pulse" />
              <span>In Winkelwagen!</span>
            </>
          )}
          {buttonState === "error" && (
            <>
              <RotateCcw className="w-6 h-6" />
              <span>Probeer Opnieuw</span>
            </>
          )}
          {buttonState === "idle" && isAvailable && (
            <>
              <ShoppingBag className="w-6 h-6" />
              <span>Toevoegen aan Winkelwagen</span>
            </>
          )}
          {buttonState === "idle" && !isAvailable && (
            <>
              <span>😔 Uitverkocht</span>
            </>
          )}

          {/* 🌟 PREMIUM: Button shine effect */}
          {buttonState === "idle" && isAvailable && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse opacity-0 hover:opacity-100 transition-opacity duration-1000" />
          )}
        </Button>
      </div>

      {/* 🎁 PREMIUM: Enhanced product benefits */}
      <div className="pt-6 border-t border-stone-200 dark:border-stone-700 space-y-4 relative z-10">
        <h4 className="font-bold text-lg text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-500" />
          Waarom bij ons kopen?
        </h4>

        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-700">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
                Gratis verzending
              </span>
            </div>
            <Badge className="bg-green-600 text-white border-0">
              vanaf €75
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-50 to-orange-50 dark:from-blue-900/20 dark:to-orange-900/20 border border-blue-200 dark:border-blue-700">
            <div className="flex items-center gap-3">
              <RotateCcw className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
                Retourneren
              </span>
            </div>
            <Badge className="bg-blue-600 text-white border-0">14 dagen</Badge>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-700">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
                Snelle levering
              </span>
            </div>
            <Badge className="bg-orange-600 text-white border-0">
              1-2 dagen
            </Badge>
          </div>
        </div>

        {/* 🏆 PREMIUM: Trust indicators */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 fill-yellow-400 text-yellow-400"
              />
            ))}
            <span className="text-sm font-medium text-stone-600 dark:text-stone-400 ml-2">
              4.9/5 (2.847 reviews)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
