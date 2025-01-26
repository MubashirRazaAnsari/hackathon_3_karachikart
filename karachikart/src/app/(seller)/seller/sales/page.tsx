'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { client } from '@/sanity/lib/client';
import { toast } from 'react-hot-toast';
import { FaSearch, FaFilter, FaSpinner, FaBox, FaCalendar, FaDollarSign } from 'react-icons/fa';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';

interface Sale {
  _id: string;
  product: {
    name: string;
    productImage: any;
    price: number;
  };
  buyer: {
    name: string;
    email: string;
  };
  quantity: number;
  total: number;
  status: string;
  _createdAt: string;
}

export default function SalesHistory() {
  const { data: session } = useSession();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('all');

  // Add real-time sales updates
  useEffect(() => {
    const subscription = client
      .listen('*[_type == "order" && seller._ref == $sellerId && status == "delivered"]', 
        { sellerId: session?.user?.id }
      )
      .subscribe((update) => {
        fetchSales();
        toast.success('New sale recorded!');
      });

    return () => subscription.unsubscribe();
  });

  const fetchSales = useCallback(async () => {
    try {
      let query = `*[_type == "order" && seller._ref == $sellerId]`;

      // Add status filter
      if (filter !== 'all') {
        query += ` && status == "${filter}"`;
      }

      // Add date range filter
      if (dateRange !== 'all') {
        const today = new Date();
        let startDate = new Date();
        
        switch (dateRange) {
          case 'today':
            startDate.setHours(0, 0, 0, 0);
            break;
          case 'week':
            startDate.setDate(today.getDate() - 7);
            break;
          case 'month':
            startDate.setMonth(today.getMonth() - 1);
            break;
          case 'year':
            startDate.setFullYear(today.getFullYear() - 1);
            break;
        }

        query += ` && _createdAt >= "${startDate.toISOString()}"`;
      }

      query += ` | order(_createdAt desc) {
        _id,
        product->{
          name,
          productImage,
          price
        },
        buyer->{
          name,
          email
        },
        quantity,
        total,
        status,
        _createdAt
      }`;

      const data = await client.fetch(query, {
        sellerId: session?.user?.id
      });

      setSales(data);
    } catch (error) {
      console.error('Error fetching sales:', error);
      toast.error('Failed to load sales');
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id, filter, dateRange]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchSales();
    }
  }, [session?.user?.id, filter, dateRange, fetchSales]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FaSpinner className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const filteredSales = sales.filter(sale => 
    sale.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.buyer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTotalRevenue = () => {
    return filteredSales.reduce((sum, sale) => sum + (sale.total || 0), 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">Sales History</h1>
        <div className="flex items-center gap-2 text-lg font-semibold text-green-600">
          <FaDollarSign className="h-5 w-5" />
          <span>${getTotalRevenue().toFixed(2)}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search sales..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="delivered">Delivered</option>
              <option value="refunded">Refunded</option>
            </select>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="hidden md:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="md:hidden px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <FaCalendar className="h-4 w-4" />
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSales.map((sale) => (
                <tr key={sale._id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 flex-shrink-0">
                        <Image
                          src={urlFor(sale.product.productImage).url()}
                          alt={sale.product.name}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {sale.product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Qty: {sale.quantity}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="text-sm text-gray-900">{sale.buyer.name}</div>
                    <div className="text-sm text-gray-500">{sale.buyer.email}</div>
                  </td>
                  <td className="hidden md:table-cell px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(sale._createdAt).toLocaleDateString()}
                  </td>
                  <td className="md:hidden px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(sale._createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      sale.status === 'delivered' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {sale.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${sale.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSales.length === 0 && (
          <div className="text-center py-12">
            <FaBox className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">
              No sales found matching your criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 