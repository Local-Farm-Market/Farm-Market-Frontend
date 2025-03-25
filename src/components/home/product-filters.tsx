"use client";

import { useState } from "react";
import { Badge } from "@/src/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/src/components/ui/scroll-area";
import { cn } from "@/src/lib/utils";
import { Leaf, Wheat, Apple, MilkIcon as Cow, Egg, Carrot } from "lucide-react";

const categories = [
  { name: "All", icon: Leaf },
  { name: "Vegetables", icon: Carrot },
  { name: "Fruits", icon: Apple },
  { name: "Dairy", icon: Cow },
  { name: "Grains", icon: Wheat },
  { name: "Meat", icon: Cow },
  { name: "Poultry", icon: Egg },
  { name: "Organic", icon: Leaf },
  { name: "Local", icon: Leaf },
];

export function ProductFilters({
  onFilterChange,
}: {
  onFilterChange: (filter: string) => void;
}) {
  const [activeFilter, setActiveFilter] = useState("All");

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    onFilterChange(filter);
  };

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex space-x-2 py-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Badge
              key={category.name}
              variant="outline"
              className={cn(
                "cursor-pointer px-3 py-1 text-sm flex items-center gap-1",
                activeFilter === category.name
                  ? "bg-amber-600 text-white hover:bg-amber-700 border-amber-600"
                  : "bg-amber-50 text-amber-800 hover:bg-amber-100 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800 dark:hover:bg-amber-900/50"
              )}
              onClick={() => handleFilterClick(category.name)}
            >
              <Icon className="h-3 w-3" />
              {category.name}
            </Badge>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
