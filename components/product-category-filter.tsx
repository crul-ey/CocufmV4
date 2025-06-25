"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Droplets,
  Waves,
  Sun,
  Grid3X3,
  Sparkles,
  Baby,
  Package,
} from "lucide-react";
import type { ShopifyProduct } from "@/lib/shopify";

export type ProductCategory =
  | "all"
  | "beauty-oils"
  | "beach-lifestyle"
  | "sun-protection"
  | "wine-beach"
  | "parfum"
  | "kids"
  | "overige";

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
      "bg-stone-100 text-stone-800 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700 border-2 border-stone-300 dark:border-stone-600",
    activeColor:
      "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-2 border-stone-900 dark:border-stone-100 shadow-lg scale-105",
    tags: [],
  },
  {
    id: "beauty-oils" as ProductCategory,
    name: "Beauty & Oils",
    icon: Droplets,
    color:
      "bg-pink-100 text-pink-800 hover:bg-pink-200 dark:bg-pink-900/40 dark:text-pink-200 dark:hover:bg-pink-800/50 border-2 border-pink-300 dark:border-pink-600 hover:shadow-md hover:scale-102 transition-all duration-200",
    activeColor:
      "bg-pink-600 text-white dark:bg-pink-500 border-2 border-pink-600 dark:border-pink-500 shadow-lg scale-105",
    tags: ["oils-supplier"],
  },
  {
    id: "beach-lifestyle" as ProductCategory,
    name: "Beach & Lifestyle",
    icon: Waves,
    color:
      "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:hover:bg-blue-800/50 border-2 border-blue-300 dark:border-blue-600 hover:shadow-md hover:scale-102 transition-all duration-200",
    activeColor:
      "bg-blue-600 text-white dark:bg-blue-500 border-2 border-blue-600 dark:border-blue-500 shadow-lg scale-105",
    tags: ["towels-supplier"],
  },
  {
    id: "sun-protection" as ProductCategory,
    name: "Zonbescherming",
    icon: Sun,
    color:
      "bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900/40 dark:text-orange-200 dark:hover:bg-orange-800/50 border-2 border-orange-300 dark:border-orange-600 hover:shadow-md hover:scale-102 transition-all duration-200",
    activeColor:
      "bg-orange-600 text-white dark:bg-orange-500 border-2 border-orange-600 dark:border-orange-500 shadow-lg scale-105",
    tags: ["bigbuy-supplier"],
  },
  {
    id: "parfum" as ProductCategory,
    name: "Parfum & Geur",
    icon: Sparkles,
    color:
      "bg-violet-100 text-violet-800 hover:bg-violet-200 dark:bg-violet-900/40 dark:text-violet-200 dark:hover:bg-violet-800/50 border-2 border-violet-300 dark:border-violet-600 hover:shadow-md hover:scale-102 transition-all duration-200",
    activeColor:
      "bg-violet-600 text-white dark:bg-violet-500 border-2 border-violet-600 dark:border-violet-500 shadow-lg scale-105",
    tags: ["parfum-supplier"],
  },
  {
    id: "kids" as ProductCategory,
    name: "Kids & Baby",
    icon: Baby,
    color:
      "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-200 dark:hover:bg-green-800/50 border-2 border-green-300 dark:border-green-600 hover:shadow-md hover:scale-102 transition-all duration-200",
    activeColor:
      "bg-green-600 text-white dark:bg-green-500 border-2 border-green-600 dark:border-green-500 shadow-lg scale-105",
    tags: ["kids-supplier", "kinderen", "baby"],
  },
  {
    id: "overige" as ProductCategory,
    name: "Overige Artikelen",
    icon: Package,
    color:
      "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:hover:bg-amber-800/50 border-2 border-amber-300 dark:border-amber-600 hover:shadow-md hover:scale-102 transition-all duration-200",
    activeColor:
      "bg-amber-600 text-white dark:bg-amber-500 border-2 border-amber-600 dark:border-amber-500 shadow-lg scale-105",
    tags: ["overige-supplier", "diversen", "accessoires"],
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

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">
            Shop per Categorie
          </h2>
          <p className="text-stone-600 dark:text-stone-400 font-medium">
            Filter producten op type en vind precies wat je zoekt
          </p>
        </div>
        <Badge variant="outline" className="text-sm font-semibold border-2">
          {products.length} {products.length === 1 ? "product" : "producten"}{" "}
          gevonden
        </Badge>
      </div>

      {/* 🖥️ Desktop Filter Buttons - Horizontal Scroll */}
      <div className="hidden sm:block">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => {
            const Icon = category.icon;
            const productCount = getProductCount(category.tags);
            const isActive = activeCategory === category.id;

            // Show categories only if they have products, except "All Products"
            if (productCount === 0 && category.id !== "all") return null;

            return (
              <Button
                key={category.id}
                variant="ghost"
                onClick={() => handleCategoryClick(category.id)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-2xl transition-all duration-300 whitespace-nowrap font-semibold
                  ${isActive ? category.activeColor : category.color}
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-bold">{category.name}</span>
                <Badge
                  variant="secondary"
                  className={`ml-2 text-xs font-bold border-2 ${
                    isActive
                      ? "bg-white/20 text-white border-white/30"
                      : "bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-600"
                  }`}
                >
                  {productCount}
                </Badge>
              </Button>
            );
          })}
        </div>
      </div>

      {/* 📱 Mobile Filter Grid - Enhanced */}
      <div className="sm:hidden">
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category) => {
            const Icon = category.icon;
            const productCount = getProductCount(category.tags);
            const isActive = activeCategory === category.id;

            if (productCount === 0 && category.id !== "all") return null;

            return (
              <Button
                key={category.id}
                variant="ghost"
                onClick={() => handleCategoryClick(category.id)}
                className={`
                  flex flex-col items-center gap-3 p-4 h-24 rounded-xl transition-all duration-300 touch-manipulation
                  ${isActive ? category.activeColor : category.color}
                `}
              >
                <Icon className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-bold text-sm leading-tight">
                    {category.name}
                  </div>
                  <Badge
                    variant="secondary"
                    className={`mt-1 text-xs font-bold border-2 ${
                      isActive
                        ? "bg-white/20 text-white border-white/30"
                        : "bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-600"
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
        <div className="mt-6 flex items-center gap-3 text-sm text-stone-600 dark:text-stone-400">
          <span className="font-semibold">Gefilterd op:</span>
          <Badge variant="outline" className="font-bold border-2">
            {categories.find((cat) => cat.id === activeCategory)?.name}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCategoryClick("all")}
            className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-2 h-auto font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
          >
            Wis filter
          </Button>
        </div>
      )}
    </div>
  );
}
