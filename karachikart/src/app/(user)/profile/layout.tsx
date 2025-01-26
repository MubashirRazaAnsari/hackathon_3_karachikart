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
      <ProfileNavigation />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <Breadcrumb />
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
} 