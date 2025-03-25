"use client";

import { useEffect, useState } from "react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Leaf, ShoppingBasket, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserRole } from "@/src/hooks/use-user-role";
import type { UserRole } from "@/src/components/auth/wallet-connect";

export default function SelectRolePage() {
  const router = useRouter();
  const { role, setRole } = useUserRole();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if wallet is connected
    const savedWallet = localStorage.getItem("walletAddress");
    const savedRole = localStorage.getItem("userRole") as UserRole;

    setWalletAddress(savedWallet);

    // If wallet is not connected, redirect to home
    if (!savedWallet) {
      router.push("/");
      return;
    }

    // If role is already selected, redirect to home
    if (savedRole) {
      router.push("/");
      return;
    }

    setIsLoading(false);
  }, [router]);

  const selectRole = (selectedRole: UserRole) => {
    // Save role to localStorage
    localStorage.setItem("userRole", selectedRole || "");

    // Update context
    setRole(selectedRole);

    // Redirect to home page
    router.push("/");
  };

  const goBack = () => {
    // Clear wallet connection
    localStorage.removeItem("walletAddress");
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

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
        {walletAddress && (
          <p className="text-xs mt-2 text-muted-foreground">
            Connected: <span className="font-mono">{walletAddress}</span>
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
