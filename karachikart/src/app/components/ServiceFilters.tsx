'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ServiceFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [priceRange, setPriceRange] = useState(searchParams.get('price') || 'all');
  const [availability, setAvailability] = useState(searchParams.get('available') || 'all');

  const handleFilterChange = (type: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === 'all') {
      params.delete(type);
    } else {
      params.set(type, value);
    }

    router.push(`/services?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Price Range</h3>
        <select
          value={priceRange}
          onChange={(e) => {
            setPriceRange(e.target.value);
            handleFilterChange('price', e.target.value);
          }}
          className="w-full p-2 border rounded-md"
        >
          <option value="all">All Prices</option>
          <option value="0-50">$0 - $50</option>
          <option value="51-100">$51 - $100</option>
          <option value="101-200">$101 - $200</option>
          <option value="201+">$201+</option>
        </select>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Availability</h3>
        <select
          value={availability}
          onChange={(e) => {
            setAvailability(e.target.value);
            handleFilterChange('available', e.target.value);
          }}
          className="w-full p-2 border rounded-md"
        >
          <option value="all">All</option>
          <option value="true">Available Now</option>
          <option value="false">Not Available</option>
        </select>
      </div>
    </div>
  );
} 