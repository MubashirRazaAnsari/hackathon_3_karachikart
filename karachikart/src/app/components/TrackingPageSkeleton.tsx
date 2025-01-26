export default function TrackingPageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
        <div className="h-6 w-72 bg-gray-200 rounded"></div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-5 w-48 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 