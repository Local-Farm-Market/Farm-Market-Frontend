"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { useEscrow } from "@/src/hooks/use-escrow";
import { formatPrice } from "@/src/lib/types";

interface PaymentClaimCardProps {
  orderId: bigint;
  amount: bigint;
  isClaimable: boolean;
  onClaimSuccess?: () => void;
  onOpenModal: () => void;
}

export function PaymentClaimCard({
  orderId,
  amount,
  isClaimable,
  onClaimSuccess,
  onOpenModal,
}: PaymentClaimCardProps) {
  const [isPending, setIsPending] = useState(false);
  const { claimEscrow, isLoading } = useEscrow();

  const handleClaim = async () => {
    setIsPending(true);
    try {
      await claimEscrow(orderId);
      if (onClaimSuccess) {
        onClaimSuccess();
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Payment #{orderId.toString()}</CardTitle>
        <CardDescription>Order payment ready for claim</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium">Amount:</span>
          <span className="text-lg font-bold">${formatPrice(amount)} ETH</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Status:</span>
          <span
            className={`text-sm font-medium ${
              isClaimable ? "text-green-500" : "text-yellow-500"
            }`}
          >
            {isClaimable ? "Ready to claim" : "Pending completion"}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onOpenModal}>
          View Details
        </Button>
        <Button
          onClick={handleClaim}
          disabled={!isClaimable || isLoading || isPending}
        >
          {isPending ? "Claiming..." : "Claim Payment"}
        </Button>
      </CardFooter>
    </Card>
  );
}
