// components/product/add-to-cart-button.tsx
"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useCart } from "@/src/hooks/use-cart";
import { useUserRole } from "@/src/hooks/use-user-role";
import type { FormattedProduct } from "@/src/lib/types";

interface AddToCartButtonProps {
  product: FormattedProduct;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  quantity?: number; // Add this optional prop
}

export function AddToCartButton({
  product,
  variant = "default",
  size = "default",
  className = "",
  quantity = 1, // Default to 1 if not provided
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const { role } = useUserRole();
  const [isAdded, setIsAdded] = useState(false);

  // Only show for buyers
  if (role !== "buyer") {
    return null;
  }

  const handleAddToCart = async () => {
    await addItem(product.id, quantity); // Use the quantity prop
    setIsAdded(true);

    // Reset the button after 1.5 seconds
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleAddToCart}
      className={`${className} ${
        isAdded ? "bg-green-600 hover:bg-green-700" : ""
      }`}
      disabled={
        isAdded || !product.isAvailable || Number(product.stockQuantity) === 0
      }
    >
      {isAdded ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Added
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </>
      )}
    </Button>
  );
}
