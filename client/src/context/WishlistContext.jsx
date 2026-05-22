import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const WishlistContext = createContext(null)

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wishlist')) || [] } catch { return [] }
  })

  useEffect(() => { localStorage.setItem('wishlist', JSON.stringify(items)) }, [items])

  const toggle = (product) => {
    setItems(prev => {
      const exists = prev.find(i => i._id === product._id)
      if (exists) {
        toast('Removed from wishlist', { icon: '💔' })
        return prev.filter(i => i._id !== product._id)
      }
      toast('Added to wishlist!', { icon: '❤️' })
      return [...prev, product]
    })
  }

  const isWishlisted = (id) => items.some(i => i._id === id)

  return (
    <WishlistContext.Provider value={{ items, toggle, isWishlisted, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
