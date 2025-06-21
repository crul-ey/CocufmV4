"use client";

import { Suspense } from "react";
import { searchProducts } from "@/lib/shopify";
import Header from "@/components/header";
import CartDrawer from "@/components/cart-drawer";
import ProductGrid from "@/components/product-grid";
import { Search, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SearchPageProps {
  searchParams: { q?: string };
}

function SearchResultsWrapper({ query }: { query: string }) {
  return (
    <Suspense fallback={<SearchResultsSkeleton />}>
      <SearchResultsContent query={query} />
    </Suspense>
  );
}

async function SearchResultsContent({ query }: { query: string }) {
  try {
    const products = await searchProducts(query, 24);

    // Add createdAt for sorting
    const productsWithCreatedAt = products.map(
      (product: any, index: number) => ({
        ...product,
        createdAt:
          product.createdAt ??
          new Date(Date.now() - index * 86400000).toISOString(),
      })
    );

    return (
      <div className="space-y-8">
        {/* Results header */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">
              {products.length > 0 ? (
                <>
                  {products.length} resultaten voor "{query}"
                </>
              ) : (
                <>Geen resultaten voor "{query}"</>
              )}
            </h2>
            {products.length > 0 && (
              <p className="text-stone-600 dark:text-stone-400">
                Gevonden in onze collectie van premium zomerproducten
              </p>
            )}
          </div>
        </div>

        {products.length > 0 ? (
          <ProductGrid products={productsWithCreatedAt} showFilters={true} />
        ) : (
          <NoResults query={query} />
        )}
      </div>
    );
  } catch (error) {
    console.error("Search error:", error);
    return <SearchError />;
  }
}

function SearchResultsSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="space-y-2">
          <div className="h-8 bg-stone-200 dark:bg-stone-700 rounded w-64 animate-pulse" />
          <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-48 animate-pulse" />
        </div>
      </div>

      {/* Products skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="group">
            <div className="card overflow-hidden animate-pulse">
              <div className="aspect-square bg-gradient-to-r from-stone-200 via-stone-300 to-stone-200 dark:from-stone-700 dark:via-stone-600 dark:to-stone-700 bg-[length:200%_100%] animate-shimmer rounded-t-2xl" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gradient-to-r from-stone-200 via-stone-300 to-stone-200 dark:from-stone-700 dark:via-stone-600 dark:to-stone-700 bg-[length:200%_100%] animate-shimmer rounded w-3/4" />
                <div className="space-y-2">
                  <div className="h-3 bg-gradient-to-r from-stone-200 via-stone-300 to-stone-200 dark:from-stone-700 dark:via-stone-600 dark:to-stone-700 bg-[length:200%_100%] animate-shimmer rounded w-full" />
                  <div className="h-3 bg-gradient-to-r from-stone-200 via-stone-300 to-stone-200 dark:from-stone-700 dark:via-stone-600 dark:to-stone-700 bg-[length:200%_100%] animate-shimmer rounded w-2/3" />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div className="h-5 bg-gradient-to-r from-stone-200 via-stone-300 to-stone-200 dark:from-stone-700 dark:via-stone-600 dark:to-stone-700 bg-[length:200%_100%] animate-shimmer rounded w-20" />
                  <div className="h-4 bg-gradient-to-r from-stone-200 via-stone-300 to-stone-200 dark:from-stone-700 dark:via-stone-600 dark:to-stone-700 bg-[length:200%_100%] animate-shimmer rounded w-16" />
                </div>
                <div className="h-10 bg-gradient-to-r from-stone-200 via-stone-300 to-stone-200 dark:from-stone-700 dark:via-stone-600 dark:to-stone-700 bg-[length:200%_100%] animate-shimmer rounded-full w-full mt-3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NoResults({ query }: { query: string }) {
  const suggestions = [
    "Controleer je spelling",
    "Probeer meer algemene zoektermen",
    "Gebruik minder woorden",
    "Zoek op merk of producttype",
  ];

  const popularSearches = [
    { term: "strandhanddoek", href: "/search?q=strandhanddoek" },
    { term: "zomer", href: "/search?q=zomer" },
    { term: "strand", href: "/search?q=strand" },
    { term: "accessoires", href: "/search?q=accessoires" },
  ];

  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-8">
        <Search className="w-12 h-12 text-stone-400" />
      </div>

      <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-4">
        Geen resultaten gevonden
      </h3>

      <p className="text-stone-600 dark:text-stone-400 mb-8 max-w-md mx-auto">
        We konden geen producten vinden die overeenkomen met "{query}". Probeer
        het met andere zoektermen.
      </p>

      <div className="max-w-md mx-auto mb-12">
        <h4 className="font-semibold text-stone-900 dark:text-stone-100 mb-4">
          Zoektips:
        </h4>
        <ul className="text-left space-y-2 text-stone-600 dark:text-stone-400">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-center">
              <div className="w-2 h-2 bg-stone-400 rounded-full mr-3" />
              {suggestion}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h4 className="font-semibold text-stone-900 dark:text-stone-100 mb-4">
          Populaire zoekopdrachten:
        </h4>
        <div className="flex flex-wrap justify-center gap-2">
          {popularSearches.map((search) => (
            <Link
              key={search.term}
              href={search.href}
              className="px-4 py-2 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-full hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors duration-200"
            >
              {search.term}
            </Link>
          ))}
        </div>
      </div>

      <Button asChild className="btn-primary">
        <Link href="/shop">Bekijk Alle Producten</Link>
      </Button>
    </div>
  );
}

function SearchError() {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-8">
        <Search className="w-12 h-12 text-red-500" />
      </div>

      <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-4">
        Er ging iets mis
      </h3>

      <p className="text-stone-600 dark:text-stone-400 mb-8 max-w-md mx-auto">
        We konden je zoekopdracht niet uitvoeren. Probeer het opnieuw of ga
        terug naar de shop.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={() => window.location.reload()} variant="outline">
          Probeer Opnieuw
        </Button>
        <Button asChild className="btn-primary">
          <Link href="/shop">Ga naar Shop</Link>
        </Button>
      </div>
    </div>
  );
}

export default function SearchPageClient({ searchParams }: SearchPageProps) {
  const query = searchParams.q || "";

  return (
    <>
      <Header />
      <CartDrawer />

      {/* Hero Section with search context */}
      <div className="relative pt-20 lg:pt-24 pb-8 lg:pb-12 bg-gradient-to-br from-stone-50 via-white to-stone-100 dark:from-stone-900 dark:via-stone-800 dark:to-stone-900">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-stone-600 dark:text-stone-400 mb-6">
            <Link
              href="/"
              className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors duration-200"
            >
              Home
            </Link>
            <span>/</span>
            <Link
              href="/shop"
              className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors duration-200"
            >
              Shop
            </Link>
            <span>/</span>
            <span className="text-stone-900 dark:text-stone-100 font-medium">
              Zoeken
            </span>
          </nav>

          {/* Back button */}
          <div className="mb-6">
            <Button
              variant="ghost"
              asChild
              className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
            >
              <Link href="/shop">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Terug naar Shop
              </Link>
            </Button>
          </div>

          {/* Search header */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-stone-900/10 to-stone-700/10 dark:from-stone-100/10 dark:to-stone-300/10 text-stone-700 dark:text-stone-300 text-sm font-medium mb-6">
              <Search className="w-4 h-4" />
              Zoekresultaten
            </div>

            <h1 className="font-serif text-3xl lg:text-5xl font-bold text-stone-900 dark:text-stone-100 mb-6 leading-tight">
              {query ? (
                <>
                  Zoeken naar{" "}
                  <span className="bg-gradient-to-r from-stone-900 via-stone-700 to-stone-900 dark:from-stone-100 dark:via-stone-300 dark:to-stone-100 bg-clip-text text-transparent">
                    "{query}"
                  </span>
                </>
              ) : (
                "Zoeken in onze collectie"
              )}
            </h1>

            {query && (
              <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
                Doorzoek onze volledige collectie van premium zomerproducten
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="py-8 lg:py-12 bg-white dark:bg-stone-900 transition-colors duration-300">
        <div className="container">
          {query ? (
            <SearchResultsWrapper query={query} />
          ) : (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-stone-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-4">
                Voer een zoekterm in
              </h2>
              <p className="text-stone-600 dark:text-stone-400 mb-8">
                Gebruik de zoekbalk bovenaan om producten te vinden
              </p>
              <Button asChild className="btn-primary">
                <Link href="/shop">Bekijk Alle Producten</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
