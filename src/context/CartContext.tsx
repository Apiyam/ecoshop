'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { ProductItem } from '../lib/wooApi'

export type CartItem = {
  product: ProductItem
  quantity: number
}

type DiscountGoal = {
  minProducts: number
  discount: number
}
type CartContextType = {
  cartItems: CartItem[]
  totalItems: number
  updatedCart: boolean
  shouldDisplayCart: boolean
  addedToCartMessage: { kind: 'added'; name: string } | { kind: 'updated'; name: string; quantity: number } | null
  addToCart: (item: CartItem) => void
  updateQuantity: (id: number, quantity: number) => void
  removeFromCart: (id: number) => void
  clearCart: () => void
  searchItem: (id: number) => CartItem | undefined
  setShouldDisplayCart: (shouldDisplay: boolean) => void
  goalCustomPackage: number
  setGoalCustomPackage: (goal: number) => void
  currentGoal: DiscountGoal
  nextGoal: DiscountGoal
  setCurrentGoal: (goal: DiscountGoal) => void
  setNextGoal: (goal: DiscountGoal) => void
  discountGoals: DiscountGoal[]
  currentDiscount: number
  setCurrentDiscount: (discount: number) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const discountGoals = [
  { minProducts: 6, discount: 5 },
  { minProducts: 10, discount: 8 },
  { minProducts: 15, discount: 10 },
  { minProducts: 20, discount: 12 },
];

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [goalCustomPackage, setGoalCustomPackage] = useState(0)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [updatedCart, setUpdatedCart] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const [shouldDisplayCart, setShouldDisplayCart] = useState(false)
  const [addedToCartMessage, setAddedToCartMessage] = useState<CartContextType['addedToCartMessage']>(null)
  const [currentGoal, setCurrentGoal] = useState(discountGoals.find(g => g.minProducts === goalCustomPackage) || discountGoals[0]);
  const [nextGoal, setNextGoal] = useState(discountGoals.find(g => g.minProducts > currentGoal.minProducts) || discountGoals[1]);
  const [currentDiscount, setCurrentDiscount] = useState(0);

  /*useEffect(() => {
    setCurrentGoal(discountGoals.find(g => g.minProducts === totalItems) || discountGoals[0]);
    setNextGoal(discountGoals.find(g => g.minProducts > totalItems) || discountGoals[1]);
  }, [totalItems])*/
  const getLocalCart = () => {
    const cart = localStorage.getItem('lubella_cart')
    return cart ? JSON.parse(cart) : []
  }
  useEffect(() => {
    setCartItems(getLocalCart())
    setTotalItems(getLocalCart().reduce((acc: number, item: CartItem) => acc + item.quantity, 0))
  }, [])

  const addToCart = (item: CartItem) => {
    const existing = cartItems.find((i) => i.product.id === item.product.id)
    if (existing) {
      const newQty = existing.quantity + item.quantity
      updateQuantity(item.product.id, newQty)
      setAddedToCartMessage({ kind: 'updated', name: item.product.name, quantity: newQty })
    } else {
      setCartItems([...cartItems, item])
      setTotalItems(totalItems + item.quantity)
      setAddedToCartMessage({ kind: 'added', name: item.product.name })
    }
    setUpdatedCart(true)
    setTimeout(() => setAddedToCartMessage(null), 3500)
    localStorage.setItem('lubella_cart', JSON.stringify(cartItems))
    setTimeout(() => {
      setUpdatedCart(false)
    }, 3000)
  }

  const searchItem = (id: number) => {
    return cartItems.find((i) => i.product.id === id)
  }

  const updateQuantity = (id: number, quantity: number) => {
    const existing = cartItems.find((i) => i.product.id === id)
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === id ? { ...item, quantity } : item))
    )
    setTotalItems(totalItems + (quantity - (existing?.quantity || 0)))
    localStorage.setItem('lubella_cart', JSON.stringify(cartItems))
  }

  const removeFromCart = (id: number) => {
    const qty = cartItems.find((item) => item.product.id === id)?.quantity
    setCartItems((prev) => prev.filter((item) => item.product.id !== id))
    setTotalItems(totalItems - (qty || 0))
    localStorage.setItem('lubella_cart', JSON.stringify(cartItems))
  }

  const clearCart = () => {
    setCartItems([])
    setTotalItems(0)
    localStorage.removeItem('lubella_cart')
  }

  return (
    <CartContext.Provider
      value={{ 
        cartItems,
        goalCustomPackage,
        setGoalCustomPackage,
        addToCart,
        totalItems,
        updateQuantity,
        removeFromCart,
        discountGoals,  
        currentDiscount,
        setCurrentDiscount,
        clearCart,
        searchItem, updatedCart, shouldDisplayCart, setShouldDisplayCart, currentGoal, nextGoal, setCurrentGoal, setNextGoal, addedToCartMessage }}
    >
      {children}
    </CartContext.Provider>
  )
}

// Custom hook para usar más fácil
export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside a CartProvider')
  return context
}