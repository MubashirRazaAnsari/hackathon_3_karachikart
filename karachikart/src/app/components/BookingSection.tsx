'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface BookingSectionProps {
  serviceId: string;
  price: number;
  availability: string[];
  duration: string;
}

export default function BookingSection({ serviceId, price, availability, duration }: BookingSectionProps) {
  const { data: session } = useSession();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId,
          date: selectedDate,
          time: selectedTime,
        }),
      });
      if (!response.ok) throw new Error('Booking failed');
      window.location.reload();
    } catch (error) {
      console.error('Error booking service:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold">${price}</span>
        <span className="text-gray-600">Duration: {duration}</span>
      </div>

      {session ? (
        <form onSubmit={handleBooking} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Select Time</label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-2 border rounded"
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
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Booking...' : 'Book Now'}
          </button>
        </form>
      ) : (
        <p className="text-center text-gray-600">Please sign in to book this service</p>
      )}
    </div>
  );
} 