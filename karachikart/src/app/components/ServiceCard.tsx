import Image from 'next/image';
import Link from 'next/link';
import { StarIcon } from '@heroicons/react/24/solid';

interface ServiceProvider {
  _ref?: string;
  name?: string;
  rating?: number;
}

interface Service {
  _id: string;
  name: string;
  price: number;
  category?: string;
  image?: string;
  description: string;
  duration?: string;
  availability?: string[];
  provider?: ServiceProvider;
}

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48">
        <Image
          src={service.image || '/placeholder.jpg'}
          alt={service.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {service.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">${service.price}</span>
          {service.duration && (
            <span className="text-sm text-gray-500">{service.duration}</span>
          )}
        </div>
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-1">
            <span className="text-sm">
              {service.provider?.name || 'Service Provider'}
            </span>
            {service.provider?.rating && (
              <div className="flex items-center text-yellow-400">
                <StarIcon className="h-4 w-4" />
                <span className="text-sm">{service.provider.rating}</span>
              </div>
            )}
          </div>
        </div>
          <Link
            href={`/services/${service._id}`}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View Details
          </Link>
      </div>
    </div>
  );
} 