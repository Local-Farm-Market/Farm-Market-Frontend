"use client";

import { useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { getFarmEscrowContract } from "@/src/lib/contract-config";
import type { CartItem } from "@/src/lib/types";
import { toast } from "@/src/components/ui/use-toast";

export function useCartContract() {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);

  const contract = getFarmEscrowContract();

  // Read cart items
  const {
    data: cartItems,
    isLoading: isLoadingCart,
    refetch: refetchCart,
  } = useReadContract({
    ...contract,
    functionName: "getCartItems",
    query: {
      enabled: !!address,
    },
  });

  // Read cart total
  const {
    data: cartTotal,
    isLoading: isLoadingTotal,
    refetch: refetchTotal,
  } = useReadContract({
    ...contract,
    functionName: "getCartTotal",
    query: {
      enabled: !!address,
    },
  });

  // Write functions
  const { writeContractAsync, isPending } = useWriteContract();

  // Add to cart
  const addToCart = async (productId: bigint, quantity: bigint) => {
    try {
      setIsLoading(true);
      await writeContractAsync({
        ...contract,
        functionName: "addToCart",
        args: [productId, quantity],
      });
      toast({
        title: "Added to cart",
        description: "Product has been added to your cart.",
      });
      refetchCart();
      refetchTotal();
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add product to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update cart item quantity
  const updateCartItemQuantity = async (
    productId: bigint,
    quantity: bigint
  ) => {
    try {
      setIsLoading(true);
      await writeContractAsync({
        ...contract,
        functionName: "updateCartItemQuantity",
        args: [productId, quantity],
      });
      toast({
        title: "Cart updated",
        description: "Cart item quantity has been updated.",
      });
      refetchCart();
      refetchTotal();
    } catch (error) {
      console.error("Error updating cart:", error);
      toast({
        title: "Error",
        description: "Failed to update cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Remove from cart - check if this function exists in your contract
  const removeFromCart = async (productId: bigint) => {
    try {
      setIsLoading(true);
      // If your contract doesn't have removeFromCart, set quantity to 0 instead
      await updateCartItemQuantity(productId, BigInt(0));
      toast({
        title: "Removed from cart",
        description: "Product has been removed from your cart.",
      });
      refetchCart();
      refetchTotal();
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast({
        title: "Error",
        description: "Failed to remove product from cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      setIsLoading(true);
      await writeContractAsync({
        ...contract,
        functionName: "clearCart",
      });
      toast({
        title: "Cart cleared",
        description: "Your cart has been cleared.",
      });
      refetchCart();
      refetchTotal();
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast({
        title: "Error",
        description: "Failed to clear cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Create order from cart
  const createOrderFromCart = async (shippingAddress: string) => {
    try {
      setIsLoading(true);
      await writeContractAsync({
        ...contract,
        functionName: "createOrderFromCart",
        args: [shippingAddress],
      });
      toast({
        title: "Order created",
        description: "Your order has been created successfully.",
      });
      refetchCart();
      refetchTotal();
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    cartItems: (cartItems as CartItem[]) || [],
    cartTotal,
    isLoading: isLoading || isLoadingCart || isLoadingTotal || isPending,
    isPending,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    createOrderFromCart,
    refetchCart,
    refetchTotal,
  };
}
