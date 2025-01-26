'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import toast from 'react-hot-toast';

export default function CompareButton({ product }: { product: Product }) {
  const [isInCompare, setIsInCompare] = useState(false);

  useEffect(() => {
    const compareList = JSON.parse(localStorage.getItem('compareList') || '[]');
    setIsInCompare(compareList.some((item: Product) => item._id === product._id));
  }, [product._id]);

  const handleCompare = () => {
    const compareList = JSON.parse(localStorage.getItem('compareList') || '[]');
    
    if (compareList.length >= 4 && !isInCompare) {
      toast.error('You can compare up to 4 products');
      return;
    }

    if (isInCompare) {
      const newList = compareList.filter((item: Product) => item._id !== product._id);
      localStorage.setItem('compareList', JSON.stringify(newList));
      setIsInCompare(false);
      toast.success('Removed from compare');
    } else {
      compareList.push(product);
      localStorage.setItem('compareList', JSON.stringify(compareList));
      setIsInCompare(true);
      toast.success('Added to compare');
    }
  };

  return (
    <button
      onClick={handleCompare}
      className={`text-sm px-3 py-1 rounded-md ${
        isInCompare 
          ? 'bg-gray-200 text-gray-700' 
          : 'bg-blue-100 text-blue-700'
      }`}
    >
      {isInCompare ? 'Remove Compare' : 'Compare'}
    </button>
  );
} 