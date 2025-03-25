"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Textarea } from "@/src/components/ui/textarea";

interface DisputeButtonProps {
  orderId: string;
  onDisputeSubmit: (orderId: string, reason: string) => void;
}

export function DisputeButton({
  orderId,
  onDisputeSubmit,
}: DisputeButtonProps) {
  const [reason, setReason] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    onDisputeSubmit(orderId, reason);
    setOpen(false);
    setReason("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 text-yellow-600 dark:text-yellow-400 border-yellow-300 dark:border-yellow-800 hover:bg-yellow-50 dark:hover:bg-yellow-950"
        >
          <AlertTriangle className="h-4 w-4" />
          Raise Dispute
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Raise a Dispute</DialogTitle>
          <DialogDescription>
            Explain the issue with your order. Our AI will guide you through the
            dispute process.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            placeholder="Describe the issue with your order..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-[120px]"
          />
          <div className="mt-4 p-3 bg-muted rounded-md text-sm">
            <p className="font-medium mb-2">AI Guidance:</p>
            <ul className="space-y-2 list-disc pl-4">
              <li>Be specific about what went wrong with your order</li>
              <li>Include photos if possible to support your claim</li>
              <li>Mention any communication you've had with the seller</li>
              <li>
                Specify your desired resolution (refund, replacement, etc.)
              </li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={reason.trim().length < 10}
            className="gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            Submit Dispute
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
