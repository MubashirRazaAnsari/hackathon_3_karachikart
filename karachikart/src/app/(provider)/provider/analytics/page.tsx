'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { client } from '@/sanity/lib/client';
import { toast } from 'react-hot-toast';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface Analytics {
  revenueByMonth: any[];
  bookingsByStatus: any[];
  popularServices: any[];
  customerSatisfaction: any[];
}

function processRevenueData(data: any[]) {
  return data.reduce((acc: any[], curr: any) => {
    const existingMonth = acc.find((item) => item.month === curr.month);
    if (existingMonth) {
      existingMonth.revenue += curr.revenue;
    } else {
      acc.push({ month: curr.month, revenue: curr.revenue });
    }
    return acc;
  }, []);
}

function processStatusData(data: any[]) {
  return data.reduce((acc: any[], curr: any) => {
    const existingStatus = acc.find((item) => item.name === curr.status);
    if (existingStatus) {
      existingStatus.value += 1;
    } else {
      acc.push({ name: curr.status, value: 1 });
    }
    return acc;
  }, []);
}

function processServicesData(data: any[]) {
  return data.reduce((acc: any[], curr: any) => {
    const existingService = acc.find((item) => item.name === curr.service);
    if (existingService) {
      existingService.bookings += 1;
    } else {
      acc.push({ name: curr.service, bookings: 1 });
    }
    return acc;
  }, []);
}

function processRatingsData(data: any[]) {
  return data.reduce((acc: any[], curr: any) => {
    const rating = Math.floor(curr.rating);
    const existingRating = acc.find((item) => item.name === `${rating} Star`);
    if (existingRating) {
      existingRating.value += 1;
    } else {
      acc.push({ name: `${rating} Star`, value: 1 });
    }
    return acc;
  }, []);
}

export default function ProviderAnalytics() {
  const { data: session } = useSession();
  const [timeframe, setTimeframe] = useState('month');
  const [analytics, setAnalytics] = useState<Analytics>({
    revenueByMonth: [],
    bookingsByStatus: [],
    popularServices: [],
    customerSatisfaction: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      // Revenue by month
      const revenueQuery = `*[_type == "booking" && provider._ref == $providerId && status != "cancelled"] | order(date asc) {
        "month": date[0..6],
        "revenue": price
      }`;

      // Bookings by status
      const statusQuery = `*[_type == "booking" && provider._ref == $providerId] {
        status
      }`;

      // Popular services
      const servicesQuery = `*[_type == "booking" && provider._ref == $providerId] {
        "service": service->name,
        price
      }`;

      // Customer satisfaction (ratings)
      const ratingsQuery = `*[_type == "review" && service->provider._ref == $providerId] {
        rating
      }`;

      const [revenue, status, services, ratings] = await Promise.all([
        client.fetch(revenueQuery, { providerId: session?.user?.id }),
        client.fetch(statusQuery, { providerId: session?.user?.id }),
        client.fetch(servicesQuery, { providerId: session?.user?.id }),
        client.fetch(ratingsQuery, { providerId: session?.user?.id }),
      ]);

      // Process the data for charts
      const processedData = {
        revenueByMonth: processRevenueData(revenue),
        bookingsByStatus: processStatusData(status),
        popularServices: processServicesData(services),
        customerSatisfaction: processRatingsData(ratings),
      };

      setAnalytics(processedData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Revenue Trend */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-4">Revenue Trend</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0088FE"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bookings by Status */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-4">Bookings by Status</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.bookingsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.bookingsByStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Services */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-4">Popular Services</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.popularServices}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="bookings" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Satisfaction */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-4">Customer Satisfaction</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.customerSatisfaction}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.customerSatisfaction.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}