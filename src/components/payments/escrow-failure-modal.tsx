"use client";

import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";

interface EscrowFailureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  errorMessage: string;
  onRetry: () => void;
}

export function EscrowFailureModal({
  open,
  onOpenChange,
  errorMessage,
  onRetry,
}: EscrowFailureModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <DialogTitle className="text-center text-xl pt-4">
            Payment Failed
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-300">
              We encountered an issue while processing your payment to escrow.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Error details:</div>
            <div className="p-3 bg-muted rounded-md text-sm font-mono">
              {errorMessage}
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            If this issue persists, please contact our support team for
            assistance.
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Checkout
          </Button>
          <Button
            onClick={onRetry}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
