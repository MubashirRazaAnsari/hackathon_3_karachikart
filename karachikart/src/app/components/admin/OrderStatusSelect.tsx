'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface OrderStatusSelectProps {
  orderId: string;
  currentStatus: string;
  onStatusChange?: (newStatus: string) => void;
}

export default function OrderStatusSelect({
  orderId,
  currentStatus,
  onStatusChange,
}: OrderStatusSelectProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      const updatedOrder = await response.json();
      setStatus(newStatus);
      onStatusChange?.(newStatus);

      if (newStatus === 'shipped' && updatedOrder.trackingNumber) {
        toast.success(
          `Order marked as shipped. Tracking number: ${updatedOrder.trackingNumber}`
        );
      } else {
        toast.success('Order status updated successfully');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <select
      value={status}
      onChange={(e) => handleStatusChange(e.target.value)}
      disabled={isUpdating}
      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
    >
      <option value="pending">Pending</option>
      <option value="processing">Processing</option>
      <option value="shipped">Shipped</option>
      <option value="delivered">Delivered</option>
      <option value="cancelled">Cancelled</option>
    </select>
  );
} 