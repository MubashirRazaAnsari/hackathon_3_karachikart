// components/ProductGrid.tsx
'use client';

import Image from "next/image";
import Link from "next/link";
import { urlFor } from '@/sanity/lib/image';
import { Product } from '@/types';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { useWishlist } from '@/app/context/WishlistContext';

interface ProductGridProps {
  products: Product[];
  showBidding: boolean;
  productType: string;
}

export default function ProductGrid({ products, showBidding, productType }: ProductGridProps) {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const { data: session } = useSession();
  const { addToWishlist, removeFromWishlist, isInWishlist, getImageUrl } = useWishlist();

  const handleImageError = (productId: string) => {
    setFailedImages(prev => new Set(prev).add(productId));
  };

  const handleWishlist = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); // Prevent navigation to product page
    
    if (!session) {
      toast.error('Please sign in to add items to your wishlist');
      return;
    }

    try {
      if (isInWishlist(product._id || '')) {
        removeFromWishlist(product._id || '');
        toast.success('Removed from wishlist');
      } else {
        addToWishlist(product);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  const renderImage = (product: Product) => {
    if (failedImages.has(product._id || '')) {
      return (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400">No image available</span>
        </div>
      );
    }

    const imageUrl = getImageUrl(product.productImage);

    return (
      <Image
        src={imageUrl}
        alt={product.name || 'Product image'}
        fill
        className="object-contain p-4 hover:scale-105 transition-transform duration-200"
        onError={() => handleImageError(product._id || '')}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    );
  };

  const getCategoryName = (category: Product['category']) => {
    return typeof category === 'string' ? category : category?.name || 'Uncategorized';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {products.map((product) => (
        <div 
          key={product._id} 
          className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 relative"
        >
          {/* Wishlist Button */}
          <button
            onClick={(e) => handleWishlist(e, product)}
            className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm transition-colors duration-200"
            aria-label={isInWishlist(product._id || '') ? "Remove from wishlist" : "Add to wishlist"}
          >
            <svg 
              className={`w-5 h-5 ${
                isInWishlist(product._id || '')
                  ? 'text-red-500 fill-current' 
                  : 'text-gray-400 hover:text-red-500'
              }`} 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>

          <Link href={`/${productType}/${product._id}`}>
            <div className="relative aspect-square">
              {renderImage(product)}
            </div>
            
            <div className="p-4">
              <h3 className="font-medium text-gray-900 truncate">
                {product.name}
              </h3>
              
              <p className="mt-1 text-sm text-gray-500">
                {getCategoryName(product.category)}
              </p>
              
              <div className="mt-2 flex items-center justify-between">
                <span className="font-bold text-gray-900">
                  ${typeof product.price === 'number' 
                    ? product.price.toFixed(2) 
                    : product.price
                  }
                </span>
                
                {product.rating && (
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1 text-sm text-gray-600">
                      {Number(product.rating).toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              {product.stock !== undefined && (
                <div className="mt-2 text-sm">
                  {product.stock === 0 ? (
                    <span className="text-red-500">Out of stock</span>
                  ) : product.stock < 5 ? (
                    <span className="text-orange-500">Only {product.stock} left</span>
                  ) : (
                    <span className="text-green-500">In stock</span>
                  )}
                </div>
              )}
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}