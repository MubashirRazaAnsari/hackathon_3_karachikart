'use client';

import { useState, useEffect } from 'react';
import { client } from '@/sanity/lib/client';
import ProductListingSkeleton from '@/app/components/ProductListingSkeleton';
import ServiceCard from '@/app/components/ServiceCard';

interface Service {
  _id: string;
  name: string;
  price: number;
  category: string;
  image: any;
  description: string;
  duration: string;
  availability: string[];
  provider: {
    _ref: string;
    name: string;
    rating: number;
  };
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const query = `*[_type == "service"] {
          _id,
          name,
          price,
          category,
          description,
          duration,
          availability,
          "image": image.asset->url,
          provider->{
            _id,
            name,
            rating
          }
        }`;
        const data = await client.fetch(query);
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const filteredServices = services
    .filter(service => 
      (selectedCategory === 'all' || service.category === selectedCategory) &&
      service.price >= priceRange[0] && 
      service.price <= priceRange[1] &&
      (service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       service.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);

  if (loading) return <ProductListingSkeleton />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Our Services</h1>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 p-2 border rounded-md"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="all">All Categories</option>
            <option value="cleaning">Cleaning</option>
            <option value="repair">Repair</option>
            <option value="maintenance">Maintenance</option>
            {/* Add more categories */}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedServices.map((service) => (
          <ServiceCard key={service._id} service={service} />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center gap-2">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-4 py-2 rounded ${
              currentPage === i + 1
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
} 