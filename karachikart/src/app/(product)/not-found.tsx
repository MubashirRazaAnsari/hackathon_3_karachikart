import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
      <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
      <Link
        href="/"
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
      >
        Return Home
      </Link>
    </div>
  );
} 