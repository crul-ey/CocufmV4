"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Droplets, Waves, Sun, Grid3X3, Wine, Sparkles } from "lucide-react";
import type { ShopifyProduct } from "@/lib/shopify";

export type ProductCategory =
  | "all"
  | "beauty-oils"
  | "beach-lifestyle"
  | "sun-protection"
  | "wine-beach"
  | "parfum";

interface ProductCategoryFilterProps {
  products: ShopifyProduct[];
  activeCategory: ProductCategory;
  onFilterChangeAction: (
    category: ProductCategory,
    filteredProducts: ShopifyProduct[]
  ) => void;
}

const categories = [
  {
    id: "all" as ProductCategory,
    name: "Alle Producten",
    icon: Grid3X3,
    color:
      "bg-stone-50 text-stone-800 hover:bg-stone-100 border border-stone-200 dark:bg-stone-800/80 dark:text-stone-200 dark:hover:bg-stone-700 dark:border-stone-700",
    activeColor:
      "bg-stone-900 text-white shadow-lg shadow-stone-900/25 dark:bg-stone-100 dark:text-stone-900",
    tags: [],
  },
  {
    id: "beauty-oils" as ProductCategory,
    name: "Beauty & Oils",
    icon: Droplets,
    color:
      "bg-pink-50 text-pink-800 hover:bg-pink-100 border border-pink-200 dark:bg-pink-950/50 dark:text-pink-200 dark:hover:bg-pink-900/50 dark:border-pink-800",
    activeColor:
      "bg-pink-600 text-white shadow-lg shadow-pink-600/25 dark:bg-pink-500",
    tags: ["oils-supplier"],
  },
  {
    id: "beach-lifestyle" as ProductCategory,
    name: "Beach & Lifestyle",
    icon: Waves,
    color:
      "bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-200 dark:hover:bg-blue-900/50 dark:border-blue-800",
    activeColor:
      "bg-blue-600 text-white shadow-lg shadow-blue-600/25 dark:bg-blue-500",
    tags: ["towels-supplier"],
  },
  {
    id: "sun-protection" as ProductCategory,
    name: "Zonbescherming",
    icon: Sun,
    color:
      "bg-orange-50 text-orange-800 hover:bg-orange-100 border border-orange-200 dark:bg-orange-950/50 dark:text-orange-200 dark:hover:bg-orange-900/50 dark:border-orange-800",
    activeColor:
      "bg-orange-600 text-white shadow-lg shadow-orange-600/25 dark:bg-orange-500",
    tags: ["bigbuy-supplier"],
  },
  {
    id: "parfum" as ProductCategory,
    name: "Parfum & Geur",
    icon: Sparkles,
    color:
      "bg-violet-50 text-violet-800 hover:bg-violet-100 border border-violet-200 dark:bg-violet-950/50 dark:text-violet-200 dark:hover:bg-violet-900/50 dark:border-violet-800",
    activeColor:
      "bg-violet-600 text-white shadow-lg shadow-violet-600/25 dark:bg-violet-500",
    tags: ["parfum-supplier"],
  },
  {
    id: "wine-beach" as ProductCategory,
    name: "Wijn & Strand",
    icon: Wine,
    color:
      "bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200 dark:bg-purple-950/50 dark:text-purple-200 dark:hover:bg-purple-900/50 dark:border-purple-800",
    activeColor:
      "bg-purple-600 text-white shadow-lg shadow-purple-600/25 dark:bg-purple-500",
    tags: ["wine-strand-accessories"],
  },
];

