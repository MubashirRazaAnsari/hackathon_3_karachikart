'use client';

import { useState } from 'react';
import { FaEnvelope, FaPhone, FaSearch } from 'react-icons/fa';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: number;
  joinDate: string;
}

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    orders: 5,
    totalSpent: 499.99,
    joinDate: '2024-01-15',
  },
  // Add more mock customers
];

export default function CustomersManagement() {
  const [customers] = useState(mockCustomers);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(
    customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customer Management</h1>
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{customer.name}</h3>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <FaEnvelope className="h-4 w-4" />
                  <span className="text-sm">{customer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <FaPhone className="h-4 w-4" />
                  <span className="text-sm">{customer.phone}</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-lg font-semibold">{customer.orders}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Spent</p>
                  <p className="text-lg font-semibold">
                    ${customer.totalSpent.toFixed(2)}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Customer since {new Date(customer.joinDate).toLocaleDateString()}
              </p>
            </div>

            <div className="mt-4">
              <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No customers found matching your search.</p>
        </div>
      )}
    </div>
  );
} 