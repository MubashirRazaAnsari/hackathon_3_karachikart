'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  FaUser,
  FaBox,
  FaHeart,
  FaMapMarkerAlt,
  FaCreditCard,
  FaCog,
} from 'react-icons/fa';
import Breadcrumb from '@/app/components/shared/Breadcrumb';

const menuItems = [
  {
    icon: FaUser,
    label: 'Overview',
    href: '/profile',
  },
  {
    icon: FaBox,
    label: 'Orders',
    href: '/profile/orders',
  },
  {
    icon: FaHeart,
    label: 'Wishlist',
    href: '/wishlist',
  },
  {
    icon: FaMapMarkerAlt,
    label: 'Addresses',
    href: '/profile/addresses',
  },
  {
    icon: FaCreditCard,
    label: 'Payment Methods',
    href: '/profile/payment',
  },
  {
    icon: FaCog,
    label: 'Settings',
    href: '/profile/settings',
  },
];

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <nav className="bg-white rounded-lg shadow p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-grow">
          <Breadcrumb />
          {children}
        </main>
      </div>
    </div>
  );
} 