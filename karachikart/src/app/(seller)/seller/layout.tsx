import { generateMetadata, baseViewport } from '@/lib/metadata';
import SellerNavigation from '@/app/components/seller/SellerNavigation';

export const metadata = generateMetadata(
  'Seller Dashboard',
  'Manage your seller account and listings'
);

export const viewport = baseViewport;

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex pt-2">
        <SellerNavigation />
        <main className="flex-1 p-2 overflow-auto max-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
} 