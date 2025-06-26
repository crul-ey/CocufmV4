"use client";

import { useState, useEffect, useTransition } from "react";
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
  CheckCircle,
  XCircle,
  Info,
} from "lucide-react";
import type { ShopifyProduct, ShopifyProductVariantNode } from "@/lib/shopify"; // Gecorrigeerd type
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface AddToCartClientSideProps {
  product: ShopifyProduct;
  selectedVariantProp?: ShopifyProductVariantNode;
  onVariantChangeAction: (variantId: string) => void;
}

type ButtonState =
  | "idle"
  | "loading"
  | "success"
  | "error"
  | "adding"
  | "celebrating";

export default function AddToCartClientSide({
  product,
  selectedVariantProp,
  onVariantChangeAction,
}: AddToCartClientSideProps) {
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [internalSelectedVariant, setInternalSelectedVariant] = useState<
    ShopifyProductVariantNode | undefined
  >(
    selectedVariantProp ||
      product.variants.edges.find((v) => v.node.availableForSale)?.node ||
      product.variants.edges[0]?.node
  );

  const [qty, setQty] = useState(1);
  const [buttonState, setButtonState] = useState<ButtonState>("idle");
  const [urgencyLevel, setUrgencyLevel] = useState<"low" | "medium" | "high">(
    "low"
  );

  useEffect(() => {
    setInternalSelectedVariant(selectedVariantProp);
  }, [selectedVariantProp]);

  const isAvailable = internalSelectedVariant?.availableForSale ?? false;
  const stockQuantity = internalSelectedVariant?.quantityAvailable ?? 0;
  const isWishlisted = isInWishlist(product.id);

  useEffect(() => {
    if (stockQuantity <= 0)
      setUrgencyLevel("low"); // Geen urgency als uitverkocht
    else if (stockQuantity <= 2) setUrgencyLevel("high");
    else if (stockQuantity <= 5) setUrgencyLevel("medium");
    else setUrgencyLevel("low");
  }, [stockQuantity]);

  useEffect(() => {
    setQty(1);
  }, [internalSelectedVariant]);

  const handleLocalVariantSelect = (variantId: string) => {
    const newVariant = product.variants.edges.find(
      (edge) => edge.node.id === variantId
    )?.node;
    if (newVariant) {
      setInternalSelectedVariant(newVariant);
      onVariantChangeAction(variantId);
    }
  };

  const handleAdd = () => {
    if (
      !internalSelectedVariant ||
      !isAvailable ||
      !internalSelectedVariant.id
    ) {
      toast({
        title: "Niet beschikbaar",
        description:
          "Dit product of deze variant is momenteel niet beschikbaar.",
        variant: "destructive",
      });
      setButtonState("error");
      setTimeout(() => setButtonState("idle"), 2000);
      return;
    }

    setButtonState("adding");
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 200)); // Kortere UX delay
      setButtonState("loading");
      try {
        await addItem(internalSelectedVariant.id, qty);
        setButtonState("celebrating");
        setTimeout(() => setButtonState("success"), 400);
        toast({
          title: "🎉 Toegevoegd!",
          description: `${qty}× ${product.title} (${internalSelectedVariant.title}) in winkelwagen.`,
          duration: 3000,
        });
      } catch (error) {
        setButtonState("error");
        toast({
          title: "😔 Oeps!",
          description: `Kon product niet toevoegen. Probeer opnieuw.`,
          variant: "destructive",
          duration: 4000,
        });
      } finally {
        setTimeout(() => setButtonState("idle"), 2500);
      }
    });
  };

  const handleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast({ title: "💔 Verwijderd van verlanglijst", duration: 2000 });
    } else {
      const wishlistItem = {
        id: product.id,
        handle: product.handle,
        title: product.title,
        price: {
          amount:
            internalSelectedVariant?.price.amount ||
            product.priceRange.minVariantPrice.amount,
          currencyCode:
            internalSelectedVariant?.price.currencyCode ||
            product.priceRange.minVariantPrice.currencyCode,
        },
        image:
          internalSelectedVariant?.image || product.images.edges[0]?.node
            ? {
                url: (internalSelectedVariant?.image ||
                  product.images.edges[0]?.node)!.url,
                altText:
                  (internalSelectedVariant?.image ||
                    product.images.edges[0]?.node)!.altText || product.title,
              }
            : undefined,
      };
      addToWishlist(wishlistItem);
      toast({ title: "❤️ Toegevoegd aan verlanglijst", duration: 2000 });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: product.title,
      text: `Bekijk dit geweldige product: ${product.title}`,
      url: window.location.href,
    };
    try {
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare(shareData)
      ) {
        await navigator.share(shareData);
        toast({
          title: "📱 Gedeeld!",
          description: "Product succesvol gedeeld",
          duration: 2000,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "🔗 Link gekopieerd!",
          description: "Je kunt de link nu delen",
          duration: 2000,
        });
      } else {
        throw new Error("Share and clipboard not supported");
      }
    } catch (error) {
      const textArea = document.createElement("textarea");
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        toast({
          title: "🔗 Link gekopieerd!",
          description: "Je kunt de link nu delen",
          duration: 2000,
        });
      } catch (copyError) {
        toast({
          title: "Fout",
          description: "Kon link niet kopiëren of delen.",
          variant: "destructive",
          duration: 3000,
        });
      }
      document.body.removeChild(textArea);
    }
  };

  const getButtonFeedbackContent = () => {
    if (buttonState === "adding" || isPending)
      return (
        <>
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Voorbereiden...
        </>
      );
    if (buttonState === "loading")
      return (
        <>
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Toevoegen...
        </>
      );
    if (buttonState === "celebrating")
      return (
        <>
          <Sparkles className="w-5 h-5 mr-2 text-yellow-300 animate-ping" />{" "}
          Gelukt!
        </>
      );
    if (buttonState === "success")
      return (
        <>
          <CheckCircle className="w-5 h-5 mr-2 text-green-400" /> In
          Winkelwagen!
        </>
      );
    if (buttonState === "error")
      return (
        <>
          <XCircle className="w-5 h-5 mr-2 text-red-400" /> Probeer Opnieuw
        </>
      );
    if (!isAvailable) return <>😔 Uitverkocht</>;
    return (
      <>
        <ShoppingBag className="w-5 h-5 mr-2" /> Toevoegen
      </>
    );
  };

  const renderVariantOptionButtons = (option: any) => {
    // Unieke waarden voor deze specifieke optie, rekening houdend met selecties van andere opties
    // Dit is een complexe logica. Voor nu tonen we alle varianten als knoppen.
    // Een betere UX zou zijn om per optie (Kleur, Maat) knoppen te tonen.
    // De huidige `product-page-client` stuurt al de geselecteerde variant.
    // Deze component kan zich focussen op het tonen van de opties van *die* variant,
    // of knoppen tonen om *andere* varianten te kiezen.

    // Als er maar één optie is (bijv. alleen "Titel"), en meerdere varianten,
    // dan zijn de variant.title knoppen logisch.
    if (
      product.options.length === 1 &&
      product.options[0].name === "Title" &&
      product.variants.edges.length > 1
    ) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {product.variants.edges.map(({ node: v }) => {
            const variantIsAvailable = v.availableForSale;
            const isSelected = internalSelectedVariant?.id === v.id;
            return (
              <button
                key={v.id}
                onClick={() => handleLocalVariantSelect(v.id)}
                disabled={!variantIsAvailable}
                aria-pressed={isSelected}
                title={v.title}
                className={cn(
                  "p-2.5 rounded-md border text-xs font-medium transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 dark:focus:ring-offset-stone-900 truncate",
                  isSelected
                    ? "bg-blue-600 text-white border-blue-700 shadow-md scale-105"
                    : "bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border-stone-300 dark:border-stone-600 hover:border-blue-500 dark:hover:border-blue-400",
                  !variantIsAvailable &&
                    "bg-stone-100 dark:bg-stone-700/50 text-stone-400 dark:text-stone-500 cursor-not-allowed line-through border-stone-200 dark:border-stone-700 hover:scale-100 opacity-70"
                )}
              >
                {v.title}
                {isSelected && (
                  <Check className="absolute top-1 right-1 w-3 h-3 text-white/80" />
                )}
              </button>
            );
          })}
        </div>
      );
    }
    // TODO: Implementeer een meer geavanceerde variant selector als er meerdere opties zijn (Kleur, Maat etc.)
    return null;
  };

  return (
    <div className="p-6 bg-stone-50 dark:bg-stone-800/50 rounded-xl shadow-lg border border-stone-200 dark:border-stone-700/50 space-y-5">
      {product.variants.edges.length > 1 && product.options.length > 0 && (
        <div>
          {product.options.map((option) => (
            <div key={option.id} className="mb-3">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                Kies {option.name.toLowerCase()}:
                {internalSelectedVariant?.selectedOptions.find(
                  (so) => so.name === option.name
                )?.value && (
                  <span className="text-blue-600 dark:text-blue-400 font-bold ml-1">
                    (
                    {
                      internalSelectedVariant?.selectedOptions.find(
                        (so) => so.name === option.name
                      )?.value
                    }
                    )
                  </span>
                )}
              </label>
              {renderVariantOptionButtons(option)}
            </div>
          ))}
          {!internalSelectedVariant && product.variants.edges.length > 0 && (
            <p className="text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
              <Info size={14} /> Selecteer een variant hierboven.
            </p>
          )}
        </div>
      )}

      <div className="space-y-1.5">
        <label
          htmlFor={`quantity-${product.id}`}
          className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5"
        >
          <Zap className="w-3.5 h-3.5 text-orange-500" />
          Aantal:
        </label>
        <div className="flex items-center justify-between">
          <div className="flex items-center bg-white dark:bg-stone-700/60 rounded-lg border border-stone-300 dark:border-stone-600 p-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-md w-9 h-9 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-600"
              onClick={() => setQty(Math.max(1, qty - 1))}
              disabled={
                !isAvailable ||
                buttonState === "loading" ||
                qty <= 1 ||
                isPending
              }
              aria-label="Verminder aantal"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <input
              id={`quantity-${product.id}`}
              type="number"
              value={qty}
              onChange={(e) =>
                setQty(Math.max(1, Number.parseInt(e.target.value, 10) || 1))
              }
              className="w-10 text-center font-semibold text-sm text-stone-900 dark:text-stone-100 bg-transparent border-none focus:ring-0 appearance-none [-moz-appearance:textfield]"
              aria-live="polite"
              disabled={!isAvailable || buttonState === "loading" || isPending}
            />
            <Button
              variant="ghost"
              size="icon"
              className="rounded-md w-9 h-9 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-600"
              onClick={() => setQty(qty + 1)}
              disabled={
                !isAvailable ||
                (stockQuantity > 0 && qty >= stockQuantity) ||
                buttonState === "loading" ||
                isPending
              }
              aria-label="Verhoog aantal"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {isAvailable && stockQuantity > 0 && (
            <div className="text-right">
              {urgencyLevel === "high" && (
                <Badge variant="destructive" className="text-xs animate-pulse">
                  🔥 Laatste {stockQuantity}!
                </Badge>
              )}
              {urgencyLevel === "medium" && (
                <Badge variant="outline" className="text-xs">
                  ⚡ Nog {stockQuantity}
                </Badge>
              )}
              {urgencyLevel === "low" && (
                <Badge variant="default" className="text-xs">
                  ✅ Op voorraad
                </Badge>
              )}
            </div>
          )}
          {!isAvailable && (
            <Badge variant="outline" className="text-xs">
              😔 Uitverkocht
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-2.5">
        <Button
          size="lg"
          className={cn(
            "w-full text-sm font-semibold py-3 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-[1.01] active:scale-[0.99] shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-stone-800 flex items-center justify-center gap-2",
            buttonState === "idle" &&
              isAvailable &&
              "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
            buttonState === "idle" &&
              !isAvailable &&
              "bg-stone-300 dark:bg-stone-600 text-stone-500 dark:text-stone-400 cursor-not-allowed shadow-none",
            (buttonState === "adding" || buttonState === "loading") &&
              "bg-sky-500 text-white cursor-wait",
            buttonState === "celebrating" &&
              "bg-gradient-to-r from-green-500 to-emerald-400 text-white scale-105",
            buttonState === "success" &&
              "bg-green-500 hover:bg-green-600 focus:ring-green-400 text-white",
            buttonState === "error" &&
              "bg-red-500 hover:bg-red-600 focus:ring-red-400 text-white"
          )}
          disabled={
            !isAvailable ||
            buttonState === "adding" ||
            buttonState === "loading" ||
            isPending
          }
          onClick={handleAdd}
        >
          {getButtonFeedbackContent()}
        </Button>
        <div className="flex gap-2.5">
          <Button
            variant="outline"
            size="lg"
            onClick={handleWishlist}
            className="flex-1 py-3 text-xs border-stone-300 dark:border-stone-600 hover:border-red-500 dark:hover:border-red-400 hover:text-red-500 dark:hover:text-red-400 focus:ring-red-400"
            aria-label={
              isWishlisted
                ? "Verwijder van verlanglijst"
                : "Voeg toe aan verlanglijst"
            }
          >
            <Heart
              className={cn(
                "w-4 h-4 mr-1.5 transition-colors",
                isWishlisted && "fill-red-500 text-red-500"
              )}
            />
            {isWishlisted ? "Bewaard" : "Bewaar"}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleShare}
            className="flex-1 py-3 text-xs border-stone-300 dark:border-stone-600 hover:border-sky-500 dark:hover:border-sky-400 hover:text-sky-500 dark:hover:text-sky-400 focus:ring-sky-400"
            aria-label="Deel product"
          >
            <Share2 className="w-4 h-4 mr-1.5" />
            Deel
          </Button>
        </div>
      </div>

      <div className="pt-5 border-t border-stone-200 dark:border-stone-700/50 space-y-3">
        <h4 className="text-xs font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-blue-500" />
          Waarom bij Cocúfum?
        </h4>
        <div className="grid grid-cols-1 gap-2 text-xs">
          {[
            {
              icon: Truck,
              text: "Gratis verzending",
              detail: "vanaf €75",
              color: "green",
            },
            {
              icon: RotateCcw,
              text: "Eenvoudig retourneren",
              detail: "14 dagen",
              color: "blue",
            },
            {
              icon: Zap,
              text: "Snelle levering",
              detail: "1-2 werkdagen",
              color: "orange",
            },
          ].map((item) => (
            <div
              key={item.text}
              className="flex items-center gap-2 p-2 rounded-md bg-white dark:bg-stone-700/50 border border-stone-200 dark:border-stone-600/50"
            >
              <item.icon
                className={`w-4 h-4 text-${item.color}-500 flex-shrink-0`}
              />
              <div>
                <span
                  className={`font-medium text-stone-700 dark:text-stone-300`}
                >
                  {item.text}
                </span>
                <span
                  className={`block text-xs text-stone-500 dark:text-stone-400`}
                >
                  {item.detail}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
