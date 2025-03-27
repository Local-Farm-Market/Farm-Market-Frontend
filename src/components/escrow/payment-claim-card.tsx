"use client";

import React from "react";
import {
  DollarSign,
  CheckCircle,
  Clock,
  Copy,
  Check,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";

interface PaymentClaimCardProps {
  orderId: string;
  txId: string;
  amount: number;
  date: Date;
  status: "available" | "pending" | "claimed";
  onClaim?: () => void;
}

export function PaymentClaimCard({
  orderId,
  txId,
  amount,
  date,
  status,
  onClaim,
}: PaymentClaimCardProps) {
  const [copied, setCopied] = React.useState(false);

  const copyTxId = () => {
    navigator.clipboard.writeText(txId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = () => {
    switch (status) {
      case "available":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800">
            Available
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800">
            Pending
          </Badge>
        );
      case "claimed":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800">
            Claimed
          </Badge>
        );
    }
  };

  return (
    <Card
      className={
        status === "available" ? "border-green-200 dark:border-green-800" : ""
      }
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md font-medium flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            Payment for Order #{orderId}
          </CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Amount:</span>
            <span className="text-xl font-bold text-green-700 dark:text-green-400">
              ${amount.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Date:</span>
            <span>{date.toLocaleDateString()}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Transaction ID:</span>
            <div className="flex items-center gap-1">
              <span className="font-mono text-xs truncate max-w-[120px]">
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

          {status === "available" && (
            <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-md flex items-center gap-2 mt-2">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-sm text-green-800 dark:text-green-300">
                This payment has been released from escrow and is ready to be
                claimed.
              </span>
            </div>
          )}

          {status === "pending" && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-md flex items-center gap-2 mt-2">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <span className="text-sm text-amber-800 dark:text-amber-300">
                Waiting for buyer confirmation before payment is released from
                escrow.
              </span>
            </div>
          )}

          {status === "claimed" && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-md flex items-center gap-2 mt-2">
              <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-blue-800 dark:text-blue-300">
                This payment has been successfully claimed and transferred to
                your wallet.
              </span>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            {status === "available" && onClaim && (
              <Button
                onClick={onClaim}
                className="gap-2 bg-green-600 hover:bg-green-700 text-white"
              >
                <DollarSign className="h-4 w-4" />
                Claim Payment
              </Button>
            )}

            {status === "pending" && (
              <Button variant="outline" className="gap-2">
                <ArrowRight className="h-4 w-4" />
                View Order Details
              </Button>
            )}

            {status === "claimed" && (
              <Button variant="outline" className="gap-2">
                <ArrowRight className="h-4 w-4" />
                View Transaction
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
