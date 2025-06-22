"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Plus,
  Minus,
  ShoppingBag,
  Trash2,
  Gift,
  Truck,
  Shield,
  Star,
  Sparkles,
  Heart,
  ArrowRight,
  Package,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"

type Price = {
  amount: string
  currencyCode: string
}

type CartState = "idle" | "updating" | "success" | "error"

export default function PremiumCartDrawer() {
  const { cart, isOpen, closeCart, removeItem, updateQuantity, isLoading } = useCart()
  const { toast } = useToast()
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set())
  const [cartState, setCartState] = useState<CartState>("idle")
  const [celebrationMode, setCelebrationMode] = useState(false)
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<string | null>(null)

  const formatPrice = (amount: string, currencyCode: string) => {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: currencyCode,
    }).format(Number.parseFloat(amount))
  }

  const handleQuantityUpdate = async (lineId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      // If quantity becomes 0, show remove confirmation
      const item = cartItems.find(({ node }) => node.id === lineId)
      if (item) {
        setShowRemoveConfirm(lineId)
      }
      return
    }

    setUpdatingItems((prev) => new Set(prev).add(lineId))
    setCartState("updating")

    try {
      await updateQuantity(lineId, newQuantity)
      setCartState("success")
      setCelebrationMode(true)

      toast({
        title: "🎉 Perfect bijgewerkt!",
        description: "Je winkelwagen is succesvol aangepast.",
        variant: "success",
        duration: 2000,
      })

      setTimeout(() => {
        setCelebrationMode(false)
        setCartState("idle")
      }, 1500)
    } catch (error) {
      setCartState("error")
      toast({
        title: "❌ Oeps! Er ging iets mis",
        description: "Probeer het nog een keer. Onze excuses!",
        variant: "destructive",
        duration: 3000,
      })
      setTimeout(() => setCartState("idle"), 2000)
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(lineId)
        return newSet
      })
    }
  }

  const handleRemoveItem = async (lineId: string, productTitle: string) => {
    setRemovingItems((prev) => new Set(prev).add(lineId))
    setShowRemoveConfirm(null)

    try {
      await removeItem(lineId)
      toast({
        title: "🗑️ Product verwijderd",
        description: `${productTitle} is uit je winkelwagen gehaald.`,
        variant: "success",
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: "❌ Verwijderen mislukt",
        description: "Er ging iets mis. Probeer het opnieuw.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setRemovingItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(lineId)
        return newSet
      })
    }
  }

  const cartItems = cart?.lines.edges || []

  // Calculate totals with enhanced logic
  const totals = cartItems.reduce(
    (acc, { node: item }) => {
      const price = item.merchandise?.price
      if (price) {
        const itemTotal = Number.parseFloat(price.amount) * item.quantity
        acc.subtotal += itemTotal
        acc.items += item.quantity
        if (!acc.currencyCode) {
          acc.currencyCode = price.currencyCode
        }
      }
      return acc
    },
    { subtotal: 0, items: 0, currencyCode: "EUR" },
  )

  // Premium features calculations - UPDATED SHIPPING COSTS
  const freeShippingThreshold = 75
  const progressToFreeShipping = Math.min((totals.subtotal / freeShippingThreshold) * 100, 100)
  const amountToFreeShipping = Math.max(freeShippingThreshold - totals.subtotal, 0)
  const hasFreeShipping = totals.subtotal >= freeShippingThreshold

  // NIEUWE SHIPPING LOGIC - Gebaseerd op je Shopify instellingen
  const calculateShippingCost = () => {
    if (hasFreeShipping || cartItems.length === 0) return 0

    // €7,90 voor eerste product + €1,00 voor elk extra product
    const baseShipping = 7.9
    const additionalItems = Math.max(0, totals.items - 1)
    const additionalShipping = additionalItems * 1.0

    return baseShipping + additionalShipping
  }

  const shippingCost = calculateShippingCost()
  const finalTotal = totals.subtotal + shippingCost

  return (
    <>
      <Sheet open={isOpen} onOpenChange={closeCart}>
        <SheetContent className="w-full sm:max-w-xl bg-gradient-to-br from-white via-stone-50 to-stone-100 dark:from-stone-900 dark:via-stone-800 dark:to-stone-700 flex flex-col">
          {/* Premium Header */}
          <SheetHeader className="border-b border-stone-200 dark:border-stone-700 pb-4 relative overflow-hidden flex-shrink-0">
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
                        {totals.items}
                      </Badge>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">Premium Winkelwagen</h2>
                    <p className="text-sm text-stone-600 dark:text-stone-400">
                      {cartItems.length} {cartItems.length === 1 ? "product" : "producten"}
                    </p>
                  </div>
                </div>
                <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
              </SheetTitle>

              {/* Free Shipping Progress */}
              {!hasFreeShipping && cartItems.length > 0 && (
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Nog €{amountToFreeShipping.toFixed(2)} voor gratis verzending!
                    </span>
                  </div>
                  <Progress value={progressToFreeShipping} className="h-2" />
                </div>
              )}

              {hasFreeShipping && cartItems.length > 0 && (
                <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-900 dark:text-green-100">
                      🎉 Je krijgt gratis verzending!
                    </span>
                  </div>
                </div>
              )}
            </div>
          </SheetHeader>

          {cartItems.length === 0 ? (
            /* Empty Cart State */
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
                Ontdek onze premium collectie van zorgvuldig geselecteerde lifestyle producten.
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
                  <Shield className="w-3 h-3" />
                  <span>Veilig</span>
                </div>
                <div className="flex items-center gap-1">
                  <Truck className="w-3 h-3" />
                  <span>Gratis verzending</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  <span>Premium kwaliteit</span>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items - MOBILE OPTIMIZED */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3 px-1">
                {cartItems.map(({ node: item }, index) => {
                  const isUpdating = updatingItems.has(item.id)
                  const isRemoving = removingItems.has(item.id)
                  const linePrice = item.merchandise?.price
                  const lineTotalAmount = linePrice
                    ? (Number.parseFloat(linePrice.amount) * item.quantity).toString()
                    : "0"

                  return (
                    <div
                      key={item.id}
                      className={`group relative p-3 sm:p-4 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm hover:shadow-md transition-all duration-300 ${
                        isUpdating ? "ring-2 ring-blue-400 bg-blue-50 dark:bg-blue-900/20" : ""
                      } ${celebrationMode ? "animate-pulse bg-green-50 dark:bg-green-900/20" : ""} ${
                        isRemoving ? "opacity-50 scale-95" : ""
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex gap-3">
                        {/* Product Image */}
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-700 dark:to-stone-600 rounded-xl overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                          {item.merchandise.product.images.edges[0] ? (
                            <Image
                              src={item.merchandise.product.images.edges[0].node.url || "/placeholder.svg"}
                              alt={item.merchandise.product.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-6 h-6 text-stone-400" />
                            </div>
                          )}
                          <div className="absolute top-1 right-1">
                            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs px-1 py-0.5">
                              <Star className="w-2 h-2 mr-0.5" />
                              Premium
                            </Badge>
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1 min-w-0 pr-2">
                              <h4 className="font-bold text-stone-900 dark:text-stone-100 truncate text-sm sm:text-base">
                                {item.merchandise.product.title}
                              </h4>
                              {item.merchandise.title !== "Default Title" && (
                                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-medium">
                                  {item.merchandise.title}
                                </p>
                              )}
                            </div>

                            {/* Remove Button - ALWAYS VISIBLE ON MOBILE */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowRemoveConfirm(item.id)}
                              disabled={isLoading || isRemoving}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-full transition-all duration-300 flex-shrink-0 min-w-[40px] min-h-[40px] touch-manipulation"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Quantity Controls & Price - MOBILE OPTIMIZED */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center bg-stone-100 dark:bg-stone-700 rounded-full p-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                                disabled={isUpdating || isLoading || item.quantity <= 1}
                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full hover:bg-white dark:hover:bg-stone-600 transition-colors touch-manipulation min-w-[32px] min-h-[32px]"
                              >
                                <Minus className="w-3 h-3" />
                              </Button>

                              <div className="w-8 sm:w-10 text-center">
                                {isUpdating ? (
                                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                                ) : (
                                  <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                                    {item.quantity}
                                  </span>
                                )}
                              </div>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                                disabled={isUpdating || isLoading}
                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full hover:bg-white dark:hover:bg-stone-600 transition-colors touch-manipulation min-w-[32px] min-h-[32px]"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <div className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100">
                                {linePrice ? formatPrice(lineTotalAmount, linePrice.currencyCode) : "€0,00"}
                              </div>
                              {item.quantity > 1 && linePrice && (
                                <div className="text-xs text-stone-500 dark:text-stone-400">
                                  {formatPrice(linePrice.amount, linePrice.currencyCode)} per stuk
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Loading Overlay */}
                      {(isUpdating || isRemoving) && (
                        <div className="absolute inset-0 bg-white/80 dark:bg-stone-800/80 rounded-2xl flex items-center justify-center">
                          <div className="flex items-center gap-2 text-blue-600">
                            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm font-medium">
                              {isRemoving ? "Verwijderen..." : "Bijwerken..."}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Premium Cart Summary */}
              <div className="border-t border-stone-200 dark:border-stone-700 pt-4 space-y-4 bg-gradient-to-r from-stone-50 to-white dark:from-stone-800 dark:to-stone-900 -mx-6 px-6 pb-6 flex-shrink-0">
                {/* Order Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-stone-600 dark:text-stone-400 text-sm">
                    <span>Subtotaal ({totals.items} items)</span>
                    <span>{formatPrice(totals.subtotal.toString(), totals.currencyCode)}</span>
                  </div>

                  <div className="flex justify-between text-stone-600 dark:text-stone-400 text-sm">
                    <span>Verzending</span>
                    <span className={hasFreeShipping ? "text-green-600 font-medium" : ""}>
                      {hasFreeShipping ? "GRATIS! 🎉" : `€${shippingCost.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="border-t border-stone-200 dark:border-stone-700 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-stone-900 dark:text-stone-100">Totaal</span>
                      <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {formatPrice(finalTotal.toString(), totals.currencyCode)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-stone-200 dark:border-stone-700">
                  <div className="text-center">
                    <Shield className="w-4 h-4 text-green-500 mx-auto mb-1" />
                    <div className="text-xs text-stone-600 dark:text-stone-400">Veilig betalen</div>
                  </div>
                  <div className="text-center">
                    <Clock className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                    <div className="text-xs text-stone-600 dark:text-stone-400">2-3 werkdagen</div>
                  </div>
                  <div className="text-center">
                    <Gift className="w-4 h-4 text-purple-500 mx-auto mb-1" />
                    <div className="text-xs text-stone-600 dark:text-stone-400">Gratis retour</div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-2">
                  <Button
                    onClick={() => {
                      if (cart?.checkoutUrl) {
                        window.open(cart.checkoutUrl, "_blank")
                        toast({
                          title: "🚀 Naar checkout!",
                          description: "Je wordt doorgestuurd naar onze veilige checkout.",
                          variant: "success",
                          duration: 2000,
                        })
                      }
                    }}
                    disabled={!cart?.checkoutUrl || isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white text-base sm:text-lg py-3 sm:py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 touch-manipulation"
                  >
                    <span>Veilig Afrekenen</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>

                  <Button
                    variant="outline"
                    onClick={closeCart}
                    className="w-full btn-secondary py-2 sm:py-3 rounded-xl font-medium touch-manipulation"
                  >
                    Verder winkelen
                  </Button>
                </div>

                {/* Security Badge */}
                <div className="text-center">
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

      {/* Remove Confirmation Dialog - MOBILE OPTIMIZED */}
      {showRemoveConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white dark:bg-stone-800 rounded-2xl p-4 sm:p-6 max-w-sm w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base">
                  Product verwijderen?
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
                  Dit kan niet ongedaan worden gemaakt.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowRemoveConfirm(null)}
                className="flex-1 touch-manipulation py-3"
              >
                Annuleren
              </Button>
              <Button
                onClick={() => {
                  const item = cartItems.find(({ node }) => node.id === showRemoveConfirm)
                  if (item) {
                    handleRemoveItem(showRemoveConfirm, item.node.merchandise.product.title)
                  }
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white touch-manipulation py-3"
              >
                Verwijderen
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
