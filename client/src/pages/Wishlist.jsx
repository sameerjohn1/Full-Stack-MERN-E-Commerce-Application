import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHeart } from 'react-icons/fi'
import { useWishlist } from '../context/WishlistContext'
import { ProductGridSkeleton } from '../components/products/ProductSkeleton'

const ProductCard = lazy(() => import('../components/products/ProductCard'))

export default function Wishlist() {
  const { items, count } = useWishlist()

  if (count === 0) return (
    <div className="page-container min-h-[60vh] flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <FiHeart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-6">Save items you love for later</p>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </motion.div>
    </div>
  )

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Wishlist ({count})</h1>
      <Suspense fallback={<ProductGridSkeleton count={count} />}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {items.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
        </div>
      </Suspense>
    </div>
  )
}
