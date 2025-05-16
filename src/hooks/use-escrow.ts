"use client";

import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { getFarmEscrowContract } from "@/src/lib/contract-config";
import type { Escrow } from "@/src/lib/types";
import { toast } from "@/src/components/ui/use-toast";

export function useEscrow() {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);

  const contract = getFarmEscrowContract();

  // Write functions
  const { writeContractAsync, isPending } = useWriteContract();

  // Claim escrow
  const claimEscrow = async (orderId: bigint) => {
    try {
      setIsLoading(true);
      await writeContractAsync({
        ...contract,
        functionName: "claimEscrow",
        args: [orderId],
      });
      toast({
        title: "Payment claimed",
        description: "Your payment has been claimed successfully.",
      });
    } catch (error) {
      console.error("Error claiming escrow:", error);
      toast({
        title: "Error",
        description: "Failed to claim payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto notify escrow claimable
  const autoNotifyEscrowClaimable = async (orderId: bigint) => {
    try {
      setIsLoading(true);
      await writeContractAsync({
        ...contract,
        functionName: "autoNotifyEscrowClaimable",
        args: [orderId],
      });
      toast({
        title: "Escrow notification",
        description: "Escrow has been marked as claimable.",
      });
    } catch (error) {
      console.error("Error notifying escrow claimable:", error);
      toast({
        title: "Error",
        description: "Failed to notify escrow claimable. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch escrow details
  const fetchEscrowDetails = async (
    orderId: bigint
  ): Promise<Escrow | null> => {
    try {
      const data = await readContract({
        ...contract,
        functionName: "getEscrowDetails",
        args: [orderId],
      });

      if (data) {
        return {
          orderId,
          amount: data[0],
          developerFee: data[1],
          sellerAmount: data[2],
          isReleased: data[3],
          isRefunded: data[4],
          isClaimable: data[5],
          isClaimed: data[6],
          releasedAt: data[7],
          createdAt: BigInt(0), // This field is not returned by getEscrowDetails
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching escrow details:", error);
      return null;
    }
  };

  return {
    isLoading: isLoading || isPending,
    claimEscrow,
    autoNotifyEscrowClaimable,
    fetchEscrowDetails,
  };
}

// Helper function to read contract (since useReadContract is a hook and can't be used inside functions)
async function readContract({ address, abi, functionName, args }: any) {
  // This is a simplified version - in a real app, you'd use wagmi's readContract
  // or create a client instance to call this
  const { result } = await fetch("/api/read-contract", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, abi, functionName, args }),
  }).then((res) => res.json());

  return result;
}
