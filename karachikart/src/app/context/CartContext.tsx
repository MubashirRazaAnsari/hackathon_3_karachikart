'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { Product } from '@/types'

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  productImage: string;
  category: string;
  stock: number;
  description: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = useCallback((product: CartItem) => {
    setCart(prevCart => [...prevCart, product])
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setCart(prevCart => prevCart.filter(item => item._id !== productId))
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCart(prevCart => prevCart.map(item =>
      item._id === productId ? { ...item, quantity } : item
    ))
  }, [])

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);
  
  const totalItems = cart.length
  
  const totalPrice = cart.reduce((sum, item) => sum + (item.price || 0), 0)

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
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