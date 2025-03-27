"use client";

import { useState, useEffect } from "react";
import { CheckCircle, ArrowRight, Copy, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";

interface EscrowSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  escrowTxId: string;
  amount: number;
  productTitle: string;
  sellerName: string;
}

export function EscrowSuccessModal({
  open,
  onOpenChange,
  orderId,
  escrowTxId,
  amount,
  productTitle,
  sellerName,
}: EscrowSuccessModalProps) {
  const [copied, setCopied] = useState(false);

  const copyTxId = () => {
    navigator.clipboard.writeText(escrowTxId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Auto-close after a delay (optional)
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onOpenChange(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [open, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <DialogTitle className="text-center text-xl pt-4">
            Payment Successfully Escrowed
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg space-y-2">
            <p className="text-sm text-green-800 dark:text-green-300">
              Your payment for{" "}
              <span className="font-semibold">{productTitle}</span> has been
              successfully held in escrow.
            </p>
            <p className="text-sm text-green-800 dark:text-green-300">
              The seller <span className="font-semibold">{sellerName}</span>{" "}
              will be notified to ship your product.
            </p>
          </div>

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
              <span className="text-muted-foreground">Escrow Transaction:</span>
              <div className="flex items-center gap-1">
                <span className="font-mono text-xs truncate max-w-[150px]">
                  {escrowTxId}
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

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" asChild className="flex-1">
            <Link href={`/orders`}>
              <ArrowRight className="mr-2 h-4 w-4" />
              Track Your Order
            </Link>
          </Button>
          <Button variant="outline" asChild className="flex-1">
            <Link href={`/marketplace`}>Continue Shopping</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
