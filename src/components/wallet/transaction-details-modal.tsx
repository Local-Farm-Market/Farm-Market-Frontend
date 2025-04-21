"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/src/components/ui/dialog"
import { Button } from "@/src/components/ui/button"
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle, Copy, Check, ExternalLink } from "lucide-react"
import { useState } from "react"

interface TransactionDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction: {
    id: string
    type: string
    amount: number
    timestamp: Date
    status: string
    orderId?: string
    description?: string
    from?: string
    to?: string
    fee?: number
  }
}

export function TransactionDetailsModal({ open, onOpenChange, transaction }: TransactionDetailsModalProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "incoming":
        return <ArrowDownLeft className="h-5 w-5 text-green-600" />
      case "outgoing":
        return <ArrowUpRight className="h-5 w-5 text-amber-600" />
      case "claim":
        return <CheckCircle className="h-5 w-5 text-blue-600" />
      default:
        return null
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "incoming":
        return "Received Payment"
      case "outgoing":
        return "Sent Payment"
      case "claim":
        return "Claimed Payment"
      default:
        return "Transaction"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending"
      case "completed":
        return "Completed"
      case "failed":
        return "Failed"
      default:
        return status
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {getTypeIcon(transaction.type)}
            {getTypeLabel(transaction.type)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${getStatusClass(transaction.status)}`}
              >
                {getStatusIcon(transaction.status)} {getStatusLabel(transaction.status)}
              </span>
            </div>
            <div className="text-right">
              <div
                className={`text-2xl font-bold ${
                  transaction.type === "incoming"
                    ? "text-green-600 dark:text-green-400"
                    : transaction.type === "claim"
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-amber-600 dark:text-amber-400"
                }`}
              >
                {transaction.type === "incoming" ? "+" : transaction.type === "claim" ? "" : "-"}$
                {transaction.amount.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">{transaction.timestamp.toLocaleString()}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 border-t border-b py-4">
            <div>
              <p className="text-sm text-muted-foreground">Transaction ID</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="font-mono text-sm truncate">{transaction.id}</p>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(transaction.id)}>
                  {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
            </div>

            {transaction.orderId && (
              <div>
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="font-medium">{transaction.orderId}</p>
              </div>
            )}

            {transaction.description && (
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="font-medium">{transaction.description}</p>
              </div>
            )}

            {transaction.from && (
              <div>
                <p className="text-sm text-muted-foreground">From</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="font-mono text-sm truncate">{transaction.from}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyToClipboard(transaction.from ?? "")}
                  >
                    {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
              </div>
            )}

            {transaction.to && (
              <div>
                <p className="text-sm text-muted-foreground">To</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="font-mono text-sm truncate">{transaction.to}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyToClipboard(transaction.to ?? "")}
                  >
                    {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {transaction.fee !== undefined && transaction.fee > 0 && (
            <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-md">
              <h3 className="font-medium">Transaction Details</h3>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Gross Amount:</span>
                  <span>${transaction.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Platform Fee (5%):</span>
                  <span>-${transaction.fee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t">
                  <span>Net Amount:</span>
                  <span>${(transaction.amount - transaction.fee).toFixed(2)}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                A 5% platform fee is deducted from all claimed payments to cover transaction processing and marketplace
                services.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="mt-6 flex justify-between items-center">
          <Button variant="outline" className="gap-2">
            <ExternalLink className="h-4 w-4" />
            View on Explorer
          </Button>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

