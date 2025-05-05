"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Separator } from "@/src/components/ui/separator";
import {
  Eye,
  MapPin,
  Calendar,
  Package,
  Edit,
  Trash2,
  Star,
} from "lucide-react";

// Update the Product interface to match the exact structure of mockProducts
interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  stock: number;
  sold: number;
  status: string;
  category: string;
  dateAdded: string;
  description: string;
  organic: boolean;
  location: string;
  unit: string;
  rating?: number;
  reviewCount?: number;
}

interface ViewProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

export function ViewProductModal({
  open,
  onOpenChange,
  product,
  onEdit,
  onDelete,
}: ViewProductModalProps) {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
            <Eye className="h-5 w-5 text-amber-600" />
            Product Details
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="relative aspect-square rounded-md overflow-hidden">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              fill
              className="object-cover"
            />
            {product.organic && (
              <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600 text-white">
                Organic
              </Badge>
            )}
            <Badge
              variant={product.status === "active" ? "default" : "secondary"}
              className={`absolute top-2 right-2 ${
                product.status === "active"
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-gray-500 hover:bg-gray-600 text-white"
              }`}
            >
              {product.status === "active" ? "In Stock" : "Out of Stock"}
            </Badge>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-amber-800 dark:text-amber-300">
                {product.title}
              </h2>
              <p className="text-2xl font-bold text-green-700 dark:text-green-400 mt-1">
                ${product.price.toFixed(2)}
              </p>
              {product.rating !== undefined && (
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(product.rating || 0)
                            ? "text-amber-500 fill-amber-500"
                            : "text-gray-300 fill-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating?.toFixed(1)} ({product.reviewCount || 0}{" "}
                    reviews)
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{product.location || "No location specified"}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Added on {product.dateAdded}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>
                {product.stock} in stock · {product.sold} sold
              </span>
            </div>

            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800">
              {product.category}
            </Badge>

            {product.description && (
              <div className="pt-2">
                <h3 className="text-sm font-medium mb-1">Description</h3>
                <p className="text-sm text-muted-foreground">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>

        <Separator className="my-2" />

        <div className="grid grid-cols-2 gap-4 py-2">
          <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-md">
            <h3 className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">
              Stock
            </h3>
            <p className="text-2xl font-bold text-green-900 dark:text-green-200">
              {product.stock}
            </p>
            <p className="text-xs text-green-700 dark:text-green-400">
              units available
            </p>
          </div>

          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-md">
            <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-1">
              Sales
            </h3>
            <p className="text-2xl font-bold text-amber-900 dark:text-amber-200">
              {product.sold}
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-400">
              units sold
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            className="gap-2 flex-1 sm:flex-none border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-950/30"
            onClick={() => {
              onOpenChange(false);
              onEdit(product);
            }}
          >
            <Edit className="h-4 w-4" />
            Edit Product
          </Button>
          <Button
            variant="destructive"
            className="gap-2 flex-1 sm:flex-none"
            onClick={() => {
              onOpenChange(false);
              onDelete(product.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
            Delete Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
