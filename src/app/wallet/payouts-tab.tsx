"use client";

import { useState } from "react";
import { PaymentClaimCard } from "@/src/components/escrow/payment-claim-card";
import { PaymentClaimModal } from "@/src/components/escrow/payment-claim-modal";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  DollarSign,
  Clock,
  CheckCircle,
  RefreshCw,
  Wallet,
} from "lucide-react";

// Mock data for the payments
const mockPayments = [
  {
    orderId: "12345",
    txId: "lsk3j4k5h6j7k8h9j0k1l2m3n4o5p6q7r8s9t0u",
    amount: 25.5,
    date: new Date(Date.now() - 3600000),
    status: "available" as const,
  },
  {
    orderId: "12346",
    txId: "lsk9j8h7g6f5d4s3a2s1d2f3g4h5j6k7l8k9j8h7",
    amount: 12.75,
    date: new Date(Date.now() - 86400000),
    status: "claimed" as const,
  },
  {
    orderId: "12347",
    txId: "lsk5r4e3w2q1a2s3d4f5g6h7j8k9l0p1o2i3u4y",
    amount: 45.0,
    date: new Date(Date.now() - 172800000),
    status: "pending" as const,
  },
];

export default function PayoutsTab() {
  const [payments, setPayments] = useState(mockPayments);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<
    (typeof mockPayments)[0] | null
  >(null);

  const handleOpenClaimModal = (payment: (typeof mockPayments)[0]) => {
    setSelectedPayment(payment);
    setClaimModalOpen(true);
  };

  const handleClaimPayment = async () => {
    if (!selectedPayment) return;

    // Simulate API call with delay
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // Update payment status
        setPayments(
          payments.map((payment) =>
            payment.orderId === selectedPayment.orderId
              ? { ...payment, status: "claimed" as const }
              : payment
          )
        );
        resolve();
      }, 1500);
    });
  };

  // Calculate summary metrics
  const availableTotal = payments
    .filter((p) => p.status === "available")
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingTotal = payments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  const claimedTotal = payments
    .filter((p) => p.status === "claimed")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-300">
                Available to Claim
              </p>
              <h3 className="text-2xl font-bold text-green-900 dark:text-green-200">
                ${availableTotal.toFixed(2)}
              </h3>
              <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                {payments.filter((p) => p.status === "available").length}{" "}
                payments
              </p>
            </div>
            <div className="h-12 w-12 bg-green-200 dark:bg-green-800 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-700 dark:text-green-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                Pending in Escrow
              </p>
              <h3 className="text-2xl font-bold text-amber-900 dark:text-amber-200">
                ${pendingTotal.toFixed(2)}
              </h3>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                {payments.filter((p) => p.status === "pending").length} payments
              </p>
            </div>
            <div className="h-12 w-12 bg-amber-200 dark:bg-amber-800 rounded-full flex items-center justify-center">
              <Clock className="h-6 w-6 text-amber-700 dark:text-amber-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                Total Claimed
              </p>
              <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-200">
                ${claimedTotal.toFixed(2)}
              </h3>
              <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                {payments.filter((p) => p.status === "claimed").length} payments
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-blue-700 dark:text-blue-300" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <Wallet className="h-5 w-5 text-amber-600" />
          Payment History
        </h2>
        <Button variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="space-y-4">
        {payments
          .filter((p) => p.status === "available")
          .map((payment) => (
            <PaymentClaimCard
              key={payment.orderId}
              orderId={payment.orderId}
              txId={payment.txId}
              amount={payment.amount}
              date={payment.date}
              status={payment.status}
              onClaim={() => handleOpenClaimModal(payment)}
            />
          ))}

        {payments
          .filter((p) => p.status === "pending")
          .map((payment) => (
            <PaymentClaimCard
              key={payment.orderId}
              orderId={payment.orderId}
              txId={payment.txId}
              amount={payment.amount}
              date={payment.date}
              status={payment.status}
            />
          ))}

        {payments
          .filter((p) => p.status === "claimed")
          .map((payment) => (
            <PaymentClaimCard
              key={payment.orderId}
              orderId={payment.orderId}
              txId={payment.txId}
              amount={payment.amount}
              date={payment.date}
              status={payment.status}
            />
          ))}

        {payments.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No payments found</p>
            </CardContent>
          </Card>
        )}
      </div>

      {selectedPayment && (
        <PaymentClaimModal
          open={claimModalOpen}
          onOpenChange={setClaimModalOpen}
          orderId={selectedPayment.orderId}
          txId={selectedPayment.txId}
          amount={selectedPayment.amount}
          onClaim={handleClaimPayment}
        />
      )}
    </div>
  );
}
