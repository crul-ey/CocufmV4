"use client";

import { useCart } from "@/contexts/cart-context";
import { shippingCalculator } from "@/lib/shipping-calculator";
import { useEffect, useState } from "react";

export default function CartDebugPage() {
  const { cart } = useCart();
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    if (cart?.lines.edges) {
      const cartItems = cart.lines.edges;
      console.log("🔍 RAW CART DATA:", cart);
      console.log("🔍 CART ITEMS:", cartItems);

      const debug = {
        totalItems: cartItems.length,
        items: cartItems.map((item, index) => {
          const product = item.node.merchandise.product;
          const tags = product.tags || [];
          const supplier = shippingCalculator.getSupplierForProduct(tags);

          console.log(`🔍 ITEM ${index + 1}:`, {
            title: product.title,
            tags: tags,
            supplier: supplier,
            rawItem: item,
          });

          return {
            title: product.title,
            tags: tags,
            supplier: supplier?.name || "❌ Geen supplier",
            supplierTag: supplier?.tag || "❌ Geen tag",
            rawTags: tags,
            hasCorrectTag:
              tags.includes("towels-supplier") ||
              tags.includes("oils-supplier"),
          };
        }),
        shippingCalculation:
          shippingCalculator.calculateShippingCosts(cartItems),
        suppliers: shippingCalculator.getActiveSuppliers(),
      };

      setDebugInfo(debug);
      console.log("🔍 COMPLETE DEBUG INFO:", debug);
    }
  }, [cart]);

  if (!cart || !debugInfo) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">🔍 Cart Debug</h1>
        <p>
          Geen cart data beschikbaar. Voeg producten toe aan je winkelwagen.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold mb-6">🔍 Cart Debug Page</h1>

      {/* Raw Cart Data */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">📦 Raw Cart Data</h2>
        <pre className="text-xs overflow-auto bg-white dark:bg-gray-900 p-4 rounded border">
          {JSON.stringify(cart, null, 2)}
        </pre>
      </div>

      {/* Items Analysis */}
      <div className="bg-white dark:bg-stone-800 p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">📋 Items Analyse</h2>
        <div className="space-y-4">
          {debugInfo.items.map((item: any, index: number) => (
            <div
              key={index}
              className="border-l-4 border-blue-500 pl-4 bg-gray-50 dark:bg-gray-700 p-4 rounded"
            >
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <div className="mt-2 space-y-1 text-sm">
                <p>
                  <strong>Tags:</strong>{" "}
                  <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">
                    [{item.rawTags.join(", ")}]
                  </code>
                </p>
                <p>
                  <strong>Heeft Correcte Tag:</strong>
                  <span
                    className={
                      item.hasCorrectTag
                        ? "text-green-600 ml-2"
                        : "text-red-600 ml-2"
                    }
                  >
                    {item.hasCorrectTag ? "✅ JA" : "❌ NEE"}
                  </span>
                </p>
                <p>
                  <strong>Gedetecteerde Supplier:</strong>
                  <span
                    className={
                      item.supplier !== "❌ Geen supplier"
                        ? "text-green-600 ml-2"
                        : "text-red-600 ml-2"
                    }
                  >
                    {item.supplier}
                  </span>
                </p>
                <p>
                  <strong>Supplier Tag:</strong>{" "}
                  <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">
                    {item.supplierTag}
                  </code>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Calculation */}
      <div className="bg-white dark:bg-stone-800 p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">🚚 Shipping Berekening</h2>
        <div className="space-y-3">
          <p>
            <strong>Totaal Suppliers:</strong>{" "}
            {debugInfo.shippingCalculation.supplierCosts.length}
          </p>
          <p>
            <strong>Totale Verzendkosten:</strong> €
            {debugInfo.shippingCalculation.totalShipping.toFixed(2)}
          </p>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Per Supplier:</h3>
            {debugInfo.shippingCalculation.supplierCosts.map(
              (supplierCost: any, index: number) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700 p-3 rounded mb-2"
                >
                  <p>
                    <strong>{supplierCost.supplier.name}</strong>
                  </p>
                  <p className="text-sm">Items: {supplierCost.itemCount}</p>
                  <p className="text-sm">
                    Verzendkosten: €{supplierCost.shippingCost.toFixed(2)}
                  </p>
                  <p className="text-sm">
                    Subtotaal: €{supplierCost.subtotal.toFixed(2)}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Supplier Config */}
      <div className="bg-white dark:bg-stone-800 p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">⚙️ Supplier Configuratie</h2>
        <div className="space-y-3">
          {debugInfo.suppliers.map((supplier: any) => (
            <div
              key={supplier.id}
              className="bg-gray-50 dark:bg-gray-700 p-3 rounded"
            >
              <p>
                <strong>{supplier.name}</strong>
              </p>
              <p className="text-sm">ID: {supplier.id}</p>
              <p className="text-sm">
                Tag:{" "}
                <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">
                  {supplier.tag}
                </code>
              </p>
              <p className="text-sm">
                Verzendkosten: €{supplier.shippingRule.baseRate} + €
                {supplier.shippingRule.additionalRate}/extra item
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
        <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
          🔧 Wat te Controleren
        </h3>
        <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
          <li>
            1. Hebben alle items de juiste tags? (oils-supplier of
            towels-supplier)
          </li>
          <li>2. Worden de suppliers correct gedetecteerd?</li>
          <li>3. Klopt de shipping berekening per supplier?</li>
          <li>4. Check de browser console voor extra debug info</li>
        </ul>
      </div>
    </div>
  );
}
