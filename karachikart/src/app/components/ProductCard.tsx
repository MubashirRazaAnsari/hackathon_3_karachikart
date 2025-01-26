'use client';

import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/sanity/lib/image';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product._id}`}>
      <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-48">
          <Image
            src={urlFor(product.productImage).url()}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
          <p className="text-gray-600 mb-2">{product.category.name}</p>
          <p className="text-xl font-bold">${product.price}</p>
        </div>
      </div>
    </Link>
  );
} 