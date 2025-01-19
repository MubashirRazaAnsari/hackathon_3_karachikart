'use client';

import { useState, useEffect } from 'react';
import { client } from '@/sanity/lib/client';
import ProductListingSkeleton from '@/app/components/ProductListingSkeleton';
import ProductGrid from '@/app/components/ProductGrid';
import ProductFilters from '@/app/components/ProductFilters';

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

export default function SecondhandProductsPage() {
  const [products, setProducts] = useState<SecondhandProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'ending-soon'>('ending-soon');
  
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const query = `*[_type == "secondhandProduct"] {
          _id,
          name,
          price,
          category,
          condition,
          description,
          "image": image.asset->url,
          seller->{
            _id,
            name
          },
          endTime,
          highestBid
        }`;
        const data = await client.fetch(query);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products
    .filter(product => 
      (selectedCategory === 'all' || product.category === selectedCategory) &&
      (selectedCondition === 'all' || product.condition === selectedCondition) &&
      product.price >= priceRange[0] && 
      product.price <= priceRange[1]
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'ending-soon':
          return new Date(a.endTime).getTime() - new Date(b.endTime).getTime();
        default:
          return 0;
      }
    });

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  if (loading) return <ProductListingSkeleton />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Secondhand Products</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64">
          <ProductFilters
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            sortBy={sortBy}
            setSortBy={setSortBy}
            conditions={['New', 'Like New', 'Good', 'Fair']}
            selectedCondition={selectedCondition}
            setSelectedCondition={setSelectedCondition} categories={[]}          />
        </aside>

        <main className="flex-1">
          <ProductGrid 
            products={paginatedProducts}
            showBidding={true}
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
        </main>
      </div>
    </div>
  );
} 