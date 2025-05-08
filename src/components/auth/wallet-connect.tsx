"use client";

import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import {
  Wallet,
  LogOut,
  Copy,
  ExternalLink,
  Check,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Card } from "@/src/components/ui/card";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { toast } from "@/src/components/ui/use-toast";
import {
  ReownProvider,
  reconnect,
  disconnect,
  useWallet,
  getAccount,
  AccountType,
  WalletType,
} from "@reownapp/appkit";

export type UserRole = "buyer" | "seller" | null;

interface WalletConnectProps {
  onRoleSelect?: (role: UserRole) => void;
}

export function WalletConnect({ onRoleSelect }: WalletConnectProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [role, setRole] = useState<UserRole>(null);
  const [showWalletDetails, setShowWalletDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const router = useRouter();

  // Reown wallet hook
  const wallet = useWallet();

  // Check if wallet is already connected on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Try to reconnect to previously connected wallet
        const connected = await reconnect();

        if (connected) {
          const account = await getAccount();
          if (account) {
            setWalletAddress(account.address);
            setIsConnected(true);

            // Get role from localStorage (still using localStorage for role persistence)
            const savedRole = localStorage.getItem("userRole") as UserRole;
            setRole(savedRole);

            if (onRoleSelect) {
              onRoleSelect(savedRole);
            }
          }
        }
      } catch (error) {
        console.error("Failed to reconnect wallet:", error);
        // Clear any stale connection data
        localStorage.removeItem("userRole");
        setRole(null);
        setIsConnected(false);
      }
    };

    checkConnection();
  }, [onRoleSelect]);

  // Watch for wallet connection changes
  useEffect(() => {
    if (wallet) {
      setIsConnected(wallet.connected);
      if (wallet.address) {
        setWalletAddress(wallet.address);
      }
    }
  }, [wallet]);

  const connectWallet = async () => {
    setIsConnecting(true);
    setConnectionError(null);

    try {
      // Initialize connection with ReownApp
      const account = await getAccount({
        type: AccountType.WALLET,
        walletType: WalletType.METAMASK, // You can customize this or make it selectable
      });

      if (account && account.address) {
        setWalletAddress(account.address);
        setIsConnected(true);

        toast({
          title: "Wallet Connected",
          description: "Your wallet has been successfully connected.",
          duration: 3000,
        });

        // If user hasn't selected a role yet, redirect to role selection
        if (!role) {
          router.push("/select-role");
        }
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
      setConnectionError("Failed to connect wallet. Please try again.");

      toast({
        title: "Connection Failed",
        description: "There was an error connecting to your wallet.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const selectRole = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setShowRoleSelection(false);

    // Save role to localStorage
    localStorage.setItem("userRole", selectedRole || "");

    if (onRoleSelect) {
      onRoleSelect(selectedRole);
    }

    // Redirect to home page
    router.push("/");
  };

  const disconnectWallet = async () => {
    try {
      await disconnect();

      setWalletAddress("");
      setIsConnected(false);
      setRole(null);
      setShowWalletDetails(false);

      // Clear localStorage
      localStorage.removeItem("userRole");

      if (onRoleSelect) {
        onRoleSelect(null);
      }

      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected.",
        duration: 3000,
      });

      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
      toast({
        title: "Disconnect Failed",
        description: "There was an error disconnecting your wallet.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard.",
      duration: 1500,
    });
  };

  // Function to get shortened address for display
  const getShortenedAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  return (
    <ReownProvider>
      {isConnected ? (
        <>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setShowWalletDetails(true)}
          >
            <Wallet className="h-4 w-4" />
            <span className="truncate max-w-[100px]">
              {getShortenedAddress(walletAddress)}
            </span>
            {role && (
              <span className="ml-1 text-xs px-1.5 py-0.5 bg-primary/10 rounded-full">
                {role}
              </span>
            )}
          </Button>

          {/* Wallet Details Modal */}
          <Dialog open={showWalletDetails} onOpenChange={setShowWalletDetails}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Wallet Details</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center py-4">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarFallback className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                    {walletAddress.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-green-500 text-white">Connected</Badge>
                  {role && (
                    <Badge className="bg-amber-500 text-white capitalize">
                      {role}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 bg-muted p-2 rounded-md w-full mb-6">
                  <span className="font-mono text-sm truncate">
                    {walletAddress}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={copyToClipboard}
                    className="flex-shrink-0"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="flex gap-2 w-full">
                  <Button
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={() =>
                      window.open(
                        `https://etherscan.io/address/${walletAddress}`,
                        "_blank"
                      )
                    }
                  >
                    <ExternalLink className="h-4 w-4" />
                    View on Explorer
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1 gap-2"
                    onClick={disconnectWallet}
                  >
                    <LogOut className="h-4 w-4" />
                    Disconnect
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Connect your wallet</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {connectionError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{connectionError}</AlertDescription>
                </Alert>
              )}

              <Card
                className={`p-4 cursor-pointer hover:bg-muted transition-colors ${
                  isConnecting ? "opacity-70 pointer-events-none" : ""
                }`}
                onClick={connectWallet}
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">MetaMask</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect to MetaMask Wallet
                    </p>
                  </div>
                </div>
              </Card>

              {/* You can add more wallet options here */}
              <Card className="p-4 cursor-pointer hover:bg-muted transition-colors opacity-50">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">WalletConnect</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect with WalletConnect (Coming Soon)
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="text-xs text-muted-foreground text-center mt-2">
              By connecting your wallet, you agree to our Terms of Service and
              Privacy Policy
            </div>
          </DialogContent>
        </Dialog>
      )}
    </ReownProvider>
  );
}
