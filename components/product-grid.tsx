"use client";

import type React from "react";
import { useState, useEffect, useMemo } from "react";
import { ChevronDown, FilterIcon, SortAsc, Star, X } from "lucide-react"; // FilterIcon hernoemd
import ProductCard from "@/components/product-card";
import ProductCategoryFilter, {
  type ProductCategory,
} from "@/components/product-category-filter"; // Jouw versie
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ShopifyProduct } from "@/lib/shopify";
import { cn } from "@/lib/utils";

type SortOptionValue =
  | "featured"
  | "price-low"
  | "price-high"
  | "name"
  | "availability"
  | "newest";

interface SortOption {
  value: SortOptionValue;
  label: string;
  icon: React.ElementType;
}

interface ProductGridProps {
  products: ShopifyProduct[]; // Alle producten voor initiële staat en "alles" filter
  showFilters?: boolean; // Optionele prop
  // title?: string; // Verwijderd, titel komt nu van de pagina zelf
}

export default function ProductGrid({
  products,
  showFilters = true,
}: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>("all");
  // Sla de producten op die door de categorie filter zijn gefilterd
  const [productsAfterCategoryFilter, setProductsAfterCategoryFilter] =
    useState<ShopifyProduct[]>(products);
  const [sortOption, setSortOption] = useState<SortOptionValue>("featured");
  const [displayedProducts, setDisplayedProducts] =
    useState<ShopifyProduct[]>(products);

  const sortOptionsList: SortOption[] = [
    { value: "featured", label: "Uitgelicht", icon: Star },
    { value: "newest", label: "Nieuwste eerst", icon: SortAsc }, // Gebruik createdAt of publishedAt
    { value: "availability", label: "Beschikbaarheid", icon: Star },
    { value: "price-low", label: "Prijs: Laag naar Hoog", icon: SortAsc },
    { value: "price-high", label: "Prijs: Hoog naar Laag", icon: SortAsc },
    { value: "name", label: "Naam A-Z", icon: SortAsc },
  ];

  const currentSortLabel = useMemo(() => {
    return (
      sortOptionsList.find((opt) => opt.value === sortOption)?.label ||
      "Sorteer"
    );
  }, [sortOption]);

  // Handler voor wanneer de categorie verandert via jouw ProductCategoryFilter
  const handleCategoryChange = (
    newCategory: ProductCategory,
    filteredProductsFromCategory: ShopifyProduct[]
  ) => {
    setActiveCategory(newCategory);
    setProductsAfterCategoryFilter(filteredProductsFromCategory);
  };

  // Effect om te sorteren wanneer productsAfterCategoryFilter of sortOption verandert
  useEffect(() => {
    const sorted = [...productsAfterCategoryFilter].sort((a, b) => {
      // Zorg dat createdAt en publishedAt bestaan en valide dates zijn voor sortering
      const aCreatedAt = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bCreatedAt = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      // const aPublishedAt = a.publishedAt ? new Date(a.publishedAt).getTime() : 0; // Als je publishedAt gebruikt voor sorteren
      // const bPublishedAt = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;

      switch (sortOption) {
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
          );
          const bAvailable = b.variants.edges.some(
            (edge) => edge.node.availableForSale
          );
          if (aAvailable !== bAvailable) return bAvailable ? 1 : -1;
          return bCreatedAt - aCreatedAt; // Fallback op nieuwste
        case "newest":
          return bCreatedAt - aCreatedAt;
        case "featured":
        default:
          const aFeatAvailable = a.variants.edges.some(
            (edge) => edge.node.availableForSale
          );
          const bFeatAvailable = b.variants.edges.some(
            (edge) => edge.node.availableForSale
          );
          if (aFeatAvailable !== bFeatAvailable) return bFeatAvailable ? 1 : -1;
          return bCreatedAt - aCreatedAt; // Fallback op nieuwste
      }
    });
    setDisplayedProducts(sorted);
  }, [productsAfterCategoryFilter, sortOption]);

  // Reset naar "Alle Producten" als de hoofd `products` prop verandert (bijv. bij navigatie)
  useEffect(() => {
    setActiveCategory("all");
    setProductsAfterCategoryFilter(products);
  }, [products]);

  const handleClearFilters = () => {
    setActiveCategory("all"); // Dit triggert jouw ProductCategoryFilter om onFilterChangeAction aan te roepen met alle producten
    setSortOption("featured");
    // De onFilterChangeAction van jouw component zou productsAfterCategoryFilter moeten updaten naar alle producten
  };

  const activeFiltersCount =
    (activeCategory !== "all" ? 1 : 0) + (sortOption !== "featured" ? 1 : 0);

  return (
    <div className="space-y-6">
      {showFilters && (
        <div className="mb-8 p-4 sm:p-6 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700 shadow-sm">
          <ProductCategoryFilter
            products={products} // Geef alle producten mee voor de tellingen in jouw filter
            activeCategory={activeCategory}
            onFilterChangeAction={handleCategoryChange} // Gebruik de prop naam van jouw component
          />
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-300">
              <FilterIcon className="w-4 h-4" />
              <span>
                {displayedProducts.length} product
                {displayedProducts.length !== 1 ? "en" : ""} gevonden
                {activeCategory !== "all" &&
                  ` in "${
                    (ProductCategoryFilter as any).categories?.find(
                      (c: any) => c.id === activeCategory
                    )?.name || activeCategory
                  }"`}
                {/* Dit is een beetje een hack om bij de 'categories' array te komen als die intern is. Beter is om CATEGORIES_CONFIG te exporteren. */}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-2 h-auto font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                >
                  <X className="w-3 h-3 mr-1.5" />
                  Wis filters ({activeFiltersCount})
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="min-w-[180px] justify-between bg-white dark:bg-stone-700 hover:bg-stone-100 dark:hover:bg-stone-600 border-stone-300 dark:border-stone-600"
                  >
                    <span className="truncate">{currentSortLabel}</span>
                    <ChevronDown className="w-4 h-4 ml-2 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                >
                  <DropdownMenuLabel className="px-2 py-1.5 text-xs font-medium text-stone-500 dark:text-stone-400">
                    Sorteer op
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-stone-200 dark:bg-stone-700" />
                  {sortOptionsList.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setSortOption(option.value)}
                      className={cn(
                        "flex items-center gap-2 cursor-pointer px-2 py-2 text-sm",
                        "focus:bg-stone-100 dark:focus:bg-stone-700",
                        sortOption === option.value
                          ? "bg-stone-100 dark:bg-stone-700 font-semibold"
                          : "hover:bg-stone-50 dark:hover:bg-stone-700/70"
                      )}
                    >
                      <option.icon className="w-4 h-4 text-stone-600 dark:text-stone-300" />
                      <span className="text-stone-700 dark:text-stone-200">
                        {option.label}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      )}

      {displayedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {displayedProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-stone-300 dark:border-stone-700 rounded-xl">
          <FilterIcon className="w-16 h-16 text-stone-400 dark:text-stone-500 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-stone-800 dark:text-stone-200 mb-2">
            Geen producten gevonden
          </h3>
          <p className="text-stone-600 dark:text-stone-400 mb-6 max-w-md mx-auto">
            Probeer je selectie aan te passen of wis de filters om alle
            producten te zien.
          </p>
          <Button variant="outline" onClick={handleClearFilters}>
            Alle filters wissen & Toon alles
          </Button>
        </div>
      )}
    </div>
  );
}
