"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { TransactionTracker } from "@/src/components/escrow/transaction-tracker";
import { DisputeButton } from "@/src/components/escrow/dispute-button";
import { Badge } from "@/src/components/ui/badge";
import { useUserRole } from "@/src/hooks/use-user-role";
import { WalletConnect } from "@/src/components/auth/wallet-connect";
import { NotificationPanel } from "@/src/components/notifications/notification-panel";
import { ThemeToggle } from "@/src/components/layout/theme-toggle";
import {
  MessageSquare,
  ExternalLink,
  Package,
  Truck,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  ArrowUpDown,
  Leaf,
  Download,
  Printer,
} from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { ProtectedRoute } from "@/src/components/auth/protected-route";

type Order = 
  | (typeof buyerOrders)[number]
  | (typeof sellerOrders)[number];

// Mock order data for buyers
const buyerOrders = [
  {
    id: "12345",
    date: new Date(Date.now() - 86400000),
    status: "payment_escrowed" as const,
    total: 23.97,
    items: [
      {
        id: "1",
        title: "Fresh Organic Tomatoes",
        price: 3.99,
        quantity: 3,
        image: "/placeholder.svg?height=200&width=200",
      },
      {
        id: "2",
        title: "Grass-Fed Beef",
        price: 12.99,
        quantity: 1,
        image: "/placeholder.svg?height=200&width=200",
      },
    ],
    seller: {
      id: "seller1",
      name: "Green Valley Farm",
      avatar: "/placeholder.svg?height=100&width=100",
    },
  },
  {
    id: "12346",
    date: new Date(Date.now() - 172800000),
    status: "in_delivery" as const,
    total: 14.47,
    items: [
      {
        id: "3",
        title: "Organic Free-Range Eggs",
        price: 5.49,
        quantity: 1,
        image: "/placeholder.svg?height=200&width=200",
      },
      {
        id: "5",
        title: "Artisanal Goat Cheese",
        price: 8.99,
        quantity: 1,
        image: "/placeholder.svg?height=200&width=200",
      },
    ],
    seller: {
      id: "seller2",
      name: "Mountain Dairy",
      avatar: "/placeholder.svg?height=100&width=100",
    },
  },
  {
    id: "12347",
    date: new Date(Date.now() - 604800000),
    status: "completed" as const,
    total: 19.96,
    items: [
      {
        id: "4",
        title: "Fresh Strawberries",
        price: 4.99,
        quantity: 4,
        image: "/placeholder.svg?height=200&width=200",
      },
    ],
    seller: {
      id: "seller3",
      name: "Berry Fields",
      avatar: "/placeholder.svg?height=100&width=100",
    },
  },
  {
    id: "12348",
    date: new Date(Date.now() - 1209600000),
    status: "disputed" as const,
    total: 6.99,
    items: [
      {
        id: "6",
        title: "Organic Quinoa",
        price: 6.99,
        quantity: 1,
        image: "/placeholder.svg?height=200&width=200",
      },
    ],
    seller: {
      id: "seller4",
      name: "Golden Fields",
      avatar: "/placeholder.svg?height=100&width=100",
    },
  },
];

