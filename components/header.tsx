"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ShoppingBag, Search, Heart, User } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/logo";
import SearchModal from "@/components/search-modal";
import WishlistDrawer from "@/components/wishlist-drawer";
import { ThemeToggle } from "@/components/theme-toggle";

export default function EnhancedHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { cartCount, openCart } = useCart();
  const { wishlistCount, openWishlist } = useWishlist();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Collectie", href: "/shop" },
    { name: "Cadeaus", href: "/cadeaus" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/98 dark:bg-stone-950/98 backdrop-blur-xl shadow-xl border-b-2 border-stone-200/80 dark:border-stone-800/80"
            : "bg-transparent"
        }`}
      >
        <div className="container">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <div className="transform group-hover:scale-105 transition-transform duration-300">
                <Logo variant="full" size="lg" />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative text-stone-800 dark:text-stone-200 hover:text-blue-600 dark:hover:text-blue-400 
                           transition-colors duration-300 font-bold py-2 group"
                >
                  {item.name}
                  <span
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-orange-500 
                                 group-hover:w-full transition-all duration-300"
                  />
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {/* Search */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(true)}
                className="hidden sm:flex btn-ghost rounded-full p-3 relative group bg-stone-100/80 dark:bg-stone-800/80 hover:bg-stone-200 dark:hover:bg-stone-700"
              >
                <Search className="w-5 h-5 group-hover:scale-110 transition-transform duration-200 text-stone-700 dark:text-stone-300" />
                <div className="absolute inset-0 bg-blue-600/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
              </Button>

              {/* Theme Toggle */}
              <div className="rounded-full p-1 bg-stone-100/80 dark:bg-stone-800/80">
                <ThemeToggle />
              </div>

              {/* Wishlist */}
              <Button
                variant="ghost"
                size="sm"
                onClick={openWishlist}
                className="hidden sm:flex btn-ghost rounded-full p-3 relative group bg-stone-100/80 dark:bg-stone-800/80 hover:bg-stone-200 dark:hover:bg-stone-700"
              >
                <Heart
                  className={`w-5 h-5 group-hover:scale-110 transition-all duration-200 ${
                    wishlistCount > 0
                      ? "text-red-500"
                      : "text-stone-700 dark:text-stone-300"
                  }`}
                />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 min-w-[20px] h-5 animate-pulse font-bold">
                    {wishlistCount}
                  </Badge>
                )}
                <div className="absolute inset-0 bg-red-600/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="sm"
                onClick={openCart}
                className="btn-ghost rounded-full p-3 relative group bg-stone-100/80 dark:bg-stone-800/80 hover:bg-stone-200 dark:hover:bg-stone-700"
              >
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform duration-200 text-stone-700 dark:text-stone-300" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 min-w-[20px] h-5 animate-bounce font-bold">
                    {cartCount}
                  </Badge>
                )}
                <div className="absolute inset-0 bg-blue-600/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
              </Button>

              {/* Account */}
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex btn-ghost rounded-full p-3 relative group bg-stone-100/80 dark:bg-stone-800/80 hover:bg-stone-200 dark:hover:bg-stone-700"
              >
                <User className="w-5 h-5 group-hover:scale-110 transition-transform duration-200 text-stone-700 dark:text-stone-300" />
                <div className="absolute inset-0 bg-stone-600/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
              </Button>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden btn-ghost rounded-full p-3 bg-stone-100/80 dark:bg-stone-800/80 hover:bg-stone-200 dark:hover:bg-stone-700"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 text-stone-700 dark:text-stone-300" />
                ) : (
                  <Menu className="w-5 h-5 text-stone-700 dark:text-stone-300" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation - VERBETERD */}
          <div
            className={`lg:hidden overflow-hidden transition-all duration-500 ${
              isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="bg-white/95 dark:bg-stone-950/95 backdrop-blur-xl border-t-2 border-stone-200/50 dark:border-stone-800/50 py-6 space-y-4 rounded-b-2xl shadow-xl mx-4 mb-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-stone-800 dark:text-stone-200 hover:text-blue-600 dark:hover:text-blue-400 
                           transition-colors duration-300 font-bold py-3 px-6 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg mx-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile-only actions */}
              <div className="flex items-center justify-center space-x-4 pt-4 border-t-2 border-stone-200/50 dark:border-stone-800/50 mx-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsSearchOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="btn-ghost flex items-center space-x-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 px-4 py-2 rounded-full font-semibold"
                >
                  <Search className="w-4 h-4 text-stone-700 dark:text-stone-300" />
                  <span className="text-stone-800 dark:text-stone-200">
                    Zoeken
                  </span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    openWishlist();
                    setIsMenuOpen(false);
                  }}
                  className="btn-ghost flex items-center space-x-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 px-4 py-2 rounded-full font-semibold"
                >
                  <Heart className="w-4 h-4 text-stone-700 dark:text-stone-300" />
                  <span className="text-stone-800 dark:text-stone-200">
                    Wishlist ({wishlistCount})
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onCloseAction={() => setIsSearchOpen(false)}
      />
      <WishlistDrawer />
    </>
  );
}
