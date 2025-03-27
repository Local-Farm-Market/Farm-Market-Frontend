"use client";

import { OrderSuccessDemonstration } from "@/src/components/product/order-success-demonstration";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Wallet, ArrowRight, Leaf } from "lucide-react";
import { Separator } from "@/src/components/ui/separator";

export default function EscrowDemoPage() {
  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-amber-800 dark:text-amber-400 flex items-center">
          <Leaf className="h-6 w-6 mr-2 text-amber-600" />
          Escrow Payment Flow Demo
        </h1>
        <p className="text-muted-foreground mt-2">
          Explore the complete escrow payment flow for the Farm Marketplace from
          order placement to payment release.
        </p>
      </div>

      <OrderSuccessDemonstration />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Buyer Flow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-amber-100 dark:bg-amber-900/30 rounded-full p-2 text-amber-700 dark:text-amber-300 flex-shrink-0">
                <span className="font-bold">1</span>
              </div>
              <div>
                <h3 className="font-medium">Place Order</h3>
                <p className="text-sm text-muted-foreground">
                  Buyer places an order and payment is held in escrow
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-3">
              <div className="bg-amber-100 dark:bg-amber-900/30 rounded-full p-2 text-amber-700 dark:text-amber-300 flex-shrink-0">
                <span className="font-bold">2</span>
              </div>
              <div>
                <h3 className="font-medium">Order Being Processed</h3>
                <p className="text-sm text-muted-foreground">
                  Buyer receives notification when the seller ships the order
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-3">
              <div className="bg-amber-100 dark:bg-amber-900/30 rounded-full p-2 text-amber-700 dark:text-amber-300 flex-shrink-0">
                <span className="font-bold">3</span>
              </div>
              <div>
                <h3 className="font-medium">Confirm Receipt</h3>
                <p className="text-sm text-muted-foreground">
                  Buyer confirms receipt of the product and rates their
                  experience
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seller Flow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-2 text-green-700 dark:text-green-300 flex-shrink-0">
                <span className="font-bold">1</span>
              </div>
              <div>
                <h3 className="font-medium">Receive Order Notification</h3>
                <p className="text-sm text-muted-foreground">
                  Seller receives notification when a buyer places an order
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-3">
              <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-2 text-green-700 dark:text-green-300 flex-shrink-0">
                <span className="font-bold">2</span>
              </div>
              <div>
                <h3 className="font-medium">Process & Ship Order</h3>
                <p className="text-sm text-muted-foreground">
                  Seller processes the order and marks it as shipped
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-3">
              <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-2 text-green-700 dark:text-green-300 flex-shrink-0">
                <span className="font-bold">3</span>
              </div>
              <div>
                <h3 className="font-medium">Receive Payment</h3>
                <p className="text-sm text-muted-foreground">
                  Seller receives notification when payment is released from
                  escrow
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-3">
              <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-2 text-green-700 dark:text-green-300 flex-shrink-0">
                <span className="font-bold">4</span>
              </div>
              <div>
                <h3 className="font-medium">Claim Payment</h3>
                <p className="text-sm text-muted-foreground">
                  Seller claims the released payment from their wallet
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-amber-600" />
            Escrow System Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-green-600" />
                Buyer Protection
              </h3>
              <p className="text-sm text-muted-foreground">
                Payment is held securely until the order is delivered and
                confirmed, protecting buyers from fraud.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-green-600" />
                Seller Assurance
              </h3>
              <p className="text-sm text-muted-foreground">
                Sellers know payment is secured before shipping products,
                eliminating the risk of non-payment.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-green-600" />
                Transparent Process
              </h3>
              <p className="text-sm text-muted-foreground">
                Both parties can track the status of the transaction at each
                step of the process.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
