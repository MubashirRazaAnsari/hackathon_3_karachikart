import Image from 'next/image';
import Link from 'next/link';
import { StarIcon } from '@heroicons/react/24/solid';

interface ServiceCardProps {
  service: {
    _id: string;
    name: string;
    price: number;
    description: string;
    duration: string;
    image: string;
    provider: {
      name: string;
      rating: number;
    };
  };
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link href={`/services/${service._id}`} className="block">
      <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-48">
          <Image
            src={service.image}
            alt={service.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4 space-y-2">
          <h3 className="text-lg font-semibold">{service.name}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{service.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">${service.price}</span>
            <span className="text-sm text-gray-500">{service.duration}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-1">
              <span className="text-sm">{service.provider.name}</span>
              <div className="flex items-center text-yellow-400">
                <StarIcon className="h-4 w-4" />
                <span className="text-sm">{service.provider.rating}</span>
              </div>
            </div>
            <button className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm hover:bg-indigo-700">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
} 