"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useToast } from "@/hooks/use-toast";

export interface WishlistItem {
  id: string;
  handle: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  image?: {
    url: string;
    altText: string;
  };
  addedAt: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  isLoading: boolean;
  addToWishlist: (item: Omit<WishlistItem, "addedAt">) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
  wishlistCount: number;
  isOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem("cocufum-wishlist");
    if (savedWishlist) {
      try {
        setItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error("Error loading wishlist:", error);
      }
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("cocufum-wishlist", JSON.stringify(items));
  }, [items]);

  const addToWishlist = (item: Omit<WishlistItem, "addedAt">) => {
    setIsLoading(true);

    // Check if item already exists
    if (items.some((wishlistItem) => wishlistItem.id === item.id)) {
      toast({
        title: "Al in wishlist",
        description: `${item.title} staat al in je wishlist.`,
        variant: "default",
      });
      setIsLoading(false);
      return;
    }

    const newItem: WishlistItem = {
      ...item,
      addedAt: new Date().toISOString(),
    };

    setItems((prev) => [newItem, ...prev]);

    toast({
      title: "Toegevoegd aan wishlist! ❤️",
      description: `${item.title} is toegevoegd aan je wishlist.`,
      duration: 3000,
    });

    setIsLoading(false);
  };

  const removeFromWishlist = (id: string) => {
    const item = items.find((item) => item.id === id);
    setItems((prev) => prev.filter((item) => item.id !== id));

    if (item) {
      toast({
        title: "Verwijderd uit wishlist",
        description: `${item.title} is verwijderd uit je wishlist.`,
        duration: 2000,
      });
    }
  };

  const isInWishlist = (id: string) => {
    return items.some((item) => item.id === id);
  };

  const clearWishlist = () => {
    setItems([]);
    toast({
      title: "Wishlist geleegd",
      description: "Alle items zijn verwijderd uit je wishlist.",
      duration: 2000,
    });
  };

  const openWishlist = () => setIsOpen(true);
  const closeWishlist = () => setIsOpen(false);

  return (
    <WishlistContext.Provider
      value={{
        items,
        isLoading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        wishlistCount: items.length,
        isOpen,
        openWishlist,
        closeWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
