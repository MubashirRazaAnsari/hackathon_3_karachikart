"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useCart } from "@/app/context/CartContext";
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useOrder } from '@/hooks/useOrder';
import type { ShippingAddress, PaymentInfo } from '@/types/order';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useCartStore } from '@/app/context/cartStore';

interface ShippingInfo {
  fullName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface CheckoutForm {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  nameOnCard: string;
}

const initialFormState: CheckoutForm = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  nameOnCard: '',
};

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const clearCart = useCartStore(state => state.clearCart);
  const { cart, totalPrice } = useCart();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        toast.error(error.message || 'Payment failed');
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        clearCart();
        toast.success('Payment successful!');
        router.push('/checkout/success');
      }
    } catch (err) {
      console.error('Payment error:', err);
      toast.error('Something went wrong with the payment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Processing...' : 'Pay now'}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const { cart, totalPrice, clearCart } = useCart();
  const { createOrder, processPayment } = useOrder();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<CheckoutForm>(initialFormState);
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '', 
    cvv: '',
    nameOnCard: ''
  });
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    if (step === 'payment' && !clientSecret) {
      const createIntent = async () => {
        try {
          const response = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: totalPrice,
              items: cart,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to create payment intent');
          }

          const data = await response.json();
          setClientSecret(data.clientSecret);
        } catch (error) {
          toast.error('Failed to initialize payment');
          setStep('shipping'); // Go back to shipping on error
        }
      };

      createIntent();
    }
  }, [step, clientSecret, cart, totalPrice]);

  if (!session) {
    return <div>Please login to continue</div>;
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <Link
          href="/new"
          className="inline-block bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate shipping info
    if (!formData.fullName || !formData.email || !formData.address) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Save shipping info and move to payment step
    setShippingInfo({
      fullName: formData.fullName,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      country: formData.country,
    });
    setStep('payment');
  };

  // Update the shipping form render
  const renderShippingForm = () => (
    <form onSubmit={handleShippingSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="fullName"
            required
            value={formData.fullName}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            name="address"
            required
            value={formData.address}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            name="city"
            required
            value={formData.city}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">State</label>
          <input
            type="text"
            name="state"
            required
            value={formData.state}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
          <input
            type="text"
            name="zipCode"
            required
            value={formData.zipCode}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Country</label>
          <input
            type="text"
            name="country"
            required
            value={formData.country}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          Continue to Payment
        </button>
      </div>
    </form>
  );

  // Update the payment section render
  const renderPaymentSection = () => {
    if (!clientSecret) {
      return <div>Loading payment...</div>;
    }

    return (
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: { theme: 'stripe' },
        }}
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Payment Information</h2>
          <CheckoutForm />
          <button
            onClick={() => setStep('shipping')}
            className="text-blue-500 hover:text-blue-600"
          >
            ← Back to shipping
          </button>
        </div>
      </Elements>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Progress Steps */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step === 'shipping' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}>1</div>
          <div className="w-16 h-1 bg-gray-200"></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step === 'payment' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}>2</div>
          <div className="w-16 h-1 bg-gray-200"></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step === 'confirmation' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}>3</div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {step === 'shipping' && renderShippingForm()}
        {step === 'payment' && renderPaymentSection()}
        {step === 'confirmation' && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">Order Confirmed!</h2>
            <p className="text-gray-600">Thank you for your purchase.</p>
            <button
              onClick={() => router.push('/profile/orders')}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
              View Orders
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
