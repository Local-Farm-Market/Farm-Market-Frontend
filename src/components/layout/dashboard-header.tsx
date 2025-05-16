"use client";

import type { ReactNode } from "react";
import { Leaf } from "lucide-react";
import { NotificationPanel } from "@/src/components/notifications/notification-panel";
import { ThemeToggle } from "@/src/components/layout/theme-toggle";
import { WalletConnect } from "@/src/components/auth/wallet-connect";
import { CartIcon } from "@/src/components/cart/cart-icon";
import { useUserRole } from "@/src/hooks/use-user-role";
import { Breadcrumb } from "@/src/components/navigation/breadcrumb";

interface DashboardHeaderProps {
  title?: string;
  children?: ReactNode;
}

export function DashboardHeader({ title, children }: DashboardHeaderProps) {
  const { role, setRole } = useUserRole();

  return (
    <div className="mb-6 space-y-2">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-amber-800 dark:text-amber-400 flex items-center">
          <Leaf className="h-6 w-6 mr-2 text-amber-600" />
          {title ||
            (role === "seller" ? "Seller Dashboard" : "Farm Marketplace")}
        </h1>
        <div className="flex items-center gap-2">
          {role === "buyer" && <CartIcon />}
          <NotificationPanel />
          <ThemeToggle />
          <WalletConnect onRoleSelect={setRole} />
        </div>
      </div>

      <Breadcrumb className="text-amber-600 dark:text-amber-400" />

      {children}
    </div>
  );
}
