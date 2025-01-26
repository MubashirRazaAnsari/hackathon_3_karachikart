'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

interface BookingSectionProps {
  serviceId: string;
  price: number;
  availability: string[];
  duration: string;
  providerName: string;
  status: string;
  providerId: string;
}

export default function BookingSection({
  serviceId,
  price,
  availability,
  duration,
  providerName,
  status,
  providerId
}: BookingSectionProps) {
  const { data: session } = useSession();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error('Please sign in to book this service');
      return;
    }

    if (status !== 'available') {
      toast.error('This service is currently unavailable');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId,
          providerId,
          date: selectedDate,
          time: selectedTime,
          duration,
          price
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Booking failed');
      }

      const data = await response.json();
      if (data.success) {
        toast.success('Booking successful!');
        setSelectedDate('');
        setSelectedTime('');
      } else {
        throw new Error('Booking failed');
      }
    } catch (error: unknown) {
      console.error('Error booking service:', error);
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to book service. Please try again.');
      } else {
        toast.error('Failed to book service. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAvailable = status === 'available';
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="border rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold">${price.toFixed(2)}</span>
        <span className="text-gray-600">{duration}</span>
      </div>

      {!session ? (
        <div className="text-center space-y-4">
          <p className="text-gray-600">Please sign in to book this service</p>
          <Link
            href="/auth/signin"
            className="block w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Sign In
          </Link>
        </div>
      ) : !isAvailable ? (
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            {status === 'coming-soon' 
              ? 'This service will be available soon'
              : 'This service is currently unavailable'}
          </p>
        </div>
      ) : (
        <form onSubmit={handleBooking} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={today}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Select Time</label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Choose time</option>
              {availability.map((time) => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? 'Processing...' : 'Book Now'}
          </button>
        </form>
      )}
    </div>
  );
} 