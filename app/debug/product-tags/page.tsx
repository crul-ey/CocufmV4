import { getAllProducts } from "@/lib/shopify";

export default async function DebugProductTagsPage() {
  const products = await getAllProducts(); // Fetch ALL products

  // Group products by tags
  const tagGroups: Record<string, any[]> = {};

  products.forEach((product) => {
    product.tags.forEach((tag) => {
      if (!tagGroups[tag]) {
        tagGroups[tag] = [];
      }
      tagGroups[tag].push(product);
    });
  });

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">🔍 Product Tags Debug</h1>

        <div className="bg-white dark:bg-stone-900 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">📊 Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200">
                Total Products
              </h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {products.length}
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 dark:text-green-200">
                Unique Tags
              </h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {Object.keys(tagGroups).length}
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 dark:text-purple-200">
                Categories
              </h3>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {
                  Object.keys(tagGroups).filter((tag) =>
                    tag.includes("supplier")
                  ).length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-stone-900 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">🏷️ All Tags & Products</h2>

          <div className="space-y-6">
            {Object.entries(tagGroups)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([tag, tagProducts]) => (
                <div
                  key={tag}
                  className="border border-stone-200 dark:border-stone-700 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">📌 {tag}</h3>
                    <span className="bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-full text-sm font-medium">
                      {tagProducts.length}{" "}
                      {tagProducts.length === 1 ? "product" : "products"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {tagProducts.map((product) => (
                      <div
                        key={product.id}
                        className="bg-stone-50 dark:bg-stone-800 p-3 rounded-lg"
                      >
                        <h4 className="font-medium text-sm">{product.title}</h4>
                        <p className="text-xs text-stone-600 dark:text-stone-400">
                          Handle: {product.handle}
                        </p>
                        <p className="text-xs text-stone-600 dark:text-stone-400">
                          Vendor: {product.vendor}
                        </p>
                        <p className="text-xs font-semibold text-green-600 dark:text-green-400">
                          €{product.priceRange.minVariantPrice.amount}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Category-specific debug */}
        <div className="bg-white dark:bg-stone-900 rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">🎯 Category Tags Check</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "Beauty & Oils", tags: ["oils-supplier"] },
              { name: "Beach & Lifestyle", tags: ["towels-supplier"] },
              { name: "Zonbescherming", tags: ["bigbuy-supplier"] },
              { name: "Parfum & Geur", tags: ["parfum-supplier"] },
              {
                name: "Kids & Baby",
                tags: ["kids-supplier", "kinderen", "baby"],
              },
              {
                name: "Overige Artikelen",
                tags: ["overige-supplier", "diversen", "accessoires"],
              },
            ].map((category) => {
              const categoryProducts = products.filter((product) =>
                category.tags.some((tag) => product.tags.includes(tag))
              );

              return (
                <div
                  key={category.name}
                  className="border border-stone-200 dark:border-stone-700 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{category.name}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        categoryProducts.length > 0
                          ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200"
                          : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200"
                      }`}
                    >
                      {categoryProducts.length} products
                    </span>
                  </div>
                  <div className="text-sm text-stone-600 dark:text-stone-400">
                    Tags: {category.tags.join(", ")}
                  </div>
                  {categoryProducts.length > 0 && (
                    <div className="mt-2 text-xs text-stone-500 dark:text-stone-400">
                      Products:{" "}
                      {categoryProducts.map((p) => p.title).join(", ")}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
