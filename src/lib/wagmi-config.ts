"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, baseSepolia } from "wagmi/chains";
import { http } from "wagmi";

// Get WalletConnect Project ID from environment variables
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!walletConnectProjectId) {
  console.warn(
    "Missing NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID environment variable. WalletConnect functionality may be limited."
  );
}

// Configure the supported chains and providers
export const wagmiConfig = getDefaultConfig({
  appName: "AgroChain",
  projectId: walletConnectProjectId || "DEFAULT_FALLBACK_ID", // Fallback for development only
  chains: [mainnet, baseSepolia],
  transports: {
    [mainnet.id]: http(),
    [baseSepolia.id]: http(),
  },
});

// Export chains for use in other components if needed
export const chains = [mainnet, baseSepolia];
