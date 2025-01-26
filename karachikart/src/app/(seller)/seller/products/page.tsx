'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaBox } from 'react-icons/fa';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: {
    name: string;
  };
  productImage: any;
  type: 'newProduct' | 'secondhandProduct';
  status: string;
  condition?: string;
}

export default function SellerProducts() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      const query = `*[
        (_type == "newProduct" || _type == "secondhandProduct") && 
        seller._ref == $sellerId
      ] {
        _id,
        _type,
        name,
        price,
        description,
        category->{name},
        productImage,
        status,
        condition
      }`;

      const data = await client.fetch(query, {
        sellerId: session?.user?.id
      });

      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Add real-time product updates
  useEffect(() => {
    const subscription = client
      .listen('*[_type in ["newProduct", "secondhandProduct"] && seller._ref == $sellerId]', 
        { sellerId: session?.user?.id }
      )
      .subscribe((update) => {
        fetchProducts();
        toast.success('Product list updated!');
      });

    return () => subscription.unsubscribe();
  }, [session?.user?.id, fetchProducts]);

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await client.delete(productId);
      setProducts(products.filter(product => product._id !== productId));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FaSpinner className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">My Products</h1>
        <Link
          href="/seller/products/new"
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <FaPlus className="h-4 w-4" /> Add New Product
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="relative aspect-video sm:aspect-square">
              <Image
                src={urlFor(product.productImage).url()}
                alt={product.name}
                fill
                className="object-cover rounded-t-lg"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Link
                  href={`/seller/products/${product._id}`}
                  className="p-2 bg-white rounded-full shadow hover:bg-blue-50 transition-colors"
                >
                  <FaEdit className="h-4 w-4 text-blue-500" />
                </Link>
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  className="p-2 bg-white rounded-full shadow hover:bg-red-50 transition-colors"
                >
                  <FaTrash className="h-4 w-4 text-red-500" />
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="mb-4">
                <h3 className="font-medium text-lg mb-1">{product.name}</h3>
                <p className="text-gray-600 text-lg">${product.price}</p>
              </div>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                {product.description}
              </p>
              <div className="flex flex-wrap gap-2 justify-between text-sm">
                <span className="px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                  {product.category.name}
                </span>
                <span className={`px-2 py-1 rounded-full ${
                  product.status === 'available' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {product.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="mb-4">
            <FaBox className="mx-auto h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No products yet
          </h3>
          <p className="text-gray-500 mb-4">
            Start by adding your first product
          </p>
          <Link
            href="/seller/products/new"
            className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FaPlus className="h-4 w-4" /> Add Product
          </Link>
        </div>
      )}

      {/* Confirmation Dialog Component could be added here */}
    </div>
  );
} 