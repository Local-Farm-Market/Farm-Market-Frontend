"use client";

import { useState, useEffect } from "react";
import { SearchBar } from "@/src/components/home/search-bar";
import { ProductFilters } from "@/src/components/home/product-filters";
import { ProductCard } from "@/src/components/product/product-card";
import { Button } from "@/src/components/ui/button";
import { Slider } from "@/src/components/ui/slider";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Label } from "@/src/components/ui/label";
import { MapPin, Filter } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import { ProtectedRoute } from "@/src/components/auth/protected-route";
import { DashboardHeader } from "@/src/components/layout/dashboard-header";
import { useProducts } from "@/src/hooks/use-products";
import type { FormattedProduct } from "@/src/lib/types";

export default function MarketplacePage() {
  const { fetchAllProducts, isLoading: productsLoading } = useProducts();
  const [products, setProducts] = useState<FormattedProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<FormattedProduct[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 20]);
  const [maxDistance, setMaxDistance] = useState(20);
  const [organicOnly, setOrganicOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch all products on component mount
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const allProducts = await fetchAllProducts();
        setProducts(allProducts);
        setFilteredProducts(allProducts);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [fetchAllProducts]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(
      query,
      activeFilter,
      priceRange,
      maxDistance,
      organicOnly,
      availableOnly
    );
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    applyFilters(
      searchQuery,
      filter,
      priceRange,
      maxDistance,
      organicOnly,
      availableOnly
    );
  };

  const applyFilters = (
    query: string,
    category: string,
    price: number[],
    distance: number,
    organic: boolean,
    available: boolean
  ) => {
    let filtered = [...products];

    // Apply search query filter
    if (query) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          (product.location &&
            product.location.toLowerCase().includes(query.toLowerCase()))
      );
    }

    // Apply category filter
    if (category && category !== "All") {
      filtered = filtered.filter((product) => product.category === category);
    }

    // Apply price range filter
    filtered = filtered.filter(
      (product) => product.price >= price[0] && product.price <= price[1]
    );

    // Apply organic filter
    if (organic) {
      filtered = filtered.filter((product) => product.isOrganic);
    }

    // Apply availability filter
    if (available) {
      filtered = filtered.filter(
        (product) => product.isAvailable && Number(product.stockQuantity) > 0
      );
    }

    setFilteredProducts(filtered);
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
    applyFilters(
      searchQuery,
      activeFilter,
      value,
      maxDistance,
      organicOnly,
      availableOnly
    );
  };

  const handleDistanceChange = (value: number[]) => {
    setMaxDistance(value[0]);
    applyFilters(
      searchQuery,
      activeFilter,
      priceRange,
      value[0],
      organicOnly,
      availableOnly
    );
  };

  const handleOrganicChange = (checked: boolean) => {
    setOrganicOnly(checked);
    applyFilters(
      searchQuery,
      activeFilter,
      priceRange,
      maxDistance,
      checked,
      availableOnly
    );
  };

  const handleAvailableChange = (checked: boolean) => {
    setAvailableOnly(checked);
    applyFilters(
      searchQuery,
      activeFilter,
      priceRange,
      maxDistance,
      organicOnly,
      checked
    );
  };

  return (
    <ProtectedRoute requireAuth={true} requireRole="buyer">
      <div className="py-6">
        <DashboardHeader title="Marketplace" />

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 md:w-auto w-full mt-2 md:mt-0"
              >
                <Filter className="h-4 w-4" />
                Advanced Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Refine your search with additional filters
                </SheetDescription>
              </SheetHeader>
              <div className="py-6 space-y-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Price Range</h3>
                  <div className="pt-4">
                    <Slider
                      defaultValue={[0, 20]}
                      max={20}
                      step={0.5}
                      value={priceRange}
                      onValueChange={handlePriceChange}
                    />
                    <div className="flex justify-between mt-2">
                      <span>${priceRange[0].toFixed(2)}</span>
                      <span>${priceRange[1].toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Maximum Distance</h3>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Within {maxDistance} miles
                    </span>
                  </div>
                  <div className="pt-4">
                    <Slider
                      defaultValue={[20]}
                      max={50}
                      step={1}
                      value={[maxDistance]}
                      onValueChange={handleDistanceChange}
                    />
                    <div className="flex justify-between mt-2">
                      <span>0 miles</span>
                      <span>50 miles</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="organic"
                      checked={organicOnly}
                      onCheckedChange={handleOrganicChange}
                    />
                    <Label htmlFor="organic">Organic products only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="available"
                      checked={availableOnly}
                      onCheckedChange={handleAvailableChange}
                    />
                    <Label htmlFor="available">Available products only</Label>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={() =>
                    applyFilters(
                      searchQuery,
                      activeFilter,
                      priceRange,
                      maxDistance,
                      organicOnly,
                      availableOnly
                    )
                  }
                >
                  Apply Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <ProductFilters onFilterChange={handleFilterChange} />

        {loading || productsLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No products found matching your criteria.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("All");
                setPriceRange([0, 20]);
                setMaxDistance(20);
                setOrganicOnly(false);
                setAvailableOnly(false);
                setFilteredProducts(products);
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
