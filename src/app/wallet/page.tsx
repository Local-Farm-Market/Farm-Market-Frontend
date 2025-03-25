"use client";

import { Badge } from "@/src/components/ui/badge";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { WalletConnect } from "@/src/components/auth/wallet-connect";
import { useUserRole } from "@/src/hooks/use-user-role";
import { NotificationPanel } from "@/src/components/notifications/notification-panel";
import { ThemeToggle } from "@/src/components/layout/theme-toggle";
import { ProtectedRoute } from "@/src/components/auth/protected-route";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
  Check,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Wallet,
  CreditCard,
  DollarSign,
  BarChart3,
  ShoppingCart,
  Leaf,
  Store,
  Plus,
} from "lucide-react";

interface Transaction {
  id: string;
  type: "incoming" | "outgoing";
  amount: number;
  timestamp: Date;
  status: "pending" | "completed" | "failed";
  from?: string;
  to?: string;
  description?: string;
}

// Buyer-specific mock data
const buyerTransactions: Transaction[] = [
  {
    id: "tx1",
    type: "outgoing",
    amount: 25.5,
    timestamp: new Date(Date.now() - 3600000),
    status: "completed",
    to: "lsk3j4k5h6j7k8h9j0k1l2m3n4o5p6q7r8s9t0u",
    description: "Purchase: Organic tomatoes",
  },
  {
    id: "tx2",
    type: "outgoing",
    amount: 12.75,
    timestamp: new Date(Date.now() - 86400000),
    status: "completed",
    to: "lsk9j8h7g6f5d4s3a2s1d2f3g4h5j6k7l8k9j8h7",
    description: "Purchase: Grass-fed beef",
  },
  {
    id: "tx3",
    type: "incoming",
    amount: 8.5,
    timestamp: new Date(Date.now() - 172800000),
    status: "completed",
    from: "lsk5r4e3w2q1a2s3d4f5g6h7j8k9l0p1o2i3u4y",
    description: "Refund for damaged product",
  },
  {
    id: "tx4",
    type: "outgoing",
    amount: 15.0,
    timestamp: new Date(Date.now() - 259200000),
    status: "pending",
    to: "lsk1q2w3e4r5t6y7u8i9o0p1a2s3d4f5g6h7j8k9",
    description: "Purchase: Organic eggs",
  },
];

// Seller-specific mock data
const sellerTransactions: Transaction[] = [
  {
    id: "tx1",
    type: "incoming",
    amount: 25.5,
    timestamp: new Date(Date.now() - 3600000),
    status: "completed",
    from: "lsk3j4k5h6j7k8h9j0k1l2m3n4o5p6q7r8s9t0u",
    description: "Sale: Organic tomatoes",
  },
  {
    id: "tx2",
    type: "incoming",
    amount: 12.75,
    timestamp: new Date(Date.now() - 86400000),
    status: "completed",
    from: "lsk9j8h7g6f5d4s3a2s1d2f3g4h5j6k7l8k9j8h7",
    description: "Sale: Grass-fed beef",
  },
  {
    id: "tx3",
    type: "outgoing",
    amount: 8.5,
    timestamp: new Date(Date.now() - 172800000),
    status: "completed",
    to: "lsk5r4e3w2q1a2s3d4f5g6h7j8k9l0p1o2i3u4y",
    description: "Refund for damaged product",
  },
  {
    id: "tx4",
    type: "incoming",
    amount: 45.0,
    timestamp: new Date(Date.now() - 259200000),
    status: "pending",
    from: "lsk1q2w3e4r5t6y7u8i9o0p1a2s3d4f5g6h7j8k9",
    description: "Sale: Bulk order - Mixed vegetables",
  },
];

