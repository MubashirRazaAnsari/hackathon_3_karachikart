'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { 
  FaHome, 
  FaBox, 
  FaChartLine, 
  FaHistory, 
  FaCog, 
  FaShoppingCart, 
  FaBars, 
  FaTimes 
} from 'react-icons/fa';

const menuItems = [
  {
    icon: FaHome,
    label: 'Dashboard',
    href: '/seller',
  },
  {
    icon: FaBox,
    label: 'My Products',
    href: '/seller/products',
  },
  {
    icon: FaShoppingCart,
    label: 'Orders',
    href: '/seller/orders',
  },
  {
    icon: FaHistory,
    label: 'Sales History',
    href: '/seller/sales',
  },
  {
    icon: FaChartLine,
    label: 'Analytics',
    href: '/seller/analytics',
  },
  {
    icon: FaCog,
    label: 'Settings',
    href: '/seller/settings',
  },
];

export default function SellerNavigation() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  // Check if user is a seller or admin
  if (!session?.user?.role || (session.user.role !== 'seller' && session.user.role !== 'admin')) {
    redirect('/');
  }

  return (
    <div className="relative">
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
            <h2 className="text-xl sm:text-2xl font-bold mb-6">
              {session.user.role === 'admin' ? 'Admin View - Seller' : 'Seller Dashboard'}
            </h2>
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 py-2 px-4 rounded hover:bg-gray-700 transition-colors"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
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
    </div>
  );
} 