"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Search, X, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

interface SearchModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
}

export default function SearchModal({
  isOpen,
  onCloseAction,
}: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches] = useState([
    "Strandhanddoek",
    "Zomer accessoires",
    "Hangmat",
    "Strandtas",
  ]);
  const [trendingSearches] = useState([
    "Zomer collectie",
    "Strand handdoeken",
    "Lifestyle",
    "Cadeaus",
  ]);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      onCloseAction();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(searchQuery);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCloseAction}
      />

      {/* Modal */}
      <div className="relative z-10 max-w-2xl mx-auto mt-20">
        <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="flex items-center p-6 border-b border-stone-200 dark:border-stone-800">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
              <Input
                type="text"
                placeholder="Zoek naar producten, merken, of collecties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg border-0 focus:ring-0 bg-stone-50 dark:bg-stone-800 rounded-2xl"
                autoFocus
                onKeyPress={handleKeyPress}
              />
            </div>
            <Button
              variant="ghost"
              onClick={onCloseAction}
              className="ml-4 p-2"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {searchQuery ? (
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold mb-4">
                  Zoeken naar "{searchQuery}"
                </h3>
                <Button
                  onClick={() => handleSearch(searchQuery)}
                  className="btn-primary"
                >
                  Zoeken
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Recent Searches */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-stone-900 dark:text-stone-100">
                    Recent gezocht
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors duration-200"
                        onClick={() => handleSearch(search)}
                      >
                        {search}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Trending Searches */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-stone-900 dark:text-stone-100 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Trending
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((search, index) => (
                      <Badge
                        key={index}
                        className="cursor-pointer bg-gradient-to-r from-stone-900 to-stone-700 hover:from-stone-800 hover:to-stone-600 text-white transition-all duration-200"
                        onClick={() => handleSearch(search)}
                      >
                        {search}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
