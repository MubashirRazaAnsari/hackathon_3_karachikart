'use client';

import { useState } from 'react';
import { FaSave } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface Settings {
  storeName: string;
  storeEmail: string;
  currency: string;
  taxRate: number;
  shippingFee: number;
  minOrderAmount: number;
  maxOrderAmount: number;
  allowGuestCheckout: boolean;
  requirePhoneNumber: boolean;
  enableReviews: boolean;
  enableWishlist: boolean;
  enableNewsletter: boolean;
}

const initialSettings: Settings = {
  storeName: 'KarachiKART',
  storeEmail: 'info@karachikart.com',
  currency: 'USD',
  taxRate: 10,
  shippingFee: 15,
  minOrderAmount: 0,
  maxOrderAmount: 10000,
  allowGuestCheckout: true,
  requirePhoneNumber: true,
  enableReviews: true,
  enableWishlist: true,
  enableNewsletter: true,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Store Settings</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
        {/* Store Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Store Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Store Name
              </label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) =>
                  setSettings({ ...settings, storeName: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Store Email
              </label>
              <input
                type="email"
                value={settings.storeEmail}
                onChange={(e) =>
                  setSettings({ ...settings, storeEmail: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Payment Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Currency
              </label>
              <select
                value={settings.currency}
                onChange={(e) =>
                  setSettings({ ...settings, currency: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tax Rate (%)
              </label>
              <input
                type="number"
                value={settings.taxRate}
                onChange={(e) =>
                  setSettings({ ...settings, taxRate: Number(e.target.value) })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Shipping Settings */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Shipping Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Shipping Fee
              </label>
              <input
                type="number"
                value={settings.shippingFee}
                onChange={(e) =>
                  setSettings({ ...settings, shippingFee: Number(e.target.value) })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Minimum Order Amount
                </label>
                <input
                  type="number"
                  value={settings.minOrderAmount}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      minOrderAmount: Number(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Maximum Order Amount
                </label>
                <input
                  type="number"
                  value={settings.maxOrderAmount}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      maxOrderAmount: Number(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Features</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="allowGuestCheckout"
                checked={settings.allowGuestCheckout}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    allowGuestCheckout: e.target.checked,
                  })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="allowGuestCheckout"
                className="ml-2 block text-sm text-gray-900"
              >
                Allow Guest Checkout
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="requirePhoneNumber"
                checked={settings.requirePhoneNumber}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    requirePhoneNumber: e.target.checked,
                  })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="requirePhoneNumber"
                className="ml-2 block text-sm text-gray-900"
              >
                Require Phone Number
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableReviews"
                checked={settings.enableReviews}
                onChange={(e) =>
                  setSettings({ ...settings, enableReviews: e.target.checked })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="enableReviews"
                className="ml-2 block text-sm text-gray-900"
              >
                Enable Product Reviews
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            <FaSave />
            {isLoading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
} 