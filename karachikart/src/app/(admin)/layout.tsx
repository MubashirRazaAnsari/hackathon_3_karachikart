'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session || session.user.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-2">
          <Link 
            href="/dashboard"
            className="block py-2 px-4 rounded hover:bg-gray-700"
          >
            Dashboard
          </Link>
          <Link 
            href="/products"
            className="block py-2 px-4 rounded hover:bg-gray-700"
          >
            Products
          </Link>
          <Link 
            href="/orders"
            className="block py-2 px-4 rounded hover:bg-gray-700"
          >
            Orders
          </Link>
          <Link 
            href="/users"
            className="block py-2 px-4 rounded hover:bg-gray-700"
          >
            Users
          </Link>
          <Link 
            href="/analytics"
            className="block py-2 px-4 rounded hover:bg-gray-700"
          >
            Analytics
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
} 