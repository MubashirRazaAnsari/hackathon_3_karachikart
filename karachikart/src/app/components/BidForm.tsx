'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface Bid {
  bidder: {
    _ref: string;
    name: string;
  };
  amount: number;
  timestamp: string;
}

interface BidFormProps {
  productId: string;
  currentPrice: number;
  auctionEnd: string;
  bids: Bid[];
}

export default function BidForm({ productId, currentPrice, auctionEnd, bids }: BidFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [bidAmount, setBidAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [latestBids, setLatestBids] = useState<Bid[]>(bids);

  // Update time left
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(auctionEnd).getTime();
      const distance = end - now;

      if (distance < 0) {
        setTimeLeft('Auction ended');
        clearInterval(timer);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [auctionEnd]);

  // Poll for new bids
  useEffect(() => {
    const pollBids = setInterval(async () => {
      try {
        const response = await fetch(`/api/bids/${productId}`);
        const data = await response.json();
        if (data.bids) {
          setLatestBids(data.bids);
        }
      } catch (error) {
        console.error('Error polling bids:', error);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollBids);
  }, [productId]);

  const handleBid = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    const amount = parseFloat(bidAmount);
    if (amount <= currentPrice) {
      toast.error('Bid must be higher than current price');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/bids/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          amount,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to place bid');
      }

      const data = await response.json();
      setLatestBids([...latestBids, data.bid]);
      setBidAmount('');
      toast.success('Bid placed successfully!');
      router.refresh();
    } catch (error) {
      toast.error('Failed to place bid');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Current Price: ${currentPrice}</h3>
        <p className="text-sm text-gray-600">Time Left: {timeLeft}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Place Your Bid</h3>
        <form onSubmit={handleBid} className="space-y-4">
          <div>
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              min={currentPrice + 1}
              step="0.01"
              placeholder={`Min bid: $${(currentPrice + 1).toFixed(2)}`}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || timeLeft === 'Auction ended'}
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? 'Placing Bid...' : 'Place Bid'}
          </button>
        </form>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Bid History</h3>
        <div className="space-y-2">
          {latestBids.length > 0 ? (
            latestBids.map((bid, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span>{bid.bidder.name}</span>
                <span className="font-semibold">${bid.amount}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No bids yet</p>
          )}
        </div>
      </div>
    </div>
  );
} 