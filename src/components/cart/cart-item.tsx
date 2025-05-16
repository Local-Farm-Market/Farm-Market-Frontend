"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useCart } from "@/src/hooks/use-cart";
import type { FormattedCartItem } from "@/src/lib/types";

interface CartItemProps {
  item: FormattedCartItem;
}

export function CartItemCard({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const { productId, quantity, product } = item;

  if (!product) {
    return null;
  }

  return (
    <div className="flex items-center gap-4 py-4 border-b border-amber-100 dark:border-amber-900/50">
      <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
        <Image
          src={product.imageUrls[0] || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-amber-900 dark:text-amber-100 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          Seller: {product.sellerName || "Unknown"}
        </p>
        <p className="font-bold text-green-700 dark:text-green-400">
          ${product.price.toFixed(2)}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full border-amber-200 dark:border-amber-800"
          onClick={() => updateQuantity(productId, quantity - 1)}
        >
          <Minus className="h-4 w-4" />
        </Button>

        <span className="w-8 text-center">{quantity}</span>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full border-amber-200 dark:border-amber-800"
          onClick={() => updateQuantity(productId, quantity + 1)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-right min-w-[80px]">
        <p className="font-bold text-green-700 dark:text-green-400">
          ${(product.price * quantity).toFixed(2)}
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
          onClick={() => removeItem(productId)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
