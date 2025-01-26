'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaCreditCard, FaCheck } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface PaymentMethod {
  id: string;
  type: 'credit' | 'debit';
  cardNumber: string;
  expiryDate: string;
  cardHolder: string;
  isDefault: boolean;
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'credit',
    cardNumber: '**** **** **** 1234',
    expiryDate: '12/25',
    cardHolder: 'John Doe',
    isDefault: true,
  },
  {
    id: '2',
    type: 'debit',
    cardNumber: '**** **** **** 5678',
    expiryDate: '06/24',
    cardHolder: 'John Doe',
    isDefault: false,
  },
];

export default function PaymentMethodsPage() {
  const { data: session, status } = useSession();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  const handleDelete = (methodId: string) => {
    if (confirm('Are you sure you want to delete this payment method?')) {
      setPaymentMethods(paymentMethods.filter((method) => method.id !== methodId));
      toast.success('Payment method deleted successfully');
    }
  };

  const handleSetDefault = (methodId: string) => {
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === methodId,
      }))
    );
    toast.success('Default payment method updated');
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
        <p className="text-gray-600 mb-4">
          You need to be signed in to manage your payment methods
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
        <h1 className="text-2xl font-bold">Payment Methods</h1>
        <button
          onClick={() => {
            setSelectedMethod(null);
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          <FaPlus /> Add New Card
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <FaCreditCard className="h-6 w-6 text-gray-400" />
                <div>
                  <h3 className="font-medium flex items-center gap-2">
                    {method.type.charAt(0).toUpperCase() + method.type.slice(1)} Card
                    {method.isDefault && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </h3>
                  <p className="text-gray-600 mt-1">{method.cardNumber}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedMethod(method);
                    setShowAddModal(true);
                  }}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <FaEdit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(method.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <FaTrash className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <p>Expires: {method.expiryDate}</p>
              <p className="mt-1">Card Holder: {method.cardHolder}</p>
            </div>

            {!method.isDefault && (
              <button
                onClick={() => handleSetDefault(method.id)}
                className="mt-4 text-blue-500 text-sm hover:text-blue-600 flex items-center gap-1"
              >
                <FaCheck className="h-4 w-4" />
                Set as Default
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add/Edit Payment Method Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-xl font-bold mb-6">
              {selectedMethod ? 'Edit Card' : 'Add New Card'}
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="**** **** **** ****"
                  maxLength={19}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength={5}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="***"
                    maxLength={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Card Holder Name
                </label>
                <input
                  type="text"
                  placeholder="Name on card"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
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
                  {selectedMethod ? 'Update' : 'Add'} Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 