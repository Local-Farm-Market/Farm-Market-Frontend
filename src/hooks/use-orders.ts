"use client";

import { useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { getFarmEscrowContract } from "@/src/lib/contract-config";
import {
  type Order,
  type OrderStatus,
  type FormattedOrder,
  type FormattedProduct,
  formatPrice,
  getOrderStatusText,
} from "@/src/lib/types";
import { useEffect } from "react";
import { toast } from "@/src/components/ui/use-toast";

export function useOrders() {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [buyerOrders, setBuyerOrders] = useState<FormattedOrder[]>([]);
  const [sellerOrders, setSellerOrders] = useState<FormattedOrder[]>([]);

  const contract = getFarmEscrowContract();

  // Read buyer orders
  const { data: buyerOrderIds, isLoading: isLoadingBuyerOrders } =
    useReadContract({
      ...contract,
      functionName: "getUserOrders",
      args: address ? [address] : undefined,
      query: {
        enabled: !!address,
      },
    });

  // Read seller orders
  const { data: sellerOrderIds, isLoading: isLoadingSellerOrders } =
    useReadContract({
      ...contract,
      functionName: "getSellerOrders",
      args: address ? [address] : undefined,
      query: {
        enabled: !!address,
      },
    });

  // Write functions
  const { writeContractAsync, isPending } = useWriteContract();

  // Create order from cart
  const createOrderFromCart = async (
    shippingAddress: string,
    totalAmount: bigint
  ) => {
    try {
      setIsLoading(true);
      await writeContractAsync({
        ...contract,
        functionName: "createOrderFromCart",
        args: [shippingAddress],
        value: totalAmount,
      });
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
    } finally {
      setIsLoading(false);
    }
  };

  // Add shipping info
  const addShippingInfo = async (orderId: bigint, trackingInfo: string) => {
    try {
      setIsLoading(true);
      await writeContractAsync({
        ...contract,
        functionName: "addShippingInfo",
        args: [orderId, trackingInfo],
      });
      toast({
        title: "Shipping info added",
        description: "Shipping information has been added successfully.",
      });
    } catch (error) {
      console.error("Error adding shipping info:", error);
      toast({
        title: "Error",
        description: "Failed to add shipping information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId: bigint, status: OrderStatus) => {
    try {
      setIsLoading(true);
      await writeContractAsync({
        ...contract,
        functionName: "updateOrderStatus",
        args: [orderId, status],
      });
      toast({
        title: "Order status updated",
        description: "Order status has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch order details
  const fetchOrderDetails = async (orderId: bigint): Promise<Order | null> => {
    try {
      const response = await fetch("/api/read-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: contract.address,
          abi: contract.abi,
          functionName: "getOrderDetails",
          args: [orderId],
        }),
      });

      const { result: data } = await response.json();

      if (data) {
        return {
          id: data[0],
          buyer: data[1],
          seller: data[2],
          productIds: data[3],
          quantities: data[4],
          totalPrice: data[5],
          shippingFee: data[6],
          status: data[7],
          shippingAddress: data[8],
          trackingInfo: data[9],
          updatedAt: BigInt(0), // This field is not returned by getOrderDetails
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching order details:", error);
      return null;
    }
  };

  // Fetch buyer orders
  const fetchBuyerOrders = async (): Promise<Order[]> => {
    if (!address || !buyerOrderIds) return [];

    try {
      const orderPromises = buyerOrderIds.map((id) => fetchOrderDetails(id));
      const orders = await Promise.all(orderPromises);
      return orders.filter((o): o is Order => o !== null);
    } catch (error) {
      console.error("Error fetching buyer orders:", error);
      return [];
    }
  };

  // Fetch seller orders
  const fetchSellerOrders = async (): Promise<Order[]> => {
    if (!address || !sellerOrderIds) return [];

    try {
      const orderPromises = sellerOrderIds.map((id) => fetchOrderDetails(id));
      const orders = await Promise.all(orderPromises);
      return orders.filter((o): o is Order => o !== null);
    } catch (error) {
      console.error("Error fetching seller orders:", error);
      return [];
    }
  };

  // Format order data
  const formatOrder = async (order: Order): Promise<FormattedOrder> => {
    // Fetch product details for each product in the order
    const productPromises = order.productIds.map(async (id) => {
      const productData = await fetchProductById(id);
      return productData;
    });

    const products = await Promise.all(productPromises);
    const formattedProducts = products.filter(Boolean) as FormattedProduct[];

    return {
      id: order.id.toString(),
      buyer: order.buyer,
      seller: order.seller,
      productIds: order.productIds.map((id) => id.toString()),
      quantities: order.quantities.map((q) => Number(q)),
      totalPrice: formatPrice(order.totalPrice),
      shippingFee: formatPrice(order.shippingFee),
      status: order.status,
      statusText: getOrderStatusText(order.status),
      shippingAddress: order.shippingAddress,
      trackingInfo: order.trackingInfo,
      updatedAt: order.updatedAt ? Number(order.updatedAt) : undefined,
      products: formattedProducts,
    };
  };

  // Fetch product details
  const fetchProductById = async (productId: bigint) => {
    try {
      const response = await fetch("/api/read-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: contract.address,
          abi: contract.abi,
          functionName: "getProduct",
          args: [productId],
        }),
      });

      const { result: data } = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      return null;
    }
  };

  // Fetch buyer orders
  useEffect(() => {
    const fetchBuyerOrdersFormatted = async () => {
      const orders = await fetchBuyerOrders();
      const formattedOrders = await Promise.all(
        orders.map((order) => formatOrder(order))
      );
      setBuyerOrders(formattedOrders);
    };

    fetchBuyerOrdersFormatted();
  }, [buyerOrderIds, address]);

  // Fetch seller orders
  useEffect(() => {
    const fetchSellerOrdersFormatted = async () => {
      const orders = await fetchSellerOrders();
      const formattedOrders = await Promise.all(
        orders.map((order) => formatOrder(order))
      );
      setSellerOrders(formattedOrders);
    };

    fetchSellerOrdersFormatted();
  }, [sellerOrderIds, address]);

  return {
    isLoading:
      isLoading || isLoadingBuyerOrders || isLoadingSellerOrders || isPending,
    createOrderFromCart,
    addShippingInfo,
    updateOrderStatus,
    fetchOrderDetails,
    fetchBuyerOrders,
    fetchSellerOrders,
    buyerOrderIds,
    sellerOrderIds,
    buyerOrders,
    sellerOrders,
    refetchOrders: () => {},
  };
}
