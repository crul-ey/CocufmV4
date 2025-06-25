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
  type ShopifyCartLineMerchandise,
  type ShopifyImageNode, // Import for explicit typing
  createCart,
  getCart,
  addToCart as shopifyAddToCart,
  removeFromCart,
  updateCartLine,
} from "@/lib/shopify";

export interface CartItem {
  id: string;
  variantId: string;
  productId: string;
  title: string;
  quantity: number;
  image: ShopifyImageNode | null; // ✅ Use ShopifyImageNode type
  price: {
    amount: string;
    currencyCode: string;
  };
  compareAtPrice?: {
    amount: string;
    currencyCode: string;
  } | null;
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  productTitle: string;
  productHandle: string;
  vendor: string;
  tags: string[];
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
  error: string | null; // ✅ Add error state
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null); // ✅ Initialize error state

  const items: CartItem[] =
    cart?.lines.edges.map((edge) => {
      const line = edge.node;
      const merchandise = line.merchandise as ShopifyCartLineMerchandise;

      return {
        id: line.id,
        variantId: merchandise.id,
        productId: merchandise.product.id,
        title: merchandise.title,
        quantity: line.quantity,
        image: merchandise.image || null, // ✅ Use merchandise.image
        price: merchandise.price,
        compareAtPrice: merchandise.compareAtPrice,
        totalPrice: line.cost.totalAmount,
        productTitle: merchandise.product.title,
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
    setError(null); // ✅ Clear previous errors
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
        setError(errMsg); // ✅ Set error state
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
      setError(`Initialisatie fout: ${errorMsg}`); // ✅ Set error state
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeCart(); // Removed .catch as errors are handled within and set to state
  }, [initializeCart]);

  const addItem = useCallback(
    async (variantId: string, quantity = 1) => {
      setIsLoading(true);
      setError(null); // ✅ Clear previous errors
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
            setError(initErrorMsg); // ✅ Set error state
            throw new CartInitializationError(initErrorMsg);
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
        setError(`Fout bij toevoegen: ${errorMsg}`); // ✅ Set error state
        // No re-throw, let UI handle error state
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
        setError("Winkelwagen niet beschikbaar voor verwijderen item."); // ✅ Set error state
        return;
      }
      setIsLoading(true);
      setError(null); // ✅ Clear previous errors
      try {
        console.log(`🗑️ Removing line ${lineId} from cart ${cart.id}`);
        const updatedCart = await removeFromCart(cart.id, lineId);
        setCart(updatedCart);
        console.log("✅ Item successfully removed.");
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error(`❌ Error removing line ${lineId} from cart:`, errorMsg);
        setError(`Fout bij verwijderen: ${errorMsg}`); // ✅ Set error state
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
        setError("Winkelwagen niet beschikbaar voor update hoeveelheid."); // ✅ Set error state
        return;
      }
      if (quantity <= 0) {
        await removeItem(lineId);
        return;
      }
      setIsLoading(true);
      setError(null); // ✅ Clear previous errors
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
        setError(`Fout bij update hoeveelheid: ${errorMsg}`); // ✅ Set error state
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
        error, // ✅ Provide error state
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
