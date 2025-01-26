'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { FaSave, FaSpinner } from 'react-icons/fa';
import { client } from '@/sanity/lib/client';
import { toast } from 'react-hot-toast';

interface ProviderSettings {
  businessName: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  workingHours: {
    monday: { start: string; end: string; closed: boolean };
    tuesday: { start: string; end: string; closed: boolean };
    wednesday: { start: string; end: string; closed: boolean };
    thursday: { start: string; end: string; closed: boolean };
    friday: { start: string; end: string; closed: boolean };
    saturday: { start: string; end: string; closed: boolean };
    sunday: { start: string; end: string; closed: boolean };
  };
  autoConfirm: boolean;
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    newBooking: boolean;
    bookingUpdates: boolean;
  };
}

const defaultWorkingHours = {
  start: '09:00',
  end: '17:00',
  closed: false,
};

export default function ProviderSettings() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<ProviderSettings>({
    businessName: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    workingHours: {
      monday: { ...defaultWorkingHours },
      tuesday: { ...defaultWorkingHours },
      wednesday: { ...defaultWorkingHours },
      thursday: { ...defaultWorkingHours },
      friday: { ...defaultWorkingHours },
      saturday: { ...defaultWorkingHours, closed: true },
      sunday: { ...defaultWorkingHours, closed: true },
    },
    autoConfirm: false,
    notificationPreferences: {
      email: true,
      sms: false,
      newBooking: true,
      bookingUpdates: true,
    },
  });

  const fetchSettings = useCallback(async () => {
    try {
      const query = `*[_type == "serviceProvider" && _id == $providerId][0]`;
      const data = await client.fetch(query, {
        providerId: session?.user?.id
      });
      
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await client
        .patch(session?.user?.id as string)
        .set(settings)
        .commit();

      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto px-4 sm:px-6">
      <h1 className="text-xl sm:text-2xl font-bold">Provider Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Business Information */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-medium mb-4">Business Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name
              </label>
              <input
                type="text"
                value={settings.businessName}
                onChange={(e) =>
                  setSettings({ ...settings, businessName: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) =>
                  setSettings({ ...settings, email: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) =>
                  setSettings({ ...settings, phone: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) =>
                  setSettings({ ...settings, address: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                value={settings.bio}
                onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Working Hours */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-medium mb-4">Working Hours</h2>
          <div className="space-y-4">
            {Object.entries(settings.workingHours).map(([day, hours]) => (
              <div key={day} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <div className="w-full sm:w-24 font-medium capitalize">{day}</div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={!hours.closed}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          workingHours: {
                            ...settings.workingHours,
                            [day]: { ...hours, closed: !e.target.checked },
                          },
                        })
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm">Open</span>
                  </label>
                  {!hours.closed && (
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <input
                        type="time"
                        value={hours.start}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            workingHours: {
                              ...settings.workingHours,
                              [day]: { ...hours, start: e.target.value },
                            },
                          })
                        }
                        className="w-full sm:w-auto rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <span className="text-sm">to</span>
                      <input
                        type="time"
                        value={hours.end}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            workingHours: {
                              ...settings.workingHours,
                              [day]: { ...hours, end: e.target.value },
                            },
                          })
                        }
                        className="w-full sm:w-auto rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-medium mb-4">Notification Preferences</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notificationPreferences.email}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notificationPreferences: {
                      ...settings.notificationPreferences,
                      email: e.target.checked,
                    },
                  })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm">Email notifications</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notificationPreferences.sms}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notificationPreferences: {
                      ...settings.notificationPreferences,
                      sms: e.target.checked,
                    },
                  })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm">SMS notifications</span>
            </label>
          </div>
        </div>

        {/* Booking Settings */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-medium mb-4">Booking Settings</h2>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.autoConfirm}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    autoConfirm: e.target.checked,
                  })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm">Auto-confirm bookings</span>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {saving ? (
              <>
                <FaSpinner className="animate-spin h-4 w-4" /> Saving...
              </>
            ) : (
              <>
                <FaSave className="h-4 w-4" /> Save Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 