// Mock order data for sellers
const sellerOrders = [
  {
    id: "12345",
    date: new Date(Date.now() - 86400000),
    status: "payment_escrowed" as const,
    total: 23.97,
    customer: {
      id: "cust1",
      name: "John Doe",
      avatar: "/placeholder.svg?height=100&width=100",
      address: "123 Main St, Anytown, CA 12345",
    },
    items: [
      {
        id: "1",
        title: "Fresh Organic Tomatoes",
        price: 3.99,
        quantity: 3,
        image: "/placeholder.svg?height=200&width=200",
      },
      {
        id: "2",
        title: "Grass-Fed Beef",
        price: 12.99,
        quantity: 1,
        image: "/placeholder.svg?height=200&width=200",
      },
    ],
  },
  {
    id: "12346",
    date: new Date(Date.now() - 172800000),
    status: "in_delivery" as const,
    total: 14.47,
    customer: {
      id: "cust2",
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=100&width=100",
      address: "456 Oak Ave, Somewhere, NY 67890",
    },
    items: [
      {
        id: "3",
        title: "Organic Free-Range Eggs",
        price: 5.49,
        quantity: 1,
        image: "/placeholder.svg?height=200&width=200",
      },
      {
        id: "5",
        title: "Artisanal Goat Cheese",
        price: 8.99,
        quantity: 1,
        image: "/placeholder.svg?height=200&width=200",
      },
    ],
  },
  {
    id: "12347",
    date: new Date(Date.now() - 604800000),
    status: "completed" as const,
    total: 19.96,
    customer: {
      id: "cust3",
      name: "Robert Johnson",
      avatar: "/placeholder.svg?height=100&width=100",
      address: "789 Pine Ln, Elsewhere, TX 54321",
    },
    items: [
      {
        id: "4",
        title: "Fresh Strawberries",
        price: 4.99,
        quantity: 4,
        image: "/placeholder.svg?height=200&width=200",
      },
    ],
  },
  {
    id: "12348",
    date: new Date(Date.now() - 1209600000),
    status: "disputed" as const,
    total: 6.99,
    customer: {
      id: "cust4",
      name: "Emily Davis",
      avatar: "/placeholder.svg?height=100&width=100",
      address: "321 Cedar Rd, Nowhere, WA 13579",
    },
    items: [
      {
        id: "6",
        title: "Organic Quinoa",
        price: 6.99,
        quantity: 1,
        image: "/placeholder.svg?height=200&width=200",
      },
    ],
  },
];

