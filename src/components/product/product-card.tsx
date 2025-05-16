import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { MapPin, Leaf } from "lucide-react";
import type { FormattedProduct } from "@/src/lib/types";

interface ProductCardProps {
  product: FormattedProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const {
    id,
    name,
    price,
    imageUrls,
    location,
    isAvailable,
    category,
    isOrganic,
    stockQuantity,
  } = product;

  return (
    <Link href={`/product/${id}`}>
      <Card className="overflow-hidden h-full transition-all hover:shadow-md border-amber-100 dark:border-amber-900/50 group">
        <div className="relative aspect-square">
          <Image
            src={imageUrls[0] || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <Badge
            variant={isAvailable && stockQuantity > 0 ? "default" : "secondary"}
            className={`absolute top-2 right-2 ${
              isAvailable && stockQuantity > 0
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-gray-500 hover:bg-gray-600 text-white"
            }`}
          >
            {isAvailable && stockQuantity > 0 ? "Available" : "Sold Out"}
          </Badge>
          <Badge
            variant="outline"
            className="absolute top-2 left-2 bg-background/80 border-amber-200 dark:border-amber-800"
          >
            {category}
          </Badge>
        </div>
        <CardContent className="p-4 bg-gradient-to-b from-amber-50/50 to-white dark:from-amber-950/30 dark:to-background">
          <h3 className="font-medium text-lg line-clamp-1 text-amber-900 dark:text-amber-100">
            {name}
          </h3>
          <p className="text-xl font-bold mt-1 text-green-700 dark:text-green-400">
            ${price.toFixed(2)}
          </p>
          <div className="flex items-center mt-2 text-muted-foreground text-sm">
            <MapPin className="h-3 w-3 mr-1 text-amber-600 dark:text-amber-400" />
            <span className="line-clamp-1">
              {location || "Unknown location"}
            </span>
          </div>
          {isOrganic && (
            <div className="flex items-center mt-2 text-green-600 dark:text-green-400 text-xs">
              <Leaf className="h-3 w-3 mr-1" />
              <span>Certified Organic</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
