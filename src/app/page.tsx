"use client";

import { useState, useEffect } from "react";
import { SearchBar } from "@/src/components/home/search-bar";
import { ProductFilters } from "@/src/components/home/product-filters";
import { ProductCard } from "@/src/components/product/product-card";
import { WalletConnect } from "@/src/components/auth/wallet-connect";
import { OnboardingGuide } from "@/src/components/auth/onboarding-guide";
import { NotificationPanel } from "@/src/components/notifications/notification-panel";
import { ThemeToggle } from "@/src/components/layout/theme-toggle";
import { useUserRole } from "@/src/hooks/use-user-role";
import { SellerDashboard } from "@/src/components/seller/seller-dashboard";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import {
  Leaf,
  Sprout,
  Sun,
  Droplet,
  Wallet,
  ShoppingBasket,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Mock product data
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

export default function Home() {
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const { role, setRole } = useUserRole();
  const [isConnected, setIsConnected] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if wallet is connected
    const walletAddress = localStorage.getItem("walletAddress");
    setIsConnected(!!walletAddress);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterProducts(query, activeFilter);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    filterProducts(searchQuery, filter);
  };

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

  // If user is a seller, show seller dashboard
  if (isConnected && role === "seller") {
    return <SellerDashboard />;
  }

  // If not connected, show welcome screen
  if (!isConnected) {
    return (
      <div className="py-12 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="text-center max-w-2xl">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center">
              <Leaf className="h-10 w-10 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-amber-800 dark:text-amber-400">
            Welcome to Farm Marketplace
          </h1>
          <p className="text-lg mb-8 text-muted-foreground">
            Connect your wallet to start buying fresh produce directly from
            local farmers or sell your farm products to customers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <WalletConnect onRoleSelect={setRole} />
            <OnboardingGuide />
            <ThemeToggle />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <ShoppingBasket className="h-10 w-10 text-green-600 dark:text-green-400 mb-4" />
                <h3 className="font-medium text-lg text-green-800 dark:text-green-300 mb-2">
                  Buy Fresh Produce
                </h3>
                <p className="text-green-700 dark:text-green-400">
                  Browse and purchase fresh, locally grown produce directly from
                  farmers.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Leaf className="h-10 w-10 text-amber-600 dark:text-amber-400 mb-4" />
                <h3 className="font-medium text-lg text-amber-800 dark:text-amber-300 mb-2">
                  Sell Your Products
                </h3>
                <p className="text-amber-700 dark:text-amber-400">
                  List your farm products and reach customers directly without
                  middlemen.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Wallet className="h-10 w-10 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="font-medium text-lg text-blue-800 dark:text-blue-300 mb-2">
                  Secure Transactions
                </h3>
                <p className="text-blue-700 dark:text-blue-400">
                  All transactions are secured through blockchain escrow for
                  buyer and seller protection.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Connected buyer view
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
}
