import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiShoppingBag, FiArrowRight } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import CartItem from '../components/cart/CartItem'

export default function Cart() {
  const { items, totalItems, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  if (items.length === 0) return (
    <div className="page-container min-h-[60vh] flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <FiShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything yet</p>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </motion.div>
    </div>
  )

  const subtotal = totalPrice
  const shipping = subtotal >= 50 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart ({totalItems})</h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:underline">Clear all</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <AnimatePresence>
              {items.map(item => <CartItem key={item._id} item={item} />)}
            </AnimatePresence>
          </div>
          <Link to="/products" className="inline-flex items-center gap-2 text-sm text-primary-600 hover:underline mt-4">
            ← Continue Shopping
          </Link>
        </div>
        <div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">Order Summary</h2>
            <div className="space-y-3 mb-5">
              <Row label={`Subtotal (${totalItems} items)`} value={`$${subtotal.toFixed(2)}`} />
              <Row label="Shipping" value={shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`} />
              <Row label="Tax (8%)" value={`$${tax.toFixed(2)}`} />
              {shipping === 0 && <p className="text-xs text-green-600 font-medium">🎉 Free shipping applied!</p>}
              {shipping > 0 && <p className="text-xs text-gray-500">Add ${(50 - subtotal).toFixed(2)} more for free shipping</p>}
            </div>
            <div className="border-t border-gray-100 pt-4 mb-5">
              <Row label="Total" value={`$${total.toFixed(2)}`} bold />
            </div>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => user ? navigate('/checkout') : navigate('/login', { state: { from: { pathname: '/checkout' } } })}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3.5"
            >
              Proceed to Checkout <FiArrowRight />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, bold }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className={bold ? 'font-bold text-gray-900 text-base' : 'text-gray-600'}>{label}</span>
      <span className={bold ? 'font-bold text-gray-900 text-base' : 'text-gray-900 font-medium'}>{value}</span>
    </div>
  )
}
