"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { getFarmEscrowContract } from "@/src/lib/contract-config";
import type { Product, FormattedProduct } from "@/src/lib/types";
import { toast } from "@/src/components/ui/use-toast";

export function useProducts() {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);

  const contract = getFarmEscrowContract();

  // Get seller products
  const { data: sellerProductIds, isLoading: isLoadingSellerProducts } =
    useReadContract({
      ...contract,
      functionName: "getUserProducts",
      args: address ? [address] : undefined,
      query: {
        enabled: !!address,
      },
    });

  // Write functions
  const { writeContractAsync, isPending } = useWriteContract();

  // Add product
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
      fetchSellerProducts();
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

  // Update product
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
      toast({
        title: "Product updated",
        description: "Your product has been updated successfully.",
      });
      fetchSellerProducts();
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

  // Fetch product by ID
  const fetchProductById = async (
    productId: string
  ): Promise<FormattedProduct | null> => {
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

      const { result } = await response.json();

      if (result) {
        const product = result as unknown as Product;
        return formatProduct(product);
      }
      return null;
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  };

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

  // Fetch all products (for marketplace)
  const fetchAllProducts = async (): Promise<FormattedProduct[]> => {
    try {
      // This is a simplified approach - in a real app, you'd need pagination
      // For demo purposes, we'll fetch products with IDs 1-20
      const productPromises = [];
      for (let i = 1; i <= 20; i++) {
        productPromises.push(fetchProductById(i.toString()));
      }

      const products = await Promise.all(productPromises);
      return products.filter((p): p is FormattedProduct => p !== null);
    } catch (error) {
      console.error("Error fetching all products:", error);
      return [];
    }
  };

  // Fetch products by category
  const fetchProductsByCategory = async (
    category: string
  ): Promise<FormattedProduct[]> => {
    try {
      // Use the API route for contract reads
      const response = await fetch("/api/read-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: contract.address,
          abi: contract.abi,
          functionName: "getProductsByCategory",
          args: [category],
        }),
      });

      const { result: productIds } = await response.json();

      if (!productIds || !Array.isArray(productIds)) {
        return [];
      }

      const productPromises = productIds.map((id: bigint) =>
        fetchProductById(id.toString())
      );
      const products = await Promise.all(productPromises);
      return products.filter((p): p is FormattedProduct => p !== null);
    } catch (error) {
      console.error("Error fetching products by category:", error);
      return [];
    }
  };

  // Fetch seller products
  const fetchSellerProducts = async () => {
    if (!address || !sellerProductIds) return;

    try {
      const productPromises = sellerProductIds.map((id) =>
        fetchProductById(id.toString())
      );
      const products = await Promise.all(productPromises);
      setSellerProducts(
        products.filter(
          (p): p is FormattedProduct => p !== null
        ) as unknown as Product[]
      );
    } catch (error) {
      console.error("Error fetching seller products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Process seller product IDs
  useEffect(() => {
    if (sellerProductIds && address) {
      fetchSellerProducts();
    }
    setIsLoading(isLoadingSellerProducts);
  }, [sellerProductIds, address, isLoadingSellerProducts]);

  return {
    products,
    sellerProducts,
    isLoading: isLoading || isPending,
    addProduct,
    updateProduct,
    fetchProductById,
    fetchAllProducts,
    fetchProductsByCategory,
  };
}
