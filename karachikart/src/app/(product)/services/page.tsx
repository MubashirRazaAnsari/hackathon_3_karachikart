'use client';

import React, { useState, useEffect } from 'react';
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

const CATEGORIES = [
  { title: 'All Services', value: 'all' },
  { title: 'Home Services', items: [
    { title: 'Home Maintenance', value: 'home-maintenance' },
    { title: 'Cleaning', value: 'cleaning' },
    { title: 'Plumbing', value: 'plumbing' },
    { title: 'Electrical', value: 'electrical' },
    { title: 'Painting', value: 'painting' },
    { title: 'Carpentry', value: 'carpentry' },
    { title: 'HVAC', value: 'hvac' },
  ]},
  { title: 'Tech Services', items: [
    { title: 'Web Development', value: 'web-development' },
    { title: 'Mobile App Development', value: 'mobile-development' },
    { title: 'UI/UX Design', value: 'ui-ux-design' },
    { title: 'Digital Marketing', value: 'digital-marketing' },
    { title: 'IT Support', value: 'it-support' },
  ]},
  { title: 'Professional Services', items: [
    { title: 'Business Consulting', value: 'business-consulting' },
    { title: 'Legal Services', value: 'legal' },
    { title: 'Accounting', value: 'accounting' },
    { title: 'Translation', value: 'translation' },
  ]},
  { title: 'Personal Services', items: [
    { title: 'Personal Training', value: 'personal-training' },
    { title: 'Life Coaching', value: 'life-coaching' },
    { title: 'Tutoring', value: 'tutoring' },
    { title: 'Photography', value: 'photography' },
  ]},
  { title: 'Automotive', items: [
    { title: 'Car Repair', value: 'car-repair' },
    { title: 'Car Wash', value: 'car-wash' },
    { title: 'Car Detailing', value: 'car-detailing' },
  ]},
  { title: 'Events & Entertainment', items: [
    { title: 'Event Planning', value: 'event-planning' },
    { title: 'DJ Services', value: 'dj-services' },
    { title: 'Catering', value: 'catering' },
  ]},
  { title: 'Other Services', items: [
    { title: 'Moving', value: 'moving' },
    { title: 'Pet Care', value: 'pet-care' },
    { title: 'Landscaping', value: 'landscaping' },
    { title: 'Custom Services', value: 'custom' },
  ]},
];

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

  const filteredServices = services.filter(service => 
    service?.price >= priceRange[0] && 
    service?.price <= priceRange[1] &&
    (!searchQuery || (
      (service?.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (service?.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    ))
  );

  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);

  if (loading) return <ProductListingSkeleton />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search and Category Bar */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
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
              className="sm:w-64 p-2 border rounded-md bg-white"
            >
              {CATEGORIES.map((category) => (
                <React.Fragment key={category.title}>
                  {category.items ? (
                    <optgroup label={category.title}>
                      {category.items.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.title}
                        </option>
                      ))}
                    </optgroup>
                  ) : (
                    <option value={category.value}>
                      {category.title}
                    </option>
                  )}
                </React.Fragment>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Our Services</h1>
          <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full mt-2 sm:mt-0">
            {filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'} found
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 