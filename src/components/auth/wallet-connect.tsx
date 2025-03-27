"use client";

import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Wallet, LogOut, Copy, ExternalLink, Check } from "lucide-react";
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

export type UserRole = "buyer" | "seller" | null;

interface WalletConnectProps {
  onRoleSelect?: (role: UserRole) => void;
}

export function WalletConnect({ onRoleSelect }: WalletConnectProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [role, setRole] = useState<UserRole>(null);
  const [showWalletDetails, setShowWalletDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  // Check if wallet is already connected on component mount
  useEffect(() => {
    const savedWallet = localStorage.getItem("walletAddress");
    const savedRole = localStorage.getItem("userRole") as UserRole;

    if (savedWallet) {
      setWalletAddress(savedWallet);
      setIsConnected(true);
      setRole(savedRole);

      if (onRoleSelect) {
        onRoleSelect(savedRole);
      }
    }
  }, [onRoleSelect]);

  const connectWallet = () => {
    // Mock wallet connection
    const mockAddress = "lsk" + Math.random().toString(36).substring(2, 15);
    setWalletAddress(mockAddress);
    setIsConnected(true);

    // Save wallet address to localStorage
    localStorage.setItem("walletAddress", mockAddress);

    // Redirect to role selection page
    router.push("/select-role");
  };

  // const selectRole = (selectedRole: UserRole) => {
  //   setRole(selectedRole);
  //   setShowRoleSelection(false);

  //   // Save role to localStorage
  //   localStorage.setItem("userRole", selectedRole || "");

  //   if (onRoleSelect) {
  //     onRoleSelect(selectedRole);
  //   }

  //   // Redirect to home page
  //   router.push("/");
  // };

  const disconnectWallet = () => {
    setWalletAddress("");
    setIsConnected(false);
    setRole(null);
    setShowWalletDetails(false);

    // Clear localStorage
    localStorage.removeItem("walletAddress");
    localStorage.removeItem("userRole");

    if (onRoleSelect) {
      onRoleSelect(null);
    }

    // Redirect to home page
    router.push("/");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {isConnected ? (
        <>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setShowWalletDetails(true)}
          >
            <Wallet className="h-4 w-4" />
            <span className="truncate max-w-[100px]">{walletAddress}</span>
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
                  <Button variant="outline" className="flex-1 gap-2">
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
              <Card
                className="p-4 cursor-pointer hover:bg-muted transition-colors"
                onClick={connectWallet}
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Lisk Wallet</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect to Lisk Desktop/Mobile
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
