import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { getCategories } from '../api/products'
import Spinner from '../components/common/Spinner'

const CATEGORY_EMOJIS = {
  electronics: '📱', clothing: '👕', shoes: '👟', books: '📚', sports: '⚽',
  home: '🏠', beauty: '💄', toys: '🧸', food: '🍕', furniture: '🪑',
  jewelry: '💍', automotive: '🚗', garden: '🌿', health: '💊',
}
const GRADIENTS = [
  'from-blue-400 to-indigo-600', 'from-purple-400 to-pink-600', 'from-orange-400 to-red-600',
  'from-green-400 to-teal-600', 'from-yellow-400 to-orange-600', 'from-pink-400 to-rose-600',
  'from-cyan-400 to-blue-600', 'from-violet-400 to-purple-600',
]

export default function Categories() {
  const { data, isLoading } = useQuery({ queryKey: ['categories'], queryFn: getCategories })
  const categories = data?.categories || []

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Categories</h1>
        <p className="text-gray-500">Browse products by category</p>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {categories.map((cat, i) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -6, scale: 1.03 }}
            >
              <Link
                to={`/products?category=${cat}`}
                className={`flex flex-col items-center justify-center bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} rounded-2xl p-8 text-white hover:shadow-xl transition-shadow`}
              >
                <div className="text-5xl mb-4">{CATEGORY_EMOJIS[cat.toLowerCase()] || '🛍️'}</div>
                <h3 className="text-lg font-bold capitalize text-center">{cat}</h3>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
