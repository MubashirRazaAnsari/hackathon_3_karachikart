export const dynamic = 'force-dynamic';

import ProductFilters from '@/app/components/ProductFilters';
import type { Product } from '@/types';
import { serverClient } from '@/sanity/lib/client';
import { Suspense } from 'react';
import Loading from '../loading';
import Pagination from '@/app/components/Pagination';
import ProductCard from '@/app/components/ProductCard';

// Add metadata and viewport exports
export const metadata = {
  title: 'New Products | KarachiKart',
  description: 'Browse our latest collection of new products'
};

export const viewport = {
  width: 'device-width',
  initialScale: 1
};

interface SearchParams {
  category?: string;
  price?: string;
  sort?: string;
  page?: string;
  [key: string]: string | undefined;
}

async function getProducts(searchParams: SearchParams) {
  try {
    // Fetch products from both Sanity and FakeStore API
    const [sanityProducts, fakeStoreProducts] = await Promise.all([
      // Sanity products query
      serverClient.fetch<Product[]>(`
        *[_type == "newProduct"] {
          _id,
          name,
          price,
          description,
          "productImage": productImage.asset->url,
          "category": category->name,
          stock,
          rating,
          isFeatured,
          trending
        }
      `),
      
      // FakeStore API products
      fetch('https://fakestoreapi.com/products').then(res => res.json())
    ]);

    // Transform FakeStore products to match Sanity product structure
    const transformedFakeStore = fakeStoreProducts.map((product: any) => ({
      _id: product.id,
      name: product.title,
      price: product.price,
      description: product.description,
      productImage: product.image,
      category: product.category,
      stock: 99, // Default value
      rating: product.rating.rate,
      isFeatured: false,
      trending: false
    }));

    // Combine products
    const allProducts = [...sanityProducts, ...transformedFakeStore];

    // Apply filters
    let filteredProducts = allProducts;

    // Category filter
    if (searchParams.category) {
      filteredProducts = filteredProducts.filter(
        p => p.category.toLowerCase() === searchParams.category?.toLowerCase()
      );
    }

    // Price filter
    if (searchParams.price) {
      const [min, max] = searchParams.price.split('-').map(Number);
      filteredProducts = filteredProducts.filter(p => {
        if (searchParams.price === '201+') return p.price >= 201;
        if (max) return p.price >= min && p.price <= max;
        return p.price >= min;
      });
    }

    // Sorting
    switch (searchParams.sort) {
      case 'price-asc':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      default:
        filteredProducts.sort(() => Math.random() - 0.5); // Random shuffle
    }

    // Pagination
    const page = Number(searchParams.page) || 1;
    const productsPerPage = 12;
    const start = (page - 1) * productsPerPage;
    const end = start + productsPerPage;
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    return {
      products: filteredProducts.slice(start, end),
      totalPages,
      currentPage: page,
      totalProducts: filteredProducts.length
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
}

async function getCategories() {
  try {
    // Combine categories from both sources
    const [sanityCategories, fakeStoreCategories] = await Promise.all([
      // Sanity categories
      serverClient.fetch<Array<{ _id: string; name: string }>>(
        `*[_type == "category"] { _id, name }`
      ),
      
      // FakeStore categories
      fetch('https://fakestoreapi.com/products/categories')
        .then(res => res.json())
        .then(categories => categories.map((name: string) => ({
          _id: name.toLowerCase().replace(' ', '-'),
          name: name.charAt(0).toUpperCase() + name.slice(1)
        })))
    ]);

    // Remove duplicates
    const uniqueCategories = Array.from(new Map(
      [...sanityCategories, ...fakeStoreCategories]
        .map(item => [item.name, item])
    ).values());

    return uniqueCategories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
}

export default async function NewProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [{ products, totalPages, currentPage, totalProducts }, categories] = await Promise.all([
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
          <h1 className="text-2xl font-bold text-gray-900">New Products</h1>
          <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full mt-2 sm:mt-0">
            {totalProducts} {totalProducts === 1 ? 'product' : 'products'} found
          </div>
        </div>

        {/* Products Grid */}
        <Suspense fallback={<Loading />}>
          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard 
                    key={product._id} 
                    product={product}
                    productType="new"
                  />
                ))}
              </div>
              <div className="mt-8">
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  baseUrl="/new"
                  searchParams={searchParams}
                />
              </div>
            </>
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