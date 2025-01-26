'use client';

import { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Dialog } from '@headlessui/react';

interface ProductFiltersProps {
  categories: any[];
  selectedCategory?: string;
  selectedPrice?: string;
  selectedSort?: string;
}

export default function ProductFilters({ 
  categories, 
  selectedCategory, 
  selectedPrice, 
  selectedSort 
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const handleFilterChange = (type: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === 'all') {
      params.delete(type);
    } else {
      params.set(type, value);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mb-6">
      {/* Mobile filter button */}
      <button
        type="button"
        className="lg:hidden flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
        onClick={() => setIsMobileFiltersOpen(true)}
      >
        <svg className="w-5 h-5" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters
      </button>

      {/* Mobile filters dialog */}
      <Dialog
        open={isMobileFiltersOpen}
        onClose={setIsMobileFiltersOpen}
        className="lg:hidden relative z-50"
      >
        <div className="fixed inset-0 bg-black/25" />
        
        <div className="fixed inset-0 flex">
          <Dialog.Panel className="relative mr-auto flex h-full w-full max-w-xs flex-col bg-white py-4 pb-6 shadow-xl">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-lg font-medium">Filters</h2>
              <button
                type="button"
                className="-mr-2 flex h-10 w-10 items-center justify-center p-2 text-gray-400 hover:text-gray-500"
                onClick={() => setIsMobileFiltersOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile filters content */}
            <div className="mt-4 px-4 space-y-6">
              <FilterSection
                title="Price Range"
                value={searchParams.get('price') || 'all'}
                options={[
                  { value: 'all', label: 'All Prices' },
                  { value: '0-50', label: '$0 - $50' },
                  { value: '51-100', label: '$51 - $100' },
                  { value: '101-200', label: '$101 - $200' },
                  { value: '201+', label: '$201+' },
                ]}
                onChange={(value) => handleFilterChange('price', value)}
              />

              <FilterSection
                title="Category"
                value={searchParams.get('category') || 'all'}
                options={[
                  { value: 'all', label: 'All Categories' },
                  ...categories.map(category => ({
                    value: category.name,
                    label: category.name
                  }))
                ]}
                onChange={(value) => handleFilterChange('category', value)}
              />
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Desktop filters - Horizontal Layout */}
      <div className="hidden lg:flex items-center gap-6 p-4 bg-white rounded-lg shadow-sm">
        <span className="text-gray-700 font-medium">Filters:</span>
        <div className="flex gap-4 flex-1">
          <FilterSection
            title="Price Range"
            value={searchParams.get('price') || 'all'}
            options={[
              { value: 'all', label: 'All Prices' },
              { value: '0-50', label: '$0 - $50' },
              { value: '51-100', label: '$51 - $100' },
              { value: '101-200', label: '$101 - $200' },
              { value: '201+', label: '$201+' },
            ]}
            onChange={(value) => handleFilterChange('price', value)}
          />

          <FilterSection
            title="Category"
            value={searchParams.get('category') || 'all'}
            options={[
              { value: 'all', label: 'All Categories' },
              ...categories.map(category => ({
                value: category.name,
                label: category.name
              }))
            ]}
            onChange={(value) => handleFilterChange('category', value)}
          />
        </div>
      </div>
    </div>
  );
}

function FilterSection({ title, value, options, onChange }: {
  title: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-600">{title}:</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}