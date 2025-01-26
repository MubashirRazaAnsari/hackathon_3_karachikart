import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useCart } from '@/app/context/CartContext';
import type { ShippingAddress, PaymentInfo } from '@/types/order';

export function useOrder() {
  const router = useRouter();
  const { cart, totalPrice, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const createOrder = async (
    shippingAddress: ShippingAddress,
    paymentInfo: PaymentInfo
  ) => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return false;
    }

    setIsProcessing(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            id: item._id,
            quantity: item.quantity,
            price: item.price,
          })),
          total: totalPrice,
          shippingAddress,
          paymentInfo,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const { order } = await response.json();
      clearCart();
      router.push('/checkout/success');
      return true;
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order. Please try again.');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const processPayment = async (paymentDetails: any) => {
    // Implement payment processing logic here
    // This is where you'd integrate with a payment provider
    return {
      success: true,
      transactionId: 'mock-transaction-id',
      status: 'completed' as const,
    };
  };

  return {
    createOrder,
    processPayment,
    isProcessing,
  };
} 