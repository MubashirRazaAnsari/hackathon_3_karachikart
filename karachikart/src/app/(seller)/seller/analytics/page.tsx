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
import { FaSpinner } from 'react-icons/fa';

interface AnalyticsData {
  revenueByMonth: any[];
  salesByProduct: any[];
  salesByCategory: any[];
  customerStats: any[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function SellerAnalytics() {
  const { data: session } = useSession();
  const [timeframe, setTimeframe] = useState('month');
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    revenueByMonth: [],
    salesByProduct: [],
    salesByCategory: [],
    customerStats: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      // Revenue by month
      const revenueQuery = `*[_type == "order" && seller._ref == $sellerId] {
        "month": _createdAt[0..6],
        total,
        status
      }`;

      // Sales by product
      const productQuery = `*[_type == "order" && seller._ref == $sellerId] {
        "productName": product->name,
        quantity,
        total
      }`;

      // Sales by category
      const categoryQuery = `*[_type == "order" && seller._ref == $sellerId] {
        "category": product->category->name,
        total
      }`;

      // Customer stats
      const customerQuery = `{
        "totalCustomers": count(distinct *[_type == "order" && seller._ref == $sellerId].buyer._ref),
        "repeatCustomers": count(distinct *[_type == "order" && seller._ref == $sellerId && count(*[_type == "order" && seller._ref == ^.seller._ref && buyer._ref == ^.buyer._ref]) > 1].buyer._ref),
        "averageOrderValue": avg(*[_type == "order" && seller._ref == $sellerId].total)
      }`;

      const [revenue, products, categories, customers] = await Promise.all([
        client.fetch(revenueQuery, { sellerId: session?.user?.id }),
        client.fetch(productQuery, { sellerId: session?.user?.id }),
        client.fetch(categoryQuery, { sellerId: session?.user?.id }),
        client.fetch(customerQuery, { sellerId: session?.user?.id }),
      ]);

      // Process revenue data
      const revenueByMonth = revenue.reduce((acc: any, curr: any) => {
        const existingMonth = acc.find((item: any) => item.month === curr.month);
        if (existingMonth) {
          existingMonth.revenue += curr.total;
          existingMonth.orders += 1;
        } else {
          acc.push({
            month: curr.month,
            revenue: curr.total,
            orders: 1,
          });
        }
        return acc;
      }, []).sort((a: any, b: any) => a.month.localeCompare(b.month));

      // Process product data
      const salesByProduct = products.reduce((acc: any, curr: any) => {
        const existing = acc.find((item: any) => item.name === curr.productName);
        if (existing) {
          existing.sales += curr.total;
          existing.quantity += curr.quantity;
        } else {
          acc.push({
            name: curr.productName,
            sales: curr.total,
            quantity: curr.quantity,
          });
        }
        return acc;
      }, []).sort((a: any, b: any) => b.sales - a.sales).slice(0, 5);

      // Process category data
      const salesByCategory = categories.reduce((acc: any, curr: any) => {
        const existing = acc.find((item: any) => item.name === curr.category);
        if (existing) {
          existing.value += curr.total;
        } else {
          acc.push({
            name: curr.category || 'Uncategorized',
            value: curr.total,
          });
        }
        return acc;
      }, []);

      setAnalytics({
        revenueByMonth,
        salesByProduct,
        salesByCategory,
        customerStats: [
          { name: 'Total Customers', value: customers.totalCustomers },
          { name: 'Repeat Customers', value: customers.repeatCustomers },
          { name: 'Avg Order Value', value: customers.averageOrderValue || 0 },
        ],
      });
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
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FaSpinner className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">Analytics Dashboard</h1>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="w-full sm:w-auto rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h2 className="text-base sm:text-lg font-medium mb-4">Revenue Trend</h2>
          <div className="h-[300px] sm:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0088FE"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#00C49F"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h2 className="text-base sm:text-lg font-medium mb-4">Top Products</h2>
          <div className="h-[300px] sm:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.salesByProduct}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#0088FE" />
                <Bar dataKey="quantity" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by Category */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h2 className="text-base sm:text-lg font-medium mb-4">Sales by Category</h2>
          <div className="h-[300px] sm:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.salesByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => 
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {analytics.salesByCategory.map((entry: any, index: number) => (
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

        {/* Customer Stats */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h2 className="text-base sm:text-lg font-medium mb-4">Customer Insights</h2>
          <div className="space-y-6">
            {analytics.customerStats.map((stat, index) => (
              <div key={stat.name} className="flex justify-between items-center">
                <span className="text-gray-600">{stat.name}</span>
                <span className="text-lg sm:text-2xl font-bold">
                  {stat.name === 'Avg Order Value' 
                    ? `$${stat.value.toFixed(2)}`
                    : stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 