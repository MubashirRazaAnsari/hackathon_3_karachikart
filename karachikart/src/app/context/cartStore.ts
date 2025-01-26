import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product) => set((state) => {
        const existingItem = state.items.find(item => item._id === product._id);
        
        if (existingItem) {
          return {
            items: state.items.map(item =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          };
        }
        
        return {
          items: [...state.items, { ...product, quantity: 1 }],
        };
      }),

      removeItem: (productId) => set((state) => ({
        items: state.items.filter(item => item._id !== productId),
      })),

      updateQuantity: (productId, quantity) => set((state) => ({
        items: state.items.map(item =>
          item._id === productId
            ? { ...item, quantity: Math.max(0, quantity) }
            : item
        ),
      })),

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        const state = get();
        return state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'cart-storage',
    }
  )
); 