// 🚚 SMART SHIPPING CALCULATOR
// Automatische verzendkosten berekening per leverancier

export interface ShippingRule {
  id: string
  name: string
  description: string
  baseRate: number // Basis verzendkosten
  additionalRate: number // Per extra item
  freeShippingThreshold: number // Gratis verzending vanaf
  countries: string[] // Ondersteunde landen
  active: boolean
}

export interface SupplierConfig {
  id: string
  name: string
  tag: string // Shopify product tag (bijv. "supplier-a")
  shippingRule: ShippingRule
  color: string // Voor UI
  icon: string // Voor UI
}

// 🏭 LEVERANCIERS CONFIGURATIE - COMPLETE VERSIE MET BIGBUY
export const SUPPLIERS: SupplierConfig[] = [
  {
    id: "oils-supplier",
    name: "Beauty & Oils",
    tag: "oils-supplier",
    color: "purple",
    icon: "🧴",
    shippingRule: {
      id: "oils-shipping",
      name: "Beauty & Oils Verzending",
      description: "Verzending voor beauty producten en oliën",
      baseRate: 9.99,
      additionalRate: 0.0,
      freeShippingThreshold: 75.0,
      countries: ["NL", "BE"],
      active: true,
    },
  },
  {
    id: "towels-supplier",
    name: "Beach & Lifestyle",
    tag: "towels-supplier",
    color: "blue",
    icon: "🏖️",
    shippingRule: {
      id: "towels-shipping",
      name: "Beach & Lifestyle Verzending",
      description: "Verzending voor strandhanddoeken en accessoires",
      baseRate: 7.5,
      additionalRate: 0.0,
      freeShippingThreshold: 75.0,
      countries: ["NL", "BE"],
      active: true,
    },
  },
  {
    id: "bigbuy-supplier",
    name: "Zonbescherming",
    tag: "bigbuy-supplier",
    color: "orange",
    icon: "☀️",
    shippingRule: {
      id: "bigbuy-shipping",
      name: "Zonbescherming Verzending",
      description: "Verzending voor zonnecreme en beschermingsproducten",
      baseRate: 4.95,
      additionalRate: 1.5,
      freeShippingThreshold: 50.0,
      countries: ["NL", "BE"],
      active: true,
    },
  },
]

// 🧮 SHIPPING CALCULATOR CLASS
export class ShippingCalculator {
  private suppliers: SupplierConfig[]

  constructor(suppliers: SupplierConfig[] = SUPPLIERS) {
    this.suppliers = suppliers.filter((s) => s.shippingRule.active)
  }

  // 🏷️ Identificeer leverancier op basis van product tags
  identifySupplier(productTags: string[]): SupplierConfig | null {
    for (const supplier of this.suppliers) {
      if (productTags.includes(supplier.tag)) {
        return supplier
      }
    }
    // Fallback naar eerste leverancier als geen tag gevonden
    return this.suppliers[0] || null
  }

  // 📦 Groepeer cart items per leverancier
  groupItemsBySupplier(cartItems: any[]): Map<string, any[]> {
    const groups = new Map<string, any[]>()

    cartItems.forEach((item) => {
      const productTags = item.node.merchandise.product.tags || []
      const supplier = this.identifySupplier(productTags)

      if (supplier) {
        const existing = groups.get(supplier.id) || []
        existing.push(item)
        groups.set(supplier.id, existing)
      }
    })

    return groups
  }

  // 💰 Bereken verzendkosten per leverancier - COMPLETE VERSIE
  calculateShippingCosts(cartItems: any[]): {
    supplierCosts: Array<{
      supplier: SupplierConfig
      items: any[]
      subtotal: number
      itemCount: number
      shippingCost: number
      hasFreeShipping: boolean
      amountToFreeShipping: number
    }>
    totalShipping: number
    totalItems: number
    totalSubtotal: number
    hasFreeShipping: boolean
  } {
    const supplierGroups = this.groupItemsBySupplier(cartItems)
    const supplierCosts: any[] = []
    let totalShipping = 0
    let totalItems = 0
    let totalSubtotal = 0

    supplierGroups.forEach((items, supplierId) => {
      const supplier = this.suppliers.find((s) => s.id === supplierId)
      if (!supplier) return

      // Bereken subtotaal en item count voor deze leverancier
      const { subtotal, itemCount } = items.reduce(
        (acc, item) => {
          const price = item.node.merchandise?.price
          if (price) {
            const itemTotal = Number.parseFloat(price.amount) * item.node.quantity
            acc.subtotal += itemTotal
            acc.itemCount += item.node.quantity
          }
          return acc
        },
        { subtotal: 0, itemCount: 0 },
      )

      // Bereken verzendkosten voor deze leverancier
      const rule = supplier.shippingRule
      const hasFreeShipping = subtotal >= rule.freeShippingThreshold
      const amountToFreeShipping = Math.max(rule.freeShippingThreshold - subtotal, 0)

      let shippingCost = 0
      if (!hasFreeShipping) {
        if (supplier.id === "bigbuy-supplier") {
          // BigBuy: €4.95 + €1.50 per extra item
          shippingCost = rule.baseRate + Math.max(0, itemCount - 1) * rule.additionalRate
        } else {
          // Andere suppliers: vast tarief
          shippingCost = rule.baseRate
        }
      }

      supplierCosts.push({
        supplier,
        items,
        subtotal,
        itemCount,
        shippingCost,
        hasFreeShipping,
        amountToFreeShipping,
      })

      totalShipping += shippingCost
      totalItems += itemCount
      totalSubtotal += subtotal
    })

    return {
      supplierCosts,
      totalShipping,
      totalItems,
      totalSubtotal,
      hasFreeShipping: totalShipping === 0,
    }
  }

  // 🎯 Krijg leverancier info voor product
  getSupplierForProduct(productTags: string[]): SupplierConfig | null {
    return this.identifySupplier(productTags)
  }

  // 📋 Krijg alle actieve leveranciers
  getActiveSuppliers(): SupplierConfig[] {
    return this.suppliers
  }

  // ➕ Voeg nieuwe leverancier toe (voor admin)
  addSupplier(supplier: SupplierConfig): void {
    this.suppliers.push(supplier)
  }

  // ✏️ Update leverancier (voor admin)
  updateSupplier(supplierId: string, updates: Partial<SupplierConfig>): boolean {
    const index = this.suppliers.findIndex((s) => s.id === supplierId)
    if (index !== -1) {
      this.suppliers[index] = { ...this.suppliers[index], ...updates }
      return true
    }
    return false
  }

  // 🗑️ Verwijder leverancier (voor admin)
  removeSupplier(supplierId: string): boolean {
    const index = this.suppliers.findIndex((s) => s.id === supplierId)
    if (index !== -1) {
      this.suppliers.splice(index, 1)
      return true
    }
    return false
  }
}

// 🌟 SINGLETON INSTANCE
export const shippingCalculator = new ShippingCalculator()

// 🎨 HELPER FUNCTIONS
export const formatPrice = (amount: number, currency = "EUR"): string => {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: currency,
  }).format(amount)
}

export const getSupplierColor = (color: string): string => {
  const colors: Record<string, string> = {
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200",
    green: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200",
    purple: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200",
    orange: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200",
    red: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200",
  }
  return colors[color] || colors.blue
}
