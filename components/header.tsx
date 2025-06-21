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
    { name: "Zomer Collectie", href: "/shop" },
    { name: "Cadeaus", href: "/cadeaus" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 dark:bg-stone-950/95 backdrop-blur-md shadow-lg border-b border-stone-200/50 dark:border-stone-800/50"
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
                  className="relative text-stone-700 dark:text-stone-300 hover:text-blue-600 dark:hover:text-blue-400 
                           transition-colors duration-300 font-medium py-2 group"
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
                className="hidden sm:flex btn-ghost rounded-full p-3 relative group"
              >
                <Search className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                <div className="absolute inset-0 bg-blue-600/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
              </Button>

              {/* Theme Toggle */}
              <div className="rounded-full p-1">
                <ThemeToggle />
              </div>

              {/* Wishlist */}
              <Button
                variant="ghost"
                size="sm"
                onClick={openWishlist}
                className="hidden sm:flex btn-ghost rounded-full p-3 relative group"
              >
                <Heart
                  className={`w-5 h-5 group-hover:scale-110 transition-all duration-200 ${
                    wishlistCount > 0 ? "text-red-500" : ""
                  }`}
                />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 min-w-[20px] h-5 animate-pulse">
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
                className="btn-ghost rounded-full p-3 relative group"
              >
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 min-w-[20px] h-5 animate-bounce">
                    {cartCount}
                  </Badge>
                )}
                <div className="absolute inset-0 bg-blue-600/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
              </Button>

              {/* Account */}
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex btn-ghost rounded-full p-3 relative group"
              >
                <User className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                <div className="absolute inset-0 bg-stone-600/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
              </Button>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden btn-ghost rounded-full p-3"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div
            className={`lg:hidden overflow-hidden transition-all duration-500 ${
              isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="border-t border-stone-200/50 dark:border-stone-800/50 py-6 space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-stone-700 dark:text-stone-300 hover:text-blue-600 dark:hover:text-blue-400 
                           transition-colors duration-300 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile-only actions */}
              <div className="flex items-center space-x-4 pt-4 border-t border-stone-200/50 dark:border-stone-800/50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsSearchOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="btn-ghost flex items-center space-x-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Zoeken</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    openWishlist();
                    setIsMenuOpen(false);
                  }}
                  className="btn-ghost flex items-center space-x-2"
                >
                  <Heart className="w-4 h-4" />
                  <span>Wishlist ({wishlistCount})</span>
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
