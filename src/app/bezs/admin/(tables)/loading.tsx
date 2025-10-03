// apps-table-skeleton.tsx
function AppsTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="w-full border rounded-md overflow-hidden">
      {/* Table header skeleton */}
      <div className="grid grid-cols-3 gap-2 p-2 border-b bg-gray-100 dark:bg-gray-800">
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>

      {/* Table rows skeleton */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="grid grid-cols-3 gap-2 p-2">
            <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="space-y-8 mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold animate-pulse bg-gray-300 h-6 w-1/3 rounded"></h1>
        <p className="text-sm animate-pulse bg-gray-300 h-4 w-1/4 rounded"></p>
      </div>
      <AppsTableSkeleton rows={4} />
    </div>
  );
}
