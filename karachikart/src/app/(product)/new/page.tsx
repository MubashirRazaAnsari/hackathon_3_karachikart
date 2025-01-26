"use client";

import { useState, useEffect } from 'react';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import ProductGrid from '@/app/components/ProductGrid';
import SearchAndFilter from '@/app/components/product/SearchAndFilter';
import ProductListingSkeleton from '@/app/components/ProductListingSkeleton';
import type { Product } from '@/types';
import { serverClient } from '@/sanity/lib/client';
import ProductFilters from '@/app/components/ProductFilters';
import { Suspense } from 'react';
import Loading from '../loading';

async function getProducts() {
  // Fetch Sanity products
  const sanityProducts = await serverClient.fetch(`
    *[_type == "newProduct"] {
      _id,
      name,
      price,
      description,
      category->{
        name
      },
      productImage,
      stock,
      rating
    }
  `);

  // Fetch API products
  const apiRes = await fetch('https://fakestoreapi.com/products');
  const apiProducts = await apiRes.json();

  // Transform API products to match our Product type
  const transformedApiProducts = apiProducts.map((item: any) => ({
    _id: item.id.toString(),
    name: item.title,
    price: item.price,
    description: item.description,
    category: item.category,
    image: item.image,
    rating: item.rating.rate
  }));

  return [...sanityProducts, ...transformedApiProducts];
}

export default async function ProductsPage() {
  const allProducts = await getProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64">
          <ProductFilters products={allProducts} />
        </aside>

        <main className="flex-1">
          <ProductGrid products={allProducts} />
        </main>
      </div>
    </div>
  );
}
