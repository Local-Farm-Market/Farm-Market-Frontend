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
  Search,
  Filter,
  ArrowUpDown,
  Leaf,
  Download,
  Printer,
} from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { ProtectedRoute } from "@/src/components/auth/protected-route";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/src/components/ui/dialog";
import { Textarea } from "@/src/components/ui/textarea";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import { Separator } from "@/src/components/ui/separator";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

// Update the TransactionStatus type to remove "disputed"
type TransactionStatus = "payment_escrowed" | "in_delivery" | "completed";

// Update the buyer orders to remove disputed status
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
];

// Update the seller orders to remove disputed status
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
];

export default function OrdersPage() {
  const { role, setRole } = useUserRole();
  type Order =
    | {
        id: string;
        date: Date;
        status: TransactionStatus;
        total: number;
        customer: {
          id: string;
          name: string;
          avatar: string;
          address: string;
        };
        items: {
          id: string;
          title: string;
          price: number;
          quantity: number;
          image: string;
        }[];
      }
    | {
        id: string;
        date: Date;
        status: TransactionStatus;
        total: number;
        seller: {
          id: string;
          name: string;
          avatar: string;
        };
        items: {
          id: string;
          title: string;
          price: number;
          quantity: number;
          image: string;
        }[];
      };

  const [orders, setOrders] = useState<Order[]>(
    role === "seller" ? sellerOrders : buyerOrders
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderDetailsModalOpen, setOrderDetailsModalOpen] = useState(false);
  const [processOrderModalOpen, setProcessOrderModalOpen] = useState(false);
  const [contactBuyerModalOpen, setContactBuyerModalOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shippingCarrier, setShippingCarrier] = useState("FedEx");

  const [currentTab, setCurrentTab] = useState("all");

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
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const openOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setOrderDetailsModalOpen(true);
  };

  const openProcessOrder = (order: any) => {
    setSelectedOrder(order);
    setProcessOrderModalOpen(true);
    setTrackingNumber("");
    setShippingCarrier("FedEx");
  };

  const openContactBuyer = (order: any) => {
    setSelectedOrder(order);
    setContactBuyerModalOpen(true);
    setMessageText("");
  };

  const handleProcessOrder = () => {
    // In a real app, this would make an API call
    // For now, we'll just close the modal
    setProcessOrderModalOpen(false);

    // Show a success message or update the order status
    alert(
      `Order #${selectedOrder.id} has been processed and marked as shipped`
    );
  };

  const handleSendMessage = () => {
    // In a real app, this would send a message to the buyer
    // For now, we'll just close the modal
    setContactBuyerModalOpen(false);

    // Show a success message
    alert(`Message sent to ${selectedOrder?.customer?.name}`);
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
                            "seller" in order
                              ? order.seller.avatar
                              : "/placeholder.svg"
                          }
                          alt={
                            "seller" in order
                              ? order.seller.name
                              : "Unknown Seller"
                          }
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span>
                        Seller:{" "}
                        {"seller" in order ? order.seller.name : "Unknown"}
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
                          src={
                            "seller" in order
                              ? order.seller.avatar
                              : "/placeholder.svg"
                          }
                          alt={
                            "seller" in order
                              ? order.seller.name
                              : "Unknown Seller"
                          }
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span>
                        Seller:{" "}
                        {"seller" in order ? order.seller.name : "Unknown"}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </div>
        </CardContent>
      </Card>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="mb-6">
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
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader className="pb-0">
              <div className="flex justify-between items-center pb-4">
                <CardTitle>All Orders</CardTitle>
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
                                  "customer" in order
                                    ? order.customer.avatar
                                    : "/placeholder.svg"
                                }
                                alt={
                                  "customer" in order
                                    ? order.customer.name
                                    : "Unknown"
                                }
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span>
                              {"customer" in order
                                ? order.customer.name
                                : "Unknown"}
                            </span>
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
                              onClick={() => openOrderDetails(order)}
                            >
                              Details
                            </Button>
                            {order.status === "payment_escrowed" && (
                              <Button
                                size="sm"
                                className="bg-amber-600 hover:bg-amber-700 text-white"
                                onClick={() => openProcessOrder(order)}
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
                              onClick={() => openContactBuyer(order)}
                            >
                              <MessageSquare className="h-4 w-4" />
                              <span className="hidden sm:inline">
                                Contact Buyer
                              </span>
                            </Button>
                            <Button
                              size="sm"
                              className="bg-amber-600 hover:bg-amber-700 text-white"
                              onClick={() => openProcessOrder(order)}
                            >
                              Process Order
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
                                  "customer" in order
                                    ? order.customer.avatar
                                    : "/placeholder.svg"
                                }
                                alt={
                                  "customer" in order
                                    ? order.customer.name
                                    : "Unknown"
                                }
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <div>
                                Customer:{" "}
                                {"customer" in order
                                  ? order.customer.name
                                  : "Unknown"}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {"customer" in order
                                  ? order.customer.address
                                  : "N/A"}
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
                              className="border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950/30"
                              onClick={() => openOrderDetails(order)}
                            >
                              <Package className="h-4 w-4 mr-1" />
                              Details
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
                                  "customer" in order
                                    ? order.customer.avatar
                                    : "/placeholder.svg"
                                }
                                alt={
                                  "customer" in order
                                    ? order.customer.name
                                    : "Unknown"
                                }
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <div>
                                Customer:{" "}
                                {"customer" in order
                                  ? order.customer.name
                                  : "Unknown"}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {"customer" in order
                                  ? order.customer.address
                                  : "N/A"}
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
                            className="border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950/30"
                            onClick={() => openOrderDetails(order)}
                          >
                            <Package className="h-4 w-4 mr-1" />
                            Details
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
                                  "customer" in order
                                    ? order.customer.avatar
                                    : "/placeholder.svg"
                                }
                                alt={
                                  "customer" in order
                                    ? order.customer.name
                                    : "Unknown"
                                }
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <div>
                                Customer:{" "}
                                {"customer" in order
                                  ? order.customer.name
                                  : "Unknown"}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {"customer" in order
                                  ? order.customer.address
                                  : "N/A"}
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
      </Tabs>

      {/* Order Details Modal */}
      {selectedOrder && (
        <Dialog
          open={orderDetailsModalOpen}
          onOpenChange={setOrderDetailsModalOpen}
        >
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <Package className="h-5 w-5 text-amber-600" />
                Order Details #{selectedOrder.id}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Order Status Tracker */}
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-4">Order Status</h3>
                <TransactionTracker status={selectedOrder.status} />
              </div>

              {/* Customer Information */}
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">Customer Information</h3>
                <div className="flex items-center gap-3 mb-2">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={selectedOrder.customer.avatar || "/placeholder.svg"}
                      alt={selectedOrder.customer.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{selectedOrder.customer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedOrder.customer.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">Order Items</h3>
                <div className="space-y-4">
                  {selectedOrder.items.map((item: any) => (
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
                            ${item.price.toFixed(2)} × {item.quantity}
                          </span>
                          <span className="font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${(selectedOrder.total - 5).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>$5.00</span>
                  </div>
                  <div className="flex justify-between font-bold text-green-700 dark:text-green-400">
                    <span>Total</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">Order Timeline</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Order Placed</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedOrder.date.toLocaleDateString()} at{" "}
                        {selectedOrder.date.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  {selectedOrder.status === "in_delivery" ||
                  selectedOrder.status === "completed" ? (
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                        <Truck className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Order Shipped</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(
                            selectedOrder.date.getTime() + 86400000
                          ).toLocaleDateString()}{" "}
                          at{" "}
                          {new Date(
                            selectedOrder.date.getTime() + 86400000
                          ).toLocaleTimeString()}
                        </p>
                        <p className="text-sm">Tracking: FDX123456789</p>
                      </div>
                    </div>
                  ) : null}

                  {selectedOrder.status === "completed" ? (
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Order Delivered</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(
                            selectedOrder.date.getTime() + 432000000
                          ).toLocaleDateString()}{" "}
                          at{" "}
                          {new Date(
                            selectedOrder.date.getTime() + 432000000
                          ).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <DialogFooter className="flex gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setOrderDetailsModalOpen(false)}
              >
                Close
              </Button>
              {selectedOrder.status === "payment_escrowed" && (
                <Button
                  onClick={() => {
                    setOrderDetailsModalOpen(false);
                    openProcessOrder(selectedOrder);
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Process Order
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Process Order Modal */}
      {selectedOrder && (
        <Dialog
          open={processOrderModalOpen}
          onOpenChange={setProcessOrderModalOpen}
        >
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <Truck className="h-5 w-5 text-amber-600" />
                Process Order #{selectedOrder.id}
              </DialogTitle>
              <DialogDescription>
                Enter shipping details to process this order
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={selectedOrder.customer.avatar || "/placeholder.svg"}
                    alt={selectedOrder.customer.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{selectedOrder.customer.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.customer.address}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-md">
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  This order will be marked as shipped and the buyer will be
                  notified with the tracking information.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="carrier">Shipping Carrier</Label>
                <Select
                  value={shippingCarrier}
                  onValueChange={setShippingCarrier}
                >
                  <SelectTrigger className="border-amber-200 dark:border-amber-800">
                    <SelectValue placeholder="Select carrier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FedEx">FedEx</SelectItem>
                    <SelectItem value="UPS">UPS</SelectItem>
                    <SelectItem value="USPS">USPS</SelectItem>
                    <SelectItem value="DHL">DHL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tracking">Tracking Number</Label>
                <Input
                  id="tracking"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                  className="border-amber-200 dark:border-amber-800"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any special instructions or notes"
                  className="border-amber-200 dark:border-amber-800"
                />
              </div>
            </div>

            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setProcessOrderModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleProcessOrder}
                className="bg-amber-600 hover:bg-amber-700 text-white"
                disabled={!trackingNumber}
              >
                <Truck className="h-4 w-4 mr-2" />
                Ship Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Contact Buyer Modal */}
      {selectedOrder && (
        <Dialog
          open={contactBuyerModalOpen}
          onOpenChange={setContactBuyerModalOpen}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-amber-600" />
                Contact Buyer
              </DialogTitle>
              <DialogDescription>
                Send a message to {selectedOrder.customer.name} about order #
                {selectedOrder.id}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={selectedOrder.customer.avatar || "/placeholder.svg"}
                    alt={selectedOrder.customer.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{selectedOrder.customer.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Order #{selectedOrder.id}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-md">
                <h4 className="text-sm font-medium mb-2">Order Summary</h4>
                <ScrollArea className="h-24">
                  <ul className="text-sm space-y-1">
                    {selectedOrder.items.map((item: any) => (
                      <li key={item.id}>
                        {item.title} × {item.quantity} - $
                        {(item.price * item.quantity).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message here..."
                  className="border-amber-200 dark:border-amber-800 min-h-[120px]"
                />
              </div>
            </div>

            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setContactBuyerModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendMessage}
                className="bg-amber-600 hover:bg-amber-700 text-white"
                disabled={!messageText.trim()}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
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
