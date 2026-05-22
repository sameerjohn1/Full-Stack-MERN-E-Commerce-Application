import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')) || [] } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addItem = (product, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i._id === product._id)
      if (existing) {
        const newQty = Math.min(existing.quantity + qty, product.stock || 99)
        toast.success('Cart updated!')
        return prev.map(i => i._id === product._id ? { ...i, quantity: newQty } : i)
      }
      toast.success('Added to cart!')
      return [...prev, { ...product, quantity: qty }]
    })
  }

  const removeItem = (id) => {
    setItems(prev => prev.filter(i => i._id !== id))
    toast.success('Removed from cart')
  }

  const updateQty = (id, qty) => {
    if (qty < 1) return
    setItems(prev => prev.map(i => i._id === id ? { ...i, quantity: qty } : i))
  }

  const clearCart = () => setItems([])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const isInCart = (id) => items.some(i => i._id === id)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice, isInCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
