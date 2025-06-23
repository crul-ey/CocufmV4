"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Droplets, Waves, Sun, Grid3X3 } from "lucide-react";
import type { ShopifyProduct } from "@/lib/shopify";

export type ProductCategory =
  | "all"
  | "beauty-oils"
  | "beach-lifestyle"
  | "sun-protection";

interface ProductCategoryFilterProps {
  products: ShopifyProduct[];
  onFilterChangeAction: (
    category: ProductCategory,
    filteredProducts: ShopifyProduct[]
  ) => void;
  activeCategory: ProductCategory;
}

const categories = [
  {
    id: "all" as ProductCategory,
    name: "Alle Producten",
    icon: Grid3X3,
    color: "bg-stone-100 text-stone-700 hover:bg-stone-200",
    activeColor: "bg-stone-900 text-white",
    tags: [],
  },
  {
    id: "beauty-oils" as ProductCategory,
    name: "Beauty & Oils",
    icon: Droplets,
    color: "bg-pink-100 text-pink-700 hover:bg-pink-200",
    activeColor: "bg-pink-600 text-white",
    tags: ["oils-supplier"],
  },
  {
    id: "beach-lifestyle" as ProductCategory,
    name: "Beach & Lifestyle",
    icon: Waves,
    color: "bg-blue-100 text-blue-700 hover:bg-blue-200",
    activeColor: "bg-blue-600 text-white",
    tags: ["towels-supplier"],
  },
  {
    id: "sun-protection" as ProductCategory,
    name: "Zonbescherming",
    icon: Sun,
    color: "bg-orange-100 text-orange-700 hover:bg-orange-200",
    activeColor: "bg-orange-600 text-white",
    tags: ["bigbuy-supplier"],
  },
];

export default function ProductCategoryFilter({
  products,
  onFilterChangeAction,
  activeCategory,
}: ProductCategoryFilterProps) {
  const getProductCount = (categoryTags: string[]) => {
    if (categoryTags.length === 0) return products.length;

    return products.filter((product) => {
      const productTags = product.tags || [];
      return categoryTags.some((tag) => productTags.includes(tag));
    }).length;
  };

  const handleCategoryClick = (category: ProductCategory) => {
    const categoryConfig = categories.find((cat) => cat.id === category);
    if (!categoryConfig) return;

    let filteredProducts = products;

    if (category !== "all") {
      filteredProducts = products.filter((product) => {
        const productTags = product.tags || [];
        return categoryConfig.tags.some((tag) => productTags.includes(tag));
      });
    }

    onFilterChangeAction(category, filteredProducts);
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">
            Shop per Categorie
          </h2>
          <p className="text-stone-600 dark:text-stone-400">
            Filter producten op type en vind precies wat je zoekt
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
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

          return (
            <Button
              key={category.id}
              variant="ghost"
              onClick={() => handleCategoryClick(category.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200
                ${
                  isActive
                    ? category.activeColor
                    : `${category.color} border border-stone-200 dark:border-stone-700`
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{category.name}</span>
              <Badge
                variant="secondary"
                className={`ml-1 text-xs ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300"
                }`}
              >
                {productCount}
              </Badge>
            </Button>
          );
        })}
      </div>

      {/* Mobile Filter Dropdown */}
      <div className="sm:hidden">
        <div className="grid grid-cols-2 gap-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const productCount = getProductCount(category.tags);
            const isActive = activeCategory === category.id;

            return (
              <Button
                key={category.id}
                variant="ghost"
                onClick={() => handleCategoryClick(category.id)}
                className={`
                  flex flex-col items-center gap-2 p-4 h-auto rounded-lg transition-all duration-200
                  ${
                    isActive
                      ? category.activeColor
                      : `${category.color} border border-stone-200 dark:border-stone-700`
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <div className="text-center">
                  <div className="font-medium text-sm leading-tight">
                    {category.name}
                  </div>
                  <Badge
                    variant="secondary"
                    className={`mt-1 text-xs ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300"
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
        <div className="mt-4 flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
          <span>Gefilterd op:</span>
          <Badge variant="outline" className="font-medium">
            {categories.find((cat) => cat.id === activeCategory)?.name}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCategoryClick("all")}
            className="text-xs text-blue-600 hover:text-blue-700 p-0 h-auto"
          >
            Wis filter
          </Button>
        </div>
      )}
    </div>
  );
}
