import Image from 'next/image';
import Link from 'next/link';
import { generateMetadata, baseViewport } from '@/lib/metadata';

export default function NotFound() {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center">
      <Image src={'/next.svg'} alt='' width={200} height={200} className='my-3' />
      <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link
        href="/"
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
      >
        Return Home
      </Link>
    </div>
  );
}

export const metadata = generateMetadata(
  'Page Not Found',
  'The requested page could not be found'
);

export const viewport = baseViewport; 