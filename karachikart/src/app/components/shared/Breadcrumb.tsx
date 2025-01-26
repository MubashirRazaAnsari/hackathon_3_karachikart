'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumb() {
  const pathname = usePathname();
  const paths = pathname.split('/').filter(Boolean);

  if (paths.length <= 1) return null;

  return (
    <nav className="text-sm mb-4">
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            Home
          </Link>
        </li>
        {paths.map((path, index) => {
          const href = `/${paths.slice(0, index + 1).join('/')}`;
          const isLast = index === paths.length - 1;
          const label = path.charAt(0).toUpperCase() + path.slice(1);

          return (
            <li key={path} className="flex items-center">
              <span className="text-gray-400 mx-2">/</span>
              {isLast ? (
                <span className="text-gray-900">{label}</span>
              ) : (
                <Link href={href} className="text-gray-500 hover:text-gray-700">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
} 