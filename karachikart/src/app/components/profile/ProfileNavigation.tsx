'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import {
  FaUser,
  FaBox,
  FaHeart,
  FaMapMarkerAlt,
  FaCreditCard,
  FaCog,
  FaBars,
  FaTimes,
} from 'react-icons/fa';

const menuItems = [
  {
    icon: FaUser,
    label: 'Overview',
    href: '/profile',
    role: 'user'
  },
  {
    icon: FaBox,
    label: 'Orders',
    href: '/profile/orders',
    role: 'user'
  },
  {
    icon: FaHeart,
    label: 'Wishlist',
    href: '/wishlist',
    role: 'user'
  },
  {
    icon: FaMapMarkerAlt,
    label: 'Addresses',
    href: '/profile/addresses',
    role: 'user'
  },
  {
    icon: FaCreditCard,
    label: 'Payment Methods',
    href: '/profile/payment',
    role: 'user'
  },
  {
    icon: FaCog,
    label: 'Settings',
    href: '/profile/settings',
    role: 'user'
  },
] as const;

export default function ProfileNavigation() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  if (!session?.user?.role || (session.user.role !== 'user' && session.user.role !== 'admin')) {
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
          className={`fixed lg:sticky left-0 z-40 h-[calc(100vh-5rem)] w-64 bg-gray-800 text-white transform transition-transform rounded-lg duration-200 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0`}
        >
          <nav className="rounded-lg shadow p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = session.user.role === 'admin' ? true : session.user.role === item.role;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-opacity-50 z-30 rounded-lg lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
} 