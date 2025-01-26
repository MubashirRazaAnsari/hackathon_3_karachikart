'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import type { Product } from '@/types';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useWishlist } from '@/app/context/WishlistContext';
import { urlFor } from '@/sanity/lib/image';

interface ProductGridProps {
  products: Product[];
  showWishlist?: boolean;
}

export default function ProductGrid({ products, showWishlist = true }: ProductGridProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleWishlistClick = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!session) {
      toast.error('Please sign in to add items to your wishlist');
      router.push('/auth/signin');
      return;
    }

    if (isInWishlist(product._id || '')) {
      removeFromWishlist(product._id || '');
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist');
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <div key={product._id} className="group relative">
          <Link href={`/product/${product._id}`}>
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={urlFor(product.productImage).url()}
                alt={product.name || 'Product Image'}
                fill
                className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
              />
              {showWishlist && (
                <button
                  onClick={(e) => handleWishlistClick(e, product)}
                  className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                >
                  {isInWishlist(product._id || '') ? (
                    <FaHeart className="w-5 h-5 text-red-500" />
                  ) : (
                    <FaRegHeart className="w-5 h-5" />
                  )}
                </button>
              )}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white font-medium px-4 py-2 bg-black/60 rounded">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>
          </Link>
          <div className="mt-4 space-y-1">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 truncate">
              {typeof product.category === 'string' 
                ? product.category 
                : product.category?.name || ''}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">
                ${product.price.toFixed(2)}
              </p>
              {product.rating && (
                <div className="flex items-center">
                  <span className="text-sm text-gray-500">
                    {product.rating} ★
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 