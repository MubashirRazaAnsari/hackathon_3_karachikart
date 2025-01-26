'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { serverClient } from '@/sanity/lib/client';
import toast from 'react-hot-toast';

interface Bid {
  _id: string;
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
  bids = [], 
  endTime 
}: BiddingSectionProps) {
  const { data: session } = useSession();
  const [bidAmount, setBidAmount] = useState(highestBid ? highestBid + 1 : currentPrice);
  const [timeLeft, setTimeLeft] = useState('');
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const distance = end - now;

      if (distance < 0) {
        setIsEnded(true);
        setTimeLeft('Auction ended');
        clearInterval(interval);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  const handleBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error('Please sign in to place a bid');
      return;
    }

    if (bidAmount <= highestBid) {
      toast.error('Bid amount must be higher than current highest bid');
      return;
    }

    try {
      const bid = {
        _type: 'bid',
        amount: bidAmount,
        product: {
          _type: 'reference',
          _ref: productId
        },
        user: {
          _type: 'reference',
          _ref: session.user.id
        }
      };

      await serverClient.create(bid);
      toast.success('Bid placed successfully');
    } catch (error) {
      toast.error('Failed to place bid');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">Current Price</p>
          <p className="text-2xl font-bold">${currentPrice}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Highest Bid</p>
          <p className="text-2xl font-bold">${highestBid || currentPrice}</p>
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <p className="text-sm font-medium">Time Left:</p>
        <p className="text-lg">{timeLeft}</p>
      </div>

      {!isEnded && (
        <form onSubmit={handleBid} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Your Bid</label>
            <input
              type="number"
              min={highestBid ? highestBid + 1 : currentPrice}
              value={bidAmount}
              onChange={(e) => setBidAmount(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Place Bid
          </button>
        </form>
      )}

      <div className="space-y-2">
        <h3 className="font-medium">Bid History</h3>
        {bids.map((bid) => (
          <div key={bid._id} className="flex justify-between text-sm">
            <span>{bid.userName}</span>
            <span>${bid.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 