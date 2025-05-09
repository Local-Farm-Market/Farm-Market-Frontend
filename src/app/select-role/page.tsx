"use client";

import { useEffect, useState } from "react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Leaf, ShoppingBasket, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserRole } from "@/src/hooks/use-user-role";
import type { UserRole } from "@/src/components/auth/wallet-connect";
import { useAccount, useDisconnect } from "wagmi";
import { toast } from "@/src/components/ui/use-toast";
import { saveWalletRole, hasProfile } from "@/src/lib/wallet-storage";

export default function SelectRolePage() {
  const router = useRouter();
  const { role, setRole } = useUserRole();
  const [isLoading, setIsLoading] = useState(true);

  // Use wagmi hooks
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    // Check if wallet is connected using wagmi
    if (!isConnected || !address) {
      router.push("/");
      return;
    }

    // Check if user already has a role and profile
    const userHasProfile = hasProfile(address);

    // If user already has a profile, redirect to home
    if (userHasProfile) {
      router.push("/");
      return;
    }

    setIsLoading(false);
  }, [router, isConnected, address]);

  const selectRole = (selectedRole: UserRole) => {
    if (!address) return;

    // Save role to wallet-specific storage
    saveWalletRole(address, selectedRole);

    // Update context
    setRole(selectedRole);

    // Show success toast
    toast({
      title: "Role Selected",
      description: `You've selected the ${selectedRole} role.`,
      duration: 3000,
    });

    // Redirect to profile setup page
    router.push("/profile-setup");
  };

  const goBack = async () => {
    try {
      // Disconnect wallet using wagmi
      await disconnect();

      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected.",
        duration: 3000,
      });

      // Redirect to home
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  // Function to get shortened address for display
  const getShortenedAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  return (
    <div className="container max-w-md mx-auto py-12">
      <div className="text-center mb-8">
        <Button variant="ghost" onClick={goBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold mb-2">Choose Your Role</h1>
        <p className="text-muted-foreground">
          Select how you want to use the Farm Marketplace
        </p>
        {address && (
          <p className="text-xs mt-2 text-muted-foreground">
            Connected:{" "}
            <span className="font-mono">{getShortenedAddress(address)}</span>
          </p>
        )}
      </div>

      <div className="grid gap-6">
        <Card
          className="p-6 cursor-pointer hover:bg-muted transition-colors border-2 hover:border-primary"
          onClick={() => selectRole("buyer")}
        >
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <ShoppingBasket className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-medium text-xl">I'm a Buyer</h3>
              <p className="text-muted-foreground">
                Browse and purchase farm products
              </p>
              <ul className="mt-2 text-sm space-y-1">
                <li>• Discover fresh local produce</li>
                <li>• Support sustainable farming</li>
                <li>• Secure escrow payments</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card
          className="p-6 cursor-pointer hover:bg-muted transition-colors border-2 hover:border-primary"
          onClick={() => selectRole("seller")}
        >
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
              <Leaf className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-medium text-xl">I'm a Seller</h3>
              <p className="text-muted-foreground">
                List and sell your farm products
              </p>
              <ul className="mt-2 text-sm space-y-1">
                <li>• Reach more customers</li>
                <li>• Manage your farm inventory</li>
                <li>• Track sales and analytics</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
