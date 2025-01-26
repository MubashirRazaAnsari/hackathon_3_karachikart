'use client';

import { useCompare } from '@/app/context/CompareContext';
import { Product } from '@/types';
import { FaBalanceScale } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function CompareButton({ product }: { product: Product }) {
  const { addToCompare, removeFromCompare, isInCompare, compareItems } = useCompare();

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    const productId = product._id || '';  // Add default empty string
    
    if (isInCompare(productId)) {
      removeFromCompare(productId);
      toast.success('Removed from comparison');
    } else {
      if (compareItems.length >= 4) {
        toast.error('You can compare up to 4 products');
        return;
      }
      addToCompare(product);
      toast.success('Added to comparison');
    }
  };

  return (
    <button
      onClick={handleCompare}
      className={`flex items-center gap-2 px-3 py-1 rounded-md transition-colors ${
        isInCompare(product._id || '') ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
      }`}
    >
      <FaBalanceScale className="w-4 h-4" />
      <span className="hidden lg:block text-sm">
        {isInCompare(product._id || '') ? 'Remove' : 'Compare'}
      </span>
    </button>
  );
} 