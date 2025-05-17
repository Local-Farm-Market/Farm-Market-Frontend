// components/product/virtualized-product-grid.tsx
"use client";

import { useRef, useEffect, useState } from "react";
import { FixedSizeGrid as Grid } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { ProductCard } from "@/src/components/product/product-card";
import type { FormattedProduct } from "@/src/lib/types";

interface VirtualizedProductGridProps {
  products: FormattedProduct[];
}

export function VirtualizedProductGrid({
  products,
}: VirtualizedProductGridProps) {
  const [columnCount, setColumnCount] = useState(4);
  const [key, setKey] = useState(0); // Add a key state to force remount
  const gridRef = useRef<Grid>(null);

  // Update column count based on screen size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let newColumnCount = 4;

      if (width < 640) {
        newColumnCount = 1;
      } else if (width < 768) {
        newColumnCount = 2;
      } else if (width < 1024) {
        newColumnCount = 3;
      } else {
        newColumnCount = 4;
      }

      if (newColumnCount !== columnCount) {
        setColumnCount(newColumnCount);
        // Force grid remount when column count changes
        setKey((prevKey) => prevKey + 1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [columnCount]);

  // Calculate row count
  const rowCount = Math.ceil(products.length / columnCount);

  return (
    <div className="h-[800px] w-full mt-6">
      <AutoSizer>
        {({ height, width }) => (
          <Grid
            key={key} // Use key to force remount when column count changes
            ref={gridRef}
            columnCount={columnCount}
            columnWidth={width / columnCount}
            height={height}
            rowCount={rowCount}
            rowHeight={400} // Adjust based on your card height
            width={width}
            itemData={{
              products,
              columnCount,
            }}
          >
            {({ columnIndex, rowIndex, style, data }) => {
              const index = rowIndex * data.columnCount + columnIndex;
              if (index >= data.products.length) {
                return null;
              }

              const product = data.products[index];

              return (
                <div style={style} className="p-3">
                  <ProductCard product={product} />
                </div>
              );
            }}
          </Grid>
        )}
      </AutoSizer>
    </div>
  );
}
