'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  let errorMessage = 'An error occurred during authentication';

  switch (error) {
    case 'CredentialsSignin':
      errorMessage = 'Invalid email or password';
      break;
    case 'AccessDenied':
      errorMessage = 'You do not have permission to access this resource';
      break;
    case 'EmailSignin':
      errorMessage = 'The email verification link may have expired';
      break;
    // Add more error cases as needed
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {errorMessage}
          </p>
        </div>
        <div className="flex flex-col items-center gap-4">
          <Link
            href="/auth/signin"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 