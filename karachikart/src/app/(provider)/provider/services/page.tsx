'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import ServiceForm from '@/app/components/provider/ServiceForm';

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  availability: string[];
  status: string;
  image: any;
}

export default function ProviderServices() {
  const { data: session } = useSession();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      const query = `*[_type == "service" && provider._ref == $providerId] {
        _id,
        name,
        description,
        price,
        duration,
        availability,
        status,
        image
      }`;

      const data = await client.fetch(query, {
        providerId: session?.user?.id
      });

      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      await client.delete(serviceId);
      toast.success('Service deleted successfully');
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">My Services</h1>
        <button
          onClick={() => {
            setSelectedService(null);
            setShowForm(true);
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          <FaPlus /> Add New Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {services.map((service) => (
          <div
            key={service._id}
            className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="relative aspect-video sm:h-48">
              <Image
                src={urlFor(service.image).url()}
                alt={service.name}
                fill
                className="object-cover rounded-t-lg"
              />
            </div>
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                <div>
                  <h3 className="font-medium">{service.name}</h3>
                  <p className="text-gray-600">${service.price}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedService(service);
                      setShowForm(true);
                    }}
                    className="p-2 text-blue-500 hover:text-blue-600"
                    aria-label="Edit service"
                  >
                    <FaEdit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="p-2 text-red-500 hover:text-red-600"
                    aria-label="Delete service"
                  >
                    <FaTrash className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                {service.description}
              </p>
              <div className="flex flex-wrap gap-2 justify-between text-sm">
                <span className="text-gray-600">{service.duration}</span>
                <span
                  className={`px-2 py-1 rounded-full ${
                    service.status === 'available'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {service.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Service Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="relative bg-white rounded-lg w-full max-w-2xl p-6">
              <ServiceForm
                service={selectedService}
                onClose={() => setShowForm(false)}
                onSubmit={() => {
                  setShowForm(false);
                  fetchServices();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 