"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { WalletConnect } from "@/src/components/auth/wallet-connect";
import { NotificationPanel } from "@/src/components/notifications/notification-panel";
import { ThemeToggle } from "@/src/components/layout/theme-toggle";
import { useUserRole } from "@/src/hooks/use-user-role";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Package,
  Leaf,
  Plus,
  ShoppingBag,
  Users,
  Star,
} from "lucide-react";

// Mock data for seller dashboard
const mockSalesData = [
  { month: "Jan", amount: 1200 },
  { month: "Feb", amount: 1800 },
  { month: "Mar", amount: 2400 },
  { month: "Apr", amount: 2000 },
  { month: "May", amount: 2800 },
  { month: "Jun", amount: 3600 },
];

const mockProducts = [
  {
    id: "1",
    title: "Fresh Organic Tomatoes",
    price: 3.99,
    stock: 45,
    sold: 120,
    status: "active",
  },
  {
    id: "2",
    title: "Grass-Fed Beef",
    price: 12.99,
    stock: 20,
    sold: 35,
    status: "active",
  },
  {
    id: "3",
    title: "Organic Free-Range Eggs",
    price: 5.49,
    stock: 0,
    sold: 80,
    status: "out_of_stock",
  },
  {
    id: "4",
    title: "Fresh Strawberries",
    price: 4.99,
    stock: 15,
    sold: 65,
    status: "active",
  },
];

const mockOrders = [
  {
    id: "ORD-12345",
    customer: "John Doe",
    date: "2023-05-15",
    amount: 45.97,
    status: "completed",
  },
  {
    id: "ORD-12346",
    customer: "Jane Smith",
    date: "2023-05-16",
    amount: 12.99,
    status: "processing",
  },
  {
    id: "ORD-12347",
    customer: "Robert Johnson",
    date: "2023-05-16",
    amount: 23.48,
    status: "processing",
  },
  {
    id: "ORD-12348",
    customer: "Emily Davis",
    date: "2023-05-17",
    amount: 9.99,
    status: "pending",
  },
];

export default function SellerDashboard() {
  const { setRole } = useUserRole();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400";
      case "processing":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400";
      case "pending":
        return "text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-amber-800 dark:text-amber-400 flex items-center">
          <Leaf className="h-6 w-6 mr-2 text-amber-600" />
          Farmer Dashboard
        </h1>
        <div className="flex items-center gap-2">
          <NotificationPanel />
          <ThemeToggle />
          <WalletConnect onRoleSelect={setRole} />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-300">
                Total Sales
              </p>
              <h3 className="text-2xl font-bold text-green-900 dark:text-green-200">
                $12,450
              </h3>
              <p className="text-xs text-green-700 dark:text-green-400 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" /> +12% from last month
              </p>
            </div>
            <div className="h-12 w-12 bg-green-200 dark:bg-green-800 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-700 dark:text-green-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                Products
              </p>
              <h3 className="text-2xl font-bold text-amber-900 dark:text-amber-200">
                24
              </h3>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                3 out of stock
              </p>
            </div>
            <div className="h-12 w-12 bg-amber-200 dark:bg-amber-800 rounded-full flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-amber-700 dark:text-amber-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                Orders
              </p>
              <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-200">
                156
              </h3>
              <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                12 pending fulfillment
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center">
              <Package className="h-6 w-6 text-blue-700 dark:text-blue-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-purple-800 dark:text-purple-300">
                Customers
              </p>
              <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-200">
                89
              </h3>
              <p className="text-xs text-purple-700 dark:text-purple-400 mt-1">
                4.8 average rating
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-700 dark:text-purple-300" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content area */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-amber-600" />
                Sales Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-end justify-between gap-2 pt-4">
                {mockSalesData.map((data) => (
                  <div key={data.month} className="flex flex-col items-center">
                    <div
                      className="w-12 bg-gradient-to-t from-amber-500 to-amber-300 dark:from-amber-700 dark:to-amber-500 rounded-t-md"
                      style={{ height: `${(data.amount / 4000) * 250}px` }}
                    ></div>
                    <span className="text-xs mt-2">{data.month}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center">
                  <Package className="h-5 w-5 mr-2 text-green-600" />
                  Recent Orders
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-700 border-green-200 hover:bg-green-50 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-950/30"
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex justify-between items-center p-3 border rounded-md"
                  >
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.customer}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-medium">${order.amount.toFixed(2)}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-green-50 to-amber-50 dark:from-green-950/40 dark:to-amber-950/40 border-green-200 dark:border-green-900">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-4">
                  <Plus className="h-8 w-8 text-green-600 dark:text-green-300" />
                </div>
                <h3 className="text-lg font-bold text-green-800 dark:text-green-300 mb-2">
                  Add New Product
                </h3>
                <p className="text-sm text-green-700 dark:text-green-400 mb-4">
                  List your farm products quickly and start selling today
                </p>
                <Button className="bg-green-600 hover:bg-green-700 text-white w-full">
                  Add Product
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2 text-amber-600" />
                Top Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockProducts.slice(0, 3).map((product) => (
                  <div
                    key={product.id}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{product.title}</p>
                      <p className="text-sm text-muted-foreground">
                        ${product.price.toFixed(2)} · {product.sold} sold
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm">4.8</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Products
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                Customer Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-md">
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 text-yellow-500" />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">
                      2 days ago
                    </span>
                  </div>
                  <p className="text-sm">
                    "The tomatoes were incredibly fresh and flavorful. Will
                    definitely order again!"
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    - Sarah M.
                  </p>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-md">
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4].map((star) => (
                        <Star key={star} className="h-4 w-4 text-yellow-500" />
                      ))}
                      <Star className="h-4 w-4 text-gray-300 dark:text-gray-600" />
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">
                      1 week ago
                    </span>
                  </div>
                  <p className="text-sm">
                    "Great quality beef, but delivery was a bit delayed."
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    - Michael T.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
