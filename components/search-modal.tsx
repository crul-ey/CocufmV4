"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Search, X, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { searchProducts } from "@/lib/shopify";
import Image from "next/image";

interface SearchModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
}

interface QuickResult {
  id: string;
  title: string;
  handle: string;
  price: string;
  image?: string;
  vendor?: string;
}

export default function SearchModal({
  isOpen,
  onCloseAction,
}: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [quickResults, setQuickResults] = useState<QuickResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingSearches] = useState([
    "Strandhanddoek",
    "Zomer collectie",
    "Parfum",
    "Kids speelgoed",
    "Lifestyle",
    "Cadeaus",
  ]);

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("recentSearches");
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch (error) {
          console.error("Error loading recent searches:", error);
        }
      }
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = (query: string) => {
    if (typeof window !== "undefined") {
      const updated = [
        query,
        ...recentSearches.filter((s) => s !== query),
      ].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
    }
  };

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setSearchQuery("");
      setQuickResults([]);
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Quick search as user types
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length >= 2) {
      setIsSearching(true);

      searchTimeoutRef.current = setTimeout(async () => {
        try {
          console.log(`🔍 Quick searching for: "${searchQuery}"`);
          const results = await searchProducts(searchQuery, 5); // Limit to 5 for quick results

          const quickResults: QuickResult[] = results.map((product) => ({
            id: product.id,
            title: product.title,
            handle: product.handle,
            price: `€${Number.parseFloat(
              product.priceRange.minVariantPrice.amount
            ).toFixed(2)}`,
            image: product.images.edges[0]?.node.url,
            vendor: product.vendor,
          }));

          setQuickResults(quickResults);
          console.log(`✅ Quick search found ${quickResults.length} results`);
        } catch (error) {
          console.error("Quick search error:", error);
          setQuickResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 300); // Debounce for 300ms
    } else {
      setQuickResults([]);
      setIsSearching(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      console.log(`🚀 Navigating to search results for: "${trimmedQuery}"`);
      saveRecentSearch(trimmedQuery);
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      onCloseAction();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(searchQuery);
    }
    if (e.key === "Escape") {
      onCloseAction();
    }
  };

  const handleQuickResultClick = (handle: string) => {
    router.push(`/product/${handle}`);
    onCloseAction();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onCloseAction}
      />

      {/* Modal */}
      <div className="relative z-10 max-w-2xl mx-auto mt-16 sm:mt-20">
        <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden animate-in slide-in-from-top-4 duration-300 mx-4">
          {/* Header */}
          <div className="flex items-center p-4 sm:p-6 border-b border-stone-200 dark:border-stone-800">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Zoek naar producten, merken, of collecties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 sm:py-4 text-base sm:text-lg border-0 focus:ring-0 bg-stone-50 dark:bg-stone-800 rounded-2xl"
                onKeyDown={handleKeyPress}
              />
              {isSearching && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              onClick={onCloseAction}
              className="ml-4 p-2 hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto">
            {searchQuery.trim().length >= 2 ? (
              <div className="p-4 sm:p-6">
                {/* Quick Results */}
                {quickResults.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-3">
                      Snelle resultaten
                    </h3>
                    <div className="space-y-2">
                      {quickResults.map((result) => (
                        <button
                          key={result.id}
                          onClick={() => handleQuickResultClick(result.handle)}
                          className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors duration-200 text-left group"
                        >
                          {result.image && (
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800 flex-shrink-0">
                              <Image
                                src={result.image || "/placeholder.svg"}
                                alt={result.title}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-stone-900 dark:text-stone-100 truncate group-hover:text-stone-700 dark:group-hover:text-stone-300">
                              {result.title}
                            </p>
                            <div className="flex items-center space-x-2 text-sm text-stone-500 dark:text-stone-400">
                              <span>{result.price}</span>
                              {result.vendor && (
                                <>
                                  <span>•</span>
                                  <span>{result.vendor}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300 flex-shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Search All Results Button */}
                <div className="border-t border-stone-200 dark:border-stone-800 pt-4">
                  <Button
                    onClick={() => handleSearch(searchQuery)}
                    className="w-full flex items-center justify-center space-x-2 py-3 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-200 rounded-xl font-medium transition-colors duration-200"
                  >
                    <Search className="w-4 h-4" />
                    <span>Zoek alle resultaten voor "{searchQuery}"</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-4 sm:p-6 space-y-6">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-3 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Recent gezocht
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((search, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors duration-200 px-3 py-1"
                          onClick={() => handleSearch(search)}
                        >
                          {search}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Searches */}
                <div>
                  <h3 className="text-sm font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-3 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Populair
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((search, index) => (
                      <Badge
                        key={index}
                        className="cursor-pointer bg-gradient-to-r from-stone-900 to-stone-700 hover:from-stone-800 hover:to-stone-600 text-white transition-all duration-200 px-3 py-1"
                        onClick={() => handleSearch(search)}
                      >
                        {search}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Search Tips */}
                <div className="text-center pt-4 border-t border-stone-200 dark:border-stone-800">
                  <p className="text-sm text-stone-500 dark:text-stone-400">
                    💡 Tip: Probeer zoektermen zoals "strand", "zomer", of
                    "parfum"
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
