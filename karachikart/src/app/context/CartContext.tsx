'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { Product } from '@/types'

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  productImage?: string;
  image?: string;
  category: string;
  stock: number;
  description: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        setCart(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error('Error loading cart:', error)
      toast.error('Error loading your cart')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = useCallback((product: Product) => {
    if (!product) return; // Early guard clause
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id)
      
      if (existingItem) {
        if (existingItem.quantity >= 10) {
          toast.error('Maximum quantity reached')
          return prevCart
        }
        return prevCart.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      
      const cartItem: CartItem = {
        _id: product._id || '',
        name: product.name || '',
        price: product.price || 0,
        productImage: typeof product.productImage === 'string' ? product.productImage : undefined,
        image: product.image || '',
        category: typeof product.category === 'string' ? product.category : product.category?.name || '',
        stock: product.stock ?? 0,
        description: product.description || '',
        quantity: 1
      }
      return [...prevCart, cartItem]
    })
    toast.success('Added to cart')
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    if (!productId) return; // Early guard clause
    setCart(prevCart => prevCart.filter(item => item._id !== productId))
    toast.success('Removed from cart')
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (!productId || quantity < 1 || quantity > 10) {
      toast.error('Invalid quantity')
      return
    }
    
    setCart(prevCart => prevCart.map(item =>
      item._id === productId ? { ...item, quantity } : item
    ))
  }, [])

  const clearCart = useCallback(() => {
    setCart([])
    toast.success('Cart cleared')
  }, [])
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isLoading
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
} 