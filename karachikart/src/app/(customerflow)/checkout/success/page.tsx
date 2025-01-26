'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/app/context/cartStore';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const clearCart = useCartStore(state => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-green-600">Order Successful!</h1>
        <p className="text-gray-600">
          Thank you for your purchase. Your order has been confirmed.
        </p>
        <div className="space-x-4 mt-8">
          <Link
            href="/profile/orders"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            View Orders
          </Link>
          <Link
            href="/"
            className="inline-block bg-gray-100 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-200"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
} 