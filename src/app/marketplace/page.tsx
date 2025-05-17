// app/marketplace/page.tsx
"use client";

import { useState, useCallback, useMemo } from "react";
import { useDebounce } from "use-debounce";
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
import { Pagination } from "@/src/components/ui/pagination";
import { VirtualizedProductGrid } from "@/src/components/product/virtualized-product-grid";
import type { FormattedProduct } from "@/src/lib/types";

export default function MarketplacePage() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [activeFilter, setActiveFilter] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 20]);
  const [maxDistance, setMaxDistance] = useState(20);
  const [organicOnly, setOrganicOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);

  // Get products with pagination
  const { useProductsWithPagination } = useProducts();
  const { products, total, isLoading } = useProductsWithPagination(
    currentPage,
    itemsPerPage,
    activeFilter !== "All" ? activeFilter : undefined
  );

  // Memoized filtered products
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product) => {
      // Search query filter
      if (
        debouncedSearchQuery &&
        !product.name
          .toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase()) &&
        !(
          product.location &&
          product.location
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase())
        )
      ) {
        return false;
      }

      // Price range filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }

      // Organic filter
      if (organicOnly && !product.isOrganic) {
        return false;
      }

      // Availability filter
      if (
        availableOnly &&
        (!product.isAvailable || product.stockQuantity <= 0)
      ) {
        return false;
      }

      return true;
    });
  }, [products, debouncedSearchQuery, priceRange, organicOnly, availableOnly]);

  // Handlers
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  }, []);

  const handleFilterChange = useCallback((filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(1); // Reset to first page on filter change
  }, []);

  const handlePriceChange = useCallback((value: number[]) => {
    setPriceRange(value);
  }, []);

  const handleDistanceChange = useCallback((value: number[]) => {
    setMaxDistance(value[0]);
  }, []);

  const handleOrganicChange = useCallback((checked: boolean) => {
    setOrganicOnly(checked);
  }, []);

  const handleAvailableChange = useCallback((checked: boolean) => {
    setAvailableOnly(checked);
  }, []);

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setActiveFilter("All");
    setPriceRange([0, 20]);
    setMaxDistance(20);
    setOrganicOnly(false);
    setAvailableOnly(false);
    setCurrentPage(1);
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil(total / itemsPerPage);

  return (
    <ProtectedRoute requireAuth={true} requireRole="buyer">
      <div className="py-6">
        <DashboardHeader title="Marketplace" />

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} initialValue={searchQuery} />
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

                <Button className="w-full" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <ProductFilters
          onFilterChange={handleFilterChange}
          activeFilter={activeFilter}
        />

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-80 rounded-lg bg-gray-100 animate-pulse"
              ></div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            <VirtualizedProductGrid products={filteredProducts} />

            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No products found matching your criteria.
            </p>
            <Button variant="outline" className="mt-4" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
