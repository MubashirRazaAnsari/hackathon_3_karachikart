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
      <ProviderNavigation />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
} 