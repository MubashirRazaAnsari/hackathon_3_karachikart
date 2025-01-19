export default function ProductListingSkeleton() {
  return (
    <div className="w-full animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow">
            <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 