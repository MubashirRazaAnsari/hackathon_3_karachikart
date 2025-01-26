'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { useCart } from '@/app/context/CartContext';
import { toast } from 'react-hot-toast';

export default function CartPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, totalPrice, clearCart, isLoading } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > 10) {
      toast.error('Maximum quantity is 10');
      return;
    }
    updateQuantity(itemId, newQuantity);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    setIsProcessing(true);
    try {
      // Add any pre-checkout validation here
      router.push('/checkout');
    } catch (error) {
      toast.error('Error processing checkout');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Shopping Cart</h1>
        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-600 text-sm"
          >
            Clear Cart
          </button>
        )}
      </div>

      {cart.length > 0 ? (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-grow">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <div key={item._id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={item.image || item.productImage || '/placeholder.jpg'}
                          alt={item.name}
                          fill
                          className="object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="ml-6 flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-base font-medium text-gray-900 hover:text-blue-500">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-500">{item.category}</p>
                          </div>
                          <p className="text-base font-medium text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center border rounded shadow-sm">
                            <button
                              onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                              className="p-2 hover:bg-gray-100 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <FaMinus className="h-4 w-4" />
                            </button>
                            <span className="px-4 py-2 border-x min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                              className="p-2 hover:bg-gray-100 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <FaPlus className="h-4 w-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-red-500 hover:text-red-600 transition-colors p-2"
                            aria-label="Remove item"
                          >
                            <FaTrash className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-80">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-lg font-medium mb-4">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal ({cart.length} items)</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Including taxes and shipping
                  </p>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                  {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Link
            href="/new"
            className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      )}
    </div>
  );
} 