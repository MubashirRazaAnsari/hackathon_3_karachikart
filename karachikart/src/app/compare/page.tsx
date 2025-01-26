'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import Link from 'next/link';

export default function ComparePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const compareList = JSON.parse(localStorage.getItem('compareList') || '[]');
    setProducts(compareList);
  }, []);

  const removeFromCompare = (productId: string) => {
    const newList = products.filter(product => product._id !== productId);
    setProducts(newList);
    localStorage.setItem('compareList', JSON.stringify(newList));
  };

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Compare Products</h1>
        <p>No products to compare. Add some products to compare them.</p>
        <Link href="/new" className="text-blue-600 hover:underline mt-4 inline-block">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Compare Products</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Feature
              </th>
              {products.map(product => (
                <th key={product._id} className="px-6 py-3 bg-gray-50">
                  <div className="space-y-2">
                    <div className="relative w-32 h-32 mx-auto">
                      <Image
                        src={urlFor(product.productImage).url()}
                        alt={product.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <h3 className="font-medium">{product.name}</h3>
                    <button
                      onClick={() => removeFromCompare(product._id)}
                      className="text-red-600 text-sm hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Price
              </td>
              {products.map(product => (
                <td key={product._id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  ${product.price}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Category
              </td>
              {products.map(product => (
                <td key={product._id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {typeof product.category === 'string' 
                    ? product.category 
                    : product.category?.name}
                </td>
              ))}
            </tr>
            {/* Add more comparison rows as needed */}
          </tbody>
        </table>
      </div>
    </div>
  );
} 