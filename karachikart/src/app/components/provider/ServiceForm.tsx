'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { client } from '@/sanity/lib/client';
import { toast } from 'react-hot-toast';

interface ServiceFormProps {
  service?: any;
  onClose: () => void;
  onSubmit: () => void;
}

export default function ServiceForm({ service, onClose, onSubmit }: ServiceFormProps) {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: service?.name || '',
    description: service?.description || '',
    price: service?.price || '',
    duration: service?.duration || '',
    availability: service?.availability || [],
    status: service?.status || 'available',
    image: null as File | null,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageAsset = formData.image 
        ? await client.assets.upload('image', formData.image)
        : null;

      const serviceDoc = {
        _type: 'service',
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        duration: formData.duration,
        availability: formData.availability,
        status: formData.status,
        provider: {
          _type: 'reference',
          _ref: session?.user?.id,
        },
        ...(imageAsset && {
          image: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: imageAsset._id,
            },
          },
        }),
      };

      if (service?._id) {
        await client.patch(service._id).set(serviceDoc).commit();
        toast.success('Service updated successfully');
      } else {
        await client.create(serviceDoc);
        toast.success('Service created successfully');
      }

      onSubmit();
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error('Failed to save service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-6">
          {service ? 'Edit Service' : 'Add New Service'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Service Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Duration
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                placeholder="e.g., 1 hour"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Availability
            </label>
            <select
              multiple
              value={formData.availability}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  availability: Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  ),
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="24/7">24/7</option>
              <option value="9am-5pm">9am-5pm</option>
              <option value="10am-6pm">10am-6pm</option>
              <option value="11am-7pm">11am-7pm</option>
              <option value="12pm-8pm">12pm-8pm</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
              <option value="coming-soon">Coming Soon</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Service Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  image: e.target.files ? e.target.files[0] : null,
                })
              }
              className="mt-1 block w-full"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Saving...' : service ? 'Update Service' : 'Add Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 