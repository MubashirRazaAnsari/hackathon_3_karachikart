import { generateMetadata, baseViewport } from '@/lib/metadata';
import ProviderNavigation from '@/app/components/provider/ProviderNavigation';

export const metadata = generateMetadata(
  'Service Provider Dashboard',
  'Manage your service provider account and services'
);

export const viewport = baseViewport;

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex pt-2">
        <ProviderNavigation />
        <main className="flex-1 p-2 overflow-auto max-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
} 