"use client";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { ArrowDownLeft, Clock, CheckCircle, ExternalLink } from "lucide-react";

interface PaymentClaimCardProps {
  orderId: string;
  txId: string;
  amount: number;
  date: Date;
  status: "available" | "claimed";
  onClaim?: () => void;
  onViewTransaction?: () => void;
}

export function PaymentClaimCard({
  orderId,
  txId,
  amount,
  date,
  status,
  onClaim,
  onViewTransaction,
}: PaymentClaimCardProps) {
  const getStatusBadge = () => {
    switch (status) {
      case "available":
        return (
          <div className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 rounded-full text-xs flex items-center gap-1">
            <ArrowDownLeft className="h-3 w-3" /> Available
          </div>
        );
      case "claimed":
        return (
          <div className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 rounded-full text-xs flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Claimed
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card
      className={`border ${
        status === "available"
          ? "border-green-200 dark:border-green-900"
          : "border-blue-200 dark:border-blue-900"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">Order #{orderId}</h3>
              {getStatusBadge()}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Transaction ID:{" "}
              <span className="font-mono text-xs">
                {txId.substring(0, 16)}...
              </span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {date.toLocaleDateString()} at {date.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex flex-col sm:items-end gap-2">
            <div className="text-xl font-bold text-green-600 dark:text-green-400">
              ${amount.toFixed(2)}
            </div>
            <div className="flex gap-2">
              {status === "available" && onClaim && (
                <Button
                  size="sm"
                  className="gap-2 bg-green-600 hover:bg-green-700"
                  onClick={onClaim}
                >
                  <ArrowDownLeft className="h-4 w-4" />
                  Claim Payment
                </Button>
              )}
              {status === "claimed" && onViewTransaction && (
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={onViewTransaction}
                >
                  <ExternalLink className="h-4 w-4" />
                  View Transaction
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