export default function OrdersPage() {
  const { role, setRole } = useUserRole();
  const [orders, setOrders] = useState<Order[]>(
  role === "seller" ? sellerOrders : buyerOrders
);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const handleDisputeSubmit = (orderId: string, reason: string) => {
    console.log(`Dispute submitted for order ${orderId}: ${reason}`);
    // In a real app, this would submit the dispute to the backend
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: "disputed" as const } : order
      )
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter orders based on search query
    filterOrders(searchQuery);
  };

  const filterOrders = (query: string) => {
    if (!query) {
      setOrders(role === "seller" ? sellerOrders : buyerOrders);
      return;
    }

    if (role === "seller") {
      const filtered = sellerOrders.filter(
        (order) =>
          order.id.toLowerCase().includes(query.toLowerCase()) ||
          order.customer.name.toLowerCase().includes(query.toLowerCase()) ||
          order.items.some((item) =>
            item.title.toLowerCase().includes(query.toLowerCase())
          )
      );
      setOrders(filtered);
    } else {
      const filtered = buyerOrders.filter(
        (order) =>
          order.id.toLowerCase().includes(query.toLowerCase()) ||
          order.seller.name.toLowerCase().includes(query.toLowerCase()) ||
          order.items.some((item) =>
            item.title.toLowerCase().includes(query.toLowerCase())
          )
      );
      setOrders(filtered);
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      // Toggle sort order if clicking the same field
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Default to descending when changing fields
      setSortBy(field);
      setSortOrder("desc");
    }

    // Sort the orders
    const sorted = [...orders].sort((a, b) => {
      // @ts-ignore - dynamic property access
      const aValue = a[field];
      // @ts-ignore - dynamic property access
      const bValue = b[field];

      if (field === "date") {
        return sortOrder === "asc"
          ? new Date(aValue).getTime() - new Date(bValue).getTime()
          : new Date(bValue).getTime() - new Date(aValue).getTime();
      } else if (typeof aValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }
    });

    setOrders(sorted);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "payment_escrowed":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800"
          >
            Payment Escrowed
          </Badge>
        );
      case "in_delivery":
        return (
          <Badge
            variant="outline"
            className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800"
          >
            In Delivery
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800"
          >
            Completed
          </Badge>
        );
      case "disputed":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800"
          >
            Disputed
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Buyer-specific orders UI
  const BuyerOrders = () => (
    <>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Input
            type="search"
            placeholder="Search orders..."
            className="pl-10 border-amber-200 dark:border-amber-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 text-amber-600"
          >
            Search
          </Button>
        </form>

        <Button
          variant="outline"
          className="gap-2 border-amber-200 dark:border-amber-800"
        >
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      <Tabs defaultValue="active" className="mb-6">
        <TabsList className="bg-amber-100 dark:bg-amber-950/50">
          <TabsTrigger
            value="active"
            className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
          >
            Active Orders
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
          >
            Completed
          </TabsTrigger>
          <TabsTrigger
            value="disputed"
            className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
          >
            Disputed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          {orders
            .filter((order) =>
              ["payment_escrowed", "in_delivery"].includes(order.status)
            )
            .map((order) => (
              <Card
                key={order.id}
                className="overflow-hidden border-amber-100 dark:border-amber-900/50"
              >
                <CardContent className="p-0">
                  <div className="p-4 border-b flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">Order #{order.id}</h3>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Placed on {order.date.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-950/30"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span className="hidden sm:inline">Contact Seller</span>
                      </Button>
                      <DisputeButton
                        orderId={order.id}
                        onDisputeSubmit={handleDisputeSubmit}
                      />
                    </div>
                  </div>

                  <div className="p-4">
                    <TransactionTracker status={order.status} />
                  </div>

                  <div className="p-4 border-t">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden">
                        <Image
                          src={"seller" in order ? order.seller.avatar : "/placeholder.svg"}
                          alt={"seller" in order ? order.seller.name : "N/A"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span>
                        Seller: {"seller" in order ? order.seller.name : "N/A"}
                      </span>
                    </div>

                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{item.title}</h4>
                            <div className="flex justify-between mt-1">
                              <span className="text-sm text-muted-foreground">
                                ${item.price.toFixed(2)} x {item.quantity}
                              </span>
                              <span className="font-medium">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${(order.total - 5).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>Shipping</span>
                        <span>$5.00</span>
                      </div>
                      <div className="flex justify-between mt-2 font-bold text-green-700 dark:text-green-400">
                        <span>Total</span>
                        <span>${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

          {orders.filter((order) =>
            ["payment_escrowed", "in_delivery"].includes(order.status)
          ).length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No active orders found.</p>
              <Button
                asChild
                className="mt-4 bg-amber-600 hover:bg-amber-700 text-white"
              >
                <Link href="/marketplace">Browse Marketplace</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          {orders
            .filter((order) => order.status === "completed")
            .map((order) => (
              <Card
                key={order.id}
                className="overflow-hidden border-amber-100 dark:border-amber-900/50"
              >
                <CardContent className="p-0">
                  <div className="p-4 border-b flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">Order #{order.id}</h3>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Placed on {order.date.toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950/30"
                    >
                      <Link
                        href={`/product/${order.items[0].id}`}
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Buy Again
                      </Link>
                    </Button>
                  </div>

                  <div className="p-4 border-t">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden">
                        <Image
                          src={"seller" in order ? order.seller.avatar : "/placeholder.svg"}
                          alt={"seller" in order ? order.seller.name : "N/A"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span>
                        Seller: {"seller" in order ? order.seller.name : "N/A"}
                      </span>
                    </div>

                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{item.title}</h4>
                            <div className="flex justify-between mt-1">
                              <span className="text-sm text-muted-foreground">
                                ${item.price.toFixed(2)} x {item.quantity}
                              </span>
                              <span className="font-medium">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between mt-2 font-bold text-green-700 dark:text-green-400">
                        <span>Total</span>
                        <span>${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

          {orders.filter((order) => order.status === "completed").length ===
            0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No completed orders found.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="disputed" className="space-y-6">
          {orders
            .filter((order) => order.status === "disputed")
            .map((order) => (
              <Card
                key={order.id}
                className="overflow-hidden border-amber-100 dark:border-amber-900/50"
              >
                <CardContent className="p-0">
                  <div className="p-4 border-b flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">Order #{order.id}</h3>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Placed on {order.date.toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-950/30"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span className="hidden sm:inline">Contact Support</span>
                    </Button>
                  </div>

                  <div className="p-4">
                    <TransactionTracker status={order.status} />
                  </div>

                  <div className="p-4 border-t">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden">
                        <Image
                          src={"seller" in order ? order.seller.avatar : "/placeholder.svg"}
                          alt={"seller" in order ? order.seller.name : "N/A"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span>
                        Seller: {"seller" in order ? order.seller.name : "N/A"}
                      </span>
                    </div>

                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{item.title}</h4>
                            <div className="flex justify-between mt-1">
                              <span className="text-sm text-muted-foreground">
                                ${item.price.toFixed(2)} x {item.quantity}
                              </span>
                              <span className="font-medium">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between mt-2 font-bold text-green-700 dark:text-green-400">
                        <span>Total</span>
                        <span>${order.total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-md">
                      <h4 className="font-medium mb-1">Dispute Status</h4>
                      <p className="text-sm">
                        Your dispute is currently being reviewed. We'll update
                        you within 48 hours.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

          {orders.filter((order) => order.status === "disputed").length ===
            0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No disputed orders found.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  );

  // Seller-specific orders UI
  const SellerOrders = () => (
    <>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Input
            type="search"
            placeholder="Search orders by ID, customer, or product..."
            className="pl-10 border-amber-200 dark:border-amber-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 text-amber-600"
          >
            Search
          </Button>
        </form>

        <Button
          variant="outline"
          className="gap-2 border-amber-200 dark:border-amber-800"
        >
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      <Card className="mb-6 border-amber-200 dark:border-amber-800">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
              <div className="flex justify-center mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full">
                  <Package className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                2
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                New Orders
              </div>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-center">
              <div className="flex justify-center mb-2">
                <div className="p-2 bg-amber-100 dark:bg-amber-800 rounded-full">
                  <Truck className="h-5 w-5 text-amber-600 dark:text-amber-300" />
                </div>
              </div>
              <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                1
              </div>
              <div className="text-sm text-amber-600 dark:text-amber-400">
                In Delivery
              </div>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
              <div className="flex justify-center mb-2">
                <div className="p-2 bg-green-100 dark:bg-green-800 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-300" />
                </div>
              </div>
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                12
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                Completed
              </div>
            </div>

            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
              <div className="flex justify-center mb-2">
                <div className="p-2 bg-red-100 dark:bg-red-800 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-300" />
                </div>
              </div>
              <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                1
              </div>
              <div className="text-sm text-red-600 dark:text-red-400">
                Disputed
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="bg-amber-100 dark:bg-amber-950/50">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
          >
            All Orders
          </TabsTrigger>
          <TabsTrigger
            value="new"
            className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
          >
            New
          </TabsTrigger>
          <TabsTrigger
            value="processing"
            className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
          >
            Processing
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
          >
            Completed
          </TabsTrigger>
          <TabsTrigger
            value="disputed"
            className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
          >
            Disputed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader className="pb-0">
              <div className="flex justify-between items-center">
                <CardTitle>All Orders</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-950/30"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-950/30"
                  >
                    <Printer className="h-4 w-4" />
                    Print
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-amber-200 dark:border-amber-800">
                      <th
                        className="text-left py-3 px-4 cursor-pointer"
                        onClick={() => handleSort("id")}
                      >
                        <div className="flex items-center">
                          Order ID
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        </div>
                      </th>
                      <th className="text-left py-3 px-4">Customer</th>
                      <th
                        className="text-left py-3 px-4 cursor-pointer"
                        onClick={() => handleSort("date")}
                      >
                        <div className="flex items-center">
                          Date
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        </div>
                      </th>
                      <th className="text-left py-3 px-4">Items</th>
                      <th
                        className="text-left py-3 px-4 cursor-pointer"
                        onClick={() => handleSort("total")}
                      >
                        <div className="flex items-center">
                          Total
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        </div>
                      </th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-amber-100 dark:border-amber-900/50 hover:bg-amber-50/50 dark:hover:bg-amber-950/30"
                      >
                        <td className="py-3 px-4 font-medium">#{order.id}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden">
                              <Image
                                src={
                                  "customer" in order ? order.customer.avatar : "/placeholder.svg"
                                }
                                alt={"customer" in order ? order.customer.name : "N/A"}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span>{"customer" in order ? order.customer.name : "N/A"}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {order.date.toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          {order.items.map((item) => (
                            <div key={item.id} className="text-sm">
                              {item.title} (x{item.quantity})
                            </div>
                          ))}
                        </td>
                        <td className="py-3 px-4 font-medium text-green-700 dark:text-green-400">
                          ${order.total.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950/30"
                            >
                              Details
                            </Button>
                            {order.status === "payment_escrowed" && (
                              <Button
                                size="sm"
                                className="bg-amber-600 hover:bg-amber-700 text-white"
                              >
                                Process
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle>New Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders
                  .filter((order) => order.status === "payment_escrowed")
                  .map((order) => (
                    <Card
                      key={order.id}
                      className="overflow-hidden border-amber-100 dark:border-amber-900/50"
                    >
                      <CardContent className="p-0">
                        <div className="p-4 border-b flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">Order #{order.id}</h3>
                              {getStatusBadge(order.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Placed on {order.date.toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1 border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-950/30"
                            >
                              <MessageSquare className="h-4 w-4" />
                              <span className="hidden sm:inline">
                                Contact Buyer
                              </span>
                            </Button>
                            <Button
                              size="sm"
                              className="bg-amber-600 hover:bg-amber-700 text-white"
                            >
                              Process Order
                            </Button>
                          </div>
                        </div>

                        <div className="p-4 border-t">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden">
                              <Image
                                src={
                                  "customer" in order ? order.customer.avatar : "/placeholder.svg"
                                }
                                alt={"customer" in order ? order.customer.name : "N/A"}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <div>
                                Customer: {"customer" in order ? order.customer.name : "N/A"}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {"customer" in order ? order.customer.address : "N/A"}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex gap-4">
                                <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                                  <Image
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium">{item.title}</h4>
                                  <div className="flex justify-between mt-1">
                                    <span className="text-sm text-muted-foreground">
                                      ${item.price.toFixed(2)} x {item.quantity}
                                    </span>
                                    <span className="font-medium">
                                      ${(item.price * item.quantity).toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 pt-4 border-t">
                            <div className="flex justify-between">
                              <span>Subtotal</span>
                              <span>${(order.total - 5).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span>Shipping</span>
                              <span>$5.00</span>
                            </div>
                            <div className="flex justify-between mt-2 font-bold text-green-700 dark:text-green-400">
                              <span>Total</span>
                              <span>${order.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                {orders.filter((order) => order.status === "payment_escrowed")
                  .length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      No new orders found.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processing">
          {/* Similar structure to "new" tab but filtered for in_delivery status */}
          <Card>
            <CardHeader>
              <CardTitle>Processing Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders
                  .filter((order) => order.status === "in_delivery")
                  .map((order) => (
                    <Card
                      key={order.id}
                      className="overflow-hidden border-amber-100 dark:border-amber-900/50"
                    >
                      <CardContent className="p-0">
                        <div className="p-4 border-b flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">Order #{order.id}</h3>
                              {getStatusBadge(order.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Placed on {order.date.toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1 border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-950/30"
                            >
                              <Truck className="h-4 w-4" />
                              <span className="hidden sm:inline">
                                Update Tracking
                              </span>
                            </Button>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Mark Delivered
                            </Button>
                          </div>
                        </div>

                        <div className="p-4">
                          <TransactionTracker status={order.status} />
                        </div>

                        <div className="p-4 border-t">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden">
                              <Image
                                src={
                                  "customer" in order ? order.customer.avatar : "/placeholder.svg"
                                }
                                alt={"customer" in order ? order.customer.name : "N/A"}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <div>
                                Customer: {"customer" in order ? order.customer.name : "N/A"}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {"customer" in order ? order.customer.address : "N/A"}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex gap-4">
                                <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                                  <Image
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium">{item.title}</h4>
                                  <div className="flex justify-between mt-1">
                                    <span className="text-sm text-muted-foreground">
                                      ${item.price.toFixed(2)} x {item.quantity}
                                    </span>
                                    <span className="font-medium">
                                      ${(item.price * item.quantity).toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 pt-4 border-t">
                            <div className="flex justify-between mt-2 font-bold text-green-700 dark:text-green-400">
                              <span>Total</span>
                              <span>${order.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                {orders.filter((order) => order.status === "in_delivery")
                  .length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      No orders in processing.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          {/* Similar structure but filtered for completed status */}
          <Card>
            <CardHeader>
              <CardTitle>Completed Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders
                  .filter((order) => order.status === "completed")
                  .map((order) => (
                    <Card
                      key={order.id}
                      className="overflow-hidden border-amber-100 dark:border-amber-900/50"
                    >
                      <CardContent className="p-0">
                        <div className="p-4 border-b flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">Order #{order.id}</h3>
                              {getStatusBadge(order.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Placed on {order.date.toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950/30"
                          >
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:inline">
                              Download Invoice
                            </span>
                          </Button>
                        </div>

                        <div className="p-4 border-t">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden">
                              <Image
                                src={
                                  "customer" in order ? order.customer.avatar : "/placeholder.svg"
                                }
                                alt={"customer" in order ? order.customer.name : "N/A"}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <div>
                                Customer: {"customer" in order ? order.customer.name : "N/A"}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {"customer" in order ? order.customer.address : "N/A"}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex gap-4">
                                <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                                  <Image
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium">{item.title}</h4>
                                  <div className="flex justify-between mt-1">
                                    <span className="text-sm text-muted-foreground">
                                      ${item.price.toFixed(2)} x {item.quantity}
                                    </span>
                                    <span className="font-medium">
                                      ${(item.price * item.quantity).toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 pt-4 border-t">
                            <div className="flex justify-between mt-2 font-bold text-green-700 dark:text-green-400">
                              <span>Total</span>
                              <span>${order.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                {orders.filter((order) => order.status === "completed")
                  .length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      No completed orders found.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disputed">
          {/* Similar structure but filtered for disputed status */}
          <Card>
            <CardHeader>
              <CardTitle>Disputed Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders
                  .filter((order) => order.status === "disputed")
                  .map((order) => (
                    <Card
                      key={order.id}
                      className="overflow-hidden border-amber-100 dark:border-amber-900/50"
                    >
                      <CardContent className="p-0">
                        <div className="p-4 border-b flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">Order #{order.id}</h3>
                              {getStatusBadge(order.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Placed on {order.date.toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-950/30"
                          >
                            <MessageSquare className="h-4 w-4" />
                            <span className="hidden sm:inline">
                              Contact Support
                            </span>
                          </Button>
                        </div>

                        <div className="p-4">
                          <TransactionTracker status={order.status} />
                        </div>

                        <div className="p-4 border-t">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden">
                              <Image
                                src={
                                  "customer" in order ? order.customer.avatar : "/placeholder.svg"
                                }
                                alt={"customer" in order ? order.customer.name : "N/A"}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <div>
                                Customer: {"customer" in order ? order.customer.name : "N/A"}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {"customer" in order ? order.customer.address : "N/A"}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex gap-4">
                                <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                                  <Image
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium">{item.title}</h4>
                                  <div className="flex justify-between mt-1">
                                    <span className="text-sm text-muted-foreground">
                                      ${item.price.toFixed(2)} x {item.quantity}
                                    </span>
                                    <span className="font-medium">
                                      ${(item.price * item.quantity).toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 pt-4 border-t">
                            <div className="flex justify-between mt-2 font-bold text-green-700 dark:text-green-400">
                              <span>Total</span>
                              <span>${order.total.toFixed(2)}</span>
                            </div>
                          </div>

                          <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md">
                            <h4 className="font-medium mb-1">
                              Dispute Details
                            </h4>
                            <p className="text-sm">
                              Customer has reported an issue with this order.
                              Please review the details and respond within 48
                              hours.
                            </p>
                            <Button
                              className="mt-3 bg-amber-600 hover:bg-amber-700 text-white"
                              size="sm"
                            >
                              Respond to Dispute
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                {orders.filter((order) => order.status === "disputed")
                  .length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      No disputed orders found.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );

  return (
    <ProtectedRoute requireAuth={true}>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-amber-800 dark:text-amber-400 flex items-center">
            <Leaf className="h-6 w-6 mr-2 text-amber-600" />
            {role === "seller" ? "Manage Orders" : "My Orders"}
          </h1>
          <div className="flex items-center gap-2">
            <NotificationPanel />
            <ThemeToggle />
            <WalletConnect onRoleSelect={setRole} />
          </div>
        </div>

        {role === "seller" ? <SellerOrders /> : <BuyerOrders />}
      </div>
    </ProtectedRoute>
  );
}
