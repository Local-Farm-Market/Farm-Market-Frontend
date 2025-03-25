"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { Badge } from "@/src/components/ui/badge";
import { WalletConnect } from "@/src/components/auth/wallet-connect";
import { NotificationPanel } from "@/src/components/notifications/notification-panel";
import { ThemeToggle } from "@/src/components/layout/theme-toggle";
import { useUserRole } from "@/src/hooks/use-user-role";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Leaf,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  ArrowUpDown,
  Upload,
  Camera,
} from "lucide-react";
import { ProtectedRoute } from "@/src/components/auth/protected-route";

// Mock product data for seller
const mockProducts = [
  {
    id: "1",
    title: "Fresh Organic Tomatoes",
    price: 3.99,
    image: "/placeholder.svg?height=200&width=200",
    stock: 45,
    sold: 120,
    status: "active",
    category: "Vegetables",
    dateAdded: "2023-05-10",
  },
  {
    id: "2",
    title: "Grass-Fed Beef",
    price: 12.99,
    image: "/placeholder.svg?height=200&width=200",
    stock: 20,
    sold: 35,
    status: "active",
    category: "Meat",
    dateAdded: "2023-05-12",
  },
  {
    id: "3",
    title: "Organic Free-Range Eggs",
    price: 5.49,
    image: "/placeholder.svg?height=200&width=200",
    stock: 0,
    sold: 80,
    status: "out_of_stock",
    category: "Poultry",
    dateAdded: "2023-05-15",
  },
  {
    id: "4",
    title: "Fresh Strawberries",
    price: 4.99,
    image: "/placeholder.svg?height=200&width=200",
    stock: 15,
    sold: 65,
    status: "active",
    category: "Fruits",
    dateAdded: "2023-05-18",
  },
  {
    id: "5",
    title: "Artisanal Goat Cheese",
    price: 8.99,
    image: "/placeholder.svg?height=200&width=200",
    stock: 12,
    sold: 28,
    status: "active",
    category: "Dairy",
    dateAdded: "2023-05-20",
  },
  {
    id: "6",
    title: "Organic Quinoa",
    price: 6.99,
    image: "/placeholder.svg?height=200&width=200",
    stock: 30,
    sold: 42,
    status: "active",
    category: "Grains",
    dateAdded: "2023-05-22",
  },
];

