'use client';

import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { Product } from '@/types';
import { FaHeart } from 'react-icons/fa';
import { useWishlist } from '@/app/context/WishlistContext';

interface ProductGridProps {
  products: Product[];
  showBidding?: boolean;
  productType?: 'new' | 'used';
}

export default function ProductGrid({ 
  products, 
  showBidding = false,
  productType = 'new'
}: ProductGridProps) {
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const handleWishlistClick = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    if (wishlist.some(item => item._id === product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Link 
          href={`/${productType}/${product._id}`} 
          key={product._id}
          className="group"
        >
          <div className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="relative aspect-square">
              <Image
                src={product.productImage ? urlFor(product.productImage).url() : (product.image || '/placeholder.jpg')}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <button
                onClick={(e) => handleWishlistClick(e, product)}
                className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
              >
                <FaHeart 
                  className={`w-5 h-5 ${
                    wishlist.some(item => item._id === product._id)
                      ? 'text-red-500'
                      : 'text-gray-400'
                  }`}
                />
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-lg mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-2">
                {typeof product.category === 'string' 
                  ? product.category 
                  : product.category?.name}
              </p>
              <div className="flex justify-between items-center">
                <p className="font-bold text-lg">${product.price}</p>
                {showBidding && (
                  <span className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm">
                    Place Bid
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 