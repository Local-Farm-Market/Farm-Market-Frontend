"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/src/components/ui/dialog"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Clock, Search, ArrowDownLeft, CheckCircle, ExternalLink } from "lucide-react"
import { useState } from "react"

interface PendingPayoutsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PendingPayoutsModal({ open, onOpenChange }: PendingPayoutsModalProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock pending payouts data
  const pendingPayouts = [
    {
      orderId: "12347",
      txId: "lsk5r4e3w2q1a2s3d4f5g6h7j8k9l0p1o2i3u4y",
      amount: 45.0,
      date: new Date(Date.now() - 172800000),
      buyer: "John Smith",
      product: "Organic Tomatoes (5kg)",
      escrowStatus: "In Escrow",
      releaseDate: new Date(Date.now() + 259200000),
    },
    {
      orderId: "12350",
      txId: "lsk7j6k5h4g3f2d1s2a3s4d5f6g7h8j9k0l1p2o3i",
      amount: 78.25,
      date: new Date(Date.now() - 86400000),
      buyer: "Sarah Johnson",
      product: "Grass-Fed Beef (2kg)",
      escrowStatus: "In Escrow",
      releaseDate: new Date(Date.now() + 345600000),
    },
    {
      orderId: "12352",
      txId: "lsk9p8o7i6u5y4t3r2e1w2q3a4s5d6f7g8h9j0k",
      amount: 32.5,
      date: new Date(Date.now() - 43200000),
      buyer: "Michael Brown",
      product: "Organic Free-Range Eggs (30 count)",
      escrowStatus: "In Escrow",
      releaseDate: new Date(Date.now() + 432000000),
    },
  ]

  const filteredPayouts = pendingPayouts.filter(
    (payout) =>
      payout.orderId.includes(searchQuery) ||
      payout.buyer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payout.product.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Clock className="h-5 w-5 text-amber-600" />
            Pending Payouts
          </DialogTitle>
        </DialogHeader>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by order ID, buyer, or product"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredPayouts.length > 0 ? (
            filteredPayouts.map((payout) => (
              <div key={payout.orderId} className="border rounded-md p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium flex items-center gap-2">
                      Order #{payout.orderId}
                      <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 rounded-full flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {payout.escrowStatus}
                      </span>
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Transaction ID: <span className="font-mono text-xs">{payout.txId}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-amber-600 dark:text-amber-400">
                      ${payout.amount.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">{payout.date.toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Buyer:</p>
                    <p className="font-medium">{payout.buyer}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Product:</p>
                    <p className="font-medium">{payout.product}</p>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-md">
                  <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                    <ArrowDownLeft className="h-4 w-4" />
                    <span className="font-medium">Expected Release Date:</span>
                  </div>
                  <p className="text-sm mt-1">
                    {payout.releaseDate.toLocaleDateString()} (
                    {Math.ceil((payout.releaseDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days remaining)
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Funds will be available to claim after the buyer confirms receipt of the product or after the escrow
                    period ends.
                  </p>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    View Order
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Check Status
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 border rounded-md">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium">No Pending Payouts Found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {searchQuery
                  ? "No payouts match your search criteria."
                  : "You don't have any pending payouts at the moment."}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="mt-6">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

