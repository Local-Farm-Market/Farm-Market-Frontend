"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { ArrowDownLeft, CheckCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/src/components/ui/alert";

interface PaymentClaimModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  txId: string;
  amount: number;
  onClaim: () => Promise<void>;
  showCommissionNotice?: boolean;
}

export function PaymentClaimModal({
  open,
  onOpenChange,
  orderId,
  txId,
  amount,
  onClaim,
  showCommissionNotice = false,
}: PaymentClaimModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClaim = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await onClaim();
      setIsSuccess(true);
    } catch (err) {
      setError("Failed to claim payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false);
      // Reset state after modal is closed
      setTimeout(() => {
        setIsSuccess(false);
        setError(null);
      }, 300);
    }
  };

  const fee = amount * 0.05; // 5% platform fee
  const netAmount = amount - fee;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowDownLeft className="h-5 w-5 text-green-600" />
            Claim Payment
          </DialogTitle>
        </DialogHeader>

        {!isSuccess ? (
          <>
            <div className="space-y-4">
              <div className="p-4 border rounded-md">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Order ID:
                  </span>
                  <span className="font-medium">#{orderId}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-muted-foreground">
                    Transaction ID:
                  </span>
                  <span className="font-mono text-xs">
                    {txId.substring(0, 12)}...
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-muted-foreground">Amount:</span>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    ${amount.toFixed(2)}
                  </span>
                </div>

                {showCommissionNotice && (
                  <>
                    <div className="border-t my-3"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Platform Fee (1%):
                      </span>
                      <span className="text-red-600 dark:text-red-400">
                        -${fee.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm font-medium">Net Amount:</span>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        ${netAmount.toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {showCommissionNotice && (
                <Alert className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900">
                  <AlertDescription className="text-sm text-amber-800 dark:text-amber-300">
                    A 1% platform fee will be deducted from your payment to
                    cover transaction processing and marketplace services.
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleClaim}
                disabled={isLoading}
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ArrowDownLeft className="h-4 w-4" />
                    Claim $
                    {showCommissionNotice
                      ? netAmount.toFixed(2)
                      : amount.toFixed(2)}
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center justify-center">
              <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-center">
                Payment Claimed Successfully!
              </h3>
              <p className="text-center text-muted-foreground mt-2">
                $
                {showCommissionNotice
                  ? netAmount.toFixed(2)
                  : amount.toFixed(2)}{" "}
                has been added to your wallet balance.
              </p>
            </div>

            <DialogFooter>
              <Button onClick={handleClose} className="w-full">
                Close
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
