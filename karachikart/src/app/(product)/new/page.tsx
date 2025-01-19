"use client";

import { useState, useEffect } from 'react';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import ProductListingSkeleton from '@/app/components/ProductListingSkeleton';
import ProductGrid from '@/app/components/ProductGrid';
import ProductFilters from '@/app/components/ProductFilters';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: {
    name: string;
  };
  productImage: any;
  description: string;
  stock: number;
  rating?: {
    rate: number;
    count: number;
  };
}

export default function NewProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name'>('name');
  const [categories, setCategories] = useState<string[]>([]);
  
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryData = await client.fetch(`
          *[_type == "category"] {
            name
          }
        `);
        setCategories(categoryData.map((cat: any) => cat.name));

        const productData = await client.fetch(`
          *[_type == "newProduct"] {
            _id,
            name,
            price,
            category->{
              name
            },
            productImage,
            description,
            stock,
            rating
          }
        `);
        setProducts(productData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products
    .filter(product => 
      (selectedCategory === 'all' || product.category.name === selectedCategory) &&
      product.price >= priceRange[0] &&
      product.price <= priceRange[1]
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">New Products</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64">
          <ProductFilters
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            sortBy={sortBy}
            setSortBy={setSortBy}
            categories={categories}
          />
        </aside>

        <main className="flex-1">
          {loading ? (
            <ProductListingSkeleton />
          ) : (
            <>
              <ProductGrid 
                products={paginatedProducts.map(product => ({
                  ...product,
                  image: product.productImage ? urlFor(product.productImage).url() : '/images/placeholders/placeholder.png',
                  category: product.category
                }))} 
              />
              
              <div className="mt-8 flex justify-center gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded ${
                      currentPage === i + 1
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
