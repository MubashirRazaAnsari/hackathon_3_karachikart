'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { FaTruck, FaBox, FaCheck } from 'react-icons/fa';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import Breadcrumb from '@/app/components/shared/Breadcrumb';
import TrackingButton from '@/app/components/TrackingButton';


interface OrderItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    productImage?: any;
    image?: string;
    price: number;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  createdAt: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  items: OrderItem[];
  total: number;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  trackingNumber?: string;
}

const statusSteps = [
  { status: 'pending', label: 'Order Placed', icon: FaBox },
  { status: 'processing', label: 'Processing', icon: FaBox },
  { status: 'shipped', label: 'Shipped', icon: FaTruck },
  { status: 'delivered', label: 'Delivered', icon: FaCheck },
];

const FALLBACK_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

function getImageUrl(product: any) {
  if (!product) return FALLBACK_IMAGE;
  
  try {
    // Case 1: Handle Sanity image
    if (product.productImage?._type === 'image') {
      return urlFor(product.productImage)
        .width(400)
        .height(400)
        .fit('crop')
        .crop('center')
        .url();
    }
    
    // Case 2: Handle direct image URL
    if (product.image && typeof product.image === 'string') {
      return product.image;
    }
    
    // Case 3: Handle productImage as string URL
    if (product.productImage && typeof product.productImage === 'string') {
      return product.productImage;
    }

    return FALLBACK_IMAGE;
  } catch (error) {
    console.error('Error processing image:', error);
    return FALLBACK_IMAGE;
  }
}

export default function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: session, status } = useSession();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await client.fetch<Order>(
          `*[_type == "order" && _id == $orderId][0]{
            _id,
            orderNumber,
            createdAt,
            status,
            items[]{
              _id,
              product->{
                _id,
                name,
                productImage,
                image,
                price
              },
              quantity,
              price
            },
            total,
            shippingAddress,
            trackingNumber
          }`,
          { orderId: params.id }
        );
        setOrder(orderData);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchOrder();
    }
  }, [params.id, session]);

  if (status === 'loading' || loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
        <p className="text-gray-600 mb-4">
          You need to be signed in to view order details
        </p>
        <Link
          href="/auth/signin"
          className="inline-block bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <Link
          href="/profile/orders"
          className="text-blue-500 hover:text-blue-600"
        >
          ← Back to Orders
        </Link>
      </div>
    );
  }

  const currentStepIndex = statusSteps.findIndex(
    (step) => step.status === order.status
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb />
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Order #{order.orderNumber}
            </h1>
            <p className="text-gray-600">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Link
            href="/profile/orders"
            className="text-blue-500 hover:text-blue-600"
          >
            ← Back to Orders
          </Link>
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-bold mb-4">Order Status</h2>
          <div className="relative">
            <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -translate-y-1/2" />
            <div
              className="absolute left-0 top-1/2 h-1 bg-blue-500 -translate-y-1/2 transition-all duration-500"
              style={{
                width: `${((currentStepIndex + 1) / statusSteps.length) * 100}%`,
              }}
            />
            <div className="relative flex justify-between my-2">
              {statusSteps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index <= currentStepIndex;
                return (
                  <div
                    key={step.status}
                    className="flex flex-col items-center"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm mt-2">{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
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
                      src={getImageUrl(item.product)}
                      alt={item.product?.name || 'Product image'}
                      fill
                      className="object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = FALLBACK_IMAGE;
                      }}
                    />
                  </div>
                  <div className="ml-6 flex-1">
                    <h3 className="font-medium">{item.product?.name || 'Product'}</h3>
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

        {/* Shipping Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold mb-4">Shipping Information</h2>
          <div className="space-y-2">
            <p>{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.address}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
              {order.shippingAddress.zipCode}
            </p>
            <p>{order.shippingAddress.country}</p>
          </div>
          {order.trackingNumber && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm font-medium">Tracking Number</p>
              <p className="text-blue-500">{order.trackingNumber}</p>
            </div>
          )}
        </div>

        <TrackingButton 
          trackingNumber={order.trackingNumber} 
          orderNumber={order.orderNumber}
        />
      </div>
    </div>
  );
} 