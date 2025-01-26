'use client';

import { useState, useEffect } from 'react';
import { client } from '@/sanity/lib/client';
import ProductListingSkeleton from '@/app/components/ProductListingSkeleton';
import ProductGrid from '@/app/components/ProductGrid';
import ProductFilters from '@/app/components/ProductFilters';
import { serverClient } from '@/sanity/lib/client';
import { Suspense } from 'react';
import Loading from '../loading';

interface SecondhandProduct {
  _id: string;
  name: string;
  price: number;
  category: string;
  condition: string;
  image: any;
  description: string;
  seller: {
    _ref: string;
    name: string;
  };
  endTime: string;
  highestBid: number;
}

async function getProducts() {
  try {
    const products = await serverClient.fetch(`
      *[_type == "secondhandProduct"] {
        _id,
        name,
        price,
        description,
        category->{
          name
        },
        productImage,
        condition,
        seller->{
          name,
          rating
        },
        endTime,
        highestBid
      }
    `);
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export default async function SecondhandProductsPage() {
  const products = await getProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Secondhand Products</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64">
          <ProductFilters
            selectedCategory="all"
            setSelectedCategory={() => {}}
            priceRange={[0, 1000]}
            setPriceRange={() => {}}
            sortBy="newest"
            setSortBy={() => {}}
            categories={[]}
            conditions={['New', 'Like New', 'Good', 'Fair']}
          />
        </aside>

        <main className="flex-1">
          <Suspense fallback={<Loading />}>
            <ProductGrid 
              products={products}
              showBidding={true}
              productType="secondhand"
            />
          </Suspense>
        </main>
      </div>
    </div>
  );
} 