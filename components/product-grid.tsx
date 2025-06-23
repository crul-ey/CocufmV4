"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Filter, SortAsc, Star } from "lucide-react";
import ProductCard from "@/components/product-card";
import ProductCategoryFilter, {
  type ProductCategory,
} from "@/components/product-category-filter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ShopifyProduct } from "@/lib/shopify";

interface ProductGridProps {
  products: ShopifyProduct[];
  title?: string;
  showFilters?: boolean;
}

type SortOption =
  | "featured"
  | "price-low"
  | "price-high"
  | "name"
  | "availability";

export default function ProductGrid({
  products,
  title,
  showFilters = true,
}: ProductGridProps) {
  const [sortedProducts, setSortedProducts] =
    useState<ShopifyProduct[]>(products);
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory>("all");

  // Get unique categories from products
  const getProductCategory = (product: ShopifyProduct): ProductCategory => {
    if (product.tags.includes("bigbuy-supplier")) return "sun-protection";
    if (product.tags.includes("oils-supplier")) return "beauty-oils";
    if (product.tags.includes("towels-supplier")) return "beach-lifestyle";
    return "all";
  };

  const handleCategoryFilter = (
    category: ProductCategory,
    filteredProducts: ShopifyProduct[]
  ) => {
    setSelectedCategory(category);
    // Apply current sorting to filtered products
    const sorted = [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (
            Number.parseFloat(a.priceRange.minVariantPrice.amount) -
            Number.parseFloat(b.priceRange.minVariantPrice.amount)
          );
        case "price-high":
          return (
            Number.parseFloat(b.priceRange.minVariantPrice.amount) -
            Number.parseFloat(a.priceRange.minVariantPrice.amount)
          );
        case "name":
          return a.title.localeCompare(b.title, "nl", { sensitivity: "base" });
        case "availability":
          const aAvailable = a.variants.edges.some(
            (edge) => edge.node.availableForSale
          )
            ? 1
            : 0;
          const bAvailable = b.variants.edges.some(
            (edge) => edge.node.availableForSale
          )
            ? 1
            : 0;
          if (aAvailable !== bAvailable) {
            return bAvailable - aAvailable;
          }
          return a.title.localeCompare(b.title, "nl", { sensitivity: "base" });
        default:
          const aHasAvailable = a.variants.edges.some(
            (edge) => edge.node.availableForSale
          )
            ? 1
            : 0;
          const bHasAvailable = b.variants.edges.some(
            (edge) => edge.node.availableForSale
          )
            ? 1
            : 0;
          if (aHasAvailable !== bHasAvailable) {
            return bHasAvailable - aHasAvailable;
          }
          return 0;
      }
    });
    setSortedProducts(sorted);
  };

  useEffect(() => {
    // Re-apply current category filter when sort changes
    let filtered = products;

    if (selectedCategory !== "all") {
      filtered = products.filter(
        (product) => getProductCategory(product) === selectedCategory
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (
            Number.parseFloat(a.priceRange.minVariantPrice.amount) -
            Number.parseFloat(b.priceRange.minVariantPrice.amount)
          );
        case "price-high":
          return (
            Number.parseFloat(b.priceRange.minVariantPrice.amount) -
            Number.parseFloat(a.priceRange.minVariantPrice.amount)
          );
        case "name":
          return a.title.localeCompare(b.title, "nl", { sensitivity: "base" });
        case "availability":
          const aAvailable = a.variants.edges.some(
            (edge) => edge.node.availableForSale
          )
            ? 1
            : 0;
          const bAvailable = b.variants.edges.some(
            (edge) => edge.node.availableForSale
          )
            ? 1
            : 0;
          if (aAvailable !== bAvailable) {
            return bAvailable - aAvailable;
          }
          return a.title.localeCompare(b.title, "nl", { sensitivity: "base" });
        default:
          const aHasAvailable = a.variants.edges.some(
            (edge) => edge.node.availableForSale
          )
            ? 1
            : 0;
          const bHasAvailable = b.variants.edges.some(
            (edge) => edge.node.availableForSale
          )
            ? 1
            : 0;
          if (aHasAvailable !== bHasAvailable) {
            return bHasAvailable - aHasAvailable;
          }
          return 0;
      }
    });

    setSortedProducts(sorted);
  }, [products, sortBy, selectedCategory]);

  const sortOptions = [
    { value: "featured" as const, label: "Uitgelicht", icon: Star },
    { value: "availability" as const, label: "Beschikbaarheid", icon: Star },
    {
      value: "price-low" as const,
      label: "Prijs: Laag naar Hoog",
      icon: SortAsc,
    },
    {
      value: "price-high" as const,
      label: "Prijs: Hoog naar Laag",
      icon: SortAsc,
    },
    { value: "name" as const, label: "Naam A-Z", icon: SortAsc },
  ];

  return (
    <div className="space-y-6">
      {title && (
        <div className="text-center">
          <h2 className="font-serif text-2xl lg:text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">
            {title}
          </h2>
          <div className="w-24 h-0.5 bg-stone-300 dark:bg-stone-600 mx-auto"></div>
        </div>
      )}

      {showFilters && (
        <div className="space-y-4">
          {/* Category Filter */}
          <ProductCategoryFilter
            products={products}
            activeCategory={selectedCategory}
            onFilterChangeAction={handleCategoryFilter}
          />

          {/* Sort Dropdown */}
          <div className="flex justify-end">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-stone-600 dark:text-stone-400" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="min-w-[180px] justify-between hover:bg-stone-50 dark:hover:bg-stone-800"
                  >
                    {
                      sortOptions.find((option) => option.value === sortBy)
                        ?.label
                    }
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {sortOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`cursor-pointer ${
                        sortBy === option.value
                          ? "bg-stone-100 dark:bg-stone-800"
                          : ""
                      }`}
                    >
                      <option.icon className="w-4 h-4 mr-2" />
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      )}

      {/* Products Count */}
      <div className="flex items-center justify-between text-sm text-stone-600 dark:text-stone-400">
        <span>
          {sortedProducts.length} product
          {sortedProducts.length !== 1 ? "en" : ""} gevonden
          {selectedCategory !== "all" && ` in geselecteerde categorie`}
        </span>
        <span className="hidden sm:block">
          Gesorteerd op:{" "}
          {sortOptions.find((option) => option.value === sortBy)?.label}
        </span>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
        {sortedProducts.map((product, index) => (
          <div
            key={product.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* No Results State */}
      {sortedProducts.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Filter className="w-12 h-12 text-stone-400" />
          </div>
          <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
            Geen producten gevonden
          </h3>
          <p className="text-stone-600 dark:text-stone-400 mb-6 max-w-md mx-auto">
            Er zijn geen producten die voldoen aan je huidige filters. Probeer
            andere filters of wis alle filters.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCategory("all");
                setSortBy("featured");
              }}
            >
              Alle filters wissen
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedCategory("all")}
            >
              Toon alle producten
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
