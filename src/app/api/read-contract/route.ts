import { NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";

// Create a public client for reading from the blockchain
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

export async function POST(request: Request) {
  try {
    const { address, abi, functionName, args } = await request.json();

    // Call the contract function
    const result = await publicClient.readContract({
      address: address as `0x${string}`,
      abi,
      functionName,
      args,
    });

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Error reading contract:", error);
    return NextResponse.json(
      { error: "Failed to read contract" },
      { status: 500 }
    );
  }
}
