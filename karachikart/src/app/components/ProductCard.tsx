'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/sanity/lib/image';
import { Product } from '@/types';
import CompareButton from './CompareButton';
import { toast } from 'react-hot-toast';
import { useCart } from '@/app/context/CartContext';
import { useProductStore } from '../context/productStore';
import { PLACEHOLDER_IMAGE } from '@/constants/images';

interface ProductCardProps {
  product: Product;
  showBidding?: boolean;
  productType?: 'new' | 'secondhand';
}

export default function ProductCard({ product, showBidding = false, productType = 'new' }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [localStock, setLocalStock] = useState(product.stock);
  const { updateStock } = useProductStore();
  const { addToCart } = useCart();
  const [imgError, setImgError] = useState(false);
  
  // Enhanced image URL handling for both Sanity and Live API images
  const imageUrl = useMemo(() => {
    if (imgError) return PLACEHOLDER_IMAGE;
    
    try {
      // Case 1: Handle Sanity image reference
      if (product.productImage && typeof product.productImage === 'object' && '_type' in product.productImage) {
        return urlFor(product.productImage)
          .width(240)
          .height(240)
          .fit('crop')
          .crop('center')
          .url();
      }
      
      // Case 2: Handle direct image URL (from Live API)
      if (product.image && typeof product.image === 'string' && (
        product.image.startsWith('http') || 
        product.image.startsWith('/')
      )) {
        return product.image;
      }
      
      // Case 3: Handle Sanity image in 'image' field
      if (product.image && typeof product.image === 'object' && '_type' in product.image) {
        return urlFor(product.image)
          .width(240)
          .height(240)
          .fit('crop')
          .crop('center')
          .url();
      }
      
      // Case 4: Handle productImage as string URL
      if (product.productImage && typeof product.productImage === 'string' && (
        product.productImage.startsWith('http') || 
        product.productImage.startsWith('/')
      )) {
        return product.productImage;
      }
    } catch (error) {
      console.error('Error processing image:', error);
    }
    
    return PLACEHOLDER_IMAGE;
  }, [product.productImage, product.image, imgError]);

  const isSanityProduct = (id: string | number): boolean => {
    const strId = String(id);
    return strId.includes('draft.') || strId.length > 20;
  };

  const handleAddToCart = async () => {
    if (!localStock || localStock <= 0) return;
    
    setIsLoading(true);
    try {
      if (isSanityProduct(product._id || '')) {
        // Update stock in Sanity
        await updateStock(product._id || '', localStock - 1);
      }
      
      // Update local stock for all products
      setLocalStock((prev) => prev ? prev - 1 : 0);
      
      // Add to cart
      addToCart(product);
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Only show error if it's a Sanity product
      if (isSanityProduct(product._id || '')) {
        toast.error('Failed to add to cart');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/${productType}/${product._id}`}>
        <div className="aspect-square relative overflow-hidden w-full h-[240px]">
          <Image
            src={imageUrl}
            alt={product.name || 'Product image'}
            fill
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 768px) 33vw, (max-width: 1200px) 240px"
            onError={() => setImgError(true)}
          />
        </div>
      </Link>

      <div className="p-4">
        <h3 className="text-base font-semibold mb-2 line-clamp-1">{product.name}</h3>
        <div className="flex justify-between items-center mb-2">
          <span className="text-base font-bold">${product.price}</span>
          {product.rating && (
            <span className="text-yellow-400 flex items-center">
              ★ {product.rating.toFixed(1)}
            </span>
          )}
        </div>

        {!showBidding && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              {localStock === 0 ? (
                <span className="text-red-500">Out of stock</span>
              ) : (
                `${localStock} in stock`
              )}
            </p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleAddToCart}
                disabled={isLoading || localStock === undefined || localStock <= 0}
                className={`flex-1 py-2 rounded-lg ${
                  isLoading || localStock === undefined || localStock <= 0
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-black/90'
                }`}
              >
                {isLoading ? 'Adding...' : 'Add to Cart'}
              </button>
              <CompareButton product={product} />
            </div>
          </div>
        )}

        {showBidding && (
          <div className="mt-2">
            <button className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors">
              Place Bid
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 