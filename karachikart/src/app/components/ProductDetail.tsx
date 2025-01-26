'use client';

import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { Product } from '@/types';
import AddToCartButton from './AddToCarButton';
import ProductReviews from './ProductReviews';
import { Suspense, useEffect, useCallback } from 'react';
import ProductDetailSkeleton from './ProductDetailSkeleton';
import { useProductStore } from '../context/productStore';
import { client } from '@/sanity/lib/client';

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { updateStock } = useProductStore();

  const subscribeToStockUpdates = useCallback(() => {
    return client
      .listen(
        `*[_type in ["newProduct", "secondhandProduct"] && _id == $id] {
          stock
        }`, 
        { id: product._id }
      )
      .subscribe({
        next: (update) => {
          if (update.result?.stock !== undefined) {
            updateStock(product._id || '', update.result.stock);
          }
        },
        error: (err) => {
          console.error('Subscription error:', err);
        }
      });
  }, [product._id, updateStock]);

  useEffect(() => {
    const subscription = subscribeToStockUpdates();
    return () => {
      subscription.unsubscribe();
    };
  }, [subscribeToStockUpdates]);

  const imageUrl = product.productImage ? urlFor(product.productImage).url() : '/placeholder.jpg';

  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-square rounded-lg overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.name || 'Product Image'}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 33vw"
            priority
          />
        </div>

        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl font-semibold">${product.price}</p>
          <p className="text-gray-600">{product.description}</p>
          <p className="text-sm text-gray-500">
            Category: {typeof product.category === 'string' ? product.category : product.category?.name || 'Uncategorized'}
          </p>
          <p>Stock: {product.stock}</p>
          <AddToCartButton product={product} />
        </div>
      </div>

      <div className="mt-16">
        <ProductReviews
          productId={product._id || ''}
          reviews={product.reviews || []}
        />
      </div>
    </Suspense>
  );
} 