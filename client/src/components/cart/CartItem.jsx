import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'

export default function CartItem({ item }) {
  const { removeItem, updateQty } = useCart()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      className="flex items-start gap-4 py-5 border-b border-gray-100 last:border-0"
    >
      <Link to={`/products/${item._id}`} className="flex-shrink-0">
        <img
          src={item.images?.[0] || 'https://placehold.co/80x80?text=P'}
          alt={item.name}
          className="w-20 h-20 object-cover rounded-xl border border-gray-100"
        />
      </Link>
      <div className="flex-1 min-w-0">
        <Link to={`/products/${item._id}`} className="font-medium text-gray-900 hover:text-primary-600 transition-colors line-clamp-2 text-sm">
          {item.name}
        </Link>
        <p className="text-xs text-gray-500 mt-0.5 capitalize">{item.category}</p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl p-0.5">
            <button
              onClick={() => updateQty(item._id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg disabled:opacity-40 transition-colors"
            >
              <FiMinus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
            <button
              onClick={() => updateQty(item._id, item.quantity + 1)}
              disabled={item.quantity >= (item.stock || 99)}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg disabled:opacity-40 transition-colors"
            >
              <FiPlus className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
            <button
              onClick={() => removeItem(item._id)}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
