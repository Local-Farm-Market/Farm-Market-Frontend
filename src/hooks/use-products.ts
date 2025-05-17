// hooks/use-products.ts
"use client";

import { useState, useCallback } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { getFarmEscrowContract } from "@/src/lib/contract-config";
import type { Product, FormattedProduct } from "@/src/lib/types";
import { toast } from "@/src/components/ui/use-toast";
import useSWR from "swr";

// Cache for product data to prevent redundant fetches
const productCache = new Map<string, FormattedProduct>();

export function useProducts() {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);

  const contract = getFarmEscrowContract();

  // Get seller products with proper caching
  const { data: sellerProductIds, isLoading: isLoadingSellerProducts } =
    useReadContract({
      ...contract,
      functionName: "getUserProducts",
      args: address ? [address] : undefined,
      query: {
        enabled: !!address,
        staleTime: 60000, // Cache for 1 minute
      },
    });

  // Write functions
  const { writeContractAsync, isPending } = useWriteContract();

  // Fetch product by ID with caching
  const fetchProductById = useCallback(
    async (productId: string): Promise<FormattedProduct | null> => {
      // Check cache first
      if (productCache.has(productId)) {
        return productCache.get(productId)!;
      }

      try {
        // Use the API route for contract reads
        const response = await fetch("/api/read-contract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            address: contract.address,
            abi: contract.abi,
            functionName: "getProduct",
            args: [BigInt(productId)],
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.statusText}`);
        }

        const { result } = await response.json();

        if (result) {
          const product = result as unknown as Product;
          const formattedProduct = formatProduct(product);

          // Store in cache
          productCache.set(productId, formattedProduct);

          return formattedProduct;
        }
        return null;
      } catch (error) {
        console.error("Error fetching product:", error);
        return null;
      }
    },
    [contract.address, contract.abi]
  );

  // Format product data for UI
  const formatProduct = (product: Product): FormattedProduct => {
    return {
      id: product.id.toString(),
      seller: product.seller,
      name: product.name,
      category: product.category,
      price: Number(product.price) / 1e18, // Convert from wei to ether
      stockQuantity: Number(product.stockQuantity),
      unit: product.unit,
      description: product.description,
      imageUrls: product.imageUrls,
      isAvailable: product.isAvailable,
      isOrganic: product.isOrganic,
      soldCount: Number(product.soldCount),
      location: "", // Will be populated from seller profile if needed
    };
  };

  // Fetch products with pagination
  const fetchProducts = useCallback(
    async (
      page: number = 1,
      limit: number = 10,
      category?: string
    ): Promise<{ products: FormattedProduct[]; total: number }> => {
      try {
        // Use a single API call to get a batch of products
        const response = await fetch(
          `/api/products?page=${page}&limit=${limit}${
            category ? `&category=${category}` : ""
          }`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching products:", error);
        return { products: [], total: 0 };
      }
    },
    []
  );

  // Use SWR for products with pagination
  const useProductsWithPagination = (
    page: number = 1,
    limit: number = 10,
    category?: string
  ) => {
    const { data, error, isLoading, mutate } = useSWR(
      [`products-${page}-${limit}-${category || "all"}`],
      () => fetchProducts(page, limit, category),
      {
        revalidateOnFocus: false,
        revalidateIfStale: false,
        dedupingInterval: 60000, // 1 minute
      }
    );

    return {
      products: data?.products || [],
      total: data?.total || 0,
      isLoading,
      error,
      mutate,
    };
  };

  // Add product (optimized)
  const addProduct = async (
    name: string,
    category: string,
    price: bigint,
    stockQuantity: bigint,
    unit: string,
    description: string,
    imageUrls: string[],
    isOrganic: boolean
  ) => {
    try {
      setIsLoading(true);
      await writeContractAsync({
        ...contract,
        functionName: "addProduct",
        args: [
          name,
          category,
          price,
          stockQuantity,
          unit,
          description,
          imageUrls,
          isOrganic,
        ],
      });
      toast({
        title: "Product added",
        description: "Your product has been added successfully.",
      });

      // Clear cache for product listings to ensure fresh data
      Array.from(productCache.keys())
        .filter((key) => key.startsWith("products-"))
        .forEach((key) => productCache.delete(key));
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update product (optimized)
  const updateProduct = async (
    productId: bigint,
    name: string,
    category: string,
    price: bigint,
    stockQuantity: bigint,
    unit: string,
    description: string,
    imageUrls: string[],
    isAvailable: boolean,
    isOrganic: boolean
  ) => {
    try {
      setIsLoading(true);
      await writeContractAsync({
        ...contract,
        functionName: "updateProduct",
        args: [
          productId,
          name,
          category,
          price,
          stockQuantity,
          unit,
          description,
          imageUrls,
          isAvailable,
          isOrganic,
        ],
      });

      // Invalidate cache for this product
      productCache.delete(productId.toString());

      toast({
        title: "Product updated",
        description: "Your product has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sellerProducts,
    isLoading: isLoading || isLoadingSellerProducts || isPending,
    addProduct,
    updateProduct,
    fetchProductById,
    useProductsWithPagination,
  };
}
