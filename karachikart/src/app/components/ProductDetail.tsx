'use client';

import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { Product } from '@/types';
import AddToCartButton from './AddToCarButton';
import ProductReviews from './ProductReviews';
import { Suspense } from 'react';
import ProductDetailSkeleton from './ProductDetailSkeleton';

export default function ProductDetail({ product }: { product: Product }) {
  const imageUrl = product.productImage ? urlFor(product.productImage).url() : '/placeholder.jpg';

  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-square rounded-lg overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.name}
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
          <p className="text-sm text-gray-500">Category: {product.category?.name || 'Uncategorized'}</p>
          <p>Stock: {product.stock}</p>
          <AddToCartButton product={product} />
        </div>
      </div>

      <div className="mt-16">
        <ProductReviews
          productId={product._id}
          reviews={product.reviews || []}
        />
      </div>
    </Suspense>
  );
} 