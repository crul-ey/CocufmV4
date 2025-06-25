"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { useTheme } from "next-themes";
import Logo from "@/components/logo";
import SearchModal from "@/components/search-modal";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Shop", href: "/shop", icon: ShoppingBag },
  { name: "Cadeaus", href: "/cadeaus", icon: Gift },
  { name: "Contact", href: "/contact", icon: Phone },
];

export default function EnhancedHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { items } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { theme, setTheme } = useTheme();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
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

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          isScrolled
            ? "bg-white/95 dark:bg-stone-900/95 backdrop-blur-md shadow-lg border-b border-stone-200/50 dark:border-stone-800/50"
            : "bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm"
        )}
      >
        <div className="container">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2 group">
                <Logo className="h-8 w-8 lg:h-10 lg:w-10 transition-transform duration-300 group-hover:scale-110" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "relative px-3 py-2 text-sm font-medium transition-all duration-300 rounded-lg group",
                      isActive
                        ? "text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-800"
                        : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800/50"
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

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Search Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(true)}
                className="relative p-2 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors duration-200"
              >
                <Search className="w-5 h-5" />
                <span className="sr-only">Zoeken</span>
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="relative p-2 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors duration-200"
              >
                <Sun className="w-5 h-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute w-5 h-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              {/* Wishlist */}
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="relative p-2 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors duration-200"
              >
                <Link href="/wishlist">
                  <Heart className="w-5 h-5" />
                  {wishlistItems.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 hover:bg-red-600">
                      {wishlistItems.length}
                    </Badge>
                  )}
                  <span className="sr-only">Verlanglijst</span>
                </Link>
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="relative p-2 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors duration-200"
              >
                <Link href="/cart">
                  <ShoppingCart className="w-5 h-5" />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-200">
                      {totalItems}
                    </Badge>
                  )}
                  <span className="sr-only">Winkelwagen</span>
                </Link>
              </Button>
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center space-x-2">
              {/* Mobile Search */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors duration-200"
              >
                <Search className="w-5 h-5" />
                <span className="sr-only">Zoeken</span>
              </Button>

              {/* Mobile Cart */}
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="relative p-2 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors duration-200"
              >
                <Link href="/cart">
                  <ShoppingCart className="w-5 h-5" />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900">
                      {totalItems}
                    </Badge>
                  )}
                  <span className="sr-only">Winkelwagen</span>
                </Link>
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors duration-200"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
                <span className="sr-only">Menu</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "lg:hidden fixed inset-x-0 top-16 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 shadow-lg transition-all duration-300 ease-in-out",
            isMenuOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-4 pointer-events-none"
          )}
        >
          <div className="container py-6">
            {/* Mobile Navigation */}
            <nav className="space-y-2 mb-6">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
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

            {/* Mobile Quick Actions */}
            <div className="border-t border-stone-200 dark:border-stone-800 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/wishlist"
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-stone-100 dark:bg-stone-800 rounded-xl text-stone-900 dark:text-stone-100 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors duration-200"
                >
                  <Heart className="w-5 h-5" />
                  <span className="font-medium">Verlanglijst</span>
                  {wishlistItems.length > 0 && (
                    <Badge className="bg-red-500 text-white">
                      {wishlistItems.length}
                    </Badge>
                  )}
                </Link>

                <Button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors duration-200"
                  variant="ghost"
                >
                  <Sun className="w-5 h-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute w-5 h-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="font-medium">Thema</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onCloseAction={() => setIsSearchOpen(false)}
      />
    </>
  );
}
