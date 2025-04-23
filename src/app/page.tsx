"use client";

import { useState, useEffect } from "react";
import { WalletConnect } from "@/src/components/auth/wallet-connect";
import { OnboardingGuide } from "@/src/components/auth/onboarding-guide";
import { ThemeToggle } from "@/src/components/layout/theme-toggle";
import { useUserRole } from "@/src/hooks/use-user-role";
import SellerDashboard from "@/src/app/seller-home/page";
import { Card, CardContent } from "@/src/components/ui/card";
import { Leaf, Wallet, ShoppingBasket } from "lucide-react";
import BuyerDashboard from "./buyer-home/page";
import { useRouter } from "next/navigation";

export default function Home() {
  const { role, setRole } = useUserRole();
  const [isConnected, setIsConnected] = useState(false);
  const route = useRouter();

  useEffect(() => {
    // Check if wallet is connected
    const walletAddress = localStorage.getItem("walletAddress");
    setIsConnected(!!walletAddress);
  }, []);

  // If user is a seller, show seller dashboard
  if (isConnected && role === "buyer") {
    // return <BuyerDashboard />;
    route.push("/buyer-home");
  }

  // If user is a seller, show seller dashboard
  if (isConnected && role === "seller") {
    // return <SellerDashboard />;
    route.push("/seller-home");
  }

  // If not connected, show welcome screen
  if (!isConnected) {
    return (
      <div className="py-12 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="text-center max-w-2xl">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center">
              <Leaf className="h-10 w-10 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-amber-800 dark:text-amber-400">
            Welcome to Farm Marketplace
          </h1>
          <p className="text-lg mb-8 text-muted-foreground">
            Connect your wallet to start buying fresh produce directly from
            local farmers or sell your farm products to customers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <WalletConnect onRoleSelect={setRole} />
            <OnboardingGuide />
            <ThemeToggle />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <ShoppingBasket className="h-10 w-10 text-green-600 dark:text-green-400 mb-4" />
                <h3 className="font-medium text-lg text-green-800 dark:text-green-300 mb-2">
                  Buy Fresh Produce
                </h3>
                <p className="text-green-700 dark:text-green-400">
                  Browse and purchase fresh, locally grown produce directly from
                  farmers.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Leaf className="h-10 w-10 text-amber-600 dark:text-amber-400 mb-4" />
                <h3 className="font-medium text-lg text-amber-800 dark:text-amber-300 mb-2">
                  Sell Your Products
                </h3>
                <p className="text-amber-700 dark:text-amber-400">
                  List your farm products and reach customers directly without
                  middlemen.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Wallet className="h-10 w-10 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="font-medium text-lg text-blue-800 dark:text-blue-300 mb-2">
                  Secure Transactions
                </h3>
                <p className="text-blue-700 dark:text-blue-400">
                  All transactions are secured through blockchain escrow for
                  buyer and seller protection.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}
