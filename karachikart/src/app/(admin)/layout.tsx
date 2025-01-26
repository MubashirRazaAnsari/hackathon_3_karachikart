import { generateMetadata, baseViewport } from '@/lib/metadata';
import AdminNavigation from '@/app/components/admin/AdminNavigation';

export const metadata = generateMetadata(
  'Admin Dashboard',
  'Manage your admin account and listings'
);

export const viewport = baseViewport;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavigation />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
} 