import { create } from 'zustand';
import { Product } from '@/types';
import { toast } from 'react-hot-toast';

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  updateStock: (productId: string, newStock: number) => Promise<void>;
  setProducts: (products: Product[]) => void;
  fetchProducts: () => Promise<void>;
  subscribeToStockUpdates: () => void;
  unsubscribeFromStockUpdates: () => void;
}

export const useProductStore = create<ProductState>((set, get) => {
  let eventSource: EventSource | null = null;

  return {
    products: [],
    loading: false,
    error: null,

    updateStock: async (productId, newStock) => {
      try {
        const response = await fetch(`/api/products/${productId}/stock`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ stock: newStock }),
        });

        if (!response.ok) {
          throw new Error('Failed to update stock');
        }

        // Update local state
        set((state) => ({
          products: state.products.map((product) =>
            product._id === productId ? { ...product, stock: newStock } : product
          ),
        }));
      } catch (error) {
        console.error('Error updating stock:', error);
        throw error;
      }
    },

    setProducts: (products) => set({ products }),

    fetchProducts: async () => {
      set({ loading: true });
      try {
        const response = await fetch('/api/products');
        const products = await response.json();
        set({ products, loading: false });
      } catch (error) {
        set({ error: 'Failed to fetch products', loading: false });
        toast.error('Failed to fetch products');
      }
    },

    subscribeToStockUpdates: () => {
      if (eventSource) return; // Already subscribed

      eventSource = new EventSource('/api/products/stock-updates');
      
      eventSource.onmessage = (event) => {
        const { productId, newStock } = JSON.parse(event.data);
        set((state) => ({
          products: state.products.map(product => 
            product._id === productId 
              ? { ...product, stock: newStock }
              : product
          ),
        }));
      };

      eventSource.onerror = () => {
        eventSource?.close();
        eventSource = null;
        console.error('Lost connection to stock updates');
      };
    },

    unsubscribeFromStockUpdates: () => {
      if (eventSource) {
        eventSource.close();
        eventSource = null;
      }
    },
  };
}); 