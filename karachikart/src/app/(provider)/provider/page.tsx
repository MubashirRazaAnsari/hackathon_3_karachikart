'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { FaUsers, FaCalendarCheck, FaStar, FaDollarSign } from 'react-icons/fa';
import { client } from '@/sanity/lib/client';
import { toast } from 'react-hot-toast';

interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  activeServices: number;
  recentBookings: any[];
}

export default function ProviderDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    totalRevenue: 0,
    averageRating: 0,
    activeServices: 0,
    recentBookings: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = useCallback(async () => {
    try {
      const query = `{
        "totalBookings": count(*[_type == "booking" && provider._ref == $providerId]),
        "totalRevenue": *[_type == "booking" && provider._ref == $providerId] | order(_createdAt desc) {price}[].price,
        "averageRating": *[_type == "review" && service->provider._ref == $providerId] | order(_createdAt desc) {rating}[].rating,
        "activeServices": count(*[_type == "service" && provider._ref == $providerId && status == "available"]),
        "recentBookings": *[_type == "booking" && provider._ref == $providerId] | order(_createdAt desc)[0...5] {
          _id,
          service->{name},
          user->{name, email},
          date,
          time,
          status,
          price
        }
      }`;

      const data = await client.fetch(query, {
        providerId: session?.user?.id
      });

      // Calculate totals
      const totalRevenue = data.totalRevenue.reduce((sum: number, price: number) => sum + (price || 0), 0);
      const avgRating = data.averageRating.length 
        ? data.averageRating.reduce((sum: number, rating: number) => sum + (rating || 0), 0) / data.averageRating.length 
        : 0;

      setStats({
        ...data,
        totalRevenue,
        averageRating: avgRating
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-8">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-blue-100 rounded-full">
              <FaCalendarCheck className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Bookings</p>
              <p className="text-lg sm:text-2xl font-bold">{stats.totalBookings}</p>
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
              <p className="text-lg sm:text-2xl font-bold">${stats.totalRevenue}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-yellow-100 rounded-full">
              <FaStar className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Rating</p>
              <p className="text-lg sm:text-2xl font-bold">{stats.averageRating.toFixed(1)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-purple-100 rounded-full">
              <FaUsers className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Services</p>
              <p className="text-lg sm:text-2xl font-bold">{stats.activeServices}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 sm:p-6 border-b">
          <h2 className="text-lg font-bold">Recent Bookings</h2>
        </div>
        <div className="overflow-x-auto">
          <div className="divide-y min-w-[600px] lg:min-w-full">
            {stats.recentBookings.map((booking) => (
              <div key={booking._id} className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <p className="font-medium">{booking.service.name}</p>
                    <p className="text-sm text-gray-500">{booking.user.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(booking.date).toLocaleDateString()} at {booking.time}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${booking.price}</p>
                    <p className="text-sm text-gray-500">{booking.status}</p>
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