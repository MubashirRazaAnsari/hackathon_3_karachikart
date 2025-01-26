'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { urlFor } from '@/sanity/lib/image';
import { Product } from '@/types';

export default function FeaturedProducts({ products }: { products: Product[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <motion.div
          key={product._id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Link href={`/products/${product._id}`}>
            <div
              className="bg-white rounded-lg shadow-lg overflow-hidden"
              onMouseEnter={() => setHoveredId(product._id || '')}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="relative h-64">
                <Image
                  src={urlFor(product.productImage).url()}
                  alt={product.name || 'Product Image'}
                  fill
                  className="object-cover"
                />
                {hoveredId === product._id && (
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                    <span className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium">
                      View Details
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-2 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">${product.price}</span>
                  {product.stock && product.stock < 10 && (
                    <span className="text-sm text-red-500">
                      Only {product.stock} left!
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
} 