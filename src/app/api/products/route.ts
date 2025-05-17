// app/api/products/route.ts
import { NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import {
  FARM_ESCROW_ABI,
  FARM_ESCROW_ADDRESS,
} from "@/src/lib/contract-config";
import type { Product } from "@/src/lib/types";

// Create a public client for reading from the blockchain
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

// Cache for product data with expiration
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60000; // 1 minute cache

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category") || undefined;

    // Create cache key based on request parameters
    const cacheKey = `products-${page}-${limit}-${category || "all"}`;

    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
      return NextResponse.json(cachedData.data);
    }

    // Determine which products to fetch based on pagination
    let productIds: bigint[] = [];

    if (category) {
      // Fetch products by category
      productIds = (await publicClient.readContract({
        address: FARM_ESCROW_ADDRESS as `0x${string}`,
        abi: FARM_ESCROW_ABI,
        functionName: "getProductsByCategory",
        args: [category],
      })) as bigint[];
    } else {
      // For demo purposes, we'll fetch products with IDs from (page-1)*limit+1 to page*limit
      // In a real app, you'd have a proper way to get all product IDs
      const startId = (page - 1) * limit + 1;
      const endId = page * limit;

      productIds = Array.from({ length: endId - startId + 1 }, (_, i) =>
        BigInt(startId + i)
      );
    }

    // Apply pagination
    const paginatedIds = productIds.slice((page - 1) * limit, page * limit);

    // Batch fetch products
    const productPromises = paginatedIds.map(async (id) => {
      try {
        const product = (await publicClient.readContract({
          address: FARM_ESCROW_ADDRESS as `0x${string}`,
          abi: FARM_ESCROW_ABI,
          functionName: "getProduct",
          args: [id],
        })) as unknown as Product;

        // Format product data
        return {
          id: product.id.toString(),
          seller: product.seller,
          name: product.name,
          category: product.category,
          price: Number(product.price) / 1e18,
          stockQuantity: Number(product.stockQuantity),
          unit: product.unit,
          description: product.description,
          imageUrls: product.imageUrls,
          isAvailable: product.isAvailable,
          isOrganic: product.isOrganic,
          soldCount: Number(product.soldCount),
        };
      } catch (error) {
        console.error(`Error fetching product ${id}:`, error);
        return null;
      }
    });

    const products = (await Promise.all(productPromises)).filter(Boolean);

    const result = {
      products,
      total: productIds.length,
      page,
      limit,
    };

    // Store in cache
    cache.set(cacheKey, { data: result, timestamp: Date.now() });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
