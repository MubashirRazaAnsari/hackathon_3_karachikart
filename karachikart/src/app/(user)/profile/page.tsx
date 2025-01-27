'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { client } from '@/sanity/lib/client';
import { toast } from 'react-hot-toast';
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

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [userStats, setUserStats] = useState({
    totalOrders: 0,
    wishlistItems: 0,
    savedAddresses: 0,
    paymentMethods: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    try {
      // Fetch user stats
      const statsQuery = `{
        "totalOrders": count(*[_type == "order" && user._ref == $userId]),
        "wishlistItems": count(*[_type == "wishlistItem" && user._ref == $userId]),
        "savedAddresses": count(*[_type == "address" && user._ref == $userId]),
        "paymentMethods": count(*[_type == "paymentMethod" && user._ref == $userId]),
        "recentOrders": *[_type == "order" && user._ref == $userId] | order(_createdAt desc)[0...5] {
          _id,
          orderNumber,
          total,
          status,
          _createdAt
        }
      }`;

      const data = await client.fetch(statsQuery, {
        userId: session?.user.id
      });

      setUserStats({
        totalOrders: data.totalOrders,
        wishlistItems: data.wishlistItems,
        savedAddresses: data.savedAddresses,
        paymentMethods: data.paymentMethods,
      });
      setRecentOrders(data.recentOrders);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserData();
    }
  }, [session, fetchUserData]);

  if (status === 'loading' || loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
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
    <div>
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
            <p className="text-sm text-gray-500 mt-1">
              Member since {session.user?._createdAt ? new Date(session.user._createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Stats Grid */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold mb-4">Account Overview</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <FaBox className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold">{userStats.totalOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <FaHeart className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Wishlist Items</p>
                  <p className="text-2xl font-bold">{userStats.wishlistItems}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <FaMapMarkerAlt className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Saved Addresses</p>
                  <p className="text-2xl font-bold">{userStats.savedAddresses}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <FaCreditCard className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Methods</p>
                  <p className="text-2xl font-bold">{userStats.paymentMethods}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div>
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          <div className="bg-white rounded-lg shadow divide-y">
            {recentOrders.map((order: any) => (
              <div key={order._id} className="p-4">
                <div className="flex flex-wrap justify-between items-start mb-2 gap-2">
                  <div className="max-w-[70%]">
                    <p className="font-base overflow-hidden text-ellipsis whitespace-nowrap">
                      {order.orderNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(order._createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                    order.status === 'completed' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Total: ${order.total.toFixed(2)}
                </p>
                <Link
                  href={`/profile/orders/${order._id}`}
                  className="text-blue-500 text-sm hover:text-blue-600 mt-2 inline-block"
                >
                  View Details
                </Link>
              </div>
            ))}
            {recentOrders.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                No orders found
              </div>
            )}
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