import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { FiArrowRight, FiShield, FiTruck, FiRefreshCw, FiHeadphones } from 'react-icons/fi'
import { getFeaturedProducts, getCategories } from '../api/products'
import { ProductGridSkeleton } from '../components/products/ProductSkeleton'
import ErrorBoundary from '../components/common/ErrorBoundary'

const ProductCard = lazy(() => import('../components/products/ProductCard'))

const features = [
  { icon: FiTruck, title: 'Free Delivery', desc: 'On orders over $50' },
  { icon: FiRefreshCw, title: 'Easy Returns', desc: '30-day return policy' },
  { icon: FiShield, title: 'Secure Payment', desc: '100% secure checkout' },
  { icon: FiHeadphones, title: '24/7 Support', desc: 'Always here to help' },
]

const categoryColors = [
  'from-blue-500 to-indigo-600',
  'from-purple-500 to-pink-600',
  'from-orange-500 to-red-600',
  'from-green-500 to-teal-600',
  'from-yellow-500 to-orange-600',
  'from-pink-500 to-rose-600',
]

export default function Home() {
  const { data: featuredData, isLoading: loadingFeatured } = useQuery({
    queryKey: ['featured-products'],
    queryFn: getFeaturedProducts,
  })
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  const products = featuredData?.products || []
  const categories = categoriesData?.categories || []

  return (
    <div>
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute w-64 h-64 rounded-full bg-white"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3 }}
            />
          ))}
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-6"
            >
              🛍️ New Season Collection
            </motion.span>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              Shop the <span className="text-yellow-300">Future</span><br />of Style
            </h1>
            <p className="text-lg text-white/80 mb-10 max-w-xl">
              Discover thousands of premium products curated just for you. Fast delivery, easy returns, and unbeatable prices.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/products" className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-8 py-3.5 rounded-2xl hover:bg-gray-50 transition-colors shadow-lg">
                  Shop Now <FiArrowRight />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/categories" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-bold px-8 py-3.5 rounded-2xl hover:bg-white/20 transition-colors">
                  Browse Categories
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4"
            >
              <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900">{title}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
            <Link to="/categories" className="text-sm text-primary-600 font-medium hover:underline flex items-center gap-1">
              View all <FiArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {categories.slice(0, 6).map((cat, i) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <Link
                  to={`/products?category=${cat}`}
                  className={`block bg-gradient-to-br ${categoryColors[i % categoryColors.length]} rounded-2xl p-5 text-white text-center hover:shadow-lg transition-shadow`}
                >
                  <div className="text-3xl mb-2">🛍️</div>
                  <p className="text-sm font-semibold capitalize">{cat}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <Link to="/products" className="text-sm text-primary-600 font-medium hover:underline flex items-center gap-1">
            View all <FiArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <ErrorBoundary>
          {loadingFeatured ? (
            <ProductGridSkeleton count={8} />
          ) : products.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p>No featured products yet. Add some in the admin panel!</p>
            </div>
          ) : (
            <Suspense fallback={<ProductGridSkeleton count={8} />}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
              </div>
            </Suspense>
          )}
        </ErrorBoundary>
      </section>

      <section className="bg-gradient-to-r from-primary-600 to-indigo-600 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Ready to start shopping?</h2>
            <p className="text-lg text-white/80 mb-8">Join thousands of happy customers today</p>
            <Link to="/register" className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-8 py-3.5 rounded-2xl hover:bg-gray-50 transition-colors shadow-lg">
              Create Free Account <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
