'use client';

import { useEffect } from 'react';
import { useCart } from '@/app/context/CartContext';
import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function OrderSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart only once when component mounts
    clearCart();
  }, []); // Empty dependency array

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Order Successful!
        </h1>
        <p className="mt-2 text-gray-600">
          Thank you for your purchase. Your order has been confirmed.
        </p>
        <div className="mt-8 space-y-4">
          <Link
            href="/profile/orders"
            className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            View Orders
          </Link>
          <Link
            href="/new"
            className="block w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
} 