'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/sanity/lib/image';
import { Service } from '@/types/index';

interface ServiceGridProps {
  services: Service[];
}

export default function ServiceGrid({ services }: ServiceGridProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <Link key={service._id} href={`/services/${service._id}`}>
          <div 
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            onMouseEnter={() => setHoveredId(service._id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="relative h-48">
              {service.image && (
                <Image
                  src={urlFor(service.image).url()}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {service.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">${service.price}</span>
                <div className="text-sm text-gray-500">
                  by {service.provider?.name}
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 