"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Plus,
  Minus,
  ShoppingBag,
  Gift,
  Truck,
  Shield,
  Sparkles,
  Heart,
  ArrowRight,
  Package,
  Clock,
  X,
  Info,
} from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import {
  shippingCalculator,
  formatPrice,
  getSupplierColor,
} from "@/lib/shipping-calculator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type CartState = "idle" | "updating" | "success" | "error";

export default function EnhancedCartDrawer() {
  const { cart, isOpen, closeCart, removeItem, updateQuantity, isLoading } =
    useCart();
  const { toast } = useToast();
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const [cartState, setCartState] = useState<CartState>("idle");
  const [celebrationMode, setCelebrationMode] = useState(false);
  const [showShippingDetails, setShowShippingDetails] = useState(false);

  const handleQuantityUpdate = async (lineId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(lineId, "Product");
      return;
    }

    setUpdatingItems((prev) => new Set(prev).add(lineId));
    setCartState("updating");

    try {
      await updateQuantity(lineId, newQuantity);
      setCartState("success");
      setCelebrationMode(true);

      toast({
        title: "🎉 Perfect bijgewerkt!",
        description: "Je winkelwagen is succesvol aangepast.",
        variant: "success",
        duration: 2000,
      });

      setTimeout(() => {
        setCelebrationMode(false);
        setCartState("idle");
      }, 1500);
    } catch (error) {
      setCartState("error");
      toast({
        title: "❌ Oeps! Er ging iets mis",
        description: "Probeer het nog een keer. Onze excuses!",
        variant: "destructive",
        duration: 3000,
      });
      setTimeout(() => setCartState("idle"), 2000);
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(lineId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (lineId: string, productTitle: string) => {
    const confirmed = window.confirm(
      `${productTitle} uit winkelwagen verwijderen?`
    );
    if (!confirmed) return;

    setRemovingItems((prev) => new Set(prev).add(lineId));
    try {
      await removeItem(lineId);
      toast({
        title: "🗑️ Product verwijderd",
        description: `${productTitle} is uit je winkelwagen gehaald.`,
        variant: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "❌ Verwijderen mislukt",
        description: "Er ging iets mis. Probeer het opnieuw.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setRemovingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(lineId);
        return newSet;
      });
    }
  };

  const cartItems = cart?.lines.edges || [];
  const shippingInfo = shippingCalculator.calculateShippingCosts(cartItems);
  const finalTotal = shippingInfo.totalSubtotal + shippingInfo.totalShipping;

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-xl bg-gradient-to-br from-white via-stone-50 to-stone-100 dark:from-stone-900 dark:via-stone-800 dark:to-stone-700 flex flex-col p-0 sm:p-0">
        {/* Header */}
        <SheetHeader className="border-b border-stone-200 dark:border-stone-700 pb-4 relative overflow-hidden flex-shrink-0 px-4 sm:px-6 pt-4 sm:pt-6">
          {celebrationMode && (
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-blue-400/20 to-purple-400/20 animate-pulse" />
          )}
          <div className="relative z-10">
            <SheetTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShoppingBag className="w-6 h-6 text-stone-900 dark:text-stone-100" />
                  {cartItems.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs animate-pulse">
                      {shippingInfo.totalItems}
                    </Badge>
                  )}
                </div>
                <div>
                  {/* REMOVED "Premium" */}
                  <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                    Winkelwagen
                  </h2>
                  <p className="text-sm text-stone-600 dark:text-stone-400">
                    {cartItems.length}{" "}
                    {cartItems.length === 1 ? "product" : "producten"}
                  </p>
                </div>
              </div>
              {/* Optional: Remove Sparkles if "Premium" feel is completely gone */}
              {/* <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" /> */}
            </SheetTitle>

            {/* Shipping Progress - visible on all screens, but simplified */}
            {cartItems.length > 0 && (
              <div className="mt-4 space-y-3">
                {shippingInfo.supplierCosts.map((supplierInfo) => (
                  <div
                    key={supplierInfo.supplier.id}
                    className={`p-3 rounded-xl border ${
                      supplierInfo.hasFreeShipping
                        ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700"
                        : "bg-gradient-to-r from-blue-50 to-orange-50 dark:from-blue-900/20 dark:to-orange-900/20 border-blue-200 dark:border-blue-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1 sm:mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {supplierInfo.supplier.icon}
                        </span>
                        <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
                          {supplierInfo.supplier.name}
                        </span>
                        <Badge
                          className={`${getSupplierColor(
                            supplierInfo.supplier.color
                          )} text-xs px-1.5 py-0.5`}
                        >
                          {supplierInfo.itemCount} items
                        </Badge>
                      </div>
                      <div className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        {supplierInfo.hasFreeShipping ? (
                          <span className="text-green-600">GRATIS! 🎉</span>
                        ) : (
                          formatPrice(supplierInfo.shippingCost)
                        )}
                      </div>
                    </div>

                    {!supplierInfo.hasFreeShipping && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
                          <span>
                            Nog {formatPrice(supplierInfo.amountToFreeShipping)}{" "}
                            voor gratis
                          </span>
                          <span>
                            {Math.round(
                              (supplierInfo.subtotal /
                                supplierInfo.supplier.shippingRule
                                  .freeShippingThreshold) *
                                100
                            )}
                            %
                          </span>
                        </div>
                        <Progress
                          value={
                            (supplierInfo.subtotal /
                              supplierInfo.supplier.shippingRule
                                .freeShippingThreshold) *
                            100
                          }
                          className="h-1.5"
                        />
                      </div>
                    )}
                  </div>
                ))}

                <div className="p-3 bg-gradient-to-r from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-700 rounded-xl border border-stone-300 dark:border-stone-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-stone-600 dark:text-stone-400" />
                      <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
                        Totale verzendkosten
                      </span>
                    </div>
                    <span className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      {shippingInfo.hasFreeShipping ? (
                        <span className="text-green-600">GRATIS! 🎉</span>
                      ) : (
                        formatPrice(shippingInfo.totalShipping)
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-6">
            <div className="relative mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-stone-200 to-stone-300 dark:from-stone-700 dark:to-stone-600 rounded-full flex items-center justify-center animate-float">
                <ShoppingBag className="w-12 h-12 text-stone-400 dark:text-stone-500" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-3">
              Je winkelwagen wacht op jou! ✨
            </h3>
            <p className="text-stone-600 dark:text-stone-400 mb-8 max-w-sm leading-relaxed">
              Ontdek onze collectie van zorgvuldig geselecteerde lifestyle
              producten.
            </p>
            <Button
              onClick={closeCart}
              className="w-full max-w-xs btn-summer text-lg py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Ontdek Collectie
            </Button>
            <div className="flex items-center justify-center gap-6 text-xs text-stone-500 dark:text-stone-400 pt-6">
              <div className="flex items-center gap-1">
                {" "}
                <Shield className="w-3 h-3" /> <span>Veilig</span>{" "}
              </div>
              <div className="flex items-center gap-1">
                {" "}
                <Truck className="w-3 h-3" /> <span>Gratis verzending</span>{" "}
              </div>
              <div className="flex items-center gap-1">
                {" "}
                <Heart className="w-3 h-3" /> <span>Kwaliteit</span>{" "}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-3 sm:space-y-4 px-2 sm:px-4">
              {" "}
              {/* Reduced padding on mobile */}
              {/* Items - Supplier grouping header is hidden on mobile */}
              {shippingInfo.supplierCosts.map((supplierInfo) => (
                <div
                  key={supplierInfo.supplier.id}
                  className="space-y-2 sm:space-y-3"
                >
                  {/* Supplier Header - HIDDEN ON MOBILE, SHOWN ON SM+ */}
                  <div className="hidden sm:flex items-center gap-2 px-2">
                    <span className="text-lg">
                      {supplierInfo.supplier.icon}
                    </span>
                    <span className="text-sm font-bold text-stone-700 dark:text-stone-300">
                      {supplierInfo.supplier.name}
                    </span>
                    <Badge
                      className={`${getSupplierColor(
                        supplierInfo.supplier.color
                      )} text-xs px-1.5 py-0.5`}
                    >
                      {supplierInfo.itemCount} items
                    </Badge>
                    <div className="flex-1" />
                    <span className="text-xs text-stone-500 dark:text-stone-400">
                      {supplierInfo.supplier.shippingRule.description}
                    </span>
                  </div>

                  {supplierInfo.items.map(({ node: item }) => {
                    const isUpdating = updatingItems.has(item.id);
                    const isRemoving = removingItems.has(item.id);
                    const linePrice = item.merchandise?.price;
                    const lineTotalAmount = linePrice
                      ? (
                          Number.parseFloat(linePrice.amount) * item.quantity
                        ).toString()
                      : "0";

                    return (
                      <div
                        key={item.id}
                        className={`p-3 sm:p-4 bg-white dark:bg-stone-800 rounded-xl sm:rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm transition-all duration-300 ${
                          /* Adjusted padding and rounding for mobile */
                          isUpdating
                            ? "ring-2 ring-blue-400 bg-blue-50 dark:bg-blue-900/20"
                            : ""
                        } ${
                          celebrationMode
                            ? "animate-pulse bg-green-50 dark:bg-green-900/20"
                            : ""
                        } ${isRemoving ? "opacity-50 scale-95" : ""}`}
                      >
                        <div className="flex items-start justify-between mb-2 sm:mb-3">
                          <div className="flex gap-2 sm:gap-3 flex-1 min-w-0">
                            <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-700 dark:to-stone-600 rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0">
                              {" "}
                              {/* Adjusted size/rounding */}
                              {item.merchandise.product.images.edges[0] ? (
                                <Image
                                  src={
                                    item.merchandise.product.images.edges[0]
                                      .node.url || "/placeholder.svg"
                                  }
                                  alt={item.merchandise.product.title}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 640px) 56px, 64px"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-6 h-6 text-stone-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold sm:font-bold text-stone-900 dark:text-stone-100 text-sm leading-tight mb-0.5 sm:mb-1 truncate">
                                {" "}
                                {/* Adjusted font weight */}
                                {item.merchandise.product.title}
                              </h4>
                              {item.merchandise.title !== "Default Title" && (
                                <p className="text-xs text-stone-600 dark:text-stone-400 truncate">
                                  {item.merchandise.title}
                                </p>
                              )}
                              <div className="font-semibold sm:font-bold text-stone-900 dark:text-stone-100 text-sm mt-1">
                                {linePrice
                                  ? formatPrice(
                                      Number.parseFloat(lineTotalAmount)
                                    )
                                  : "€0,00"}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              handleRemoveItem(
                                item.id,
                                item.merchandise.product.title
                              )
                            }
                            disabled={isLoading || isRemoving}
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors flex items-center justify-center flex-shrink-0 ml-2 p-0" // Adjusted size
                            style={{
                              minWidth: "36px",
                              minHeight: "36px",
                              WebkitTapHighlightColor: "transparent",
                            }} // Adjusted min size
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center bg-stone-100 dark:bg-stone-700 rounded-full p-0.5 sm:p-1">
                            {" "}
                            {/* Adjusted padding */}
                            <button
                              onClick={() =>
                                handleQuantityUpdate(item.id, item.quantity - 1)
                              }
                              disabled={
                                isUpdating || isLoading || item.quantity <= 1
                              }
                              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-white dark:hover:bg-stone-600 transition-colors flex items-center justify-center" // Adjusted size
                              style={{
                                minWidth: "36px",
                                minHeight: "36px",
                                WebkitTapHighlightColor: "transparent",
                              }} // Adjusted min size
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <div className="w-10 sm:w-12 text-center">
                              {isUpdating ? (
                                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                              ) : (
                                <span className="font-semibold sm:font-bold text-stone-900 dark:text-stone-100">
                                  {item.quantity}
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() =>
                                handleQuantityUpdate(item.id, item.quantity + 1)
                              }
                              disabled={isUpdating || isLoading}
                              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-white dark:hover:bg-stone-600 transition-colors flex items-center justify-center" // Adjusted size
                              style={{
                                minWidth: "36px",
                                minHeight: "36px",
                                WebkitTapHighlightColor: "transparent",
                              }} // Adjusted min size
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          {item.quantity > 1 && linePrice && (
                            <div className="text-xs text-stone-500 dark:text-stone-400">
                              {formatPrice(Number.parseFloat(linePrice.amount))}{" "}
                              p.s.
                            </div>
                          )}
                        </div>
                        {(isUpdating || isRemoving) && (
                          <div className="absolute inset-0 bg-white/80 dark:bg-stone-800/80 rounded-xl sm:rounded-2xl flex items-center justify-center">
                            <div className="flex items-center gap-2 text-blue-600">
                              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                              <span className="text-sm font-medium">
                                {isRemoving ? "Verwijderen..." : "Bijwerken..."}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="border-t border-stone-200 dark:border-stone-700 pt-4 space-y-3 sm:space-y-4 bg-gradient-to-r from-stone-50 to-white dark:from-stone-800 dark:to-stone-900 px-4 sm:px-6 pb-4 sm:pb-6 flex-shrink-0">
              <div className="space-y-2">
                <div className="flex justify-between text-stone-600 dark:text-stone-400 text-sm">
                  <span>Subtotaal ({shippingInfo.totalItems} items)</span>
                  <span>{formatPrice(shippingInfo.totalSubtotal)}</span>
                </div>
                <Collapsible
                  open={showShippingDetails}
                  onOpenChange={setShowShippingDetails}
                >
                  <CollapsibleTrigger asChild>
                    <button className="flex items-center justify-between w-full text-stone-600 dark:text-stone-400 text-sm hover:text-stone-800 dark:hover:text-stone-200 transition-colors py-1">
                      <span>
                        Verzending ({shippingInfo.supplierCosts.length}{" "}
                        leveranciers)
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className={
                            shippingInfo.hasFreeShipping
                              ? "text-green-600 font-medium"
                              : ""
                          }
                        >
                          {shippingInfo.hasFreeShipping
                            ? "GRATIS! 🎉"
                            : formatPrice(shippingInfo.totalShipping)}
                        </span>
                        <Info className="w-4 h-4" />
                      </div>
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1.5 sm:space-y-2 mt-1 sm:mt-2">
                    {shippingInfo.supplierCosts.map((supplierInfo) => (
                      <div
                        key={supplierInfo.supplier.id}
                        className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 pl-2 sm:pl-4"
                      >
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <span>{supplierInfo.supplier.icon}</span>
                          <span className="truncate max-w-[120px] sm:max-w-none">
                            {supplierInfo.supplier.name}
                          </span>
                          <Badge
                            className={`${getSupplierColor(
                              supplierInfo.supplier.color
                            )} text-xs px-1 py-0`}
                          >
                            {supplierInfo.itemCount}
                          </Badge>
                        </div>
                        <span>
                          {supplierInfo.hasFreeShipping
                            ? "Gratis"
                            : formatPrice(supplierInfo.shippingCost)}
                        </span>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
                <div className="border-t border-stone-200 dark:border-stone-700 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-stone-900 dark:text-stone-100">
                      Totaal
                    </span>
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 py-2 sm:py-3 border-y border-stone-200 dark:border-stone-700">
                <div className="text-center">
                  {" "}
                  <Shield className="w-4 h-4 text-green-500 mx-auto mb-0.5 sm:mb-1" />{" "}
                  <div className="text-xs text-stone-600 dark:text-stone-400">
                    Veilig betalen
                  </div>{" "}
                </div>
                <div className="text-center">
                  {" "}
                  <Clock className="w-4 h-4 text-blue-500 mx-auto mb-0.5 sm:mb-1" />{" "}
                  <div className="text-xs text-stone-600 dark:text-stone-400">
                    Snelle levering
                  </div>{" "}
                </div>
                <div className="text-center">
                  {" "}
                  <Gift className="w-4 h-4 text-purple-500 mx-auto mb-0.5 sm:mb-1" />{" "}
                  <div className="text-xs text-stone-600 dark:text-stone-400">
                    Gratis retour
                  </div>{" "}
                </div>
              </div>
              <div className="space-y-2">
                <Button
                  onClick={() => {
                    if (cart?.checkoutUrl) {
                      window.open(cart.checkoutUrl, "_blank");
                      toast({
                        title: "🚀 Naar checkout!",
                        description:
                          "Je wordt doorgestuurd naar onze veilige checkout.",
                        variant: "success",
                        duration: 2000,
                      });
                    }
                  }}
                  disabled={!cart?.checkoutUrl || isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white text-base py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 touch-manipulation"
                >
                  <span>Veilig Afrekenen</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={closeCart}
                  className="w-full btn-secondary py-2.5 sm:py-3 rounded-xl font-medium touch-manipulation"
                >
                  Verder winkelen
                </Button>
              </div>
              <div className="text-center pt-1">
                <div className="inline-flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-3 py-1.5 rounded-full">
                  <Shield className="w-3 h-3 text-green-500" />
                  <span>256-bit SSL • Shopify Secure</span>
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
