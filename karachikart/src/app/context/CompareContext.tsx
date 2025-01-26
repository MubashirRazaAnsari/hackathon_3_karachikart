'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types';
import { toast } from 'react-hot-toast';

interface CompareContextType {
  compareItems: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareItems, setCompareItems] = useState<Product[]>([]);

  useEffect(() => {
    const savedItems = localStorage.getItem('compareList');
    if (savedItems) {
      setCompareItems(JSON.parse(savedItems));
    }
  }, []);

  const addToCompare = (product: Product) => {
    if (compareItems.length >= 4) {
      toast.error('You can compare up to 4 products');
      return;
    }
    
    if (isInCompare(product._id || '')) {
      toast.error('Product already in compare list');
      return;
    }

    const newItems = [...compareItems, product];
    setCompareItems(newItems);
    localStorage.setItem('compareList', JSON.stringify(newItems));
    toast.success('Added to compare list');
  };

  const removeFromCompare = (productId: string) => {
    const newItems = compareItems.filter(item => item._id !== productId);
    setCompareItems(newItems);
    localStorage.setItem('compareList', JSON.stringify(newItems));
    toast.success('Removed from compare list');
  };

  const clearCompare = () => {
    setCompareItems([]);
    localStorage.removeItem('compareList');
  };

  const isInCompare = (productId: string) => {
    return compareItems.some(item => item._id === productId);
  };

  return (
    <CompareContext.Provider value={{
      compareItems,
      addToCompare,
      removeFromCompare,
      clearCompare,
      isInCompare
    }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
} 