'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaTruck } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface TrackingButtonProps {
  trackingNumber?: string;
  orderNumber: string;
  className?: string;
}

export default function TrackingButton({ 
  trackingNumber, 
  orderNumber,
  className = '' 
}: TrackingButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    if (!trackingNumber) {
      toast.error(`Order #${orderNumber} doesn't have tracking information yet`);
      return;
    }
    
    setIsLoading(true);
    try {
      router.push(`/tracking/${trackingNumber}`);
    } catch (error) {
      toast.error('Failed to load tracking information');
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading || !trackingNumber}
      className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <FaTruck className="w-4 h-4" />
      {isLoading ? 'Loading...' : 'Track Order'}
    </button>
  );
} 