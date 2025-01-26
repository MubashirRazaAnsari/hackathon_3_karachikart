'use client';

import { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import { FaFilter, FaSort } from 'react-icons/fa';
import { Product } from '@/types';
import ProductCard from '@/app/components/ProductCard';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [params.slug, sortBy, priceRange]);

  const fetchProducts = async () => {
    try {
      const query = `*[_type in ["newProduct", "secondhandProduct"] && category->name == $category && price >= $minPrice && price <= $maxPrice] {
        _id,
        name,
        price,
        productImage,
        description,
        category->{
          name
        }
      } | order(${sortBy} asc)`;

      const fetchedProducts = await client.fetch(query, {
        category: decodeURIComponent(params.slug),
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
      });

      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {decodeURIComponent(params.slug)}
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <FaFilter />
            Filters
          </button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="name">Name</option>
            <option value="price">Price: Low to High</option>
            <option value="price desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {showFilters && (
        <div className="mb-8 p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Price Range</h2>
          <div className="flex gap-4 items-center">
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) =>
                setPriceRange([Number(e.target.value), priceRange[1]])
              }
              className="w-24 px-2 py-1 border rounded"
            />
            <span>to</span>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], Number(e.target.value)])
              }
              className="w-24 px-2 py-1 border rounded"
            />
          </div>
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No products found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
} 