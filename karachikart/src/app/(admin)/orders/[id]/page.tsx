'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowLeft, FaTruck } from 'react-icons/fa';
import { Order } from '@/types/order';
import { urlFor } from '@/sanity/lib/image';
import { toast } from 'react-hot-toast';
import { client } from '@/sanity/lib/client';

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function AdminOrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: session, status } = useSession();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [orderStatus, setOrderStatus] = useState('');

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const fetchOrder = async () => {
    try {
      const order = await client.fetch<Order>(
        `*[_type == "order" && _id == $id][0] {
          ...,
          items[] {
            ...,
            product->{
              _id,
              name,
              price,
              productImage
            }
          }
        }`,
        { id: params.id }
      );
      setOrder(order);
      setTrackingNumber(order.trackingNumber || '');
      setOrderStatus(order.status);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: orderStatus,
          trackingNumber,
        }),
      });

      if (!response.ok) throw new Error('Failed to update order');

      toast.success('Order updated successfully');
      setIsEditing(false);
      fetchOrder();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  if (status === 'loading' || loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <div className="text-center py-8">
        <p>Please sign in to access this page.</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-8">
        <p>Order not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <Link
              href="/admin/orders"
              className="flex items-center text-blue-500 hover:text-blue-600 mb-4"
            >
              <FaArrowLeft className="mr-2" /> Back to Orders
            </Link>
            <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
            <p className="text-gray-600">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Edit Order
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateOrder}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-bold mb-4">Order Status</h2>
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tracking Number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    statusColors[order.status]
                  }`}
                >
                  {order.status}
                </span>
              </div>
              {order.trackingNumber && (
                <div className="flex items-center text-gray-600">
                  <FaTruck className="mr-2" />
                  <span>Tracking: {order.trackingNumber}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-lg font-bold mb-4">Order Items</h2>
            <div className="divide-y">
              {order.items.map((item) => (
                <div key={item._id} className="py-4 flex items-center">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image
                      src={urlFor(item.product.productImage).url()}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="ml-6 flex-1">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-4">
            <div className="flex justify-between text-base font-medium">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold mb-4">Customer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-medium mb-2">Shipping Address</h3>
              <div className="text-gray-600 space-y-1">
                <p>{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Payment Information</h3>
              <div className="text-gray-600 space-y-1">
                <p>Method: {order.paymentInfo.method}</p>
                <p>Transaction ID: {order.paymentInfo.transactionId}</p>
                <p>Status: {order.paymentInfo.status}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 