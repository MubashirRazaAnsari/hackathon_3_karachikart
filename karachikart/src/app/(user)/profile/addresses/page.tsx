'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaCheck } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface Address {
  id: string;
  label: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

const mockAddresses: Address[] = [
  {
    id: '1',
    label: 'Home',
    fullName: 'John Doe',
    street: '123 Main Street',
    city: 'Karachi',
    state: 'Sindh',
    zipCode: '75600',
    country: 'Pakistan',
    phone: '+92 300 1234567',
    isDefault: true,
  },
  {
    id: '2',
    label: 'Office',
    fullName: 'John Doe',
    street: '456 Business Avenue',
    city: 'Karachi',
    state: 'Sindh',
    zipCode: '75700',
    country: 'Pakistan',
    phone: '+92 300 7654321',
    isDefault: false,
  },
];

export default function AddressesPage() {
  const { data: session, status } = useSession();
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const handleDelete = (addressId: string) => {
    if (confirm('Are you sure you want to delete this address?')) {
      setAddresses(addresses.filter((addr) => addr.id !== addressId));
      toast.success('Address deleted successfully');
    }
  };

  const handleSetDefault = (addressId: string) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === addressId,
      }))
    );
    toast.success('Default address updated');
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
        <p className="text-gray-600 mb-4">
          You need to be signed in to manage your addresses
        </p>
        <Link
          href="/auth/signin"
          className="inline-block bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Addresses</h1>
        <button
          onClick={() => {
            setSelectedAddress(null);
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          <FaPlus /> Add New Address
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-medium flex items-center gap-2">
                  {address.label}
                  {address.isDefault && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Default
                    </span>
                  )}
                </h3>
                <p className="text-gray-600 mt-1">{address.fullName}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedAddress(address);
                    setShowAddModal(true);
                  }}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <FaEdit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(address.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <FaTrash className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-1 text-sm text-gray-600">
              <p>{address.street}</p>
              <p>
                {address.city}, {address.state} {address.zipCode}
              </p>
              <p>{address.country}</p>
              <p className="mt-2">{address.phone}</p>
            </div>

            {!address.isDefault && (
              <button
                onClick={() => handleSetDefault(address.id)}
                className="mt-4 text-blue-500 text-sm hover:text-blue-600 flex items-center gap-1"
              >
                <FaCheck className="h-4 w-4" />
                Set as Default
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add/Edit Address Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-xl font-bold mb-6">
              {selectedAddress ? 'Edit Address' : 'Add New Address'}
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address Label
                </label>
                <input
                  type="text"
                  placeholder="e.g., Home, Office"
                  defaultValue={selectedAddress?.label}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              {/* Add more form fields for address details */}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  {selectedAddress ? 'Update' : 'Add'} Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 