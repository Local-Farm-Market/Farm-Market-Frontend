"use client";

import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import {
  PackageCheck,
  Truck,
  ShieldCheck,
  ArrowRight,
  DollarSign,
  MapPin,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent } from "@/src/components/ui/card";
import { cn } from "@/src/lib/utils";

export type OrderNotificationType =
  | "new_order"
  | "order_shipped"
  | "order_confirmed"
  | "payment_available";

interface OrderNotificationCardProps {
  id: string;
  type: OrderNotificationType;
  orderId: string;
  productTitle: string;
  productImage: string;
  quantity: number;
  price: number;
  buyerName?: string;
  buyerAddress?: string;
  timestamp: Date;
  read: boolean;
  onClick?: () => void;
  onShipOrder?: (orderId: string) => void;
  onClaimPayment?: (orderId: string) => void;
}

export function OrderNotificationCard({
  id,
  type,
  orderId,
  productTitle,
  productImage,
  quantity,
  price,
  buyerName,
  buyerAddress,
  timestamp,
  read,
  onClick,
  onShipOrder,
  onClaimPayment,
}: OrderNotificationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (onClick && !read) onClick();
  };

  const getTypeIcon = (type: OrderNotificationType) => {
    switch (type) {
      case "new_order":
        return (
          <PackageCheck className="h-8 w-8 text-amber-600 dark:text-amber-400" />
        );
      case "order_shipped":
        return <Truck className="h-8 w-8 text-blue-600 dark:text-blue-400" />;
      case "order_confirmed":
        return (
          <ShieldCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
        );
      case "payment_available":
        return (
          <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400" />
        );
    }
  };

  const getTypeTitle = (type: OrderNotificationType) => {
    switch (type) {
      case "new_order":
        return "New Order Received";
      case "order_shipped":
        return "Order Shipped";
      case "order_confirmed":
        return "Order Confirmed";
      case "payment_available":
        return "Payment Available";
    }
  };

  const getTypeDescription = (type: OrderNotificationType) => {
    switch (type) {
      case "new_order":
        return `You've received a new order for ${productTitle} × ${quantity}.`;
      case "order_shipped":
        return `Your order of ${productTitle} has been shipped.`;
      case "order_confirmed":
        return `The buyer has confirmed receipt of ${productTitle}.`;
      case "payment_available":
        return `Payment of $${(price * quantity).toFixed(
          2
        )} is available for claim.`;
    }
  };

  const getTypeBgColor = (type: OrderNotificationType) => {
    switch (type) {
      case "new_order":
        return "bg-amber-50 dark:bg-amber-950/30";
      case "order_shipped":
        return "bg-blue-50 dark:bg-blue-950/30";
      case "order_confirmed":
        return "bg-green-50 dark:bg-green-950/30";
      case "payment_available":
        return "bg-green-50 dark:bg-green-950/30";
    }
  };

  const getTypeActionButton = (type: OrderNotificationType) => {
    switch (type) {
      case "new_order":
        return (
          onShipOrder && (
            <Button
              onClick={() => onShipOrder(orderId)}
              className="gap-2 bg-amber-600 hover:bg-amber-700 text-white"
            >
              <Truck className="h-4 w-4" />
              Ship Order
            </Button>
          )
        );
      case "order_shipped":
        return (
          <Button variant="outline" className="gap-2">
            <ArrowRight className="h-4 w-4" />
            Track Shipment
          </Button>
        );
      case "payment_available":
        return (
          onClaimPayment && (
            <Button
              onClick={() => onClaimPayment(orderId)}
              className="gap-2 bg-green-600 hover:bg-green-700 text-white"
            >
              <DollarSign className="h-4 w-4" />
              Claim Payment
            </Button>
          )
        );
      default:
        return (
          <Button variant="outline" className="gap-2">
            <ArrowRight className="h-4 w-4" />
            View Details
          </Button>
        );
    }
  };

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all overflow-hidden",
        !read && "border-amber-300 dark:border-amber-700",
        getTypeBgColor(type)
      )}
      onClick={toggleExpand}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-white dark:bg-background flex-shrink-0">
            {getTypeIcon(type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{getTypeTitle(type)}</h3>
                <p className="text-sm text-muted-foreground">
                  {format(timestamp, "MMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
              {!read && <Badge className="bg-amber-600 text-white">New</Badge>}
            </div>
            <p className="mt-1 line-clamp-2">{getTypeDescription(type)}</p>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex gap-3">
              <div className="relative h-20 w-20 rounded-md overflow-hidden">
                <Image
                  src={productImage || "/placeholder.svg"}
                  alt={productTitle}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{productTitle}</h4>
                <div className="text-sm text-muted-foreground">
                  Quantity: {quantity}
                </div>
                <div className="text-sm font-medium mt-1">
                  Total: ${(price * quantity).toFixed(2)}
                </div>

                {type === "new_order" && buyerName && buyerAddress && (
                  <div className="mt-2 space-y-1">
                    <p className="text-sm">
                      Buyer: <span className="font-medium">{buyerName}</span>
                    </p>
                    <p className="text-sm flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {buyerAddress}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              {getTypeActionButton(type)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
