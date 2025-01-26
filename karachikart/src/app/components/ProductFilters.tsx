'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';

interface ProductFiltersProps {
  products: Product[];
  onFilterChange?: (filteredProducts: Product[]) => void;
}

export default function ProductFilters({ products, onFilterChange }: ProductFiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);

  // Extract unique categories from products
  const categories = Array.from(new Set(products.map(product => 
    typeof product.category === 'string' ? product.category : product.category.name
  )));

  useEffect(() => {
    const filtered = products.filter(product => {
      const productCategory = typeof product.category === 'string' 
        ? product.category 
        : product.category.name;

      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(productCategory);
      
      const matchesPrice = product.price >= priceRange[0] && 
        product.price <= priceRange[1];
      
      const matchesRating = selectedRatings.length === 0 || 
        (product.rating && selectedRatings.includes(Math.floor(product.rating)));

      return matchesCategory && matchesPrice && matchesRating;
    });

    onFilterChange?.(filtered);
  }, [selectedCategories, priceRange, selectedRatings, products]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Price Range</h3>
        <input
          type="range"
          min="0"
          max="1000"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
          className="w-full"
        />
        <div className="flex justify-between text-sm">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Categories</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedCategories([...selectedCategories, category]);
                  } else {
                    setSelectedCategories(selectedCategories.filter(c => c !== category));
                  }
                }}
                className="mr-2"
              />
              {category}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Rating</h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map(rating => (
            <label key={rating} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedRatings.includes(rating)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedRatings([...selectedRatings, rating]);
                  } else {
                    setSelectedRatings(selectedRatings.filter(r => r !== rating));
                  }
                }}
                className="mr-2"
              />
              {rating} Stars & Up
            </label>
          ))}
        </div>
      </div>
    </div>
  );
} 