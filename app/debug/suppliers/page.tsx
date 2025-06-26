import { getProducts } from "@/lib/shopify";
import { shippingCalculator } from "@/lib/shipping-calculator";
import type { ShopifyProduct } from "@/lib/shopify";

export default async function DebugSuppliersPage() {
  const products: ShopifyProduct[] = await getProducts(10);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">🔍 Supplier Debug Page</h1>

      <div className="space-y-6">
        <div className="bg-white dark:bg-stone-800 p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">
            📋 Alle Producten & Hun Tags
          </h2>
          <div className="space-y-4">
            {products.map((product: ShopifyProduct) => {
              const supplier = shippingCalculator.getSupplierForProduct(
                product.tags
              );
              return (
                <div
                  key={product.id}
                  className="border-l-4 border-blue-500 pl-4"
                >
                  <h3 className="font-semibold text-lg">{product.title}</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Tags:</strong>{" "}
                      {product.tags.join(", ") || "Geen tags"}
                    </p>
                    <p className="text-sm mt-1">
                      <strong>Gedetecteerde Supplier:</strong>{" "}
                      <span
                        className={supplier ? "text-green-600" : "text-red-600"}
                      >
                        {supplier
                          ? `${supplier.name} (${supplier.tag})`
                          : "❌ Geen supplier gevonden"}
                      </span>
                    </p>
                    {supplier && (
                      <p className="text-sm text-blue-600">
                        <strong>Verzendkosten:</strong> €
                        {supplier.shippingRule.baseRate}
                        {supplier.shippingRule.additionalRate > 0 &&
                          ` + €${supplier.shippingRule.additionalRate} per extra item`}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-stone-800 p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">
            ⚙️ Supplier Configuratie
          </h2>
          <div className="space-y-3">
            {shippingCalculator.getActiveSuppliers().map((supplier) => (
              <div
                key={supplier.id}
                className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-stone-700 rounded"
              >
                <span className="text-2xl">{supplier.icon}</span>
                <div>
                  <p className="font-semibold">{supplier.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tag:{" "}
                    <code className="bg-gray-200 dark:bg-stone-600 px-1 rounded">
                      {supplier.tag}
                    </code>
                  </p>
                  <p className="text-sm text-blue-600">
                    €{supplier.shippingRule.baseRate}
                    {supplier.shippingRule.additionalRate > 0 &&
                      ` + €${supplier.shippingRule.additionalRate}/item`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
          <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            🔧 Troubleshooting
          </h3>
          <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
            <li>
              • Controleer of de tags exact overeenkomen (hoofdlettergevoelig)
            </li>
            <li>• Zorg dat de Shopify product tags zijn opgeslagen</li>
            <li>• Refresh de pagina na het wijzigen van tags</li>
            <li>• Controleer of de Shopify API de juiste tags teruggeeft</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