export default function WalletPage() {
  const { role, setRole } = useUserRole();
  const [isConnected, setIsConnected] = useState(true);
  const [walletAddress, setWalletAddress] = useState(
    "lsk7h3kquly4s5cgh8bj2j9yqtbdgz4venhmgkx4"
  );
  const [balance, setBalance] = useState(125.75);
  const [copied, setCopied] = useState(false);
  const [sendAmount, setSendAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");

  // Use different transactions based on role
  const [transactions, setTransactions] = useState<Transaction[]>(
    role === "seller" ? sellerTransactions : buyerTransactions
  );

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = () => {
    if (!sendAmount || !recipientAddress) return;

    const amount = Number.parseFloat(sendAmount);
    if (isNaN(amount) || amount <= 0 || amount > balance) return;

    // Create new transaction
    const newTransaction: Transaction = {
      id: `tx${Date.now()}`,
      type: "outgoing",
      amount,
      timestamp: new Date(),
      status: "pending",
      to: recipientAddress,
      description: role === "seller" ? "Supplier payment" : "Payment",
    };

    setTransactions([newTransaction, ...transactions]);
    setBalance(balance - amount);
    setSendAmount("");
    setRecipientAddress("");

    // Simulate transaction completion
    setTimeout(() => {
      setTransactions(
        transactions.map((tx) =>
          tx.id === newTransaction.id ? { ...tx, status: "completed" } : tx
        )
      );
    }, 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  // Buyer-specific wallet UI
  const BuyerWallet = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800 dark:text-green-300 flex items-center">
              <Wallet className="h-4 w-4 mr-2 text-green-600" />
              Available Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 dark:text-green-200">
              ${balance.toFixed(2)}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 gap-2 border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950/30"
              onClick={() => setBalance(balance + 10)}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-800 dark:text-amber-300 flex items-center">
              <CreditCard className="h-4 w-4 mr-2 text-amber-600" />
              Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">Lisk Wallet Connected</div>
            <div className="text-xs text-muted-foreground mt-1 font-mono truncate">
              {walletAddress}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 gap-2 border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-950/30"
            >
              <Plus className="h-4 w-4" />
              Add Payment Method
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-300 flex items-center">
              <ShoppingCart className="h-4 w-4 mr-2 text-blue-600" />
              Recent Purchases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-200">
              4
            </div>
            <div className="text-sm text-muted-foreground">
              purchases this month
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 w-full border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/30"
            >
              View Purchase History
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions">
        <TabsList className="mb-6 bg-amber-100 dark:bg-amber-950/50">
          <TabsTrigger
            value="transactions"
            className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
          >
            Transactions
          </TabsTrigger>
          <TabsTrigger
            value="send"
            className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
          >
            Send
          </TabsTrigger>
          <TabsTrigger
            value="receive"
            className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
          >
            Receive
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <ArrowUpRight className="h-5 w-5 mr-2 text-amber-600" />
                Transaction History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length > 0 ? (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 border rounded-md border-amber-100 dark:border-amber-900/50"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-full ${
                            transaction.type === "incoming"
                              ? "bg-green-100 dark:bg-green-900/30"
                              : "bg-amber-100 dark:bg-amber-900/30"
                          }`}
                        >
                          {transaction.type === "incoming" ? (
                            <ArrowDownLeft
                              className={`h-4 w-4 ${
                                transaction.type === "incoming"
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-amber-600 dark:text-amber-400"
                              }`}
                            />
                          ) : (
                            <ArrowUpRight
                              className={`h-4 w-4 ${
                                transaction.type === "incoming"
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-amber-600 dark:text-amber-400"
                              }`}
                            />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">
                            {transaction.type === "incoming"
                              ? "Received"
                              : "Sent"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {transaction.timestamp.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div
                            className={`font-medium ${
                              transaction.type === "incoming"
                                ? "text-green-600 dark:text-green-400"
                                : "text-amber-600 dark:text-amber-400"
                            }`}
                          >
                            {transaction.type === "incoming" ? "+" : "-"}$
                            {transaction.amount.toFixed(2)}
                          </div>
                          <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                            {transaction.description}
                          </div>
                        </div>
                        {getStatusIcon(transaction.status)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No transactions found.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="send">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowUpRight className="h-5 w-5 mr-2 text-amber-600" />
                Send Funds
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient Address</Label>
                  <Input
                    id="recipient"
                    placeholder="Enter recipient's wallet address"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    className="border-amber-200 dark:border-amber-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (USD)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    className="border-amber-200 dark:border-amber-800"
                  />
                  <p className="text-xs text-muted-foreground">
                    Available balance: ${balance.toFixed(2)}
                  </p>
                </div>
                <Button
                  className="w-full gap-2 bg-amber-600 hover:bg-amber-700 text-white"
                  onClick={handleSend}
                  disabled={
                    !sendAmount ||
                    !recipientAddress ||
                    Number.parseFloat(sendAmount) <= 0 ||
                    Number.parseFloat(sendAmount) > balance
                  }
                >
                  <ArrowUpRight className="h-4 w-4" />
                  Send Funds
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="receive">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowDownLeft className="h-5 w-5 mr-2 text-green-600" />
                Receive Funds
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="bg-white p-4 rounded-md mb-4">
                  {/* Mock QR code */}
                  <div className="w-48 h-48 bg-[url('/placeholder.svg?height=200&width=200')] bg-contain bg-no-repeat bg-center" />
                </div>

                <div className="text-center mb-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Your Wallet Address
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <div className="text-sm font-mono bg-muted p-2 rounded-md">
                      {walletAddress}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={copyToClipboard}
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground text-center max-w-md">
                  Share your wallet address or QR code with others to receive
                  funds. Only send and receive LSK tokens to this address.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );

  // Seller-specific wallet UI
  const SellerWallet = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800 dark:text-green-300 flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-green-600" />
              Available Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 dark:text-green-200">
              ${balance.toFixed(2)}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 gap-2 border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950/30"
              onClick={() => setBalance(balance + 10)}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-800 dark:text-amber-300 flex items-center">
              <BarChart3 className="h-4 w-4 mr-2 text-amber-600" />
              Sales Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900 dark:text-amber-200">
              $1,245.50
            </div>
            <div className="text-xs text-amber-700 dark:text-amber-400 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" /> +15% from last month
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-950/30"
            >
              View Sales Report
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-300 flex items-center">
              <Store className="h-4 w-4 mr-2 text-blue-600" />
              Pending Payouts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-200">
              $345.00
            </div>
            <div className="text-xs text-blue-700 dark:text-blue-400 mt-1">
              3 orders in escrow
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 w-full border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/30"
            >
              View Pending Orders
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions">
        <TabsList className="mb-6 bg-amber-100 dark:bg-amber-950/50">
          <TabsTrigger
            value="transactions"
            className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
          >
            Transactions
          </TabsTrigger>
          <TabsTrigger
            value="sales"
            className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
          >
            Sales
          </TabsTrigger>
          <TabsTrigger
            value="payouts"
            className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
          >
            Payouts
          </TabsTrigger>
          <TabsTrigger
            value="banking"
            className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
          >
            Banking
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <ArrowUpRight className="h-5 w-5 mr-2 text-amber-600" />
                Transaction History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length > 0 ? (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 border rounded-md border-amber-100 dark:border-amber-900/50"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-full ${
                            transaction.type === "incoming"
                              ? "bg-green-100 dark:bg-green-900/30"
                              : "bg-amber-100 dark:bg-amber-900/30"
                          }`}
                        >
                          {transaction.type === "incoming" ? (
                            <ArrowDownLeft
                              className={`h-4 w-4 ${
                                transaction.type === "incoming"
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-amber-600 dark:text-amber-400"
                              }`}
                            />
                          ) : (
                            <ArrowUpRight
                              className={`h-4 w-4 ${
                                transaction.type === "incoming"
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-amber-600 dark:text-amber-400"
                              }`}
                            />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">
                            {transaction.type === "incoming"
                              ? "Received"
                              : "Sent"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {transaction.timestamp.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div
                            className={`font-medium ${
                              transaction.type === "incoming"
                                ? "text-green-600 dark:text-green-400"
                                : "text-amber-600 dark:text-amber-400"
                            }`}
                          >
                            {transaction.type === "incoming" ? "+" : "-"}$
                            {transaction.amount.toFixed(2)}
                          </div>
                          <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                            {transaction.description}
                          </div>
                        </div>
                        {getStatusIcon(transaction.status)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No transactions found.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Store className="h-5 w-5 mr-2 text-green-600" />
                Sales Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                    <div className="text-sm text-green-800 dark:text-green-300">
                      Today
                    </div>
                    <div className="text-2xl font-bold text-green-900 dark:text-green-200">
                      $145.00
                    </div>
                    <div className="text-xs text-green-700 dark:text-green-400 mt-1">
                      3 orders
                    </div>
                  </div>
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                    <div className="text-sm text-amber-800 dark:text-amber-300">
                      This Week
                    </div>
                    <div className="text-2xl font-bold text-amber-900 dark:text-amber-200">
                      $845.75
                    </div>
                    <div className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                      12 orders
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <div className="text-sm text-blue-800 dark:text-blue-300">
                      This Month
                    </div>
                    <div className="text-2xl font-bold text-blue-900 dark:text-blue-200">
                      $2,450.50
                    </div>
                    <div className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                      32 orders
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Top Selling Products
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border rounded-md border-amber-100 dark:border-amber-900/50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                          <Leaf className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <div className="font-medium">Organic Tomatoes</div>
                          <div className="text-xs text-muted-foreground">
                            120 units sold
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-green-600 dark:text-green-400">
                          $478.80
                        </div>
                        <div className="text-xs text-muted-foreground">
                          $3.99 per unit
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 border rounded-md border-amber-100 dark:border-amber-900/50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                          <Leaf className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <div className="font-medium">Grass-Fed Beef</div>
                          <div className="text-xs text-muted-foreground">
                            35 units sold
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-green-600 dark:text-green-400">
                          $454.65
                        </div>
                        <div className="text-xs text-muted-foreground">
                          $12.99 per unit
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 border rounded-md border-amber-100 dark:border-amber-900/50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                          <Leaf className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <div className="font-medium">
                            Organic Free-Range Eggs
                          </div>
                          <div className="text-xs text-muted-foreground">
                            80 units sold
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-green-600 dark:text-green-400">
                          $439.20
                        </div>
                        <div className="text-xs text-muted-foreground">
                          $5.49 per unit
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowDownLeft className="h-5 w-5 mr-2 text-green-600" />
                Payout Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border rounded-md border-green-200 dark:border-green-800">
                  <h3 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Current Payout Method
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                      <Wallet className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="font-medium">Lisk Wallet</div>
                      <div className="text-xs font-mono text-muted-foreground">
                        {walletAddress}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Payout Schedule</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="instant"
                          name="payout"
                          className="text-amber-600"
                          checked
                        />
                        <Label htmlFor="instant">
                          Instant (after escrow release)
                        </Label>
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        Active
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="daily"
                          name="payout"
                          className="text-amber-600"
                        />
                        <Label htmlFor="daily">Daily</Label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="weekly"
                          name="payout"
                          className="text-amber-600"
                        />
                        <Label htmlFor="weekly">Weekly (Monday)</Label>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Pending Payouts</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border rounded-md border-amber-100 dark:border-amber-900/50">
                      <div>
                        <div className="font-medium">Order #12345</div>
                        <div className="text-xs text-muted-foreground">
                          Organic Tomatoes (x5)
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-amber-600 dark:text-amber-400">
                          $19.95
                        </div>
                        <div className="text-xs text-muted-foreground">
                          In escrow
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 border rounded-md border-amber-100 dark:border-amber-900/50">
                      <div>
                        <div className="font-medium">Order #12346</div>
                        <div className="text-xs text-muted-foreground">
                          Grass-Fed Beef (x2)
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-amber-600 dark:text-amber-400">
                          $25.98
                        </div>
                        <div className="text-xs text-muted-foreground">
                          In escrow
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banking">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                Banking Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border rounded-md border-blue-200 dark:border-blue-800">
                  <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                    Connected Bank Account
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                      <CreditCard className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="font-medium">Farm Credit Union</div>
                      <div className="text-xs text-muted-foreground">
                        Account ending in 4567
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/30"
                  >
                    Change Bank Account
                  </Button>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Tax Information</h3>
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium">
                        Tax information complete
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your tax information is up to date. You'll receive a
                      1099-K form for the current tax year if your sales exceed
                      $600.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-950/30"
                    >
                      View Tax Documents
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );

  return (
    <ProtectedRoute requireAuth={true}>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-amber-800 dark:text-amber-400 flex items-center">
            <Wallet className="h-6 w-6 mr-2 text-amber-600" />
            {role === "seller" ? "Seller Wallet" : "My Wallet"}
          </h1>
          <div className="flex items-center gap-2">
            <NotificationPanel />
            <ThemeToggle />
            <WalletConnect onRoleSelect={setRole} />
          </div>
        </div>

        {isConnected ? (
          role === "seller" ? (
            <SellerWallet />
          ) : (
            <BuyerWallet />
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
              <p className="text-muted-foreground">
                Connect your Lisk wallet to access your funds and transactions
              </p>
            </div>
            <div className="flex justify-center">
              <Button
                size="lg"
                className="gap-2 bg-amber-600 hover:bg-amber-700 text-white"
                onClick={() => setIsConnected(true)}
              >
                <Wallet className="h-5 w-5" />
                Connect Wallet
              </Button>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
