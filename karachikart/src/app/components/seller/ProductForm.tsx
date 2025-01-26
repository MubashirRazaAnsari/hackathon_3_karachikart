'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { client } from '@/sanity/lib/client';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface ProductFormData {
  name: string;
  price: number;
  description: string;
  category: string;
  productImage: File | null;
  type: 'newProduct' | 'secondhandProduct';
  status: string;
  condition?: string;
}

interface ProductFormProps {
  product?: any;
  onClose: () => void;
  onSubmit: () => void;
}

export default function ProductForm({ product, onClose, onSubmit }: ProductFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || '',
    price: product?.price || 0,
    description: product?.description || '',
    category: product?.category?._ref || '',
    productImage: null,
    type: product?._type || 'newProduct',
    status: product?.status || 'available',
    condition: product?.condition || 'new'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageAsset;
      if (formData.productImage) {
        // Upload image to Sanity
        imageAsset = await client.assets.upload('image', formData.productImage);
      }

      const productData = {
        _type: formData.type,
        name: formData.name,
        price: Number(formData.price),
        description: formData.description,
        category: {
          _type: 'reference',
          _ref: formData.category
        },
        seller: {
          _type: 'reference',
          _ref: session?.user?.id
        },
        productImage: imageAsset ? {
          _type: 'image',
          asset: {
            _type: "reference",
            _ref: imageAsset._id
          }
        } : product?.productImage,
        status: formData.status,
        condition: formData.condition
      };

      if (product) {
        // Update existing product
        await client
          .patch(product._id)
          .set(productData)
          .commit();
        toast.success('Product updated successfully');
      } else {
        // Create new product
        await client.create(productData);
        toast.success('Product created successfully');
      }

      onSubmit();
      router.refresh();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">
          {product ? 'Edit Product' : 'Add New Product'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'newProduct' | 'secondhandProduct' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="newProduct">New Product</option>
              <option value="secondhandProduct">Secondhand Product</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, productImage: e.target.files?.[0] || null })}
              className="mt-1 block w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {formData.type === 'secondhandProduct' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Condition
              </label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="new">New</option>
                <option value="like-new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Saving...' : (product ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 