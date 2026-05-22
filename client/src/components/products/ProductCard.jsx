import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHeart, FiShoppingCart, FiEye } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import StarRating from '../common/StarRating'

export default function ProductCard({ product, index = 0 }) {
  const { addItem, isInCart } = useCart()
  const { toggle, isWishlisted } = useWishlist()
  const [imgError, setImgError] = useState(false)
  const wished = isWishlisted(product._id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="card group hover:shadow-md transition-shadow duration-300"
    >
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200 aspect-square">
        <Link to={`/products/${product._id}`}>
          {imgError || !product.images?.[0] ? (
            <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-primary-400">
              {product.name.charAt(0).toUpperCase()}
            </div>
          ) : (
            <img
              src={product.images[0]}
              alt={product.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          )}
        </Link>
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-gray-800 text-sm font-semibold px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
        {product.discount > 0 && (
          <span className="absolute top-3 left-3 badge bg-red-500 text-white">-{product.discount}%</span>
        )}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => toggle(product)}
            className={`w-9 h-9 rounded-xl shadow-md flex items-center justify-center transition-colors ${wished ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'}`}
          >
            <FiHeart className={`w-4 h-4 ${wished ? 'fill-current' : ''}`} />
          </button>
          <Link
            to={`/products/${product._id}`}
            className="w-9 h-9 bg-white rounded-xl shadow-md flex items-center justify-center text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-colors"
          >
            <FiEye className="w-4 h-4" />
          </Link>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-primary-600 font-medium uppercase tracking-wide mb-1">{product.category}</p>
        <Link to={`/products/${product._id}`}>
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 hover:text-primary-600 transition-colors mb-2">
            {product.name}
          </h3>
        </Link>
        <StarRating rating={product.averageRating || 0} showCount count={product.numReviews || 0} size="sm" />
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-lg font-bold text-gray-900">${product.price?.toFixed(2)}</span>
            {product.originalPrice > product.price && (
              <span className="ml-2 text-sm text-gray-400 line-through">${product.originalPrice?.toFixed(2)}</span>
            )}
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => addItem(product)}
            disabled={product.stock === 0 || isInCart(product._id)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
              isInCart(product._id) ? 'bg-green-500' : 'bg-primary-600 hover:bg-primary-700'
            }`}
          >
            <FiShoppingCart className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
