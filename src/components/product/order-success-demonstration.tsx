"\"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { EscrowSuccessModal } from "@/src/components/payments/escrow-success-modal";
import { EscrowFailureModal } from "@/src/components/payments/escrow-failure-modal";
import { OrderNotificationCard } from "@/src/components/notifications/order-notification-card";
import { OrderConfirmationModal } from "@/src/components/buyer/order-confirmation-modal";
import { PaymentClaimModal } from "@/src/components/escrow/payment-claim-modal";
import { TransactionTracker } from "@/src/components/escrow/transaction-tracker";
import { Wallet, PackageCheck, CheckCircle, AlertTriangle } from "lucide-react";

// This component is created to demonstrate the entire escrow flow
export function OrderSuccessDemonstration() {
  // Modals states
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [failureModalOpen, setFailureModalOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [claimModalOpen, setClaimModalOpen] = useState(false);

  // Order/transaction state
  const [currentStatus, setCurrentStatus] = useState<
    "payment_escrowed" | "in_delivery" | "completed"
  >("payment_escrowed");

  // Mock order data
  const mockOrderData = {
    orderId: "12345",
    escrowTxId: "lsk3j4k5h6j7k8h9j0k1l2m3n4o5p6q7r8s9t0u",
    amount: 25.5,
    productTitle: "Fresh Organic Tomatoes",
    productImage: "/placeholder.svg?height=200&width=200",
    sellerName: "Green Valley Farm",
    buyerName: "John Doe",
    buyerAddress: "123 Main St, Green Valley, CA 94535",
  };

  // Handler functions
  const handleSuccessfulEscrow = () => {
    setSuccessModalOpen(true);
    setCurrentStatus("payment_escrowed");
  };

  const handleFailedEscrow = () => {
    setFailureModalOpen(true);
  };

  const handleShipOrder = () => {
    setCurrentStatus("in_delivery");
  };

  const handleConfirmReceipt = async (rating: number, feedback: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setCurrentStatus("completed");
    return Promise.resolve();
  };

  const handleClaimPayment = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return Promise.resolve();
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-amber-600" />
          Escrow Transaction Flow Demo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 border rounded-md bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
          <p className="text-sm text-green-800 dark:text-green-300 mb-4">
            This demo allows you to explore the complete escrow payment flow
            from order placement to payment release.
          </p>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <h3 className="text-sm font-medium text-green-800 dark:text-green-300">
                Buyer Flow
              </h3>
              <Button
                variant="outline"
                className="w-full border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950/30"
                onClick={handleSuccessfulEscrow}
              >
                1. Place Order (Success)
              </Button>
              <Button
                variant="outline"
                className="w-full border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
                onClick={handleFailedEscrow}
              >
                1. Place Order (Failure)
              </Button>
              <Button
                variant="outline"
                className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/30"
                onClick={() => setConfirmationModalOpen(true)}
                disabled={currentStatus !== "in_delivery"}
              >
                3. Confirm Receipt
              </Button>
            </div>

            <div className="flex-1 space-y-2">
              <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">
                Seller Flow
              </h3>
              <Button
                variant="outline"
                className="w-full border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-950/30"
                onClick={handleShipOrder}
                disabled={currentStatus !== "payment_escrowed"}
              >
                2. Process & Ship Order
              </Button>
              <Button
                variant="outline"
                className="w-full border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950/30"
                onClick={() => setClaimModalOpen(true)}
                disabled={currentStatus !== "completed"}
              >
                4. Claim Payment
              </Button>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-md font-medium mb-3">
            Current Transaction Status:
          </h3>
          <TransactionTracker status={currentStatus} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-md font-medium mb-3 flex items-center gap-2">
              <PackageCheck className="h-4 w-4 text-amber-600" />
              Seller Notification Preview:
            </h3>
            <OrderNotificationCard
              id="notification1"
              type="new_order"
              orderId={mockOrderData.orderId}
              productTitle={mockOrderData.productTitle}
              productImage={mockOrderData.productImage}
              quantity={3}
              price={8.5}
              buyerName={mockOrderData.buyerName}
              buyerAddress={mockOrderData.buyerAddress}
              timestamp={new Date()}
              read={false}
              onShipOrder={handleShipOrder}
            />
          </div>

          <div>
            <h3 className="text-md font-medium mb-3 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Payment Notification Preview:
            </h3>
            <OrderNotificationCard
              id="notification2"
              type="payment_available"
              orderId={mockOrderData.orderId}
              productTitle={mockOrderData.productTitle}
              productImage={mockOrderData.productImage}
              quantity={3}
              price={8.5}
              timestamp={new Date()}
              read={false}
              onClaimPayment={() => setClaimModalOpen(true)}
            />
          </div>
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-md">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <h3 className="font-medium text-amber-800 dark:text-amber-300">
              Note
            </h3>
          </div>
          <p className="text-sm text-amber-700 dark:text-amber-400">
            This is a demonstration of the UI flow. In a real application, these
            modals would open automatically based on user actions and blockchain
            events.
          </p>
        </div>
      </CardContent>

      {/* Modals */}
      <EscrowSuccessModal
        open={successModalOpen}
        onOpenChange={setSuccessModalOpen}
        orderId={mockOrderData.orderId}
        escrowTxId={mockOrderData.escrowTxId}
        amount={mockOrderData.amount}
        productTitle={mockOrderData.productTitle}
        sellerName={mockOrderData.sellerName}
      />

      <EscrowFailureModal
        open={failureModalOpen}
        onOpenChange={setFailureModalOpen}
        errorMessage="Insufficient funds in your wallet to complete this transaction."
        onRetry={handleSuccessfulEscrow}
      />

      <OrderConfirmationModal
        open={confirmationModalOpen}
        onOpenChange={setConfirmationModalOpen}
        orderId={mockOrderData.orderId}
        productTitle={mockOrderData.productTitle}
        productImage={mockOrderData.productImage}
        sellerName={mockOrderData.sellerName}
        onConfirm={handleConfirmReceipt}
      />

      <PaymentClaimModal
        open={claimModalOpen}
        onOpenChange={setClaimModalOpen}
        orderId={mockOrderData.orderId}
        txId={mockOrderData.escrowTxId}
        amount={mockOrderData.amount}
        onClaim={handleClaimPayment}
      />
    </Card>
  );
}
