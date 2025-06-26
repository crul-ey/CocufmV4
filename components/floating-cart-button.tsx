"use client";

import { useState } from "react";
import { ShoppingBag, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/contexts/cart-context";
import { formatPrice } from "@/lib/shipping-calculator";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function FloatingCartButton() {
  const { cart, cartCount, openCart, isOpen } = useCart();
  const [showPreview, setShowPreview] = useState(false);

  // Don't show if cart drawer is already open
  if (isOpen) return null;

  const cartItems = cart?.lines.edges || [];
  const totalAmount = cart?.cost?.totalAmount
    ? Number.parseFloat(cart.cost.totalAmount.amount)
    : 0;

  return (
    <>
      {/* Desktop Preview Card */}
      {showPreview && cartCount > 0 && (
        <Card className="absolute bottom-16 right-0 w-80 z-40 shadow-2xl border-2 border-blue-200 dark:border-blue-800 bg-white/95 dark:bg-stone-900/95 backdrop-blur-sm hidden lg:block">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-stone-900 dark:text-stone-100">
                Winkelwagen ({cartCount})
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(false)}
                className="h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {cartItems.slice(0, 3).map(({ node: item }) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 p-2 bg-stone-50 dark:bg-stone-800 rounded-lg"
                >
                  <div className="w-10 h-10 bg-stone-200 dark:bg-stone-700 rounded-md overflow-hidden flex-shrink-0">
                    {item.merchandise.product.images?.edges?.[0] ? (
                      <Image
                        src={
                          item.merchandise.product.images?.edges?.[0]?.node
                            .url || "/placeholder.svg"
                        }
                        alt={item.merchandise.product.title}
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4 text-stone-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-stone-900 dark:text-stone-100 truncate">
                      {item.merchandise.product.title}
                    </p>
                    <p className="text-xs text-stone-600 dark:text-stone-400">
                      {item.quantity}x{" "}
                      {formatPrice(
                        Number.parseFloat(item.merchandise.price.amount)
                      )}
                    </p>
                  </div>
                </div>
              ))}

              {cartItems.length > 3 && (
                <p className="text-xs text-center text-stone-500 dark:text-stone-400 py-1">
                  +{cartItems.length - 3} meer items...
                </p>
              )}
            </div>

            <div className="border-t border-stone-200 dark:border-stone-700 pt-3 mt-3">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-stone-900 dark:text-stone-100">
                  Totaal:
                </span>
                <span className="font-bold text-blue-600">
                  {formatPrice(totalAmount)}
                </span>
              </div>
              <Button
                onClick={openCart}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                Bekijk Winkelwagen
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Floating Cart Button */}
      <div className="relative">
        <div className="relative">
          {/* Main Cart Button */}
          <Button
            onClick={openCart}
            onMouseEnter={() => setShowPreview(true)}
            onMouseLeave={() => setShowPreview(false)}
            className={cn(
              "w-14 h-14 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95",
              "bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800",
              "text-white border-4 border-white dark:border-stone-800",
              cartCount > 0 ? "animate-pulse" : ""
            )}
            aria-label={`Winkelwagen openen (${cartCount} items)`}
          >
            <ShoppingBag className="w-6 h-6" />
          </Button>

          {/* Cart Count Badge */}
          {cartCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-6 w-6 p-0 flex items-center justify-center bg-red-500 text-white text-xs font-bold border-2 border-white dark:border-stone-800 animate-bounce">
              {cartCount > 99 ? "99+" : cartCount}
            </Badge>
          )}

          {/* Mobile Quick Preview Button */}
          {cartCount > 0 && (
            <Button
              onClick={() => setShowPreview(!showPreview)}
              className="lg:hidden absolute -top-16 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 shadow-lg border-2 border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700"
              size="sm"
              aria-label="Winkelwagen preview"
            >
              <Eye className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Preview Overlay */}
      {showPreview && cartCount > 0 && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-end justify-center p-4">
          <Card className="w-full max-w-sm bg-white dark:bg-stone-900 shadow-2xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-stone-900 dark:text-stone-100">
                  Winkelwagen ({cartCount})
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreview(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto mb-4">
                {cartItems.slice(0, 2).map(({ node: item }) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2 bg-stone-50 dark:bg-stone-800 rounded-lg"
                  >
                    <div className="w-12 h-12 bg-stone-200 dark:bg-stone-700 rounded-md overflow-hidden flex-shrink-0">
                      {item.merchandise.product.images?.edges?.[0] ? (
                        <Image
                          src={
                            item.merchandise.product.images?.edges?.[0]?.node
                              .url || "/placeholder.svg"
                          }
                          alt={item.merchandise.product.title}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-5 h-5 text-stone-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate">
                        {item.merchandise.product.title}
                      </p>
                      <p className="text-sm text-stone-600 dark:text-stone-400">
                        {item.quantity}x{" "}
                        {formatPrice(
                          Number.parseFloat(item.merchandise.price.amount)
                        )}
                      </p>
                    </div>
                  </div>
                ))}

                {cartItems.length > 2 && (
                  <p className="text-sm text-center text-stone-500 dark:text-stone-400 py-2">
                    +{cartItems.length - 2} meer items...
                  </p>
                )}
              </div>

              <div className="border-t border-stone-200 dark:border-stone-700 pt-3">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-stone-900 dark:text-stone-100">
                    Totaal:
                  </span>
                  <span className="font-bold text-blue-600 text-lg">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowPreview(false)}
                    variant="outline"
                    className="flex-1"
                    size="sm"
                  >
                    Sluiten
                  </Button>
                  <Button
                    onClick={() => {
                      setShowPreview(false);
                      openCart();
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    Bekijk Alles
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
