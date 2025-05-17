// app/api/product/[id]/route.ts
import { NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import { FARM_ESCROW_ABI, FARM_ESCROW_ADDRESS } from "@/src/lib/contract-config";
import type { Product } from "@/src/lib/types";

// Create a public client for reading from the blockchain
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

// Cache for product data with expiration
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60000; // 1 minute cache

// Define the type for the seller profile tuple
type SellerProfileTuple = readonly [
  string, // name
  string, // farmName
  string, // location
  string, // bio
  boolean, // isVerified
  bigint, // rating
  bigint, // reviewCount
  boolean, // isSeller
  string, // farmDescription
  string // contactInfo
];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;

    // Create cache key
    const cacheKey = `product-${productId}`;

    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
      return NextResponse.json(cachedData.data);
    }

    // Fetch product data
    const productData = (await publicClient.readContract({
      address: FARM_ESCROW_ADDRESS as `0x${string}`,
      abi: FARM_ESCROW_ABI,
      functionName: "getProduct",
      args: [BigInt(productId)],
    })) as unknown as Product;

    if (!productData) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Format product data
    const formattedProduct = {
      id: productData.id.toString(),
      seller: productData.seller,
      name: productData.name,
      category: productData.category,
      price: Number(productData.price) / 1e18,
      stockQuantity: Number(productData.stockQuantity),
      unit: productData.unit,
      description: productData.description,
      imageUrls: productData.imageUrls,
      isAvailable: productData.isAvailable,
      isOrganic: productData.isOrganic,
      soldCount: Number(productData.soldCount),
      location: "", // Will be populated from seller profile
    };

    // Fetch seller profile
    const sellerData = (await publicClient.readContract({
      address: FARM_ESCROW_ADDRESS as `0x${string}`,
      abi: FARM_ESCROW_ABI,
      functionName: "userProfiles",
      args: [productData.seller],
    })) as SellerProfileTuple;

    if (sellerData) {
      // Access tuple elements by index
      const name = sellerData[0];
      const farmName = sellerData[1];
      const location = sellerData[2];
      const bio = sellerData[3];
      const isVerified = sellerData[4];
      const rating = sellerData[5];
      const reviewCount = sellerData[6];
      const isSeller = sellerData[7];
      const farmDescription = sellerData[8];
      const contactInfo = sellerData[9];

      formattedProduct.location = `${farmName}, ${location}`;

      const formattedSellerProfile = {
        name,
        farmName,
        location,
        bio,
        isVerified,
        rating,
        reviewCount,
        isSeller,
        farmDescription,
        contactInfo,
      };

      const result = {
        product: formattedProduct,
        seller: formattedSellerProfile,
      };

      // Store in cache
      cache.set(cacheKey, { data: result, timestamp: Date.now() });

      return NextResponse.json(result);
    }

    // If no seller data, return just the product
    const result = {
      product: formattedProduct,
      seller: null,
    };

    // Store in cache
    cache.set(cacheKey, { data: result, timestamp: Date.now() });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
