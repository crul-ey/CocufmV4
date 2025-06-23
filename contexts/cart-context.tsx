"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  type ShopifyCart,
  createCart,
  getCart,
  addToCart as shopifyAddToCart,
  removeFromCart,
  updateCartLine,
} from "@/lib/shopify";

interface CartContextType {
  cart: ShopifyCart | null;
  isLoading: boolean;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  cartCount: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Initialize cart on mount
  useEffect(() => {
    initializeCart();
  }, []);

  const initializeCart = async () => {
    try {
      let cartId = localStorage.getItem("shopify-cart-id");

      if (cartId) {
        const existingCart = await getCart(cartId);
        if (existingCart) {
          setCart(existingCart);
          return existingCart;
        }
      }

      // Create new cart if none exists or existing cart is invalid
      cartId = await createCart();
      localStorage.setItem("shopify-cart-id", cartId);
      const newCart = await getCart(cartId);
      setCart(newCart);
      return newCart;
    } catch (error) {
      console.error("❌ Error initializing cart:", error);
      return null;
    }
  };

  const addItem = async (variantId: string, quantity = 1) => {
    setIsLoading(true);

    try {
      let currentCart = cart;

      // If no cart, initialize one first
      if (!currentCart) {
        console.log("🔄 No cart found, initializing...");
        currentCart = await initializeCart();
        if (!currentCart) {
          throw new Error("Failed to initialize cart");
        }
      }

      console.log("🛒 Adding to cart:", {
        variantId,
        quantity,
        cartId: currentCart.id,
      });
      const updatedCart = await shopifyAddToCart(
        currentCart.id,
        variantId,
        quantity
      );
      setCart(updatedCart);
      setIsOpen(true);
      console.log("✅ Successfully added to cart!");
    } catch (error) {
      console.error("❌ Error adding to cart:", error);

      // Try to reinitialize cart and retry once
      try {
        console.log("🔄 Retrying with new cart...");
        const newCart = await initializeCart();
        if (newCart) {
          const updatedCart = await shopifyAddToCart(
            newCart.id,
            variantId,
            quantity
          );
          setCart(updatedCart);
          setIsOpen(true);
          console.log("✅ Successfully added to cart on retry!");
        }
      } catch (retryError) {
        console.error("❌ Retry also failed:", retryError);
        throw retryError;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (lineId: string) => {
    if (!cart) return;

    setIsLoading(true);
    try {
      const updatedCart = await removeFromCart(cart.id, lineId);
      setCart(updatedCart);
    } catch (error) {
      console.error("Error removing from cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (lineId: string, quantity: number) => {
    if (!cart) return;

    setIsLoading(true);
    try {
      const updatedCart = await updateCartLine(cart.id, lineId, quantity);
      setCart(updatedCart);
    } catch (error) {
      console.error("Error updating cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const cartCount =
    cart?.lines.edges.reduce((total, edge) => total + edge.node.quantity, 0) ||
    0;

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addItem,
        removeItem,
        updateQuantity,
        cartCount,
        isOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
