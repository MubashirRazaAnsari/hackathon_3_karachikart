'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { createProduct, updateProduct, deleteProduct } from '@/app/actions/product';
import type { Product } from '@/types';

interface ProductFormProps {
  mode: 'create' | 'edit';
  product?: Product;
  onClose?: () => void;
}

export default function ProductForm({ mode, product, onClose }: ProductFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: product || {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: { name: '' },
      productImage: null,
      _id: '',
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      if (mode === 'create') {
        await createProduct(data);
        toast.success('Product created successfully');
      } else {
        await updateProduct(product?._id || '', data);
        toast.success('Product updated successfully');
      }
      router.refresh();
      setIsOpen(false);
      onClose?.();
    } catch (error) {
      toast.error('Failed to save product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!product || !window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    setIsLoading(true);
    try {
      await deleteProduct(product._id || '');
      toast.success('Product deleted successfully');
      router.refresh();
      onClose?.();
    } catch (error) {
      toast.error('Failed to delete product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        {mode === 'create' ? 'Add New Product' : 'Edit Product'}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">
              {mode === 'create' ? 'Add New Product' : 'Edit Product'}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  className="w-full p-2 border rounded-md"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  {...register('description', { required: 'Description is required' })}
                  className="w-full p-2 border rounded-md h-32"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('price', { required: 'Price is required', min: 0 })}
                    className="w-full p-2 border rounded-md"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm">{errors.price.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Stock</label>
                  <input
                    type="number"
                    {...register('stock', { required: 'Stock is required', min: 0 })}
                    className="w-full p-2 border rounded-md"
                  />
                  {errors.stock && (
                    <p className="text-red-500 text-sm">{errors.stock.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  {...register('category.name', { required: 'Category is required' })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select a category</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="books">Books</option>
                  <option value="home">Home & Garden</option>
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm">{errors.category.message}</p>
                )}
              </div>

              <div className="flex justify-end gap-4 mt-6">
                {mode === 'edit' && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="px-4 py-2 text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onClose?.();
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {isLoading ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
} 