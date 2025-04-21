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
  ArrowUpDown,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { SalesReportModal } from "@/src/components/wallet/sales-report-modal";
import { PendingPayoutsModal } from "@/src/components/wallet/pending-payouts-modal";
import { TransactionDetailsModal } from "@/src/components/wallet/transaction-details-modal";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/src/components/ui/select";

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
];

export default function PayoutsTab() {
  const [payments, setPayments] = useState(mockPayments);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<
    (typeof mockPayments)[0] | null
  >(null);
  const [salesReportModalOpen, setSalesReportModalOpen] = useState(false);
  const [pendingPayoutsModalOpen, setPendingPayoutsModalOpen] = useState(false);
  const [transactionDetailsModalOpen, setTransactionDetailsModalOpen] =
    useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");

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

  const handleViewTransaction = (payment: (typeof mockPayments)[0]) => {
    setSelectedTransaction({
      id: payment.txId,
      type: payment.status === "claimed" ? "claim" : "incoming",
      amount: payment.amount,
      timestamp: payment.date,
      status: "completed",
      orderId: payment.orderId,
      description: `Payment for order #${payment.orderId}`,
      fee: payment.status === "claimed" ? payment.amount * 0.05 : 0, // 5% fee for claimed payments
    });
    setTransactionDetailsModalOpen(true);
  };

  const filterPayments = () => {
    if (activeTab === "all") return payments;
    return payments.filter((payment) => payment.status === activeTab);
  };

  const filteredPayments = filterPayments();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900">
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
        </Card> */}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <Wallet className="h-5 w-5 text-amber-600" />
          Payment History
        </h2>
        <Button variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Input
          placeholder="Search by order ID or transaction ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-amber-100 dark:bg-amber-950/50">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
          >
            All Payments
          </TabsTrigger>
          <TabsTrigger
            value="available"
            className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
          >
            Available
          </TabsTrigger>
          <TabsTrigger
            value="claimed"
            className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
          >
            Claimed
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-4">
          {filteredPayments
            .filter(
              (p) =>
                p.orderId.includes(searchQuery) ||
                p.txId.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .sort((a, b) => {
              if (sortBy === "date") {
                return b.date.getTime() - a.date.getTime();
              } else if (sortBy === "amount") {
                return b.amount - a.amount;
              } else if (sortBy === "orderId") {
                return a.orderId.localeCompare(b.orderId);
              }
              return 0;
            })
            .map((payment) => (
              <PaymentClaimCard
                key={payment.orderId}
                orderId={payment.orderId}
                txId={payment.txId}
                amount={payment.amount}
                date={payment.date}
                status={payment.status}
                onClaim={
                  payment.status === "available"
                    ? () => handleOpenClaimModal(payment)
                    : undefined
                }
                onViewTransaction={() => handleViewTransaction(payment)}
              />
            ))}

          {filteredPayments.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No payments found</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {selectedPayment && (
        <PaymentClaimModal
          open={claimModalOpen}
          onOpenChange={setClaimModalOpen}
          orderId={selectedPayment.orderId}
          txId={selectedPayment.txId}
          amount={selectedPayment.amount}
          onClaim={handleClaimPayment}
          showCommissionNotice={true}
        />
      )}

      <SalesReportModal
        open={salesReportModalOpen}
        onOpenChange={setSalesReportModalOpen}
      />

      <PendingPayoutsModal
        open={pendingPayoutsModalOpen}
        onOpenChange={setPendingPayoutsModalOpen}
      />

      {selectedTransaction && (
        <TransactionDetailsModal
          open={transactionDetailsModalOpen}
          onOpenChange={setTransactionDetailsModalOpen}
          transaction={selectedTransaction}
        />
      )}
    </div>
  );
}
