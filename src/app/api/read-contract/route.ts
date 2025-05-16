import { type NextRequest, NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { mainnet, baseSepolia } from "viem/chains";

// Create a public client
const client = createPublicClient({
  chain: process.env.NEXT_PUBLIC_CHAIN_ID === "1" ? mainnet : baseSepolia,
  transport: http(),
});

export async function POST(request: NextRequest) {
  try {
    const { address, abi, functionName, args } = await request.json();

    // Call the contract
    const result = await client.readContract({
      address,
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
