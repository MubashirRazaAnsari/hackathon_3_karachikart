'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { FaBars, FaTimes, FaChartBar, FaBox, FaShoppingCart, FaUsers, FaCog } from 'react-icons/fa';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: FaChartBar },
  { href: '/products', label: 'Products', icon: FaBox },
  { href: '/orders', label: 'Orders', icon: FaShoppingCart },
  { href: '/users', label: 'Users', icon: FaUsers },
  { href: '/settings', label: 'Settings', icon: FaCog },
];

export default function AdminNavigation() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/auth/signin');
    },
  });

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  // Only allow admin access
  if (!session?.user?.role || session.user.role !== 'admin') {
    redirect('/');
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-24 left-4 z-50 p-2 rounded-md bg-gray-800 text-white lg:hidden"
      >
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className="flex pt-20">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky left-0 z-40 h-[calc(100vh-5rem)] w-64 bg-gray-800 text-white transform transition-transform duration-200 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0`}
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 py-2 px-4 rounded hover:bg-gray-700 transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </>
  );
} 