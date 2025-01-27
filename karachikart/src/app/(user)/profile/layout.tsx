import { generateMetadata, baseViewport } from '@/lib/metadata';
import ProfileNavigation from '@/app/components/profile/ProfileNavigation';
import Breadcrumb from '@/app/components/shared/Breadcrumb';

export const metadata = generateMetadata(
  'Profile',
  'Manage your profile and listings'
);

export const viewport = baseViewport;

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex pt-2">
        <ProfileNavigation />
        <main className="flex-1 p-2 overflow-auto max-h-[calc(100vh-4rem)]">
          <Breadcrumb />
          <div className="bg-white rounded-lg shadow p-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 