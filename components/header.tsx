"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Menu,
  X,
  Search,
  ShoppingCart,
  Heart,
  Sun,
  Moon,
  Home,
  ShoppingBag,
  Gift,
  Phone,
  Info,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { useTheme } from "next-themes";
import Logo from "@/components/logo";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import SearchModal from "@/components/search-modal";

// Dynamically import the cart drawer
const EnhancedCartDrawer = dynamic(() => import("@/components/cart-drawer"), {
  ssr: false, // This component uses client-side state, so we don't need it on the server
});

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Landing", href: "/landing", icon: Sparkles }, // Add this line
  { name: "Shop", href: "/shop", icon: ShoppingBag },
  { name: "Cadeaus", href: "/cadeaus", icon: Gift },
  { name: "Bestelstatus", href: "/bestelstatus", icon: Info },
  { name: "Contact", href: "/contact", icon: Phone },
];

export default function EnhancedHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const { cartCount, openCart } = useCart(); // Use cartCount and openCart
  const { items: wishlistItems } = useWishlist();

  const { theme, setTheme } = useTheme();

  // Fix hydration by ensuring component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const closeMenu = () => setIsMenuOpen(false);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm">
        <div className="container">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2 group">
                <Logo className="h-8 w-8 lg:h-10 lg:w-10" />
              </Link>
            </div>
            <div className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative px-3 py-2 text-sm font-medium text-stone-600 dark:text-stone-400"
                >
                  <span className="flex items-center space-x-2">
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </span>
                </Link>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="p-2 rounded-full">
                <Search className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="p-2 rounded-full">
                <Sun className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="p-2 rounded-full">
                <Heart className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="p-2 rounded-full">
                <ShoppingCart className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          isScrolled || isMenuOpen
            ? "bg-white/95 dark:bg-stone-900/95 backdrop-blur-md shadow-lg border-b border-stone-200/50 dark:border-stone-800/50"
            : "bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm"
        )}
      >
        <div className="container">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center">
              <Link
                href="/"
                className="flex items-center space-x-2 group"
                onClick={closeMenu}
              >
                <Logo className="h-8 w-8 lg:h-10 lg:w-10 transition-transform duration-300 group-hover:scale-110" />
              </Link>
            </div>

            <nav className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "relative px-3 py-2 text-sm font-medium transition-all duration-300 rounded-lg group hover:bg-stone-50 dark:hover:bg-stone-800/50",
                      isActive
                        ? "text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-800"
                        : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                    )}
                  >
                    <span className="flex items-center space-x-2">
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </span>
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-stone-900 dark:bg-stone-100 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden lg:flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="relative p-2 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors duration-200 rounded-full"
                aria-label="Zoeken"
              >
                <Search className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="relative p-2 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors duration-200 rounded-full"
                aria-label="Thema wisselen"
              >
                {/* Fix: Simplified theme icon rendering to prevent hydration mismatch */}
                {theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="relative p-2 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors duration-200 rounded-full"
                aria-label="Verlanglijst"
              >
                <Link href="/wishlist">
                  <Heart className="w-5 h-5" />
                  {wishlistItems.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 hover:bg-red-600 text-white rounded-full">
                      {wishlistItems.length}
                    </Badge>
                  )}
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={openCart}
                className="relative p-2 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors duration-200 rounded-full"
                aria-label="Winkelwagen"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-200 rounded-full">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </div>

            <div className="flex lg:hidden items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors duration-200 rounded-full"
                aria-label="Zoeken"
              >
                <Search className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={openCart}
                className="relative p-2 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors duration-200 rounded-full"
                aria-label="Winkelwagen"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-full">
                    {cartCount}
                  </Badge>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors duration-200 rounded-full"
                aria-label={isMenuOpen ? "Menu sluiten" : "Menu openen"}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "lg:hidden fixed inset-x-0 top-16 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 shadow-lg transition-transform duration-300 ease-in-out transform-gpu",
            "h-[calc(100dvh-4rem)] overflow-y-auto pb-16",
            isMenuOpen
              ? "translate-y-0 opacity-100 pointer-events-auto"
              : "-translate-y-full opacity-0 pointer-events-none"
          )}
        >
          <div className="container py-6">
            <nav className="space-y-2 mb-6">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={closeMenu}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200",
                      isActive
                        ? "text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-800"
                        : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800/50"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-stone-200 dark:border-stone-800 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  asChild
                  variant="outline"
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors duration-200 font-medium"
                  onClick={closeMenu}
                >
                  <Link
                    href="/wishlist"
                    className="w-full h-full flex items-center justify-center space-x-2"
                  >
                    <Heart className="w-5 h-5" />
                    <span>Verlanglijst</span>
                    {wishlistItems.length > 0 && (
                      <Badge className="bg-red-500 text-white">
                        {wishlistItems.length}
                      </Badge>
                    )}
                  </Link>
                </Button>
                <Button
                  onClick={() => {
                    setTheme(theme === "dark" ? "light" : "dark");
                  }}
                  variant="outline"
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors duration-200 font-medium"
                >
                  {/* Fix: Simplified theme icon rendering for mobile menu too */}
                  {theme === "dark" ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                  <span className="ml-2">Thema</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <Suspense fallback={null}>
        <EnhancedCartDrawer />
      </Suspense>
      <SearchModal
        isOpen={isSearchOpen}
        onCloseAction={() => setIsSearchOpen(false)}
      />
    </>
  );
}
