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
} from "lucide-react";
import { ProtectedRoute } from "@/src/components/auth/protected-route";

// Update imports to use the new hook
import { useProductManagement } from "@/src/hooks/use-product-management";

// Replace the mockProducts array and related state/functions with the hook
export default function ProductsPage() {
  const { role, setRole } = useUserRole();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("dateAdded");
  const [sortOrder, setSortOrder] = useState("desc");

  // Use the product management hook
  const {
    filteredProducts,
    setAddProductModalOpen,
    handleViewProduct,
    handleEditProduct,
    openDeleteModal,
    filterProducts,
    renderModals,
  } = useProductManagement();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterProducts(searchQuery);
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

    // Update filtered products with sorted array
    // setFilteredProducts(sorted)
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
              onClick={() => setAddProductModalOpen(true)}
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
                                onClick={() => handleViewProduct(product)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-green-600"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600"
                                onClick={() => openDeleteModal(product)}
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
                                  onClick={() => handleViewProduct(product)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-green-600"
                                  onClick={() => handleEditProduct(product)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-600"
                                  onClick={() => openDeleteModal(product)}
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
                                  onClick={() => handleViewProduct(product)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-green-600"
                                  onClick={() => handleEditProduct(product)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-600"
                                  onClick={() => openDeleteModal(product)}
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

        {/* Modals */}
        {renderModals()}
      </div>
    </ProtectedRoute>
  );
}
