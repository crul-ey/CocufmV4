import { getProducts } from "@/lib/shopify";
import { shippingCalculator } from "@/lib/shipping-calculator";
import ProductSupplierBadge from "@/components/product-supplier-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default async function ProductsAdminPage() {
  const products = await getProducts(50); // Haal meer producten op

  // Groepeer producten per supplier
  const productsBySupplier = products.reduce((acc, product) => {
    const supplier = shippingCalculator.getSupplierForProduct(product.tags);
    const supplierKey = supplier?.id || "no-supplier";

    if (!acc[supplierKey]) {
      acc[supplierKey] = {
        supplier,
        products: [],
      };
    }

    acc[supplierKey].products.push(product);
    return acc;
  }, {} as Record<string, any>);

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Product Supplier Overzicht</h1>
        <p className="text-stone-600 dark:text-stone-400">
          Bekijk welke producten bij welke supplier horen
        </p>
      </div>

      {/* Statistieken */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{products.length}</div>
            <div className="text-sm text-stone-600">Totaal Producten</div>
          </CardContent>
        </Card>

        {Object.entries(productsBySupplier).map(([key, data]) => (
          <Card key={key}>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{data.products.length}</div>
              <div className="text-sm text-stone-600">
                {data.supplier?.name || "Geen Supplier"}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Producten per Supplier */}
      <div className="space-y-8">
        {Object.entries(productsBySupplier).map(([key, data]) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                {data.supplier ? (
                  <>
                    <span>{data.supplier.icon}</span>
                    <span>{data.supplier.name}</span>
                    <Badge variant="secondary">
                      {data.products.length} producten
                    </Badge>
                  </>
                ) : (
                  <>
                    <span>⚠️</span>
                    <span>Producten Zonder Supplier</span>
                    <Badge variant="destructive">
                      {data.products.length} producten
                    </Badge>
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.products.map((product: any) => (
                  <div key={product.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      {product.images.edges[0] && (
                        <Image
                          src={
                            product.images.edges[0].node.url ||
                            "/placeholder.svg"
                          }
                          alt={product.title}
                          width={60}
                          height={60}
                          className="rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm line-clamp-2 mb-2">
                          {product.title}
                        </h3>
                        <ProductSupplierBadge
                          productTags={product.tags}
                          showShipping={true}
                        />
                        <div className="mt-2 text-xs text-stone-500">
                          Tags: {product.tags.join(", ") || "Geen tags"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Instructies */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>🏷️ Hoe Supplier Tags Toevoegen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">In Shopify Admin:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-stone-600">
              <li>Ga naar Products → All products</li>
              <li>Klik op een product</li>
              <li>Scroll naar beneden naar "Tags"</li>
              <li>Voeg één van deze tags toe:</li>
            </ol>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {shippingCalculator.getActiveSuppliers().map((supplier) => (
              <div key={supplier.id} className="border rounded-lg p-3">
                <div className="font-medium text-sm mb-1">
                  {supplier.icon} {supplier.name}
                </div>
                <code className="text-xs bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded">
                  {supplier.tag}
                </code>
                <div className="text-xs text-stone-500 mt-1">
                  €{supplier.shippingRule.baseRate} + €
                  {supplier.shippingRule.additionalRate}/extra
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
