'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import ProductForm from '@/app/components/seller/ProductForm';
import { FaEdit, FaTrash, FaChartLine } from 'react-icons/fa';

interface ProductStats {
  totalSales: number;
  revenue: number;
  averageRating: number;
  viewCount: number;
}

export default function ProductDetail({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [stats, setStats] = useState<ProductStats>({
    totalSales: 0,
    revenue: 0,
    averageRating: 0,
    viewCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);

  const fetchProductDetails = useCallback(async () => {
    try {
      const productQuery = `*[_type in ["newProduct", "secondhandProduct"] && _id == $id][0] {
        ...,
        category->,
        seller->,
        "reviews": *[_type == "review" && product._ref == ^._id] {
          _id,
          rating,
          comment,
          user->{name, image},
          _createdAt
        }
      }`;

      const statsQuery = `{
        "totalSales": count(*[_type == "order" && product._ref == $id]),
        "revenue": *[_type == "order" && product._ref == $id] | order(_createdAt desc) {total}[].total,
        "averageRating": avg(*[_type == "review" && product._ref == $id].rating),
        "viewCount": *[_type == "product" && _id == $id].viewCount
      }`;

      const [productData, statsData] = await Promise.all([
        client.fetch(productQuery, { id: params.id }),
        client.fetch(statsQuery, { id: params.id })
      ]);

      setProduct(productData);
      setStats({
        ...statsData,
        revenue: statsData.revenue?.reduce((sum: number, val: number) => sum + val, 0) || 0
      });
    } catch (error) {
      console.error('Error fetching product details:', error);
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await client.delete(params.id);
      toast.success('Product deleted successfully');
      router.push('/seller/products');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowEditForm(true)}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            <FaEdit /> Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            <FaTrash /> Delete
          </button>
        </div>
      </div>

      {/* Product Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500">Total Sales</div>
          <div className="text-2xl font-bold">{stats.totalSales}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500">Revenue</div>
          <div className="text-2xl font-bold">${stats.revenue.toFixed(2)}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500">Average Rating</div>
          <div className="text-2xl font-bold">{stats.averageRating?.toFixed(1) || 'N/A'}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500">Views</div>
          <div className="text-2xl font-bold">{stats.viewCount || 0}</div>
        </div>
      </div>

      {/* Product Details */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          <div className="relative aspect-square">
            <Image
              src={urlFor(product.productImage).url()}
              alt={product.name}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Details</h2>
              <p className="mt-1 text-gray-500">{product.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Price</div>
                <div className="font-medium">${product.price}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Category</div>
                <div className="font-medium">{product.category?.name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Status</div>
                <div className="font-medium">{product.status}</div>
              </div>
              {product.condition && (
                <div>
                  <div className="text-sm text-gray-500">Condition</div>
                  <div className="font-medium">{product.condition}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900">Customer Reviews</h2>
            <div className="mt-6 space-y-6">
              {product.reviews?.map((review: any) => (
                <div key={review._id} className="flex space-x-4">
                  <div className="relative h-10 w-10 flex-shrink-0">
                    <Image
                      src={review.user?.image || '/placeholder-avatar.jpg'}
                      alt={review.user?.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <p className="font-medium">{review.user?.name}</p>
                      <span className="ml-2 text-yellow-400">★</span>
                      <span className="ml-1">{review.rating}</span>
                    </div>
                    <p className="mt-1 text-gray-500">{review.comment}</p>
                    <p className="mt-1 text-sm text-gray-400">
                      {new Date(review._createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {(!product.reviews || product.reviews.length === 0) && (
                <p className="text-gray-500">No reviews yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showEditForm && (
        <ProductForm
          product={product}
          onClose={() => setShowEditForm(false)}
          onSubmit={() => {
            setShowEditForm(false);
            fetchProductDetails();
          }}
        />
      )}
    </div>
  );
} 