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
  type ShopifyCartLineMerchandise, // This type now includes product.images
  type ShopifyImageNode,
  createCart,
  getCart,
  addToCart as shopifyAddToCart,
  removeFromCart,
  updateCartLine,
} from "@/lib/shopify";

export interface CartItem {
  id: string; // Line ID
  variantId: string; // Variant ID (merchandise.id)
  productId: string; // Product ID (merchandise.product.id)
  title: string; // Variant title (merchandise.title)
  quantity: number;
  variantImage: ShopifyImageNode | null; // Specific image for the variant
  productImage: ShopifyImageNode | null; // First image of the parent product
  price: {
    amount: string;
    currencyCode: string;
  };
  compareAtPrice?: {
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
    name: string;
    value: string;
  }>;
  availableForSale: boolean;
  quantityAvailable: number;
}

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
  error: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const items: CartItem[] =
    cart?.lines.edges.map((edge) => {
      const line = edge.node;
      const merchandise = line.merchandise as ShopifyCartLineMerchandise; // Type assertion is okay if CART_FRAGMENT is correct

      // Safely access the first product image
      const mainProductImage =
        merchandise.product.images?.edges?.[0]?.node || null;

      return {
        id: line.id,
        variantId: merchandise.id,
        productId: merchandise.product.id,
        title: merchandise.title, // This is the variant title
        quantity: line.quantity,
        variantImage: merchandise.image || null, // Specific variant image
        productImage: mainProductImage, // General product image
        price: merchandise.price,
        compareAtPrice: merchandise.compareAtPrice,
        totalPrice: line.cost.totalAmount,
        productTitle: merchandise.product.title, // Parent product title
        productHandle: merchandise.product.handle,
        vendor: merchandise.product.vendor,
        tags: merchandise.product.tags,
        selectedOptions: merchandise.selectedOptions,
        availableForSale: merchandise.availableForSale,
        quantityAvailable: merchandise.quantityAvailable || 0,
      };
    }) || [];

  const initializeCart = useCallback(async (): Promise<ShopifyCart | null> => {
    setIsLoading(true);
    setError(null);
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
          localStorage.removeItem("shopify-cart-id");
        }
      }

      const newCartId = await createCart();
      localStorage.setItem("shopify-cart-id", newCartId);
      const newCart = await getCart(newCartId);
      if (!newCart) {
        const errMsg = `Critical: Failed to retrieve newly created cart immediately after creation. Cart ID: ${newCartId}`;
        console.error(errMsg);
        setError(errMsg);
        throw new CartInitializationError(
          "Failed to retrieve newly created cart."
        );
      }
      setCart(newCart);
      console.log("✅ New cart created and loaded:", newCart.id);
      return newCart;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error("❌ Error initializing cart:", errorMsg);
      setError(`Initialisatie fout: ${errorMsg}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeCart();
  }, [initializeCart]);

  const addItem = useCallback(
    async (variantId: string, quantity = 1) => {
      setIsLoading(true);
      setError(null);
      let currentCart = cart;

      try {
        if (!currentCart) {
          console.log(
            "🔄 No cart found during addItem, attempting to initialize..."
          );
          currentCart = await initializeCart();
          if (!currentCart) {
            const initErrorMsg =
              "Kon winkelwagen niet initialiseren voor toevoegen item.";
            setError(initErrorMsg);
            // Do not throw here, let the UI reflect the error state
            return;
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
        setIsOpen(true);
        console.log("✅ Successfully added to cart. Cart ID:", updatedCart.id);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error("❌ Error adding item to cart:", errorMsg);
        setError(`Fout bij toevoegen: ${errorMsg}`);
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
        setError("Winkelwagen niet beschikbaar voor verwijderen item.");
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        console.log(`🗑️ Removing line ${lineId} from cart ${cart.id}`);
        const updatedCart = await removeFromCart(cart.id, lineId);
        setCart(updatedCart);
        console.log("✅ Item successfully removed.");
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error(`❌ Error removing line ${lineId} from cart:`, errorMsg);
        setError(`Fout bij verwijderen: ${errorMsg}`);
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
        setError("Winkelwagen niet beschikbaar voor update hoeveelheid.");
        return;
      }
      if (quantity <= 0) {
        await removeItem(lineId);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        console.log(
          `🔄 Updating line ${lineId} in cart ${cart.id} to quantity ${quantity}`
        );
        const updatedCart = await updateCartLine(cart.id, lineId, quantity);
        setCart(updatedCart);
        console.log("✅ Cart quantity successfully updated.");
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error(
          `❌ Error updating quantity for line ${lineId} in cart:`,
          errorMsg
        );
        setError(`Fout bij update hoeveelheid: ${errorMsg}`);
      } finally {
        setIsLoading(false);
      }
    },
    [cart, removeItem]
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
        error,
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
