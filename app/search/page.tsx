import SearchPageClient from "./SearchPageClient";

interface SearchPageProps {
  searchParams: { q?: string };
}

export const metadata = {
  title: "Zoekresultaten - Cocúfum | Vind Je Perfecte Zomerproduct",
  description:
    "Zoek door onze collectie van premium zomerproducten. Vind strandhanddoeken, accessoires en lifestyle producten.",
};

export default function SearchPage({ searchParams }: SearchPageProps) {
  return <SearchPageClient searchParams={searchParams} />;
}
