// app/search/SearchPageClient.tsx

"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import ProductGrid from "@/components/product-grid";
import type { ShopifyProduct } from "@/lib/shopify";

// Definieer de props die het component nu accepteert
interface SearchPageClientProps {
  initialProducts: ShopifyProduct[];
  initialQuery: string;
}

const SearchPageClient = ({
  initialProducts,
  initialQuery,
}: SearchPageClientProps) => {
  // Gebruik de props om de initiële state te zetten
  const [searchedProducts, setSearchedProducts] =
    useState<ShopifyProduct[]>(initialProducts);
  const [loading, setLoading] = useState(false);

  // Gebruik de hooks voor *latere* navigatie en het lezen van de URL
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("q") || "";

  // Deze useEffect draait nu alleen als de query in de URL *verandert* na de eerste laadbeurt
  useEffect(() => {
    // Sla de fetch over als de query overeenkomt met de initiële query van de server
    if (currentQuery === initialQuery) {
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${currentQuery}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSearchedProducts(data.products || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setSearchedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (currentQuery) {
      fetchProducts();
    } else {
      setSearchedProducts([]);
    }
  }, [currentQuery, initialQuery]); // Reageer op veranderingen in de URL query

  // De rest van je JSX blijft hetzelfde
  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {searchedProducts.length > 0 ? (
            <ProductGrid products={searchedProducts} showFilters={true} />
          ) : (
            // Laat een andere boodschap zien als er een query is maar geen resultaten
            currentQuery && <p>No products found for "{currentQuery}"</p>
          )}
        </>
      )}
    </div>
  );
};

export default SearchPageClient;
