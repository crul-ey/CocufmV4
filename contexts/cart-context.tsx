"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  useCallback,
} from "react";
import {
  type ShopifyCart,
  type ShopifyCartLineMerchandise, // Import this for better typing
  createCart,
  getCart,
  addToCart as shopifyAddToCart,
  removeFromCart,
  updateCartLine,
} from "@/lib/shopify";

// Enhanced CartItem interface
export interface CartItem {
  id: string; // Line ID
  variantId: string; // Variant ID (merchandise.id)
  productId: string; // Product ID (merchandise.product.id)
  title: string; // Variant title (merchandise.title)
  quantity: number;
  image: string | null;
  price: {
    // Variant price
    amount: string;
    currencyCode: string;
  };
  compareAtPrice?: {
    // Variant compareAtPrice
    amount: string;
    currencyCode: string;
  } | null;
  totalPrice: {
    // Line total cost
    amount: string;
    currencyCode: string;
  };
  productTitle: string; // Parent product title
  productHandle: string; // Parent product handle
  vendor: string; // Parent product vendor
  tags: string[]; // Parent product tags
  selectedOptions: Array<{
    // Variant selected options
    name: string;
    value: string;
  }>;
  availableForSale: boolean; // Variant availability
  quantityAvailable: number; // Variant quantity available
}

