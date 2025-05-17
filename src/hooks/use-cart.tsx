// hooks/use-cart.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useCartContract } from "./use-cart-contract";
import { useProducts } from "./use-products";
import type { FormattedCartItem } from "@/src/lib/types";
import { useToast } from "@/src/hooks/use-toast";

interface CartContextType {
  items: FormattedCartItem[];
  addItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  createOrder: (shippingAddress: string) => Promise<void>;
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;
  isLoading: boolean;
  isPending: boolean;
}

export const TAX_RATE = 0.08; // 8% tax rate

const CartContext = createContext<CartContextType | undefined>(undefined);

// Cache for product data in cart
const cartProductCache = new Map<string, FormattedCartItem["product"]>();

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const {
    cartItems,
    cartTotal,
    isLoading: contractLoading,
    isPending,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart: clearContractCart,
    createOrderFromCart,
  } = useCartContract();
  const { fetchProductById } = useProducts();

  const [formattedItems, setFormattedItems] = useState<FormattedCartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProductIds, setLoadingProductIds] = useState<Set<string>>(
    new Set()
  );

  // Load cart items and format them - optimized with caching and batching
  useEffect(() => {
    // Skip if cartItems is not available or not an array
    if (!cartItems || !Array.isArray(cartItems)) return;

    // Skip if we're already loading
    if (isLoading) return;

    const loadCartItems = async () => {
      setIsLoading(true);

      try {
        // Create a stable reference to the current cartItems
        const currentCartItems = [...cartItems];

        // Identify which products we need to fetch
        const productsToFetch = currentCartItems.filter(
          (item) => !cartProductCache.has(item.productId.toString())
        );

        // Batch fetch products we don't have in cache
        if (productsToFetch.length > 0) {
          const productPromises = productsToFetch.map(async (item) => {
            const productId = item.productId.toString();
            try {
              const product = await fetchProductById(productId);
              if (product) {
                cartProductCache.set(productId, product);
              }
            } catch (error) {
              console.error(`Error fetching product ${productId}:`, error);
            }
          });

          await Promise.all(productPromises);
        }

        // Create formatted cart items using cache
        const formatted = currentCartItems
          .map((item) => {
            const productId = item.productId.toString();
            return {
              productId,
              quantity: Number(item.quantity),
              product: cartProductCache.get(productId) || undefined,
            };
          })
          .filter(
            (item): item is FormattedCartItem => item.product !== undefined
          );

        setFormattedItems(formatted);
      } catch (error) {
        console.error("Error loading cart items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCartItems();

    // Only depend on cartItems and fetchProductById
    // Use JSON.stringify to create a stable dependency for cartItems
  }, [JSON.stringify(cartItems), fetchProductById, isLoading]);

  // Memoized cart metrics
  const itemCount = useMemo(
    () => formattedItems.reduce((count, item) => count + item.quantity, 0),
    [formattedItems]
  );

  const subtotal = useMemo(
    () => (cartTotal ? Number(cartTotal) / 1e18 : 0),
    [cartTotal]
  );

  const tax = useMemo(() => subtotal * TAX_RATE, [subtotal]);

  const total = useMemo(() => subtotal + tax, [subtotal, tax]);

  // Add item to cart with optimistic updates
  const addItem = useCallback(
    async (productId: string, quantity = 1) => {
      try {
        // Mark this product as loading
        setLoadingProductIds((prev) => new Set(prev).add(productId));

        // Get product data if not in cache
        if (!cartProductCache.has(productId)) {
          const product = await fetchProductById(productId);
          if (product) {
            cartProductCache.set(productId, product);
          }
        }

        // Optimistic update
        const product = cartProductCache.get(productId);
        if (product) {
          setFormattedItems((prev) => {
            const existingItemIndex = prev.findIndex(
              (item) => item.productId === productId
            );

            if (existingItemIndex >= 0) {
              // Update existing item
              const newItems = [...prev];
              newItems[existingItemIndex] = {
                ...newItems[existingItemIndex],
                quantity: newItems[existingItemIndex].quantity + quantity,
              };
              return newItems;
            } else {
              // Add new item
              return [...prev, { productId, quantity, product }];
            }
          });
        }

        // Actual blockchain update
        await addToCart(BigInt(productId), BigInt(quantity));
      } catch (error) {
        console.error("Error adding item to cart:", error);

        // Revert optimistic update on error
        setFormattedItems((prev) => {
          return prev.filter((item) => item.productId !== productId);
        });

        toast({
          title: "Error",
          description: "Failed to add item to cart. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoadingProductIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      }
    },
    [addToCart, fetchProductById, toast]
  );

  // Remove item from cart with optimistic updates
  const removeItem = useCallback(
    async (productId: string) => {
      try {
        // Optimistic update
        const removedItem = formattedItems.find(
          (item) => item.productId === productId
        );
        setFormattedItems((prev) =>
          prev.filter((item) => item.productId !== productId)
        );

        // Actual blockchain update
        await removeFromCart(BigInt(productId));
      } catch (error) {
        console.error("Error removing item from cart:", error);

        // Revert optimistic update on error
        const removedItem = formattedItems.find(
          (item) => item.productId === productId
        );
        if (removedItem) {
          setFormattedItems((prev) => [...prev, removedItem]);
        }

        toast({
          title: "Error",
          description: "Failed to remove item from cart. Please try again.",
          variant: "destructive",
        });
      }
    },
    [formattedItems, removeFromCart, toast]
  );

  // Update item quantity with optimistic updates
  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      try {
        if (quantity < 1) {
          await removeItem(productId);
          return;
        }

        // Optimistic update
        setFormattedItems((prev) => {
          return prev.map((item) => {
            if (item.productId === productId) {
              return { ...item, quantity };
            }
            return item;
          });
        });

        // Actual blockchain update
        await updateCartItemQuantity(BigInt(productId), BigInt(quantity));
      } catch (error) {
        console.error("Error updating item quantity:", error);

        // Revert optimistic update on error
        toast({
          title: "Error",
          description: "Failed to update item quantity. Please try again.",
          variant: "destructive",
        });
      }
    },
    [removeItem, updateCartItemQuantity, toast]
  );

  // Clear cart
  const clearCart = useCallback(async () => {
    try {
      // Optimistic update
      setFormattedItems([]);

      // Actual blockchain update
      await clearContractCart();
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast({
        title: "Error",
        description: "Failed to clear cart. Please try again.",
        variant: "destructive",
      });
    }
  }, [clearContractCart, toast]);

  // Create order from cart
  const createOrder = useCallback(
    async (shippingAddress: string) => {
      try {
        await createOrderFromCart(shippingAddress);

        // Clear local cart state after successful order
        setFormattedItems([]);

        toast({
          title: "Order created",
          description: "Your order has been created successfully.",
        });
      } catch (error) {
        console.error("Error creating order:", error);
        toast({
          title: "Error",
          description: "Failed to create order. Please try again.",
          variant: "destructive",
        });
        throw error; // Re-throw to allow handling in the checkout page
      }
    },
    [createOrderFromCart, toast]
  );

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      items: formattedItems,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      createOrder,
      itemCount,
      subtotal,
      tax,
      total,
      isLoading: isLoading || contractLoading,
      isPending,
    }),
    [
      formattedItems,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      createOrder,
      itemCount,
      subtotal,
      tax,
      total,
      isLoading,
      contractLoading,
      isPending,
    ]
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
