import { Suspense } from "react";
import { getProducts } from "@/lib/shopify";
import Header from "@/components/header";
import CartDrawer from "@/components/cart-drawer";
import ProductGrid from "@/components/product-grid";
import { Sparkles, TrendingUp, Award, ShoppingBag } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Premium Collectie - Cocúfum | Luxe Lifestyle Producten",
  description:
    "Ontdek onze exclusieve collectie van premium lifestyle producten. Zorgvuldig geselecteerd voor kwaliteit, stijl en duurzaamheid. Gratis verzending vanaf €75.",
  keywords:
    "luxe producten, lifestyle, premium kwaliteit, strandhanddoeken, cadeaus, zomer collectie",
  openGraph: {
    title: "Premium Collectie - Cocúfum",
    description:
      "Ontdek onze exclusieve collectie van premium lifestyle producten",
    images: ["/og-shop.jpg"],
  },
};

function ProductGridWrapper() {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <ProductGridContent />
    </Suspense>
  );
}

async function ProductGridContent() {
  // Fetch more products for better sorting demonstration
  const products = await getProducts(50);

  // Ensure each product has proper dates for sorting
  const productsWithDates = products.map((product: any, index: number) => ({
    ...product,
    createdAt:
      product.createdAt ??
      product.publishedAt ??
      new Date(Date.now() - index * 86400000).toISOString(),
    publishedAt:
      product.publishedAt ??
      product.createdAt ??
      new Date(Date.now() - index * 86400000).toISOString(),
  }));

  return <ProductGrid products={productsWithDates} showFilters={true} />;
}

