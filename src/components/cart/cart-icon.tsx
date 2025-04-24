"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/src/hooks/use-cart";
import { useUserRole } from "@/src/hooks/use-user-role";
import { Badge } from "@/src/components/ui/badge";
import Link from "next/link";

export function CartIcon() {
  const { itemCount } = useCart();
  const { role } = useUserRole();

  // Only show cart for buyers
  if (role !== "buyer") {
    return null;
  }

  return (
    <Link href="/cart" className="relative">
      <ShoppingCart className="h-6 w-6" />
      {itemCount > 0 && (
        <Badge className="absolute -top-2 -right-2 h-5 min-w-[20px] px-1 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white text-xs rounded-full">
          {itemCount}
        </Badge>
      )}
    </Link>
  );
}
