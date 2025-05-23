"use client";

import { useState, useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Skeleton } from "@/src/components/ui/skeleton";
import { WalletConnect } from "@/src/components/auth/wallet-connect";
import { NotificationPanel } from "@/src/components/notifications/notification-panel";
import { ThemeToggle } from "@/src/components/layout/theme-toggle";
import { ProtectedRoute } from "@/src/components/auth/protected-route";
import { useUserRole } from "@/src/hooks/use-user-role";
import { toast } from "@/src/components/ui/use-toast";
import { PayoutsTab } from "@/src/app/wallet/payouts-tab";
import { useAccount, useBalance } from "wagmi";
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";

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
  Loader2,
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
  hash?: string;
}

// Buyer-specific mock data
const buyerTransactions: Transaction[] = [
  {
    id: "tx1",
    type: "outgoing",
    amount: 25.5,
    timestamp: new Date(Date.now() - 3600000),
    status: "completed",
    to: "0x3j4k5h6j7k8h9j0k1l2m3n4o5p6q7r8s9t0u",
    description: "Purchase: Organic tomatoes",
    hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  },
  {
    id: "tx2",
    type: "outgoing",
    amount: 12.75,
    timestamp: new Date(Date.now() - 86400000),
    status: "completed",
    to: "0x9j8h7g6f5d4s3a2s1d2f3g4h5j6k7l8k9j8h7",
    description: "Purchase: Grass-fed beef",
    hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
  },
  {
    id: "tx3",
    type: "incoming",
    amount: 8.5,
    timestamp: new Date(Date.now() - 172800000),
    status: "completed",
    from: "0x5r4e3w2q1a2s3d4f5g6h7j8k9l0p1o2i3u4y",
    description: "Refund for damaged product",
    hash: "0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
  },
  {
    id: "tx4",
    type: "outgoing",
    amount: 15.0,
    timestamp: new Date(Date.now() - 259200000),
    status: "pending",
    to: "0x1q2w3e4r5t6y7u8i9o0p1a2s3d4f5g6h7j8k9",
    description: "Purchase: Organic eggs",
    hash: "0xdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc",
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
    from: "0x3j4k5h6j7k8h9j0k1l2m3n4o5p6q7r8s9t0u",
    description: "Sale: Organic tomatoes",
    hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  },
  {
    id: "tx2",
    type: "incoming",
    amount: 12.75,
    timestamp: new Date(Date.now() - 86400000),
    status: "completed",
    from: "0x9j8h7g6f5d4s3a2s1d2f3g4h5j6k7l8k9j8h7",
    description: "Sale: Grass-fed beef",
    hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
  },
  {
    id: "tx3",
    type: "outgoing",
    amount: 8.5,
    timestamp: new Date(Date.now() - 172800000),
    status: "completed",
    to: "0x5r4e3w2q1a2s3d4f5g6h7j8k9l0p1o2i3u4y",
    description: "Refund for damaged product",
    hash: "0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
  },
  {
    id: "tx4",
    type: "incoming",
    amount: 45.0,
    timestamp: new Date(Date.now() - 259200000),
    status: "pending",
    from: "0x1q2w3e4r5t6y7u8i9o0p1a2s3d4f5g6h7j8k9",
    description: "Sale: Bulk order - Mixed vegetables",
    hash: "0xdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc",
  },
];

