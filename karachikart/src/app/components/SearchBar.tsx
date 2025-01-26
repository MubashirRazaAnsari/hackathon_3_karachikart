'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { client } from '@/sanity/lib/client';
import type { Product } from '@/types';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length >= 2) {
        const searchResults = await client.fetch<Product[]>(`
          *[_type == "newProduct" && (name match $searchTerm || description match $searchTerm)] {
            _id,
            name,
            price,
            description,
            category->{
              name
            },
            productImage
          }[0...5]
        `, { searchTerm: `*${searchTerm}*` });
        
        setResults(searchResults);
        setShowResults(true);
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleResultClick = (productId: string) => {
    router.push(`/product/${productId}`);
    setShowResults(false);
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-full">
        <FaSearch className="text-sm font-light text-gray-500" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-gray-100 border-none outline-none w-[180px] lg:w-[200px]"
        />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('');
              setShowResults(false);
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="h-4 w-4" />
          </button>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-50">
          {results.map((product) => (
            <button
              key={product._id}
              className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 text-left"
              onClick={() => handleResultClick(product._id)}
            >
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src={urlFor(product.productImage).url()}
                  alt={product.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div>
                <h4 className="font-medium">{product.name}</h4>
                <p className="text-sm text-gray-600">${product.price.toFixed(2)}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 