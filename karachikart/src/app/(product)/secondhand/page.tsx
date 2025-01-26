export const dynamic = 'force-dynamic';

import ProductFilters from '@/app/components/ProductFilters';
import { serverClient } from '@/sanity/lib/client';
import { Suspense } from 'react';
import Loading from '../loading';
import ProductCard from '@/app/components/ProductCard';

interface SearchParams {
  category?: string;
  price?: string;
  sort?: string;
  [key: string]: string | undefined;
}

async function getProducts(searchParams: SearchParams) {
  try {
    let query = `*[_type == "secondhandProduct"]`;
    const filters = [];

    // Category filter
    if (searchParams.category) {
      filters.push(`category->name == "${searchParams.category}"`);
    }

    // Price filter
    if (searchParams.price) {
      if (searchParams.price === '201+') {
        filters.push(`price >= 201`);
      } else {
        const [min, max] = searchParams.price.split('-').map(Number);
        if (!isNaN(min) && !isNaN(max)) {
          filters.push(`price >= ${min} && price <= ${max}`);
        } else if (!isNaN(min)) {
          filters.push(`price >= ${min}`);
        }
      }
    }

    if (filters.length > 0) {
      query += `[${filters.join(' && ')}]`;
    }

    // Sorting
    switch (searchParams.sort) {
      case 'price-asc':
        query += ' | order(price asc)';
        break;
      case 'price-desc':
        query += ' | order(price desc)';
        break;
      case 'condition':
        query += ' | order(condition desc)';
        break;
      default:
        query += ' | order(_createdAt desc)';
    }

    query += ` {
      _id,
      name,
      price,
      description,
      "category": category->name,
      condition,
      "productImage": productImage.asset->url,
      seller->{
        name,
        rating
      },
      endTime,
      highestBid
    }`;

    return await serverClient.fetch<any[]>(query);
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
}

async function getCategories() {
  try {
    return await serverClient.fetch<Array<{ _id: string; name: string }>>(
      `*[_type == "category"] { _id, name }`
    );
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
}

// Add metadata and viewport exports
export const metadata = {
  title: 'Secondhand Products | KarachiKart',
  description: 'Browse quality secondhand products at great prices'
};

export const viewport = {
  width: 'device-width',
  initialScale: 1
};

export default async function SecondhandProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [products, categories] = await Promise.all([
    getProducts(searchParams),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Filters - Top bar for desktop */}
      <div className="hidden lg:block border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <ProductFilters 
            categories={categories}
            selectedCategory={searchParams.category}
            selectedPrice={searchParams.price}
            selectedSort={searchParams.sort}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Mobile Filters */}
        <div className="lg:hidden mb-6">
          <ProductFilters 
            categories={categories}
            selectedCategory={searchParams.category}
            selectedPrice={searchParams.price}
            selectedSort={searchParams.sort}
          />
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Secondhand Products</h1>
          <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full mt-2 sm:mt-0">
            {products.length} {products.length === 1 ? 'product' : 'products'} found
          </div>
        </div>

        {/* Products Grid */}
        <Suspense fallback={<Loading />}>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard 
                  key={product._id} 
                  product={product}
                  productType="secondhand"
                  showBidding={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600">
                Try adjusting your filters or search criteria
              </p>
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
}