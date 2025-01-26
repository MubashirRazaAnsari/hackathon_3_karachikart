'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams: Record<string, string | undefined>;
}

export default function Pagination({ currentPage, totalPages, baseUrl, searchParams }: PaginationProps) {
  const pathname = usePathname();

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    
    // Add existing search params
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && key !== 'page') params.append(key, value);
    });
    
    // Add page number
    if (pageNumber > 1) params.append('page', pageNumber.toString());
    
    return `${baseUrl}${params.toString() ? `?${params.toString()}` : ''}`;
  };

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      {currentPage > 1 && (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="px-4 py-2 border rounded hover:bg-gray-50"
        >
          Previous
        </Link>
      )}
      
      {[...Array(totalPages)].map((_, i) => {
        const pageNumber = i + 1;
        const isCurrentPage = pageNumber === currentPage;
        
        return (
          <Link
            key={pageNumber}
            href={createPageUrl(pageNumber)}
            className={`px-4 py-2 border rounded ${
              isCurrentPage 
                ? 'bg-blue-600 text-white' 
                : 'hover:bg-gray-50'
            }`}
          >
            {pageNumber}
          </Link>
        );
      })}
      
      {currentPage < totalPages && (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="px-4 py-2 border rounded hover:bg-gray-50"
        >
          Next
        </Link>
      )}
    </div>
  );
} 