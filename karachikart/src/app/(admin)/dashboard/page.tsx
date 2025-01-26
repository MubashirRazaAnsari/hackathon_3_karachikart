'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { client } from '@/sanity/lib/client';
import { toast } from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';

interface DashboardData {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  recentOrders: any[];
  recentUsers: any[];
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    recentOrders: [],
    recentUsers: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    // Set up polling for real-time updates
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const query = `{
        "totalUsers": count(*[_type == "user"]),
        "totalOrders": count(*[_type == "order"]),
        "totalRevenue": *[_type == "order"] | order(_createdAt desc) {total}[].total,
        "totalProducts": count(*[_type == "product"]),
        "recentOrders": *[_type == "order"] | order(_createdAt desc)[0...5] {
          _id,
          orderNumber,
          user->{name, email},
          total,
          status,
          _createdAt
        },
        "recentUsers": *[_type == "user"] | order(_createdAt desc)[0...5] {
          _id,
          name,
          email,
          role,
          _createdAt
        }
      }`;

      const data = await client.fetch(query);

      // Calculate total revenue in JavaScript
      const totalRevenue = data.totalRevenue.reduce((sum: number, total: number) => sum + (total || 0), 0);

      setDashboardData({
        ...data,
        totalRevenue
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <button
          onClick={fetchDashboardData}
          className="text-blue-500 hover:text-blue-600"
        >
          Refresh Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-sm text-gray-500">Total Users</h3>
          <p className="text-xl sm:text-2xl font-bold">{dashboardData.totalUsers}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-sm text-gray-500">Total Orders</h3>
          <p className="text-xl sm:text-2xl font-bold">{dashboardData.totalOrders}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-sm text-gray-500">Total Revenue</h3>
          <p className="text-xl sm:text-2xl font-bold">
            ${dashboardData.totalRevenue?.toFixed(2) || '0.00'}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-sm text-gray-500">Total Products</h3>
          <p className="text-xl sm:text-2xl font-bold">{dashboardData.totalProducts}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 sm:p-6 border-b">
            <h2 className="text-lg font-bold">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <div className="divide-y min-w-[600px] lg:min-w-full">
              {dashboardData.recentOrders.map((order) => (
                <div key={order._id} className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <p className="font-medium">Order #{order.orderNumber}</p>
                      <p className="text-sm text-gray-500">{order.user?.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order._createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${order.total.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{order.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 sm:p-6 border-b">
            <h2 className="text-lg font-bold">Recent Users</h2>
          </div>
          <div className="overflow-x-auto">
            <div className="divide-y min-w-[600px] lg:min-w-full">
              {dashboardData.recentUsers.map((user) => (
                <div key={user._id} className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-sm text-gray-500">
                        Joined {new Date(user._createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 