// Custom error types for better error handling
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
  items: CartItem[];
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

  // Convert Shopify cart to simplified items array
  const items: CartItem[] =
    cart?.lines.edges.map((edge) => {
      const line = edge.node;
      const merchandise = line.merchandise as ShopifyCartLineMerchandise; // Type assertion
      const imageNode = merchandise.images?.edges?.[0]?.node;

      return {
        id: line.id,
        variantId: merchandise.id,
        productId: merchandise.product.id,
        title: merchandise.title,
        quantity: line.quantity,
        image: imageNode?.url || null,
        price: merchandise.price,
        compareAtPrice: merchandise.compareAtPrice,
        totalPrice: line.cost.totalAmount,
        productTitle: merchandise.product.title,
        productHandle: merchandise.product.handle,
        vendor: merchandise.product.vendor,
        tags: merchandise.product.tags,
        selectedOptions: merchandise.selectedOptions,
        availableForSale: merchandise.availableForSale,
        quantityAvailable: merchandise.quantityAvailable || 0, // Ensure it's a number
      };
    }) || [];

  // Initialize cart function
  const initializeCart = useCallback(async (): Promise<ShopifyCart | null> => {
    setIsLoading(true);
    try {
      const cartId = localStorage.getItem("shopify-cart-id");
      console.log("🛒 Initializing cart. Stored cartId:", cartId);

      if (cartId) {
        const existingCart = await getCart(cartId);
        if (existingCart) {
          setCart(existingCart);
          console.log("✅ Existing cart loaded:", existingCart.id);
          return existingCart;
        } else {
          console.warn(
            "⚠️ Stored cartId is invalid or expired. Removing it and creating new cart."
          );
          localStorage.removeItem("shopify-cart-id"); // Remove invalid ID
        }
      }

      // Create new cart if none exists or existing cart is invalid
      const newCartId = await createCart();
      localStorage.setItem("shopify-cart-id", newCartId);
      const newCart = await getCart(newCartId); // Fetch the newly created cart
      if (!newCart) {
        // This case should be rare if createCart and getCart are robust
        console.error(
          "❌ Critical: Failed to retrieve newly created cart immediately after creation. Cart ID:",
          newCartId
        );
        throw new CartInitializationError(
          "Failed to retrieve newly created cart."
        );
      }
      setCart(newCart);
      console.log("✅ New cart created and loaded:", newCart.id);
      return newCart;
    } catch (error) {
      console.error(
        "❌ Error initializing cart:",
        error instanceof Error ? error.message : String(error)
      );
      // Don't re-throw here if it's a common issue like network error, allow UI to show loading/error state
      // Only throw for critical unrecoverable issues if necessary.
      // For now, we'll let it fail and the UI can react to isLoading and cart being null.
      // throw new CartInitializationError(
      //   `Failed to initialize cart: ${error instanceof Error ? error.message : String(error)}`,
      // )
      return null; // Indicate failure to initialize
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize cart on mount
  useEffect(() => {
    initializeCart().catch((err) => {
      // This catch is for unhandled promise rejections from initializeCart itself,
      // though we try to handle errors within initializeCart.
      console.error(
        "Critical error during cart initialization on mount (unhandled):",
        err
      );
    });
  }, [initializeCart]);

  const addItem = useCallback(
    async (variantId: string, quantity = 1) => {
      setIsLoading(true);
      let currentCart = cart;

      try {
        if (!currentCart) {
          console.log(
            "🔄 No cart found during addItem, attempting to initialize..."
          );
          currentCart = await initializeCart();
          if (!currentCart) {
            // If initialization still fails, we cannot proceed.
            throw new CartInitializationError(
              "Failed to initialize cart before adding item."
            );
          }
          console.log("✅ Cart initialized successfully during addItem.");
        }

        console.log(
          `🛒 Attempting to add variant ${variantId} (qty: ${quantity}) to cart ${currentCart.id}`
        );
        const updatedCart = await shopifyAddToCart(
          currentCart.id,
          variantId,
          quantity
        );
        setCart(updatedCart);
        setIsOpen(true); // Open cart drawer on successful add
        console.log("✅ Successfully added to cart. Cart ID:", updatedCart.id);
      } catch (error) {
        console.error("❌ Error adding item to cart:", error);
        // Potentially try to re-initialize cart if error suggests cart ID invalid
        if (
          error instanceof Error &&
          (error.message.includes("cart_id") ||
            error.message.includes("No cart found"))
        ) {
          console.warn(
            "Cart ID might be invalid. Attempting to re-initialize and retry add to cart."
          );
          try {
            const freshCart = await initializeCart();
            if (freshCart) {
              const updatedCartOnRetry = await shopifyAddToCart(
                freshCart.id,
                variantId,
                quantity
              );
              setCart(updatedCartOnRetry);
              setIsOpen(true);
              console.log(
                "✅ Successfully added to cart on retry with new cart!"
              );
              return;
            }
          } catch (retryError) {
            console.error("❌ Retry to add to cart also failed:", retryError);
          }
        }
        // If retry fails or error is different, re-throw or handle as appropriate
        // For now, we'll let the error be caught by a higher-level handler or shown in UI
        throw new CartModificationError(
          `Failed to add item to cart: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      } finally {
        setIsLoading(false);
      }
    },
    [cart, initializeCart]
  );

  const removeItem = useCallback(
    async (lineId: string) => {
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
        console.error(
          `❌ Error removing line ${lineId} from cart:`,
          error instanceof Error ? error.message : String(error)
        );
        throw new CartModificationError(
          `Failed to remove item from cart: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      } finally {
        setIsLoading(false);
      }
    },
    [cart]
  );

  const updateQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart) {
        console.warn("🚫 Cannot update quantity: No cart available.");
        return;
      }
      if (quantity <= 0) {
        // Shopify typically handles removal for 0 quantity, but good to guard
        await removeItem(lineId);
        return;
      }

      setIsLoading(true);
      try {
        console.log(
          `🔄 Updating line ${lineId} in cart ${cart.id} to quantity ${quantity}`
        );
        const updatedCart = await updateCartLine(cart.id, lineId, quantity);
        setCart(updatedCart);
        console.log("✅ Cart quantity successfully updated.");
      } catch (error) {
        console.error(
          `❌ Error updating quantity for line ${lineId} in cart:`,
          error instanceof Error ? error.message : String(error)
        );
        throw new CartModificationError(
          `Failed to update item quantity in cart: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      } finally {
        setIsLoading(false);
      }
    },
    [cart, removeItem] // Added removeItem dependency
  );

  const cartCount = items.reduce(
    (total: number, item: CartItem) => total + item.quantity,
    0
  );

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  return (
    <CartContext.Provider
      value={{
        cart,
        items,
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
