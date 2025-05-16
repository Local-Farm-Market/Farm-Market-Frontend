"use client";

import { useState } from "react";
import { CheckCircle, DollarSign, Copy, Check, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";

interface PaymentClaimModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void; // This is the prop name we need to use, not onClose
  orderId: string;
  txId: string;
  amount: number;
  onClaim: () => Promise<void>;
}

export function PaymentClaimModal({
  open,
  onOpenChange,
  orderId,
  txId,
  amount,
  onClaim,
}: PaymentClaimModalProps) {
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyTxId = () => {
    navigator.clipboard.writeText(txId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClaim = async () => {
    setClaiming(true);
    try {
      await onClaim();
      setClaimed(true);
    } catch (error) {
      console.error("Error claiming payment:", error);
    } finally {
      setClaiming(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          {claimed ? (
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          ) : (
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
              <DollarSign className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            </div>
          )}
          <DialogTitle className="text-center text-xl pt-4">
            {claimed ? "Payment Successfully Claimed" : "Claim Payment"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {claimed ? (
            <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg space-y-2">
              <p className="text-sm text-green-800 dark:text-green-300">
                Your payment of{" "}
                <span className="font-semibold">${amount.toFixed(2)}</span> has
                been successfully claimed and transferred to your wallet.
              </p>
            </div>
          ) : (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg space-y-2">
              <p className="text-sm text-amber-800 dark:text-amber-300">
                A payment of{" "}
                <span className="font-semibold">${amount.toFixed(2)}</span> for
                order #{orderId} is available to be claimed.
              </p>
              <p className="text-sm text-amber-800 dark:text-amber-300">
                The buyer has confirmed receipt of your product and the escrow
                has released the payment.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Order ID:</span>
              <span className="font-medium">#{orderId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-medium">${amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Transaction:</span>
              <div className="flex items-center gap-1">
                <span className="font-mono text-xs truncate max-w-[150px]">
                  {txId}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={copyTxId}
                >
                  {copied ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row sm:justify-between">
          {claimed ? (
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full"
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Go to Wallet
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleClaim}
                disabled={claiming}
                className="bg-green-600 hover:bg-green-700 text-white gap-2"
              >
                <DollarSign className="h-4 w-4" />
                {claiming ? "Processing..." : "Claim Payment"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
