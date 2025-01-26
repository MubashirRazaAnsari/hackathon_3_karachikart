import Link from 'next/link';
import { generateMetadata, baseViewport } from '@/lib/metadata';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="mb-4">The page you're looking for doesn't exist.</p>
        <Link 
          href="/"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}

export const metadata = generateMetadata(
  'Page Not Found',
  'The requested page could not be found'
);

export const viewport = baseViewport; 