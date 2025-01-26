'use client';

import { Service } from '@/types/index';
import { useState } from 'react';
import { useForm } from 'react-hook-form';


interface ServiceFormProps {
  service?: Service | null;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export default function ServiceForm({ service, onClose, onSubmit }: ServiceFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: service || {
      title: '',
      description: '',
      price: 0,
      deliveryTimeEstimate: '',
      availability: true,
      tags: [],
    },
  });

  const onSubmitForm = async (data: any) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">
          {service ? 'Edit Service' : 'Add New Service'}
        </h2>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              {...register('title', { required: 'Title is required' })}
              className="w-full p-2 border rounded-md"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
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
              <label className="block text-sm font-medium mb-1">Price ($)</label>
              <input
                type="number"
                {...register('price', { required: 'Price is required', min: 0 })}
                className="w-full p-2 border rounded-md"
              />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Delivery Time (days)
              </label>
              <input
                type="number"
                {...register('deliveryTimeEstimate', { required: true, min: 1 })}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tags</label>
            <input
              {...register('tags')}
              placeholder="Separate tags with commas"
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('availability')}
              className="mr-2"
            />
            <label className="text-sm font-medium">Available for Booking</label>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isLoading ? 'Saving...' : 'Save Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 