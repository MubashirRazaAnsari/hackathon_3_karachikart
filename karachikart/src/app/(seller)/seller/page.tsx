'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { FaBox, FaDollarSign, FaChartLine, FaUsers, FaSpinner } from 'react-icons/fa';
import { client } from '@/sanity/lib/client';
import { toast } from 'react-hot-toast';

interface DashboardStats {
  totalProducts: number;
  totalSales: number;
  totalRevenue: number;
  averageRating: number;
  recentSales: any[];
}

export default function SellerDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
    averageRating: 0,
    recentSales: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = useCallback(async () => {
    try {
      const query = `{
        "totalProducts": count(*[_type in ["newProduct", "secondhandProduct"] && seller._ref == $sellerId]),
        "totalSales": count(*[_type == "order" && seller._ref == $sellerId]),
        "totalRevenue": *[_type == "order" && seller._ref == $sellerId] | order(_createdAt desc) {total}[].total,
        "averageRating": *[_type == "review" && product->seller._ref == $sellerId] | order(_createdAt desc) {rating}[].rating,
        "recentSales": *[_type == "order" && seller._ref == $sellerId] | order(_createdAt desc)[0...5] {
          _id,
          product->{
            name,
            price,
            productImage
          },
          buyer->{
            name,
            email
          },
          total,
          status,
          _createdAt
        }
      }`;

      const data = await client.fetch(query, {
        sellerId: session?.user?.id
      });

      // Calculate totals
      const revenue = data.totalRevenue.reduce((sum: number, total: number) => sum + (total || 0), 0);
      const avgRating = data.averageRating.length 
        ? data.averageRating.reduce((sum: number, rating: number) => sum + (rating || 0), 0) / data.averageRating.length 
        : 0;

      setStats({
        ...data,
        totalRevenue: revenue,
        averageRating: avgRating
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  // First useEffect for initial load
  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  // Second useEffect for real-time updates
  useEffect(() => {
    const subscription = client
      .listen('*[_type == "order" && seller._ref == $sellerId]', 
        { sellerId: session?.user?.id }
      )
      .subscribe(() => {
        fetchDashboardStats();
      });

    return () => subscription.unsubscribe();
  }, [session?.user?.id, fetchDashboardStats]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-blue-100 rounded-full">
              <FaBox className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-lg sm:text-2xl font-bold">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-green-100 rounded-full">
              <FaDollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-lg sm:text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-yellow-100 rounded-full">
              <FaChartLine className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Sales</p>
              <p className="text-lg sm:text-2xl font-bold">{stats.totalSales}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-purple-100 rounded-full">
              <FaUsers className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Rating</p>
              <p className="text-lg sm:text-2xl font-bold">{stats.averageRating.toFixed(1)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sales */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 sm:p-6 border-b">
          <h2 className="text-base sm:text-lg font-medium">Recent Sales</h2>
        </div>
        <div className="overflow-x-auto">
          <div className="divide-y min-w-[600px] lg:min-w-full">
            {stats.recentSales.map((sale) => (
              <div key={sale._id} className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <p className="font-medium">{sale.product.name}</p>
                    <p className="text-sm text-gray-500">{sale.buyer.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(sale._createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${sale.total.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">{sale.status}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 