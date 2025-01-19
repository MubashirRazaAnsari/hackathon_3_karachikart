'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  category: string,
  description: string
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (product: CartItem) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        try {
          const parsedCart: CartItem[] = JSON.parse(savedCart)
          setCart(parsedCart)
          // Calculate totals immediately after loading cart
          const items = parsedCart.reduce((total, item) => total + item.quantity, 0)
          const price = parsedCart.reduce((total, item) => total + (item.price * item.quantity), 0)
          setTotalItems(items)
          setTotalPrice(price)
        } catch (e) {
          console.error('Error parsing cart from localStorage:', e)
          setCart([])
        }
      }
    }
  }, [])

  const calculateTotals = useCallback(() => {
    const items = cart.reduce((total, item) => total + item.quantity, 0)
    const price = cart.reduce((total, item) => total + (item.price * item.quantity), 0)
    setTotalItems(items)
    setTotalPrice(price)
  }, [cart])

  // Save cart to localStorage and update totals whenever cart changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart))
      calculateTotals()
    }
  }, [cart, calculateTotals])

  const addToCart = (product: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.id === product.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice
    }}>
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