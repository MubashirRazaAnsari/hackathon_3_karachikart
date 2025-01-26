'use client';

import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

interface SearchAndFilterProps {
  categories: string[];
  onSearch: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onPriceRangeChange: (min: number, max: number) => void;
  onSortChange: (sort: string) => void;
}

export default function SearchAndFilter({
  categories,
  onSearch,
  onCategoryChange,
  onPriceRangeChange,
  onSortChange,
}: SearchAndFilterProps) {
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow">
      {/* Search */}
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-medium mb-2">Categories</h3>
        <select
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-medium mb-2">Price Range</h3>
        <div className="flex gap-4">
          <input
            type="number"
            value={priceRange.min}
            onChange={(e) => {
              const min = Number(e.target.value);
              setPriceRange(prev => ({ ...prev, min }));
              onPriceRangeChange(min, priceRange.max);
            }}
            placeholder="Min"
            className="w-1/2 p-2 border rounded-lg"
          />
          <input
            type="number"
            value={priceRange.max}
            onChange={(e) => {
              const max = Number(e.target.value);
              setPriceRange(prev => ({ ...prev, max }));
              onPriceRangeChange(priceRange.min, max);
            }}
            placeholder="Max"
            className="w-1/2 p-2 border rounded-lg"
          />
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 className="font-medium mb-2">Sort By</h3>
        <select
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>
    </div>
  );
} 