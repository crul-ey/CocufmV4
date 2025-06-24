// contexts/cart-context.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  useCallback, // useCallback to prevent unnecessary re-renders/re-creations of functions
} from "react";
import {
  type ShopifyCart,
  createCart,
  getCart,
  addToCart as shopifyAddToCart, // Alias for clarity
  removeFromCart,
  updateCartLine,
} from "@/lib/shopify";

// Definieer aangepaste fouttypen voor betere foutafhandeling in de UI
export class CartInitializationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CartInitializationError";
  }
}

export class CartModificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CartModificationError";
  }
}

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

  // Function to initialize or retrieve the cart
  // Gebruik useCallback om te voorkomen dat deze functie onnodig opnieuw wordt gemaakt
  const initializeCart = useCallback(async (): Promise<ShopifyCart | null> => {
    setIsLoading(true); // Zet loading op true tijdens initialisatie
    try {
      let cartId = localStorage.getItem("shopify-cart-id");
      console.log("🛒 Initializing cart. Stored cartId:", cartId);

      if (cartId) {
        const existingCart = await getCart(cartId);
        if (existingCart) {
          setCart(existingCart);
          console.log("✅ Existing cart loaded:", existingCart.id);
          return existingCart;
        } else {
          // If cartId exists but getCart returns null (e.g., cart expired/deleted)
          console.warn("⚠️ Stored cartId is invalid or expired. Creating new cart.");
        }
      }

      // Create new cart if none exists or existing cart is invalid
      const newCartId = await createCart();
      localStorage.setItem("shopify-cart-id", newCartId);
      const newCart = await getCart(newCartId); // Haal de zojuist gemaakte winkelwagen op
      if (!newCart) {
          throw new CartInitializationError("Failed to retrieve newly created cart.");
      }
      setCart(newCart);
      console.log("✅ New cart created and loaded:", newCart.id);
      return newCart;
    } catch (error) {
      console.error("❌ Error initializing cart:", error instanceof Error ? error.message : String(error));
      // Gooi een meer specifieke fout door
      throw new CartInitializationError(`Failed to initialize cart: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false); // Zet loading altijd uit
    }
  }, []); // Lege dependency array betekent dat de functie maar één keer wordt gemaakt

  // Initialize cart on mount
  useEffect(() => {
    initializeCart().catch(err => {
      console.error("Critical error during cart initialization on mount:", err);
      // Hier kun je evt. een melding tonen aan de gebruiker dat de winkelwagen niet geladen kon worden
      // toast({ title: "Winkelwagen fout", description: "Kon winkelwagen niet laden.", variant: "destructive" });
    });
  }, [initializeCart]); // initializeCart is nu een stabiele functie door useCallback

  const addItem = useCallback(async (variantId: string, quantity = 1) => {
    setIsLoading(true);
    let currentCart = cart;

    try {
      // If no cart, initialize one first. This covers initial load and expired carts.
      if (!currentCart) {
        console.log("🔄 No cart found, attempting to initialize...");
        try {
          currentCart = await initializeCart();
          if (!currentCart) {
            throw new Error("Failed to initialize cart after attempt."); // Moet zelden gebeuren door throw in initializeCart
          }
          console.log("✅ Cart initialized successfully during addItem.");
        } catch (initError) {
          console.error("❌ Failed to initialize cart during addItem:", initError);
          throw new CartInitializationError(`Could not initialize cart to add item: ${initError instanceof Error ? initError.message : String(initError)}`);
        }
      }

      console.log(`🛒 Attempting to add variant ${variantId} (qty: ${quantity}) to cart ${currentCart.id}`);
      const updatedCart = await shopifyAddToCart(
        currentCart.id,
        variantId,
        quantity
      );
      setCart(updatedCart);
      setIsOpen(true);
      console.log("✅ Successfully added to cart. Cart ID:", updatedCart.id);

    } catch (error) {
      console.error("❌ Error adding to cart (initial attempt):", error);
      // Probeer de winkelwagen opnieuw te initialiseren en probeer het nog een keer
      // Dit vangt gevallen op waarin de cart ID onlangs ongeldig is geworden
      if (error instanceof Error && (error.message.includes("Invalid cartId") || error.name === "AddToCartError")) {
          console.log("🔄 Cart ID might be invalid. Retrying with a new cart...");
          try {
              const newCart = await initializeCart(); // Initialiseert een nieuwe cart
              if (newCart) {
                  console.log(`🔄 Retrying add to cart with new cart ${newCart.id} for variant ${variantId}`);
                  const updatedCartOnRetry = await shopifyAddToCart(
                      newCart.id,
                      variantId,
                      quantity
                  );
                  setCart(updatedCartOnRetry);
                  setIsOpen(true);
                  console.log("✅ Successfully added to cart on retry with new cart!");
              } else {
                  throw new CartInitializationError("Failed to reinitialize cart for retry.");
              }
          } catch (retryError) {
              console.error("❌ Retry to add to cart also failed:", retryError);
              // Gooi de uiteindelijke fout door naar de aanroeper (EnhancedProductCard)
              throw new CartModificationError(`Failed to add item to cart after retry: ${retryError instanceof Error ? retryError.message : String(retryError)}`);
          }
      } else {
          // Gooi originele, niet-cartId gerelateerde fouten direct door
          throw new CartModificationError(`Failed to add item to cart: ${error instanceof Error ? error.message : String(error)}`);
      }
    } finally {
      setIsLoading(false); // Zet loading altijd uit
    }
  }, [cart, initializeCart]); // Afhankelijkheden voor useCallback

  const removeItem = useCallback(async (lineId: string) => {
    if (!cart) {
      console.warn("🚫 Cannot remove item: No cart available.");
      return;
    }

    setIsLoading(true);
    try {
      console.log(`🗑️ Removing line ${lineId} from cart ${cart.id}`);
      const updatedCart = await removeFromCart(cart.id, lineId);
      setCart(updatedCart);
      console.log("✅ Item successfully removed.");
    } catch (error) {
      console.error(`❌ Error removing line ${lineId} from cart:`, error instanceof Error ? error.message : String(error));
      throw new CartModificationError(`Failed to remove item from cart: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  }, [cart]);

  const updateQuantity = useCallback(async (lineId: string, quantity: number) => {
    if (!cart) {
      console.warn("🚫 Cannot update quantity: No cart available.");
      return;
    }

    setIsLoading(true);
    try {
      console.log(`🔄 Updating line ${lineId} in cart ${cart.id} to quantity ${quantity}`);
      const updatedCart = await updateCartLine(cart.id, lineId, quantity);
      setCart(updatedCart);
      console.log("✅ Cart quantity successfully updated.");
    } catch (error) {
      console.error(`❌ Error updating quantity for line ${lineId} in cart:`, error instanceof Error ? error.message : String(error));
      throw new CartModificationError(`Failed to update item quantity in cart: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  }, [cart]);

  const cartCount =
    cart?.lines.edges.reduce((total, edge) => total + edge.node.quantity, 0) ||
    0;

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

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
