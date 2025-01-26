'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types';
import { urlFor } from '@/sanity/lib/image';

interface ProcessedProduct extends Omit<Product, 'productImage'> {
  productImage: string | null;
}

interface WishlistContextType {
  wishlist: ProcessedProduct[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  getImageUrl: (image: any) => string;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<ProcessedProduct[]>([]);

  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const getImageUrl = (image: any): string => {
    if (!image) return '/placeholder.jpg';
    
    try {
      if (typeof image === 'string') {
        return image;
      }
      // Handle Sanity image
      return urlFor(image).url();
    } catch (error) {
      console.error('Error processing image:', error);
      return '/placeholder.jpg';
    }
  };

  const addToWishlist = (product: Product) => {
    setWishlist((prev) => {
      if (prev.some((item) => item._id === product._id)) {
        return prev;
      }
      // Ensure the image URL is properly processed before storing
      const processedProduct = {
        ...product,
        productImage: product.productImage ? getImageUrl(product.productImage) : null
      };
      return [...prev, processedProduct];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => item._id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item._id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, getImageUrl }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
} 