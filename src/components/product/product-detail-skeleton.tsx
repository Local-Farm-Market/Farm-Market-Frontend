// components/product/product-detail-skeleton.tsx
export function ProductDetailSkeleton() {
  return (
    <div className="py-6 max-w-4xl mx-auto">
      <div className="h-10 w-64 bg-gray-200 dark:bg-gray-800 rounded-md mb-6 animate-pulse"></div>

      <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded-md mb-6 animate-pulse"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image skeleton */}
        <div>
          <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg mb-4 animate-pulse"></div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse"
              ></div>
            ))}
          </div>
        </div>

        {/* Details skeleton */}
        <div>
          <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-800 rounded-md mb-4 animate-pulse"></div>
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-800 rounded-md mb-6 animate-pulse"></div>

          <div className="h-10 w-1/3 bg-gray-200 dark:bg-gray-800 rounded-md mb-4 animate-pulse"></div>
          <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-800 rounded-md mb-6 animate-pulse"></div>

          <div className="h-24 w-full bg-gray-200 dark:bg-gray-800 rounded-md mb-6 animate-pulse"></div>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse"></div>
            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse"></div>
            <div className="h-6 w-40 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse"></div>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse"></div>
            <div className="h-10 flex-1 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse"></div>
          </div>

          <div className="h-32 w-full bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse"></div>
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="mt-12">
        <div className="grid grid-cols-4 gap-2 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-10 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse"
            ></div>
          ))}
        </div>

        <div className="h-64 w-full bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
      </div>
    </div>
  );
}
