export default function ServiceListingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-48 bg-gray-200 animate-pulse" />
          <div className="p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
            </div>
            <div className="flex justify-between items-center">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 