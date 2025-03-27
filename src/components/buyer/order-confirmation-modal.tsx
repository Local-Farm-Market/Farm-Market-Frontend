"use client";

import { useState } from "react";
import { Star, ThumbsUp, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import Image from "next/image";

interface OrderConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  productTitle: string;
  productImage: string;
  sellerName: string;
  onConfirm: (rating: number, feedback: string) => Promise<void>;
}

export function OrderConfirmationModal({
  open,
  onOpenChange,
  orderId,
  productTitle,
  productImage,
  sellerName,
  onConfirm,
}: OrderConfirmationModalProps) {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleRate = (newRating: number) => {
    setRating(newRating);
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onConfirm(rating, feedback);
      setConfirmed(true);
    } catch (error) {
      console.error("Error confirming order:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          {confirmed ? (
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          ) : (
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
              <Star className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            </div>
          )}
          <DialogTitle className="text-center text-xl pt-4">
            {confirmed ? "Order Confirmed Successfully" : "Confirm Your Order"}
          </DialogTitle>
        </DialogHeader>

        {!confirmed ? (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3">
              <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                <Image
                  src={productImage || "/placeholder.svg"}
                  alt={productTitle}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">{productTitle}</h3>
                <p className="text-sm text-muted-foreground">
                  Seller: {sellerName}
                </p>
                <p className="text-sm text-muted-foreground">
                  Order: #{orderId}
                </p>
              </div>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
              <p className="text-sm text-amber-800 dark:text-amber-300">
                Have you received this order and are you satisfied with its
                quality?
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Rate your purchase:</div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-6 w-6 cursor-pointer ${
                      star <= rating
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                    onClick={() => handleRate(star)}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Feedback (optional):</div>
              <Textarea
                placeholder="Share your experience with this product..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="border-amber-200 dark:border-amber-800"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-300">
                Thank you for confirming your order! The payment has been
                released from escrow to the seller.
              </p>
              {rating > 0 && (
                <p className="text-sm text-green-800 dark:text-green-300 mt-2">
                  Your {rating}-star rating has been submitted successfully.
                </p>
              )}
            </div>
          </div>
        )}

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {!confirmed ? (
            <>
              <Button
                onClick={handleConfirm}
                disabled={submitting}
                className="gap-2 bg-green-600 hover:bg-green-700 text-white flex-1"
              >
                <ThumbsUp className="h-4 w-4" />
                {submitting ? "Processing..." : "Confirm Receipt"}
              </Button>
            </>
          ) : (
            <Button
              onClick={() => onOpenChange(false)}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
