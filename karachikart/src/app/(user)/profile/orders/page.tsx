'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FaBox, FaTruck, FaCheck, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';

interface OrderItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress: string;
  trackingNumber?: string;
}

const statusIcons = {
  pending: FaBox,
  processing: FaBox,
  shipped: FaTruck,
  delivered: FaCheck,
  cancelled: FaTimes,
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    // In a real app, fetch orders from an API
    const mockOrders: Order[] = [
      {
        _id: 'order1',
        items: [
          {
            _id: 'item1',
            name: 'Product 1',
            price: 99.99,
            quantity: 2,
            image: '/placeholder.jpg',
          },
        ],
        total: 199.98,
        status: 'delivered',
        createdAt: '2024-03-15',
        shippingAddress: '123 Main St, City, Country',
        trackingNumber: 'TRK123456789',
      },
      // Add more mock orders
    ];
    setOrders(mockOrders);
  }, []);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
        <p className="text-gray-600 mb-4">You need to be signed in to view your orders</p>
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
      <h1 className="text-2xl font-bold mb-8">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => {
          const StatusIcon = statusIcons[order.status];
          return (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-600">Order #{order._id}</p>
                  <p className="text-sm text-gray-600">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${
                    statusColors[order.status]
                  }`}
                >
                  <StatusIcon className="h-4 w-4" />
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item._id} className="flex items-center gap-4">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <div>
                  <p className="font-medium">Total: ${order.total.toFixed(2)}</p>
                  {order.trackingNumber && (
                    <p className="text-sm text-gray-600">
                      Tracking: {order.trackingNumber}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold">Order Details</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900">Order Information</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Order #{selectedOrder._id}
                </p>
                <p className="text-sm text-gray-600">
                  Placed on{' '}
                  {new Date(selectedOrder.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900">Shipping Address</h3>
                <p className="mt-1 text-sm text-gray-600">
                  {selectedOrder.shippingAddress}
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900">Items</h3>
                <div className="mt-2 divide-y divide-gray-200">
                  {selectedOrder.items.map((item) => (
                    <div key={item._id} className="py-3 flex justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-medium">
                    ${selectedOrder.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 