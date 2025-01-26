'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FaBox,
  FaHeart,
  FaCog,
  FaMapMarkerAlt,
  FaCreditCard,
} from 'react-icons/fa';

const menuItems = [
  {
    icon: FaBox,
    label: 'My Orders',
    href: '/profile/orders',
    description: 'Track and manage your orders',
  },
  {
    icon: FaHeart,
    label: 'Wishlist',
    href: '/wishlist',
    description: 'View your saved items',
  },
  {
    icon: FaMapMarkerAlt,
    label: 'Addresses',
    href: '/profile/addresses',
    description: 'Manage your shipping addresses',
  },
  {
    icon: FaCreditCard,
    label: 'Payment Methods',
    href: '/profile/payment',
    description: 'Manage your payment options',
  },
  {
    icon: FaCog,
    label: 'Settings',
    href: '/profile/settings',
    description: 'Update your account preferences',
  },
];

const recentOrders = [
  {
    id: 'ORD-001',
    date: '2024-03-15',
    total: 299.99,
    status: 'Delivered',
  },
  {
    id: 'ORD-002',
    date: '2024-03-10',
    total: 149.99,
    status: 'Processing',
  },
];

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
        <p className="text-gray-600 mb-4">
          You need to be signed in to view your profile
        </p>
        <Link
          href="/auth/signin"
          className="inline-block bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24">
            <Image
              src={session.user?.image || '/placeholder-avatar.jpg'}
              alt={session.user?.name || 'User'}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{session.user?.name}</h1>
            <p className="text-gray-600">{session.user?.email}</p>
            <p className="text-sm text-gray-500 mt-1">Member since March 2024</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Quick Links */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{item.label}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Orders */}
        <div>
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          <div className="bg-white rounded-lg shadow divide-y">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">Order #{order.id}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Total: ${order.total.toFixed(2)}
                </p>
                <Link
                  href={`/profile/orders/${order.id}`}
                  className="text-blue-500 text-sm hover:text-blue-600 mt-2 inline-block"
                >
                  View Details
                </Link>
              </div>
            ))}
            <div className="p-4">
              <Link
                href="/profile/orders"
                className="text-blue-500 hover:text-blue-600 text-sm"
              >
                View All Orders →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 