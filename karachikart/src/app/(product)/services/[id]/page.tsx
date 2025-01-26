import { client } from '@/sanity/lib/client';
import ProductReviews from '@/app/components/ProductReviews';
import BookingSection from '@/app/components/BookingSection';
import { Suspense } from 'react';
import { StarIcon, ClockIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { notFound } from 'next/navigation';
import ProductDetailSkeleton from '@/app/components/ProductDetailSkeleton';
import { getImageUrl } from '@/utils/image';
import Image from 'next/image';

interface ServiceProvider {
  _id: string;
  name: string;
  rating: number;
  description?: string;
  contactInfo?: {
    email: string;
    phone: string;
  };
}

interface Service {
  _id: string;
  name: string;
  price: number;
  description: string;
  duration: string;
  category: string;
  status: string;
  availability: string[];
  image: any;
  provider: ServiceProvider;
  reviews: Array<{
    _id: string;
    rating: number;
    comment: string;
    userName: string;
    _createdAt: string;
  }>;
}

async function getService(id: string): Promise<Service> {
  try {
    const service = await client.fetch(`
      *[_type == "service" && _id == $id][0] {
        _id,
        name,
        price,
        description,
        duration,
        category,
        status,
        availability,
        image,
        provider->{
          _id,
          name,
          rating,
          description,
          contactInfo
        },
        "reviews": *[_type == "review" && service._ref == ^._id] {
          _id,
          rating,
          comment,
          "userName": user->name,
          _createdAt
        }
      }
    `, { id });

    if (!service) notFound();
    return service;
  } catch (error) {
    console.error('Error fetching service:', error);
    throw error;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'available':
      return 'text-green-600 bg-green-50';
    case 'unavailable':
      return 'text-red-600 bg-red-50';
    case 'coming-soon':
      return 'text-yellow-600 bg-yellow-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}

export default async function ServiceDetail({ params }: { params: { id: string } }) {
  const service = await getService(params.id);
  const imageUrl = getImageUrl(service.image);

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<ProductDetailSkeleton />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={imageUrl}
              alt={service.name}
              width={500}
              height={300}
              className="w-full h-auto"
            />
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div className="border-b pb-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold">{service.name}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(service.status)}`}>
                  {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">{service.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">
                    {service.availability.join(', ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Provider Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Service Provider</h3>
                {service.provider.rating && (
                  <div className="flex items-center gap-1">
                    <StarIcon className="h-5 w-5 text-yellow-400" />
                    <span>{service.provider.rating}</span>
                  </div>
                )}
              </div>
              <p className="text-gray-600">{service.provider.name}</p>
              {service.provider.description && (
                <p className="text-sm text-gray-500 mt-2">{service.provider.description}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>

            {/* Category */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Category:</span>
              <span className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-full">
                {service.category}
              </span>
            </div>

            {/* Booking Section */}
            <BookingSection
              serviceId={service._id}
              price={service.price}
              availability={service.availability}
              duration={service.duration}
              providerName={service.provider.name}
              status={service.status}
              providerId={service.provider._id}
            />
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <Suspense fallback={<div>Loading reviews...</div>}>
            <ProductReviews
              productId={service._id}
              reviews={service.reviews}
            />
          </Suspense>
        </div>
      </Suspense>
    </div>
  );
}
