'use client';

import { useState, useEffect } from 'react';
import {
  FaShoppingBag,
  FaBox,
  FaUsers,
  FaDollarSign,
  FaChartLine,
} from 'react-icons/fa';
import { client } from '@/sanity/lib/client';

interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  totalRevenue: number;
  recentOrders: any[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch total orders
      const totalOrders = await client.fetch(`count(*[_type == "order"])`);

      // Fetch total products
      const totalProducts = await client.fetch(`count(*[_type == "newProduct"])`);

      // Fetch total customers
      const totalCustomers = await client.fetch(`count(*[_type == "user"])`);

      // Fetch total revenue
      const revenue = await client.fetch(
        `*[_type == "order"]{total}`,
      );
      const totalRevenue = revenue.reduce(
        (sum: number, order: any) => sum + (order.total || 0),
        0
      );

      // Fetch recent orders
      const recentOrders = await client.fetch(
        `*[_type == "order"] | order(createdAt desc)[0...5]{
          _id,
          orderNumber,
          createdAt,
          status,
          total,
          shippingAddress->{fullName}
        }`
      );

      setStats({
        totalOrders,
        totalProducts,
        totalCustomers,
        totalRevenue,
        recentOrders,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Orders</p>
              <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
            </div>
            <FaShoppingBag className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Products</p>
              <h3 className="text-2xl font-bold">{stats.totalProducts}</h3>
            </div>
            <FaBox className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Customers</p>
              <h3 className="text-2xl font-bold">{stats.totalCustomers}</h3>
            </div>
            <FaUsers className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold">
                ${stats.totalRevenue.toFixed(2)}
              </h3>
            </div>
            <FaDollarSign className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-bold">Recent Orders</h2>
        </div>
        <div className="divide-y">
          {stats.recentOrders.map((order) => (
            <div key={order._id} className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Order #{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
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
  );
} 