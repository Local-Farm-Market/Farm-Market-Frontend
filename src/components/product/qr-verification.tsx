"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { QrCode, Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";

interface QrVerificationProps {
  productId: string;
  farmerId: string;
  productName: string;
  harvestDate: string;
}

export function QrVerification({
  productId,
  farmerId,
  productName,
  harvestDate,
}: QrVerificationProps) {
  const [verified, setVerified] = useState<boolean | null>(null);

  const handleVerify = () => {
    // Mock verification process
    setTimeout(() => {
      setVerified(true);
    }, 1500);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <QrCode className="h-4 w-4" />
          Verify Product
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Product Verification</DialogTitle>
          <DialogDescription>
            Scan this QR code to verify the authenticity of this product
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center py-4">
          <div className="bg-white p-4 rounded-md mb-4">
            {/* Mock QR code */}
            <div className="w-48 h-48 bg-[url('/placeholder.svg?height=200&width=200')] bg-contain bg-no-repeat bg-center" />
          </div>

          <div className="text-sm space-y-2 w-full">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Product ID:</span>
              <span className="font-medium">{productId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Farmer ID:</span>
              <span className="font-medium">{farmerId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Product:</span>
              <span className="font-medium">{productName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Harvest Date:</span>
              <span className="font-medium">{harvestDate}</span>
            </div>
          </div>

          {verified === null ? (
            <Button onClick={handleVerify} className="mt-6 w-full">
              Verify Now
            </Button>
          ) : verified ? (
            <div className="mt-6 p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md flex items-center gap-2">
              <Check className="h-5 w-5" />
              <span>Product verified successfully!</span>
            </div>
          ) : (
            <div className="mt-6 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md flex items-center gap-2">
              <X className="h-5 w-5" />
              <span>
                Verification failed. This product may not be authentic.
              </span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
