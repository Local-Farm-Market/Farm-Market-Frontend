"use client";

import { Droplet, Leaf, Sprout, Sun } from "lucide-react";
import React, { useState } from "react";
import { OnboardingGuide } from "../../components/auth/onboarding-guide";
import { NotificationPanel } from "../../components/notifications/notification-panel";
import { ThemeToggle } from "../../components/layout/theme-toggle";
import { WalletConnect } from "../../components/auth/wallet-connect";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { SearchBar } from "../../components/home/search-bar";
import { ProductFilters } from "../../components/home/product-filters";
import { ProductCard } from "../../components/product/product-card";
import { useUserRole } from "@/src/hooks/use-user-role";

const mockProducts = [
  {
    id: "1",
    title: "Fresh Organic Tomatoes",
    price: 3.99,
    image: "/placeholder.svg?height=400&width=400",
    location: "Green Valley Farm, CA",
    available: true,
    category: "Vegetables",
  },
  {
    id: "2",
    title: "Grass-Fed Beef",
    price: 12.99,
    image: "/placeholder.svg?height=400&width=400",
    location: "Sunset Ranch, TX",
    available: true,
    category: "Meat",
  },
  {
    id: "3",
    title: "Organic Free-Range Eggs",
    price: 5.49,
    image: "/placeholder.svg?height=400&width=400",
    location: "Happy Hen Farm, OR",
    available: true,
    category: "Poultry",
  },
  {
    id: "4",
    title: "Fresh Strawberries",
    price: 4.99,
    image: "/placeholder.svg?height=400&width=400",
    location: "Berry Fields, WA",
    available: false,
    category: "Fruits",
  },
  {
    id: "5",
    title: "Artisanal Goat Cheese",
    price: 8.99,
    image: "/placeholder.svg?height=400&width=400",
    location: "Mountain Dairy, VT",
    available: true,
    category: "Dairy",
  },
  {
    id: "6",
    title: "Organic Quinoa",
    price: 6.99,
    image: "/placeholder.svg?height=400&width=400",
    location: "Golden Fields, ID",
    available: true,
    category: "Grains",
  },
];

const BuyerDashboard = () => {
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { role, setRole } = useUserRole();

  console.log(role);

  const filterProducts = (query: string, filter: string) => {
    let filtered = mockProducts;

    // Apply search query filter
    if (query) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(query.toLowerCase()) ||
          product.location.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Apply category filter
    if (filter && filter !== "All") {
      filtered = filtered.filter((product) => product.category === filter);
    }

    setFilteredProducts(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterProducts(query, activeFilter);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    filterProducts(searchQuery, filter);
  };
  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-800 dark:text-green-400 flex items-center">
          <Leaf className="h-6 w-6 mr-2 text-green-600" />
          Farm Marketplace
        </h1>
        <div className="flex items-center gap-2">
          <OnboardingGuide />
          <NotificationPanel />
          <ThemeToggle />
          <WalletConnect onRoleSelect={setRole} />
        </div>
      </div>

      {/* Seasonal banner */}
      <Card className="mb-6 bg-gradient-to-r from-amber-50 to-green-50 dark:from-amber-950/40 dark:to-green-950/40 border-none overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold text-amber-800 dark:text-amber-400 mb-2">
                Spring Harvest Festival
              </h2>
              <p className="text-green-700 dark:text-green-300 max-w-md">
                Discover fresh seasonal produce from local farmers. Support
                sustainable agriculture and enjoy farm-to-table goodness.
              </p>
              <div className="flex gap-2 mt-4">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                  Explore Now
                </Button>
                <Button
                  variant="outline"
                  className="border-amber-600 text-amber-700 hover:bg-amber-50 dark:border-amber-500 dark:text-amber-400 dark:hover:bg-amber-950/30"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="h-16 w-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                <Sprout className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="h-16 w-16 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center">
                <Sun className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                <Droplet className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6">
        <SearchBar onSearch={handleSearch} />
      </div>

      <ProductFilters onFilterChange={handleFilterChange} />

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No products found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default BuyerDashboard;