export default function ProductCategoryFilter({
  products,
  activeCategory,
  onFilterChangeAction,
}: ProductCategoryFilterProps) {
  const getProductCount = (categoryTags: string[]) => {
    if (categoryTags.length === 0) return products.length;

    return products.filter((product) => {
      const productTags = product.tags || [];
      return categoryTags.some((tag) => productTags.includes(tag));
    }).length;
  };

  const getFilteredProducts = (categoryTags: string[]) => {
    if (categoryTags.length === 0) return products;

    return products.filter((product) => {
      const productTags = product.tags || [];
      return categoryTags.some((tag) => productTags.includes(tag));
    });
  };

  const handleCategoryClick = (category: ProductCategory) => {
    const categoryData = categories.find((cat) => cat.id === category);
    const filteredProducts = getFilteredProducts(categoryData?.tags || []);
    onFilterChangeAction(category, filteredProducts);
  };

  // Debug logging
  console.log("🔍 ProductCategoryFilter Debug:", {
    totalProducts: products.length,
    parfumProducts: products.filter((p) => p.tags.includes("parfum-supplier"))
      .length,
    allTags: [...new Set(products.flatMap((p) => p.tags))],
  });

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">
            Shop per Categorie
          </h2>
          <p className="text-stone-600 dark:text-stone-400 font-medium">
            Filter producten op type en vind precies wat je zoekt
          </p>
        </div>
        <Badge
          variant="outline"
          className="text-sm font-semibold bg-white dark:bg-stone-800 border-2"
        >
          {products.length} {products.length === 1 ? "product" : "producten"}{" "}
          gevonden
        </Badge>
      </div>

      {/* Desktop Filter Buttons */}
      <div className="hidden sm:flex flex-wrap gap-3">
        {categories.map((category) => {
          const Icon = category.icon;
          const productCount = getProductCount(category.tags);
          const isActive = activeCategory === category.id;

          // Debug logging voor elke categorie
          if (category.id === "parfum") {
            console.log("🌸 Parfum Category Debug:", {
              categoryId: category.id,
              tags: category.tags,
              productCount,
              productsWithTag: products
                .filter((p) => p.tags.includes("parfum-supplier"))
                .map((p) => ({
                  title: p.title,
                  tags: p.tags,
                })),
            });
          }

          // ALTIJD tonen voor debug doeleinden - verwijder deze regel later
          // if (productCount === 0 && category.id !== "all") return null;

          return (
            <Button
              key={category.id}
              variant="ghost"
              onClick={() => handleCategoryClick(category.id)}
              className={`
                flex items-center gap-2 px-5 py-3 rounded-full transition-all duration-300 font-semibold
                transform hover:scale-105 hover:shadow-md
                ${isActive ? category.activeColor : category.color}
                ${
                  productCount === 0 && category.id !== "all"
                    ? "opacity-50"
                    : ""
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span className="font-semibold">{category.name}</span>
              <Badge
                variant="secondary"
                className={`ml-2 text-xs font-bold px-2 py-1 ${
                  isActive
                    ? "bg-white/25 text-white border-white/30"
                    : "bg-white dark:bg-stone-700 text-stone-700 dark:text-stone-200 border border-stone-300 dark:border-stone-600"
                }`}
              >
                {productCount}
              </Badge>
            </Button>
          );
        })}
      </div>

      {/* Mobile Filter Grid */}
      <div className="sm:hidden">
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category) => {
            const Icon = category.icon;
            const productCount = getProductCount(category.tags);
            const isActive = activeCategory === category.id;

            // ALTIJD tonen voor debug doeleinden
            // if (productCount === 0 && category.id !== "all") return null;

            return (
              <Button
                key={category.id}
                variant="ghost"
                onClick={() => handleCategoryClick(category.id)}
                className={`
                  flex flex-col items-center gap-3 p-4 h-auto rounded-xl transition-all duration-300
                  transform hover:scale-105 hover:shadow-lg
                  ${isActive ? category.activeColor : category.color}
                  ${
                    productCount === 0 && category.id !== "all"
                      ? "opacity-50"
                      : ""
                  }
                `}
              >
                <Icon className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-bold text-sm leading-tight mb-1">
                    {category.name}
                  </div>
                  <Badge
                    variant="secondary"
                    className={`text-xs font-bold px-2 py-1 ${
                      isActive
                        ? "bg-white/25 text-white border-white/30"
                        : "bg-white dark:bg-stone-700 text-stone-700 dark:text-stone-200 border border-stone-300 dark:border-stone-600"
                    }`}
                  >
                    {productCount}
                  </Badge>
                </div>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Active Filter Indicator */}
      {activeCategory !== "all" && (
        <div className="mt-6 flex items-center gap-3 text-sm">
          <span className="text-stone-600 dark:text-stone-400 font-medium">
            Gefilterd op:
          </span>
          <Badge
            variant="outline"
            className="font-bold bg-white dark:bg-stone-800 border-2"
          >
            {categories.find((cat) => cat.id === activeCategory)?.name}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCategoryClick("all")}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold p-2 h-auto hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg"
          >
            ✕ Wis filter
          </Button>
        </div>
      )}
    </div>
  );
}
