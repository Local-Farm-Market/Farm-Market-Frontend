"use client";

import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { LogOut, Copy, ExternalLink, Check, Wallet } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { toast } from "@/src/components/ui/use-toast";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";

export type UserRole = "buyer" | "seller" | null;

interface WalletConnectProps {
  onRoleSelect?: (role: UserRole) => void;
}

export function WalletConnect({ onRoleSelect }: WalletConnectProps) {
  const [showWalletDetails, setShowWalletDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [role, setRole] = useState<UserRole>(null);
  const router = useRouter();

  // RainbowKit/wagmi hooks
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  // Check if wallet is already connected on component mount
  useEffect(() => {
    // Get role from localStorage
    const savedRole = localStorage.getItem("userRole") as UserRole;

    if (savedRole) {
      setRole(savedRole);

      if (onRoleSelect) {
        onRoleSelect(savedRole);
      }
    }
  }, [onRoleSelect]);

  // Watch for wallet connection changes
  useEffect(() => {
    if (isConnected && address) {
      // If user hasn't selected a role yet, redirect to role selection
      const savedRole = localStorage.getItem("userRole") as UserRole;
      if (!savedRole) {
        router.push("/select-role");
      }
    }
  }, [isConnected, address, router]);

  const disconnectWallet = async () => {
    try {
      disconnect();
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
    if (!address) return;

    navigator.clipboard.writeText(address);
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

  // Custom wallet button that opens details dialog
  const CustomWalletButton = () => {
    if (!isConnected || !address) return null;

    return (
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => setShowWalletDetails(true)}
      >
        <Wallet className="h-4 w-4" />
        <span className="truncate max-w-[100px]">
          {getShortenedAddress(address)}
        </span>
        {role && (
          <span className="ml-1 text-xs px-1.5 py-0.5 bg-primary/10 rounded-full">
            {role}
          </span>
        )}
      </Button>
    );
  };

  return (
    <>
      {/* RainbowKit Connect Button */}
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          // Note: If your app doesn't use authentication, you
          // can remove all 'authenticationStatus' checks
          const ready = mounted && authenticationStatus !== "loading";
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus || authenticationStatus === "authenticated");

          return (
            <div
              {...(!ready && {
                "aria-hidden": true,
                style: {
                  opacity: 0,
                  pointerEvents: "none",
                  userSelect: "none",
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <Button
                      onClick={openConnectModal}
                      className="flex items-center gap-2"
                    >
                      <Wallet className="h-4 w-4" />
                      Connect Wallet
                    </Button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <Button onClick={openChainModal} variant="destructive">
                      Wrong network
                    </Button>
                  );
                }

                return (
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => setShowWalletDetails(true)}
                  >
                    <Wallet className="h-4 w-4" />
                    <span className="truncate max-w-[100px]">
                      {getShortenedAddress(account.address)}
                    </span>
                    {role && (
                      <span className="ml-1 text-xs px-1.5 py-0.5 bg-primary/10 rounded-full">
                        {role}
                      </span>
                    )}
                  </Button>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>

      {/* Wallet Details Modal */}
      {isConnected && address && (
        <Dialog open={showWalletDetails} onOpenChange={setShowWalletDetails}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Wallet Details</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center py-4">
              <Avatar className="h-20 w-20 mb-4">
                <AvatarFallback className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                  {address.substring(0, 2).toUpperCase()}
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
                <span className="font-mono text-sm truncate">{address}</span>
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
                      `https://etherscan.io/address/${address}`,
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
      )}
    </>
  );
}
