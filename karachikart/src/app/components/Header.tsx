'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Logo
          </Link>

          <div className="flex items-center gap-4">
            {session?.user?.role === 'provider' && (
              <Link 
                href="/provider" 
                className="text-blue-600 hover:text-blue-700"
              >
                Provider Dashboard
              </Link>
            )}
            {/* Other nav items */}
          </div>
        </nav>
      </div>
    </header>
  );
} 