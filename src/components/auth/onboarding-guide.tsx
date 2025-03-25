"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";

export function OnboardingGuide() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Info className="h-4 w-4" />
          How It Works
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to Farm Marketplace</DialogTitle>
          <DialogDescription>
            Learn how our decentralized marketplace works to connect farmers and
            buyers
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="escrow">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="escrow">Escrow</TabsTrigger>
            <TabsTrigger value="disputes">Disputes</TabsTrigger>
            <TabsTrigger value="selling">Selling</TabsTrigger>
          </TabsList>
          <TabsContent value="escrow" className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">How Escrow Works</h3>
              <p className="text-sm text-muted-foreground">
                Our escrow system protects both buyers and sellers by holding
                payment until delivery is confirmed.
              </p>
              <ol className="text-sm space-y-2 list-decimal pl-4 mt-2">
                <li>Buyer places an order and payment is held in escrow</li>
                <li>
                  Seller ships the product and provides tracking information
                </li>
                <li>Buyer confirms receipt and quality of the product</li>
                <li>Payment is released to the seller automatically</li>
              </ol>
            </div>
          </TabsContent>
          <TabsContent value="disputes" className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Handling Disputes</h3>
              <p className="text-sm text-muted-foreground">
                If there's an issue with your order, our dispute resolution
                system helps resolve it fairly.
              </p>
              <ol className="text-sm space-y-2 list-decimal pl-4 mt-2">
                <li>Buyer raises a dispute with detailed information</li>
                <li>Seller is notified and can respond to the claim</li>
                <li>AI-assisted mediation helps find a resolution</li>
                <li>If needed, community governance votes on the outcome</li>
              </ol>
            </div>
          </TabsContent>
          <TabsContent value="selling" className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Selling Your Products</h3>
              <p className="text-sm text-muted-foreground">
                Farmers can easily list and sell their products on our
                marketplace.
              </p>
              <ol className="text-sm space-y-2 list-decimal pl-4 mt-2">
                <li>Connect your wallet to create a seller account</li>
                <li>Add your product with photos, description, and pricing</li>
                <li>Receive orders and ship products to buyers</li>
                <li>Get paid automatically through our escrow system</li>
              </ol>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Got it</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
