// app/search/page.tsx

import SearchPageClient from "./SearchPageClient"; // Pas het pad aan indien nodig
import { searchProducts } from "@/lib/shopify"; // Functie om op de server te zoeken

// De pagina is een async Server Component
export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const query = typeof searchParams?.q === "string" ? searchParams.q : "";

  // Voer de eerste zoekopdracht uit op de server
  const initialProducts = await searchProducts(query);

  return (
    <div>
      <h1>Search Results</h1>
      {/* Geef de initiële data en query door als props */}
      <SearchPageClient
        initialProducts={initialProducts}
        initialQuery={query}
      />
    </div>
  );
}
