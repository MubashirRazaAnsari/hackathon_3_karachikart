'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

export default function BecomeProvider() {
  const [loading, setLoading] = useState(false);
  const { data: session, update } = useSession();

  const handleRegister = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/provider/register', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to register');
      }

      // Update session to reflect new role
      await update();
      toast.success('Successfully registered as provider!');
    } catch (error) {
      toast.error('Failed to register as provider');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRegister}
      disabled={loading}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? 'Processing...' : 'Become a Provider'}
    </button>
  );
} 