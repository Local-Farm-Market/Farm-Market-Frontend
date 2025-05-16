"use client";

import type React from "react";

import { createContext, useContext, useState, useEffect } from "react";
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

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const {
    cartItems,
    cartTotal,
    isLoading,
    isPending,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart: clearContractCart,
    createOrderFromCart,
  } = useCartContract();
  const { fetchProductById } = useProducts();

  const [formattedItems, setFormattedItems] = useState<FormattedCartItem[]>([]);

  // Load cart items and format them
  useEffect(() => {
    const loadCartItems = async () => {
      if (!cartItems || !Array.isArray(cartItems)) return;

      const formattedCartPromises = cartItems.map(async (item) => {
        const product = await fetchProductById(item.productId.toString());
        return {
          productId: item.productId.toString(),
          quantity: Number(item.quantity),
          product: product || undefined, // Convert null to undefined to match FormattedCartItem type
        };
      });

      const formattedCart = await Promise.all(formattedCartPromises);
      // Filter out items with undefined products
      const validItems = formattedCart.filter(
        (item): item is FormattedCartItem => item.product !== undefined
      );
      setFormattedItems(validItems);
    };

    loadCartItems();
  }, [cartItems, fetchProductById]);

  // Calculate cart metrics
  const itemCount = formattedItems.reduce(
    (count, item) => count + item.quantity,
    0
  );
  const subtotal = cartTotal ? Number(cartTotal) / 1e18 : 0;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  // Add item to cart
  const addItem = async (productId: string, quantity = 1) => {
    try {
      await addToCart(BigInt(productId), BigInt(quantity));
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Remove item from cart
  const removeItem = async (productId: string) => {
    try {
      await removeFromCart(BigInt(productId));
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Update item quantity
  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      if (quantity < 1) {
        await removeFromCart(BigInt(productId));
        return;
      }

      await updateCartItemQuantity(BigInt(productId), BigInt(quantity));
    } catch (error) {
      console.error("Error updating item quantity:", error);
      toast({
        title: "Error",
        description: "Failed to update item quantity. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      await clearContractCart();
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast({
        title: "Error",
        description: "Failed to clear cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Create order from cart
  const createOrder = async (shippingAddress: string) => {
    try {
      await createOrderFromCart(shippingAddress);
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
  };

  return (
    <CartContext.Provider
      value={{
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
        isLoading,
        isPending,
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
