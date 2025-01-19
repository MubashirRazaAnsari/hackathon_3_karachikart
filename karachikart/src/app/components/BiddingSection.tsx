'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface Bid {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  createdAt: string;
}

interface BiddingSectionProps {
  productId: string;
  currentPrice: number;
  highestBid: number;
  bids: Bid[];
  endTime: string;
}

export default function BiddingSection({ 
  productId, 
  currentPrice, 
  highestBid, 
  bids, 
  endTime 
}: BiddingSectionProps) {
  const { data: session } = useSession();
  const [bidAmount, setBidAmount] = useState<number>(highestBid + 1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timeLeft = new Date(endTime).getTime() - new Date().getTime();
  const isEnded = timeLeft <= 0;

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || isEnded) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/bids', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          amount: bidAmount,
        }),
      });

      if (!response.ok) throw new Error('Failed to place bid');

      // Refresh the page or update the UI
      window.location.reload();
    } catch (error) {
      console.error('Error placing bid:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border rounded-lg p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">Current Price</p>
          <p className="text-2xl font-bold">${currentPrice}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Highest Bid</p>
          <p className="text-2xl font-bold text-green-600">${highestBid}</p>
        </div>
      </div>

      {!isEnded ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Time Left</p>
          <div className="grid grid-cols-4 gap-2 text-center">
            {/* Add countdown timer here */}
          </div>

          {session ? (
            <form onSubmit={handlePlaceBid} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Your Bid</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    min={highestBid + 1}
                    step="0.01"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting || bidAmount <= highestBid}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Placing Bid...' : 'Place Bid'}
              </button>
            </form>
          ) : (
            <p className="text-center text-gray-600">Please sign in to place a bid</p>
          )}
        </div>
      ) : (
        <div className="text-center text-red-600">
          <p>Auction Ended</p>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="font-medium">Bid History</h3>
        <div className="space-y-2">
          {bids.map((bid) => (
            <div key={bid.id} className="flex justify-between text-sm">
              <span>{bid.userName}</span>
              <span className="font-medium">${bid.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 