function ProductGridSkeleton() {
  return (
    <div className="space-y-8">
      {/* Skeleton for filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-wrap gap-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-8 bg-stone-200 dark:bg-stone-700 rounded-full w-20 animate-pulse"
            />
          ))}
        </div>
        <div className="h-8 bg-stone-200 dark:bg-stone-700 rounded w-40 animate-pulse" />
      </div>

      {/* Product count skeleton */}
      <div className="flex justify-between">
        <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-32 animate-pulse" />
        <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-40 animate-pulse hidden sm:block" />
      </div>

      {/* Skeleton for products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="group">
            <div className="card overflow-hidden animate-pulse">
              {/* Image skeleton with shimmer effect */}
              <div className="aspect-square bg-gradient-to-r from-stone-200 via-stone-300 to-stone-200 dark:from-stone-700 dark:via-stone-600 dark:to-stone-700 bg-[length:200%_100%] animate-shimmer rounded-t-2xl" />

              <div className="p-4 space-y-3">
                {/* Title skeleton */}
                <div className="h-4 bg-gradient-to-r from-stone-200 via-stone-300 to-stone-200 dark:from-stone-700 dark:via-stone-600 dark:to-stone-700 bg-[length:200%_100%] animate-shimmer rounded w-3/4" />

                {/* Description skeleton */}
                <div className="space-y-2">
                  <div className="h-3 bg-gradient-to-r from-stone-200 via-stone-300 to-stone-200 dark:from-stone-700 dark:via-stone-600 dark:to-stone-700 bg-[length:200%_100%] animate-shimmer rounded w-full" />
                  <div className="h-3 bg-gradient-to-r from-stone-200 via-stone-300 to-stone-200 dark:from-stone-700 dark:via-stone-600 dark:to-stone-700 bg-[length:200%_100%] animate-shimmer rounded w-2/3" />
                </div>

                {/* Price and rating skeleton */}
                <div className="flex justify-between items-center pt-2">
                  <div className="h-5 bg-gradient-to-r from-stone-200 via-stone-300 to-stone-200 dark:from-stone-700 dark:via-stone-600 dark:to-stone-700 bg-[length:200%_100%] animate-shimmer rounded w-20" />
                  <div className="h-4 bg-gradient-to-r from-stone-200 via-stone-300 to-stone-200 dark:from-stone-700 dark:via-stone-600 dark:to-stone-700 bg-[length:200%_100%] animate-shimmer rounded w-16" />
                </div>

                {/* Button skeleton */}
                <div className="h-10 bg-gradient-to-r from-stone-200 via-stone-300 to-stone-200 dark:from-stone-700 dark:via-stone-600 dark:to-stone-700 bg-[length:200%_100%] animate-shimmer rounded-full w-full mt-3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Premium stats component
function ShopStats() {
  const stats = [
    { icon: Award, label: "Premium Kwaliteit", value: "100%" },
    { icon: TrendingUp, label: "Tevreden Klanten", value: "4.9/5" },
    { icon: Sparkles, label: "Nieuwe Producten", value: "Wekelijks" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="text-center p-6 rounded-2xl bg-gradient-to-br from-white to-stone-50 dark:from-stone-800 dark:to-stone-900 border border-stone-200 dark:border-stone-700 shadow-sm hover:shadow-md transition-all duration-300 group"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-stone-900 to-stone-700 dark:from-stone-100 dark:to-stone-300 text-white dark:text-stone-900 mb-3 group-hover:scale-110 transition-transform duration-300">
            <stat.icon className="w-6 h-6" />
          </div>
          <div className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-1">
            {stat.value}
          </div>
          <div className="text-sm text-stone-600 dark:text-stone-400">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ShopPage() {
  return (
    <>
      <Header />
      <CartDrawer />

      {/* Hero Section with proper header spacing */}
      <div className="relative pt-20 lg:pt-24 pb-8 lg:pb-12 bg-gradient-to-br from-stone-50 via-white to-stone-100 dark:from-stone-900 dark:via-stone-800 dark:to-stone-900 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%)]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-100/20 to-transparent dark:from-orange-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-100/20 to-transparent dark:from-blue-900/10 rounded-full blur-3xl" />

        <div className="container relative">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-stone-600 dark:text-stone-400 mb-6">
            <Link
              href="/"
              className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors duration-200 cursor-pointer"
            >
              Home
            </Link>
            <span>/</span>
            <span className="text-stone-900 dark:text-stone-100 font-medium">
              Shop
            </span>
          </nav>

          {/* Main heading */}
          <div className="text-center max-w-4xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-stone-900/10 to-stone-700/10 dark:from-stone-100/10 dark:to-stone-300/10 text-stone-700 dark:text-stone-300 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Premium Collectie 2025
            </div>

            <h1 className="font-serif text-4xl lg:text-6xl font-bold text-stone-900 dark:text-stone-100 mb-6 leading-tight">
              Ontdek Onze
              <span className="block bg-gradient-to-r from-stone-900 via-stone-700 to-stone-900 dark:from-stone-100 dark:via-stone-300 dark:to-stone-100 bg-clip-text text-transparent">
                Exclusieve Collectie
              </span>
            </h1>

            <p className="text-xl text-stone-600 dark:text-stone-400 max-w-3xl mx-auto leading-relaxed">
              Zorgvuldig geselecteerde lifestyle producten van de hoogste
              kwaliteit. Elk item is gekozen voor zijn unieke karakter,
              duurzaamheid en tijdloze elegantie.
            </p>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 mt-8 text-sm text-stone-600 dark:text-stone-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Gratis verzending vanaf €75
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                14 dagen retourrecht
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                Premium klantenservice
              </div>
            </div>
          </div>

          <ShopStats />
        </div>
      </div>

      {/* Main content with proper spacing */}
      <main className="py-8 lg:py-12 bg-white dark:bg-stone-900 transition-colors duration-300">
        <div className="container">
          {/* Section header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">
                Alle Producten
              </h2>
              <p className="text-stone-600 dark:text-stone-400">
                Ontdek onze volledige collectie van premium lifestyle producten
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
              <ShoppingBag className="w-4 h-4" />
              Filter & sorteer hieronder
            </div>
          </div>

          <ProductGridWrapper />
        </div>
      </main>

      {/* Bottom CTA section */}
      <section className="py-16 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 dark:from-stone-100 dark:via-stone-50 dark:to-stone-100">
        <div className="container text-center">
          <h3 className="text-3xl font-bold text-white dark:text-stone-900 mb-4">
            Niet gevonden wat je zocht?
          </h3>
          <p className="text-stone-300 dark:text-stone-600 mb-8 max-w-2xl mx-auto">
            Ons team helpt je graag bij het vinden van het perfecte product.
            Neem contact met ons op voor persoonlijk advies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-3 bg-white dark:bg-stone-900 text-stone-900 dark:text-white rounded-full font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 transition-all duration-300 transform hover:scale-105"
            >
              Contact opnemen
            </Link>
            <Link
              href="/cadeaus"
              className="px-8 py-3 border-2 border-white dark:border-stone-900 text-white dark:text-stone-900 rounded-full font-semibold hover:bg-white dark:hover:bg-stone-900 hover:text-stone-900 dark:hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              Bekijk cadeaus
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
