"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { PaymentClaimCard } from "@/src/components/escrow/payment-claim-card";
import { PaymentClaimModal } from "@/src/components/escrow/payment-claim-modal";
import { useOrders } from "@/src/hooks/use-orders";
import { useEscrow } from "@/src/hooks/use-escrow";
import { OrderStatus } from "@/src/lib/types";

export function PayoutsTab() {
  const { address } = useAccount();
  const [claimableOrders, setClaimableOrders] = useState<any[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { fetchSellerOrders } = useOrders();
  const { fetchEscrowDetails } = useEscrow();

  useEffect(() => {
    if (address) {
      loadClaimableOrders();
    }
  }, [address]);

  const loadClaimableOrders = async () => {
    setIsLoading(true);
    try {
      const orders = await fetchSellerOrders();

      // Filter completed orders
      const completedOrders = orders.filter(
        (order) => order.status === OrderStatus.COMPLETED
      );

      // Get escrow details for each order
      const ordersWithEscrow = await Promise.all(
        completedOrders.map(async (order) => {
          const escrow = await fetchEscrowDetails(BigInt(order.id));
          return {
            ...order,
            escrow,
          };
        })
      );

      // Filter orders with claimable escrow
      const claimable = ordersWithEscrow.filter(
        (order) =>
          order.escrow && order.escrow.isClaimable && !order.escrow.isClaimed
      );

      setClaimableOrders(claimable);
    } catch (error) {
      console.error("Error loading claimable orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrderId(null);
  };

  const handleClaimSuccess = () => {
    loadClaimableOrders();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Available Payouts</CardTitle>
            <CardDescription>Loading available payments...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Available Payouts</CardTitle>
          <CardDescription>Claim payments for completed orders</CardDescription>
        </CardHeader>
        <CardContent>
          {claimableOrders.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {claimableOrders.map((order) => (
                <PaymentClaimCard
                  key={order.id.toString()}
                  orderId={order.id}
                  amount={order.escrow.sellerAmount}
                  isClaimable={
                    order.escrow.isClaimable && !order.escrow.isClaimed
                  }
                  onClaimSuccess={handleClaimSuccess}
                  onOpenModal={() => handleOpenModal(order.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No payments available for claim
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedOrderId && (
        <PaymentClaimModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen} // Changed from onClose to onOpenChange
          orderId={selectedOrderId}
          txId="0x1234...5678" // Added missing txId prop
          amount={
            claimableOrders.find((order) => order.id === selectedOrderId)
              ?.escrow.sellerAmount || 0
          }
          onClaim={async () => {
            // Added missing onClaim prop
            // Implement claim functionality
            await new Promise((resolve) => setTimeout(resolve, 1000));
            handleClaimSuccess();
          }}
        />
      )}
    </div>
  );
}
