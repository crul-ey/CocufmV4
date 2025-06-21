"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShoppingBag,
  Trash2,
  Sparkles,
  Star,
  Gift,
  ArrowRight,
  Package,
  Clock,
  CheckCircle,
  Plus,
} from "lucide-react";
import { useWishlist } from "@/contexts/wishlist-context";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";

type WishlistState = "idle" | "moving" | "success" | "error";

export default function PremiumWishlistDrawer() {
  const { items, isOpen, closeWishlist, removeFromWishlist, clearWishlist } =
    useWishlist();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [movingToCart, setMovingToCart] = useState<Set<string>>(new Set());
  const [wishlistState, setWishlistState] = useState<WishlistState>("idle");
  const [celebrationMode, setCelebrationMode] = useState(false);

  const formatPrice = (amount: string, currencyCode: string) => {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: currencyCode,
    }).format(Number.parseFloat(amount));
  };

  // Calculate total wishlist value
  const totalValue = items.reduce((acc, item) => {
    return acc + Number.parseFloat(item.price.amount);
  }, 0);

  const handleMoveToCart = async (item: any) => {
    setMovingToCart((prev) => new Set(prev).add(item.id));
    setWishlistState("moving");

    try {
      await addItem(item.id, 1);
      removeFromWishlist(item.id);

      setWishlistState("success");
      setCelebrationMode(true);

      toast({
        title: "🎉 Naar winkelwagen verplaatst!",
        description: `${item.title} is toegevoegd aan je winkelwagen.`,
        variant: "success",
        duration: 3000,
      });

      setTimeout(() => {
        setCelebrationMode(false);
        setWishlistState("idle");
      }, 2000);
    } catch (error) {
      setWishlistState("error");
      toast({
        title: "❌ Oeps! Er ging iets mis",
        description: "Probeer het nog een keer. Onze excuses!",
        variant: "destructive",
        duration: 4000,
      });
      setTimeout(() => setWishlistState("idle"), 3000);
    } finally {
      setMovingToCart((prev) => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };

  const handleMoveAllToCart = async () => {
    if (items.length === 0) return;

    setWishlistState("moving");
    let successCount = 0;

    for (const item of items) {
      try {
        await addItem(item.id, 1);
        removeFromWishlist(item.id);
        successCount++;
      } catch (error) {
        console.error(`Failed to move ${item.title} to cart:`, error);
      }
    }

    if (successCount > 0) {
      setWishlistState("success");
      setCelebrationMode(true);
      toast({
        title: "🎉 Alles naar winkelwagen verplaatst!",
        description: `${successCount} item${
          successCount !== 1 ? "s" : ""
        } toegevoegd aan je winkelwagen.`,
        variant: "success",
        duration: 4000,
      });
      setTimeout(() => {
        setCelebrationMode(false);
        setWishlistState("idle");
      }, 2000);
    } else {
      setWishlistState("error");
      toast({
        title: "❌ Er ging iets mis",
        description: "Kon items niet naar winkelwagen verplaatsen.",
        variant: "destructive",
        duration: 4000,
      });
      setTimeout(() => setWishlistState("idle"), 3000);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={closeWishlist}>
      <SheetContent className="w-full sm:max-w-xl bg-gradient-to-br from-white via-red-50/30 to-pink-50/30 dark:from-stone-900 dark:via-red-900/10 dark:to-pink-900/10">
        {/* Premium Header */}
        <SheetHeader className="border-b border-stone-200 dark:border-stone-700 pb-6 relative overflow-hidden">
          {celebrationMode && (
            <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 via-pink-400/20 to-purple-400/20 animate-pulse" />
          )}
          <div className="relative z-10">
            <SheetTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                  {items.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs animate-pulse">
                      {items.length}
                    </Badge>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                    Mijn Wishlist
                  </h2>
                  <p className="text-sm text-stone-600 dark:text-stone-400">
                    {items.length}{" "}
                    {items.length === 1 ? "favoriet" : "favorieten"}
                    {items.length > 0 && (
                      <span className="ml-2 font-medium text-red-600 dark:text-red-400">
                        • {formatPrice(totalValue.toString(), "EUR")} totaal
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-red-500 animate-pulse" />
                {items.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearWishlist}
                    className="text-stone-500 hover:text-red-500 text-sm"
                  >
                    Alles wissen
                  </Button>
                )}
              </div>
            </SheetTitle>

            {/* Bulk Actions */}
            {items.length > 1 && (
              <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl border border-red-200 dark:border-red-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-900 dark:text-red-100">
                      Alles naar winkelwagen verplaatsen?
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleMoveAllToCart}
                    disabled={wishlistState === "moving"}
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white text-xs px-3 py-1.5"
                  >
                    {wishlistState === "moving" ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                        Verplaatsen...
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3 mr-1" />
                        Alles toevoegen
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            /* Empty Wishlist State */
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-6">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center animate-float">
                  <Heart className="w-12 h-12 text-red-400 dark:text-red-500" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-red-400 to-pink-400 rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-3">
                Je wishlist wacht op liefde! 💕
              </h3>
              <p className="text-stone-600 dark:text-stone-400 mb-8 max-w-sm leading-relaxed">
                Bewaar je favoriete producten hier en mis nooit meer een item
                dat je hart sneller doet kloppen.
              </p>

              <div className="space-y-3 w-full max-w-xs">
                <Button
                  onClick={closeWishlist}
                  className="w-full bg-gradient-to-r from-red-500 via-pink-500 to-red-600 hover:from-red-600 hover:via-pink-600 hover:to-red-700 text-white text-lg py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Ontdek Favorieten
                </Button>

                <div className="flex items-center justify-center gap-6 text-xs text-stone-500 dark:text-stone-400 pt-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    <span>Premium kwaliteit</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Gift className="w-3 h-3" />
                    <span>Perfecte cadeaus</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    <span>Met liefde gekozen</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Wishlist Items */}
              <div className="flex-1 overflow-y-auto py-6 space-y-4 px-1">
                {items.map((item, index) => {
                  const isMoving = movingToCart.has(item.id);

                  return (
                    <div
                      key={item.id}
                      className={`group relative p-5 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm hover:shadow-lg transition-all duration-500 ${
                        isMoving
                          ? "ring-2 ring-red-400 bg-red-50 dark:bg-red-900/20"
                          : ""
                      } ${
                        celebrationMode
                          ? "animate-pulse bg-green-50 dark:bg-green-900/20"
                          : ""
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Premium Item Layout */}
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <Link
                          href={`/product/${item.handle}`}
                          className="relative w-20 h-20 bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-700 dark:to-stone-600 rounded-xl overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
                        >
                          {item.image ? (
                            <Image
                              src={item.image.url || "/placeholder.svg"}
                              alt={item.image.altText || item.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-8 h-8 text-stone-400" />
                            </div>
                          )}

                          {/* Wishlist Badge */}
                          <div className="absolute top-1 right-1">
                            <Badge className="bg-gradient-to-r from-red-400 to-pink-400 text-white text-xs px-1.5 py-0.5">
                              <Heart className="w-2.5 h-2.5 mr-1 fill-white" />
                              Favoriet
                            </Badge>
                          </div>
                        </Link>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <Link href={`/product/${item.handle}`}>
                                <h4 className="font-bold text-stone-900 dark:text-stone-100 truncate text-lg hover:text-red-600 dark:hover:text-red-400 transition-colors">
                                  {item.title}
                                </h4>
                              </Link>
                              <p className="text-lg font-bold text-red-600 dark:text-red-400 mt-1">
                                {formatPrice(
                                  item.price.amount,
                                  item.price.currencyCode
                                )}
                              </p>
                            </div>

                            {/* Remove Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromWishlist(item.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
                            Toegevoegd op{" "}
                            {new Date(item.addedAt).toLocaleDateString("nl-NL")}
                          </p>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleMoveToCart(item)}
                              disabled={isMoving}
                              className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white text-sm font-medium"
                            >
                              {isMoving ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                  Toevoegen...
                                </>
                              ) : (
                                <>
                                  <ShoppingBag className="w-4 h-4 mr-2" />
                                  Naar Winkelwagen
                                </>
                              )}
                            </Button>

                            <Link href={`/product/${item.handle}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                              >
                                Bekijken
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Loading Overlay */}
                      {isMoving && (
                        <div className="absolute inset-0 bg-white/80 dark:bg-stone-800/80 rounded-2xl flex items-center justify-center">
                          <div className="flex items-center gap-2 text-red-600">
                            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm font-medium">
                              Verplaatsen...
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Premium Wishlist Footer */}
              <div className="border-t border-stone-200 dark:border-stone-700 pt-6 space-y-4 bg-gradient-to-r from-red-50/50 to-pink-50/50 dark:from-red-900/10 dark:to-pink-900/10 -mx-6 px-6 pb-6">
                {/* Wishlist Summary */}
                <div className="flex items-center justify-between p-4 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
                  <div>
                    <div className="font-semibold text-stone-900 dark:text-stone-100">
                      {items.length} item{items.length !== 1 ? "s" : ""} in
                      wishlist
                    </div>
                    <div className="text-sm text-stone-600 dark:text-stone-400">
                      Totale waarde: {formatPrice(totalValue.toString(), "EUR")}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl">💝</div>
                    <div className="text-xs text-stone-500 dark:text-stone-400">
                      Je favorieten
                    </div>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="grid grid-cols-3 gap-4 py-3">
                  <div className="text-center">
                    <Heart className="w-4 h-4 text-red-500 mx-auto mb-1" />
                    <div className="text-xs text-stone-600 dark:text-stone-400">
                      Met liefde bewaard
                    </div>
                  </div>
                  <div className="text-center">
                    <Clock className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                    <div className="text-xs text-stone-600 dark:text-stone-400">
                      Altijd beschikbaar
                    </div>
                  </div>
                  <div className="text-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mx-auto mb-1" />
                    <div className="text-xs text-stone-600 dark:text-stone-400">
                      Snel bestellen
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    onClick={closeWishlist}
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20 py-3 rounded-xl font-medium"
                  >
                    Verder Winkelen
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                {/* Love Badge */}
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-full">
                    <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                    <span>Bewaard met liefde • Altijd beschikbaar</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
