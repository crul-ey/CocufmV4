"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Droplets,
  Waves,
  Sun,
  Grid3X3,
  Sparkles,
  Package,
  Wine,
  ToyBrick,
} from "lucide-react";
import type { ShopifyProduct } from "@/lib/shopify";

export type ProductCategory =
  | "all"
  | "beauty-oils"
  | "beach-lifestyle"
  | "sun-protection"
  | "parfum"
  | "kids-toys"
  | "wine-accessories"
  | "overige";

interface ProductCategoryFilterProps {
  products: ShopifyProduct[];
  activeCategory: ProductCategory;
  onFilterChangeAction: (
    // Belangrijk: deze prop naam wordt gebruikt
    category: ProductCategory,
    filteredProducts: ShopifyProduct[]
  ) => void;
}

// Definieer de categorieën configuratie hier, zodat ProductGrid er ook bij kan indien nodig,
// of houd het intern als ProductGrid de gefilterde lijst direct ontvangt.
// Voor nu, houd ik het intern zoals in jouw aangeleverde bestand.
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
    tags: ["oils-supplier", "collectie-beauty-oils"],
  },
  {
    id: "beach-lifestyle" as ProductCategory,
    name: "Beach & Lifestyle",
    icon: Waves,
    color:
      "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:hover:bg-blue-800/50 border-2 border-blue-300 dark:border-blue-600 hover:shadow-md hover:scale-102 transition-all duration-200",
    activeColor:
      "bg-blue-600 text-white dark:bg-blue-500 border-2 border-blue-600 dark:border-blue-500 shadow-lg scale-105",
    tags: ["towels-supplier", "collectie-beach-lifestyle"],
  },
  {
    id: "sun-protection" as ProductCategory,
    name: "Zonbescherming",
    icon: Sun,
    color:
      "bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900/40 dark:text-orange-200 dark:hover:bg-orange-800/50 border-2 border-orange-300 dark:border-orange-600 hover:shadow-md hover:scale-102 transition-all duration-200",
    activeColor:
      "bg-orange-600 text-white dark:bg-orange-500 border-2 border-orange-600 dark:border-orange-500 shadow-lg scale-105",
    tags: ["bigbuy-supplier", "collectie-zonbescherming"],
  },
  {
    id: "parfum" as ProductCategory,
    name: "Parfum & Geur",
    icon: Sparkles,
    color:
      "bg-violet-100 text-violet-800 hover:bg-violet-200 dark:bg-violet-900/40 dark:text-violet-200 dark:hover:bg-violet-800/50 border-2 border-violet-300 dark:border-violet-600 hover:shadow-md hover:scale-102 transition-all duration-200",
    activeColor:
      "bg-violet-600 text-white dark:bg-violet-500 border-2 border-violet-600 dark:border-violet-500 shadow-lg scale-105",
    tags: ["parfum-supplier", "collectie-parfum"],
  },
  {
    id: "kids-toys" as ProductCategory,
    name: "Kids & Speelgoed",
    icon: ToyBrick,
    color:
      "bg-teal-100 text-teal-800 hover:bg-teal-200 dark:bg-teal-900/40 dark:text-teal-200 dark:hover:bg-teal-800/50 border-2 border-teal-300 dark:border-teal-600 hover:shadow-md hover:scale-102 transition-all duration-200",
    activeColor:
      "bg-teal-600 text-white dark:bg-teal-500 border-2 border-teal-600 dark:border-teal-500 shadow-lg scale-105",
    tags: ["collectie-kids-speelgoed"],
  },
  {
    id: "wine-accessories" as ProductCategory,
    name: "Wijn & Accessoires",
    icon: Wine,
    color:
      "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-200 dark:hover:bg-red-800/50 border-2 border-red-300 dark:border-red-600 hover:shadow-md hover:scale-102 transition-all duration-200",
    activeColor:
      "bg-red-600 text-white dark:bg-red-500 border-2 border-red-600 dark:border-red-500 shadow-lg scale-105",
    tags: ["collectie-wijn-accessoires"],
  },
  {
    id: "overige" as ProductCategory,
    name: "Overige Artikelen",
    icon: Package,
    color:
      "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:hover:bg-amber-800/50 border-2 border-amber-300 dark:border-amber-600 hover:shadow-md hover:scale-102 transition-all duration-200",
    activeColor:
      "bg-amber-600 text-white dark:bg-amber-500 border-2 border-amber-600 dark:border-amber-500 shadow-lg scale-105",
    tags: ["collectie-overig"],
  },
];

export default function ProductCategoryFilter({
  products,
  activeCategory,
  onFilterChangeAction,
}: ProductCategoryFilterProps) {
  const getProductCount = (categoryTags: string[]) => {
    if (categoryTags.length === 0 && activeCategory === "all")
      // Jouw logica: als 'all' actief is, toon totale count
      return products.length;
    // Anders, tel producten die matchen met de tags van de *huidige* knop
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

  const totalProductsInShop = products.length;

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
          {totalProductsInShop}{" "}
          {totalProductsInShop === 1 ? "product" : "producten"} gevonden
        </Badge>
      </div>

      {/* Desktop Filter Buttons - Horizontal Scroll */}
      <div className="hidden sm:block">
        <div className="flex gap-3 overflow-x-auto pb-4 -mx-2 px-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const productCount =
              category.id === "all"
                ? totalProductsInShop
                : getProductCount(category.tags);
            const isActive = activeCategory === category.id;

            if (productCount === 0 && category.id !== "all") return null;

            return (
              <Button
                key={category.id}
                variant="ghost"
                onClick={() => handleCategoryClick(category.id)}
                className={`
            flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 whitespace-nowrap font-semibold min-w-fit flex-shrink-0
            ${isActive ? category.activeColor : category.color}
          `}
                aria-pressed={isActive}
                aria-label={`Filter op ${category.name} (${productCount} producten)`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-semibold">{category.name}</span>
                <Badge
                  variant="secondary"
                  className={`ml-1 text-xs font-bold px-2 py-0.5 ${
                    isActive
                      ? "bg-white/20 text-white border-white/30"
                      : "bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300"
                  }`}
                >
                  {productCount}
                </Badge>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Mobile Filter Grid - Enhanced */}
      <div className="sm:hidden">
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category) => {
            const Icon = category.icon;
            const productCount =
              category.id === "all"
                ? totalProductsInShop
                : getProductCount(category.tags);
            const isActive = activeCategory === category.id;

            if (productCount === 0 && category.id !== "all") return null;

            return (
              <Button
                key={category.id}
                variant="ghost"
                onClick={() => handleCategoryClick(category.id)}
                className={`
                  flex flex-col items-center justify-center gap-2 p-3 h-28 rounded-xl transition-all duration-300 touch-manipulation text-center
                  ${isActive ? category.activeColor : category.color}
                `}
                aria-pressed={isActive}
                aria-label={`Filter op ${category.name} (${productCount} producten)`}
              >
                <Icon className="w-6 h-6 mb-1" />
                <div className="flex flex-col items-center">
                  <div className="font-bold text-xs leading-tight line-clamp-2">
                    {category.name}
                  </div>
                  <Badge
                    variant="secondary"
                    className={`mt-1 text-[10px] px-1.5 py-0.5 font-bold border-2 ${
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
