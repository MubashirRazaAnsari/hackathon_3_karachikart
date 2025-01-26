'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { FaCheck, FaTimes, FaClock, FaCalendar } from 'react-icons/fa';
import { client } from '@/sanity/lib/client';
import { toast } from 'react-hot-toast';

interface Booking {
  _id: string;
  service: {
    name: string;
    price: number;
  };
  user: {
    name: string;
    email: string;
  };
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function ProviderBookings() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchBookings = useCallback(async () => {
    try {
      const query = `*[_type == "booking" && provider._ref == $providerId ${
        filter !== 'all' ? `&& status == "${filter}"` : ''
      }] | order(date desc) {
        _id,
        service->{name, price},
        user->{name, email},
        date,
        time,
        status,
        createdAt
      }`;

      const data = await client.fetch(query, {
        providerId: session?.user?.id,
      });

      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id, filter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      await client
        .patch(bookingId)
        .set({ status: newStatus })
        .commit();

      toast.success('Booking status updated');
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking status');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Bookings Management</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full sm:w-auto border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Bookings</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="hidden md:block px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="block  md:hidden px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <FaCalendar size={16} />
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {booking.service.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ${booking.service.price}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {booking.user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <div>
                        <div className="text-sm text-gray-900">
                          {new Date(booking.date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">{booking.time}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        statusColors[booking.status]
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm font-medium">
                    {booking.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            updateBookingStatus(booking._id, 'confirmed')
                          }
                          className="text-green-600 hover:text-green-900"
                        >
                          <FaCheck className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() =>
                            updateBookingStatus(booking._id, 'cancelled')
                          }
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTimes className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => updateBookingStatus(booking._id, 'completed')}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FaClock className="h-5 w-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {bookings.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No bookings found for the selected filter.
          </div>
        )}
      </div>
    </div>
  );
} 