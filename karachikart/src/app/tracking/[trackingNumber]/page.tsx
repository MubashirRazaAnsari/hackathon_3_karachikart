'use client';

import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { FaTruck, FaCopy } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import TrackingPageSkeleton from '@/app/components/TrackingPageSkeleton';
import { TrackingData } from '@/types/tracking';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch tracking data');
  return res.json();
};

const statusColors = {
  picked_up: 'bg-blue-100 text-blue-800',
  in_transit: 'bg-yellow-100 text-yellow-800',
  delivered: 'bg-green-100 text-green-800',
  delayed: 'bg-red-100 text-red-800',
} as const;

export default function TrackingPage() {
  const { trackingNumber } = useParams<{ trackingNumber: string }>();
  const { data, error, isLoading } = useSWR<TrackingData>(
    `/api/dhl-tracking?trackingNumber=${trackingNumber}`,
    fetcher
  );

  const copyTrackingNumber = () => {
    if (trackingNumber) {
      navigator.clipboard.writeText(trackingNumber);
      toast.success('Tracking number copied!');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-red-700">Failed to load tracking information</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <TrackingPageSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-2">Tracking Details</h1>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <p className="text-gray-600">Tracking Number:</p>
                  <p className="font-medium">{trackingNumber}</p>
                  <button
                    onClick={copyTrackingNumber}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <FaCopy className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              statusColors[data.shipmentInfo.status as keyof typeof statusColors]
            }`}>
              {data.shipmentInfo.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>

        {/* Shipment Timeline */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-8">
            {data.events.map((event, index) => (
              <div key={index} className="relative">
                {index !== data.events.length - 1 && (
                  <div className="absolute top-6 left-4 h-full w-0.5 bg-gray-200" />
                )}
                <div className="flex gap-4">
                  <div className="relative z-10 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100">
                    <FaTruck className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{event.description}</p>
                    <p className="text-sm text-gray-600">{event.location}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(event.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 