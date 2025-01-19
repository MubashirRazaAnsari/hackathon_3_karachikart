'use client';

import Link from 'next/link';
import Image from 'next/image';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: { name: string };
  description: string;
  stock: number;
  rating?: {
    rate: number;
    count: number;
  };
}

interface ProductGridProps {
  products: Product[];
  showBidding?: boolean;
}

export default function ProductGrid({ products, showBidding }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Link href={`/new/${product._id}`} key={product._id}>
          <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative aspect-square">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-gray-600">{product.category.name}</p>
              <p className="font-bold mt-2">${product.price}</p>
              {showBidding && (
                <button className="mt-2 w-full bg-indigo-600 text-white px-4 py-2 rounded">
                  Place Bid
                </button>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 