export default function WalletPage() {
  const { role, setRole, isConnected, walletAddress } = useUserRole();
  const [copied, setCopied] = useState(false);
  const [sendAmount, setSendAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [dollarBalance, setDollarBalance] = useState<number | null>(null);

  // Use different transactions based on role
  const [transactions, setTransactions] = useState<Transaction[]>(
    role === "seller" ? sellerTransactions : buyerTransactions
  );

  // Wagmi hooks
  const { address } = useAccount();

  // Get balance using wagmi
  const {
    data: balanceData,
    isLoading: isBalanceLoading,
    refetch: refetchBalance,
  } = useBalance({
    address: address,
  });

  // Transaction hooks
  const {
    data: txData,
    sendTransaction,
    isPending: isSending,
  } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txData,
    });

  // Convert ETH balance to USD
  useEffect(() => {
    if (balanceData) {
      // Mock conversion rate: 1 ETH = 1800 USD
      const ethToUsd = 1800;
      const usdBalance = Number.parseFloat(balanceData.formatted) * ethToUsd;
      setDollarBalance(Number.parseFloat(usdBalance.toFixed(2)));
    } else {
      setDollarBalance(null);
    }
  }, [balanceData]);

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed && txData) {
      // Create new transaction record
      const amount = Number.parseFloat(sendAmount);
      const newTransaction: Transaction = {
        id: `tx${Date.now()}`,
        type: "outgoing",
        amount,
        timestamp: new Date(),
        status: "completed",
        to: recipientAddress.startsWith("0x")
          ? (recipientAddress as `0x${string}`)
          : (() => {
              throw new Error("Invalid recipient address format");
            })(),
        description: role === "seller" ? "Supplier payment" : "Payment",
        hash: txData,
      };

      setTransactions([newTransaction, ...transactions]);
      setSendAmount("");
      setRecipientAddress("");

      toast({
        title: "Transaction Confirmed",
        description: "Your transaction has been confirmed on the blockchain.",
        duration: 5000,
      });
    }
  }, [isConfirmed, txData, recipientAddress, sendAmount, role, transactions]);

  const refreshBalance = async () => {
    setRefreshing(true);
    try {
      await refetchBalance();

      toast({
        title: "Balance Updated",
        description: "Your wallet balance has been refreshed.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Failed to refresh balance:", error);
      toast({
        title: "Error",
        description: "Failed to refresh wallet balance",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const copyToClipboard = () => {
    if (!walletAddress) return;

    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard.",
      duration: 1500,
    });
  };

  const handleSend = async () => {
    if (!sendAmount || !recipientAddress || !address || !isConnected) return;

    const amount = Number.parseFloat(sendAmount);
    if (
      isNaN(amount) ||
      amount <= 0 ||
      (dollarBalance !== null && amount > dollarBalance)
    ) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to send.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Convert USD to ETH (simplified mock conversion)
      const ethAmount = amount / 1800; // 1 ETH = 1800 USD
      const ethAmountInWei = parseEther(ethAmount.toString());

      // Send transaction
      sendTransaction({
        to: recipientAddress.startsWith("0x")
          ? (recipientAddress as `0x${string}`)
          : (() => {
              throw new Error("Invalid recipient address format");
            })(),
        value: ethAmountInWei,
      });

      toast({
        title: "Transaction Initiated",
        description: "Your transaction has been submitted to the blockchain.",
        duration: 5000,
      });
    } catch (error) {
      console.error("Transaction failed:", error);
      toast({
        title: "Transaction Failed",
        description: "Failed to send transaction. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
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

  // Function to view transaction on explorer
  const viewOnExplorer = (hash: string | undefined) => {
    if (!hash) return;

    window.open(`https://etherscan.io/tx/${hash}`, "_blank");
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
            {isBalanceLoading ? (
              <Skeleton className="h-8 w-24 bg-green-200/50 dark:bg-green-800/20" />
            ) : (
              <div className="text-3xl font-bold text-green-900 dark:text-green-200">
                ${dollarBalance !== null ? dollarBalance.toFixed(2) : "0.00"}
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              className="mt-4 gap-2 border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950/30"
              onClick={refreshBalance}
              disabled={refreshing || !isConnected}
            >
              {refreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
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
            <div className="text-sm font-medium">Wallet Connected</div>
            {walletAddress ? (
              <div className="text-xs text-muted-foreground mt-1 font-mono truncate">
                {`${walletAddress.substring(0, 8)}...${walletAddress.substring(
                  walletAddress.length - 6
                )}`}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground mt-1">
                No wallet connected
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              className="mt-4 gap-2 border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-950/30"
              disabled={true}
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
                      className="flex items-center justify-between p-3 border rounded-md border-amber-100 dark:border-amber-900/50 cursor-pointer hover:bg-amber-50/50 dark:hover:bg-amber-900/20"
                      onClick={() => viewOnExplorer(transaction.hash)}
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
                                "text-green-600 dark:text-green-400"
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
                    disabled={isSending || isConfirming}
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
                    disabled={isSending || isConfirming}
                  />
                  <p className="text-xs text-muted-foreground">
                    Available balance: $
                    {dollarBalance !== null ? dollarBalance.toFixed(2) : "0.00"}
                  </p>
                </div>
                <Button
                  className="w-full gap-2 bg-amber-600 hover:bg-amber-700 text-white"
                  onClick={handleSend}
                  disabled={
                    isSending ||
                    isConfirming ||
                    !sendAmount ||
                    !recipientAddress ||
                    Number.parseFloat(sendAmount) <= 0 ||
                    (dollarBalance !== null &&
                      Number.parseFloat(sendAmount) > dollarBalance)
                  }
                >
                  {isSending || isConfirming ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4" />
                  )}
                  {isSending
                    ? "Sending..."
                    : isConfirming
                    ? "Confirming..."
                    : "Send Funds"}
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
                {walletAddress ? (
                  <>
                    <div className="bg-white p-4 rounded-md mb-4">
                      {/* QR code for wallet address */}
                      <div className="w-48 h-48 bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${walletAddress}')] bg-contain bg-no-repeat bg-center" />
                    </div>

                    <div className="text-center mb-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        Your Wallet Address
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <div className="text-sm font-mono bg-muted p-2 rounded-md truncate max-w-[240px]">
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
                      Share your wallet address or QR code with others to
                      receive funds. Only send and receive ETH tokens to this
                      address.
                    </p>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      Please connect your wallet to receive funds.
                    </p>
                  </div>
                )}
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
            {isBalanceLoading ? (
              <Skeleton className="h-8 w-24 bg-green-200/50 dark:bg-green-800/20" />
            ) : (
              <div className="text-3xl font-bold text-green-900 dark:text-green-200">
                ${dollarBalance !== null ? dollarBalance.toFixed(2) : "0.00"}
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              className="mt-4 gap-2 border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950/30"
              onClick={refreshBalance}
              disabled={refreshing || !isConnected}
            >
              {refreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
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
                      className="flex items-center justify-between p-3 border rounded-md border-amber-100 dark:border-amber-900/50 cursor-pointer hover:bg-amber-50/50 dark:hover:bg-amber-900/20"
                      onClick={() => viewOnExplorer(transaction.hash)}
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
          <PayoutsTab />
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
                Connect your wallet to access your funds and transactions
              </p>
            </div>
            <div className="flex justify-center">
              <WalletConnect onRoleSelect={setRole} />
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
