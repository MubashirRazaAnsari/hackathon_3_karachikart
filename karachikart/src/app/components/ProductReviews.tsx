'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { serverClient } from '@/sanity/lib/client';
import { StarIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

interface Review {
  _id: string;
  rating: number;
  comment: string;
  user: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

interface ProductReviewsProps {
  productId: string;
  reviews: Review[];
}

export default function ProductReviews({ productId, reviews = [] }: ProductReviewsProps) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error('Please sign in to leave a review');
      return;
    }

    setIsSubmitting(true);
    try {
      const review = {
        _type: 'review',
        rating,
        comment,
        product: {
          _type: 'reference',
          _ref: productId
        },
        user: {
          _type: 'reference',
          _ref: session.user.id
        },
        createdAt: new Date().toISOString()
      };

      await serverClient.create(review);
      toast.success('Review submitted successfully');
      setComment('');
      setRating(5);
    } catch (error) {
      console.error('Review submission error:', error);
      toast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Reviews</h2>
      
      {session && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Rating</label>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  <StarIcon className="h-6 w-6" />
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {reviews.map((review: any) => (
          <div key={review._id} className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex text-yellow-400">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5" />
                ))}
              </div>
              <span className="text-sm text-gray-500">by {review.userName}</span>
            </div>
            <p className="text-gray-700">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 