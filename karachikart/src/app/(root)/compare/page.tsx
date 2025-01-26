'use client';

import { useCompare } from '@/app/context/CompareContext';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import Link from 'next/link';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '@/app/context/CartContext';
import { toast } from 'react-hot-toast';
import { Product } from '@/types';

const compareFeatures = [
  { key: 'price', label: 'Price', format: (value: number) => `$${value.toFixed(2)}` },
  { key: 'category', label: 'Category', format: (value: any) => typeof value === 'string' ? value : value?.name },
  { key: 'stock', label: 'Stock', format: (value: number) => value },
  { key: 'rating', label: 'Rating', format: (value: number) => value ? `${value.toFixed(1)}/5` : 'No ratings' },
  { key: 'description', label: 'Description', format: (value: string) => value, hideOnMobile: true }
];

export default function ComparePage() {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();

  const getImageUrl = (product: any) => {
    try {
      if (product.productImage && typeof product.productImage === 'object' && '_type' in product.productImage) {
        return urlFor(product.productImage)
          .width(160)
          .height(160)
          .fit('crop')
          .crop('center')
          .url();
      }
      
      if (product.productImage && typeof product.productImage === 'string' && (
        product.productImage.startsWith('http') || 
        product.productImage.startsWith('/')
      )) {
        return product.productImage;
      }

      if (product.image && typeof product.image === 'string') {
        return product.image;
      }

      if (product.image && typeof product.image === 'object' && '_type' in product.image) {
        return urlFor(product.image)
          .width(160)
          .height(160)
          .fit('crop')
          .crop('center')
          .url();
      }
    } catch (error) {
      console.error('Error processing image:', error);
    }
    
    return '/placeholder.jpg';
  };

  if (compareItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Compare Products</h1>
        <p className="text-gray-600 mb-4">No products to compare.</p>
        <Link 
          href="/new" 
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Compare Products</h1>
        <button
          onClick={clearCompare}
          className="text-red-600 hover:text-red-700 flex items-center gap-2"
        >
          <FaTrash className="h-4 w-4" />
          <span className="hidden sm:inline">Clear All</span>
        </button>
      </div>

      {/* Mobile View (Grid Layout) */}
      <div className="block lg:hidden">
        <div className="grid grid-cols-2 gap-4">
          {compareItems.map(product => (
            <div key={product._id} className="bg-white p-4 rounded-lg shadow">
              <div className="space-y-3">
                <div className="relative w-full aspect-square">
                  <Image
                    src={getImageUrl(product)}
                    alt={product.name || 'Product image'}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 50vw"
                  />
                </div>
                <h3 className="font-medium text-sm">{product.name}</h3>
                <div className="space-y-2">
                  {compareFeatures.map(({ key, label, format, hideOnMobile }) => !hideOnMobile && (
                    <div key={key} className="text-sm">
                      <span className="font-medium">{label}:</span>{' '}
                      <span>{format(product[key as keyof typeof product])}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-4 pt-2">
                  <button
                    onClick={() => removeFromCompare(product._id || '')}
                    className="text-red-600 hover:text-red-700 p-2"
                    aria-label="Remove from compare"
                  >
                    <FaTrash className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      const cartItem: Product = {
                        _id: product._id,
                        name: product.name,
                        price: product.price,
                        productImage: product.productImage,
                        quantity: 1,
                        stock: product.stock ?? 0,
                        category: product.category,
                        description: product.description
                      };
                      addToCart(cartItem);
                      toast.success('Added to cart');
                    }}
                    className="text-green-600 hover:text-green-700 p-2"
                    aria-label="Add to cart"
                  >
                    <FaShoppingCart className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop View (Table Layout) */}
      <div className="hidden lg:block">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr>
              <th className="p-4 border bg-gray-50 w-40"></th>
              {compareItems.map(product => (
                <th key={product._id} className="p-4 border bg-gray-50">
                  <div className="space-y-4">
                    <div className="relative w-40 h-40 mx-auto">
                      <Image
                        src={getImageUrl(product)}
                        alt={product.name || 'Product image'}
                        fill
                        priority
                        className="object-contain"
                        sizes="160px"
                      />
                    </div>
                    <h3 className="font-medium">{product.name}</h3>
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => removeFromCompare(product._id || '')}
                        className="text-red-600 hover:text-red-700 p-2"
                        aria-label="Remove from compare"
                      >
                        <FaTrash className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          addToCart({
                            _id: product._id,
                            name: product.name,
                            price: product.price,
                            productImage: product.productImage,
                            stock: product.stock ?? 0,
                            category: product.category,
                            description: product.description
                          });
                          toast.success('Added to cart');
                        }}
                        className="text-green-600 hover:text-green-700 p-2"
                        aria-label="Add to cart"
                      >
                        <FaShoppingCart className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {compareFeatures.map(({ key, label, format }) => (
              <tr key={key}>
                <td className="p-4 border bg-gray-50 font-medium">{label}</td>
                {compareItems.map(product => (
                  <td key={product._id} className="p-4 border text-center">
                    {format(product[key as keyof typeof product])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 