export default function ProductsPage() {
  const { role, setRole } = useUserRole();
  const router = useRouter();
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [sortBy, setSortBy] = useState("dateAdded");
  const [sortOrder, setSortOrder] = useState("desc");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterProducts(searchQuery);
  };

  const filterProducts = (query: string) => {
    if (!query) {
      setFilteredProducts(mockProducts);
      return;
    }

    const filtered = mockProducts.filter(
      (product) =>
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredProducts(filtered);
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

    // Sort the products
    const sorted = [...filteredProducts].sort((a, b) => {
      // @ts-ignore - dynamic property access
      const aValue = a[field];
      // @ts-ignore - dynamic property access
      const bValue = b[field];

      if (typeof aValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }
    });

    setFilteredProducts(sorted);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800">
            Active
          </Badge>
        );
      case "out_of_stock":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800">
            Out of Stock
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
    }
  };

  return (
    <ProtectedRoute requireAuth={true} requireRole="seller">
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-amber-800 dark:text-amber-400 flex items-center">
            <Leaf className="h-6 w-6 mr-2 text-amber-600" />
            My Products
          </h1>
          <div className="flex items-center gap-2">
            <NotificationPanel />
            <ThemeToggle />
            <WalletConnect onRoleSelect={setRole} />
          </div>
        </div>

        <Tabs defaultValue="all">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <TabsList>
              <TabsTrigger value="all">All Products</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="out_of_stock">Out of Stock</TabsTrigger>
            </TabsList>

            <Button
              onClick={() => setShowAddProduct(true)}
              className="bg-green-600 hover:bg-green-700 text-white gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New Product
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <form onSubmit={handleSearch} className="relative flex-1">
              <Input
                type="search"
                placeholder="Search products..."
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

          <TabsContent value="all" className="mt-0">
            <Card>
              <CardHeader className="pb-0">
                <CardTitle>All Products ({filteredProducts.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Product</th>
                        <th
                          className="text-left py-3 px-4 cursor-pointer"
                          onClick={() => handleSort("category")}
                        >
                          <div className="flex items-center">
                            Category
                            <ArrowUpDown className="ml-1 h-4 w-4" />
                          </div>
                        </th>
                        <th
                          className="text-left py-3 px-4 cursor-pointer"
                          onClick={() => handleSort("price")}
                        >
                          <div className="flex items-center">
                            Price
                            <ArrowUpDown className="ml-1 h-4 w-4" />
                          </div>
                        </th>
                        <th
                          className="text-left py-3 px-4 cursor-pointer"
                          onClick={() => handleSort("stock")}
                        >
                          <div className="flex items-center">
                            Stock
                            <ArrowUpDown className="ml-1 h-4 w-4" />
                          </div>
                        </th>
                        <th
                          className="text-left py-3 px-4 cursor-pointer"
                          onClick={() => handleSort("sold")}
                        >
                          <div className="flex items-center">
                            Sold
                            <ArrowUpDown className="ml-1 h-4 w-4" />
                          </div>
                        </th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <tr
                          key={product.id}
                          className="border-b hover:bg-muted/50"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10 rounded overflow-hidden">
                                <Image
                                  src={product.image || "/placeholder.svg"}
                                  alt={product.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <span className="font-medium">
                                {product.title}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">{product.category}</td>
                          <td className="py-3 px-4">
                            ${product.price.toFixed(2)}
                          </td>
                          <td className="py-3 px-4">{product.stock}</td>
                          <td className="py-3 px-4">{product.sold}</td>
                          <td className="py-3 px-4">
                            {getStatusBadge(product.status)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-amber-600"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-green-600"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
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

          <TabsContent value="active" className="mt-0">
            <Card>
              <CardHeader className="pb-0">
                <CardTitle>
                  Active Products (
                  {filteredProducts.filter((p) => p.status === "active").length}
                  )
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Same table structure but filtered for active products */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Product</th>
                        <th className="text-left py-3 px-4">Category</th>
                        <th className="text-left py-3 px-4">Price</th>
                        <th className="text-left py-3 px-4">Stock</th>
                        <th className="text-left py-3 px-4">Sold</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts
                        .filter((product) => product.status === "active")
                        .map((product) => (
                          <tr
                            key={product.id}
                            className="border-b hover:bg-muted/50"
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="relative w-10 h-10 rounded overflow-hidden">
                                  <Image
                                    src={product.image || "/placeholder.svg"}
                                    alt={product.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <span className="font-medium">
                                  {product.title}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4">{product.category}</td>
                            <td className="py-3 px-4">
                              ${product.price.toFixed(2)}
                            </td>
                            <td className="py-3 px-4">{product.stock}</td>
                            <td className="py-3 px-4">{product.sold}</td>
                            <td className="py-3 px-4">
                              {getStatusBadge(product.status)}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-amber-600"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-green-600"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
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

          <TabsContent value="out_of_stock" className="mt-0">
            <Card>
              <CardHeader className="pb-0">
                <CardTitle>
                  Out of Stock Products (
                  {
                    filteredProducts.filter((p) => p.status === "out_of_stock")
                      .length
                  }
                  )
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Same table structure but filtered for out of stock products */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Product</th>
                        <th className="text-left py-3 px-4">Category</th>
                        <th className="text-left py-3 px-4">Price</th>
                        <th className="text-left py-3 px-4">Stock</th>
                        <th className="text-left py-3 px-4">Sold</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts
                        .filter((product) => product.status === "out_of_stock")
                        .map((product) => (
                          <tr
                            key={product.id}
                            className="border-b hover:bg-muted/50"
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="relative w-10 h-10 rounded overflow-hidden">
                                  <Image
                                    src={product.image || "/placeholder.svg"}
                                    alt={product.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <span className="font-medium">
                                  {product.title}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4">{product.category}</td>
                            <td className="py-3 px-4">
                              ${product.price.toFixed(2)}
                            </td>
                            <td className="py-3 px-4">{product.stock}</td>
                            <td className="py-3 px-4">{product.sold}</td>
                            <td className="py-3 px-4">
                              {getStatusBadge(product.status)}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-amber-600"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-green-600"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
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
        </Tabs>

        {/* Add Product Form */}
        {showAddProduct && (
          <Card className="mt-6 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-green-800 dark:text-green-400 flex items-center">
                <Plus className="h-5 w-5 mr-2 text-green-600" />
                Add New Product
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Product Name</Label>
                    <Input
                      id="title"
                      placeholder="Enter product name"
                      className="border-amber-200 dark:border-amber-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      placeholder="e.g. Vegetables, Fruits, etc."
                      className="border-amber-200 dark:border-amber-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="border-amber-200 dark:border-amber-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      type="number"
                      placeholder="0"
                      className="border-amber-200 dark:border-amber-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      placeholder="e.g. lb, kg, dozen"
                      className="border-amber-200 dark:border-amber-800"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Describe your product"
                    className="border-amber-200 dark:border-amber-800"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Product Images</Label>
                  <div className="border-2 border-dashed border-amber-200 dark:border-amber-800 rounded-md p-6 text-center">
                    <div className="flex flex-col items-center">
                      <Camera className="h-10 w-10 text-amber-500 mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop images here or click to browse
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 border-amber-200 dark:border-amber-800"
                      >
                        <Upload className="h-4 w-4" />
                        Upload Images
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddProduct(false)}
                  >
                    Cancel
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    Add Product
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  );
}
