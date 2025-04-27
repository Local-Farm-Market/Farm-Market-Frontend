"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Package, Wallet, User } from "lucide-react";
import { CartIcon } from "@/src/components/cart/cart-icon";
import { useUserRole } from "@/src/hooks/use-user-role";

export default function BottomNav() {
  const pathname = usePathname();
  const { role } = useUserRole();

  // Don't show navigation on auth pages
  if (
    pathname === "/select-role" ||
    pathname === "/profile-setup" ||
    pathname === "/"
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-background border-t border-gray-200 dark:border-border z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          <Link
            href={
              role === "buyer"
                ? "/buyer-home"
                : role === "seller"
                ? "/seller-home"
                : ""
            }
            className={`flex flex-col items-center justify-center w-full h-full ${
              pathname === "/buyer-home" || pathname === "/seller-home"
                ? "text-amber-600 dark:text-amber-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>

          {role === "buyer" && (
            <Link
              href="/marketplace"
              className={`flex flex-col items-center justify-center w-full h-full ${
                pathname === "/marketplace"
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="text-xs mt-1">Marketplace</span>
            </Link>
          )}

          {role === "buyer" && (
            <Link
              href="/cart"
              className={`flex flex-col items-center justify-center w-full h-full ${
                pathname === "/cart"
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <CartIcon />
              <span className="text-xs mt-1">Cart</span>
            </Link>
          )}

          <Link
            href="/orders"
            className={`flex flex-col items-center justify-center w-full h-full ${
              pathname === "/orders"
                ? "text-amber-600 dark:text-amber-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            <Package className="h-5 w-5" />
            <span className="text-xs mt-1">Orders</span>
          </Link>

          {role === "seller" && (
            <Link
              href="/products"
              className={`flex flex-col items-center justify-center w-full h-full ${
                pathname === "/products"
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="text-xs mt-1">Products</span>
            </Link>
          )}

          <Link
            href="/wallet"
            className={`flex flex-col items-center justify-center w-full h-full ${
              pathname === "/wallet"
                ? "text-amber-600 dark:text-amber-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            <Wallet className="h-5 w-5" />
            <span className="text-xs mt-1">Wallet</span>
          </Link>

          <Link
            href="/profile"
            className={`flex flex-col items-center justify-center w-full h-full ${
              pathname === "/profile"
                ? "text-amber-600 dark:text-amber-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
