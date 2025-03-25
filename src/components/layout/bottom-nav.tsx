"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  ShoppingBag,
  Package,
  Wallet,
  User,
  Sprout,
  BarChart,
  Truck,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useUserRole } from "@/src/hooks/use-user-role";

export default function BottomNav() {
  const pathname = usePathname();
  const { role } = useUserRole();

  // Define navigation items based on user role
  const buyerNavItems = [
    { name: "Home", href: "/buyer-home", icon: Home },
    { name: "Marketplace", href: "/marketplace", icon: ShoppingBag },
    { name: "Orders", href: "/orders", icon: Package },
    { name: "Wallet", href: "/wallet", icon: Wallet },
    { name: "Profile", href: "/profile", icon: User },
  ];

  const sellerNavItems = [
    { name: "Dashboard", href: "/seller-home", icon: BarChart },
    { name: "Products", href: "/products", icon: Sprout },
    { name: "Orders", href: "/orders", icon: Truck },
    { name: "Wallet", href: "/wallet", icon: Wallet },
    { name: "Profile", href: "/profile", icon: User },
  ];

  const navItems =
    role === "seller" ? sellerNavItems : role === "buyer" ? buyerNavItems : [];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <nav className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
