import { useState, lazy, Suspense } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { FiShoppingCart, FiHeart, FiShare2, FiMinus, FiPlus, FiArrowLeft, FiCheck } from 'react-icons/fi'
import { getProduct, addReview, getReviews } from '../api/products'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import StarRating from '../components/common/StarRating'
import Spinner from '../components/common/Spinner'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

export default function ProductDetail() {
  const { id } = useParams()
  const { addItem, isInCart } = useCart()
  const { toggle, isWishlisted } = useWishlist()
  const { user } = useAuth()
  const qc = useQueryClient()
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' })
  const [tab, setTab] = useState('description')

  const { data, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
  })
  const { data: reviewsData } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => getReviews(id),
  })

  const reviewMutation = useMutation({
    mutationFn: (data) => addReview(id, data),
    onSuccess: () => {
      toast.success('Review submitted!')
      setReviewForm({ rating: 0, comment: '' })
      qc.invalidateQueries(['reviews', id])
      qc.invalidateQueries(['product', id])
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to submit review'),
  })

  const product = data?.product
  const reviews = reviewsData?.reviews || []

  if (isLoading) return (
    <div className="page-container flex items-center justify-center min-h-[60vh]">
      <Spinner size="lg" />
    </div>
  )
  if (!product) return (
    <div className="page-container text-center py-20">
      <p className="text-gray-500">Product not found</p>
    </div>
  )

  const images = product.images?.length ? product.images : ['https://placehold.co/600x600?text=Product']
  const wished = isWishlisted(product._id)
  const inCart = isInCart(product._id)

  return (
    <div className="page-container">
      <Link to="/products" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6">
        <FiArrowLeft className="w-4 h-4" /> Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        <div>
          <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-3">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImg}
                src={images[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${activeImg === i ? 'border-primary-600' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm text-primary-600 font-medium uppercase tracking-wide mb-2">{product.category}</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>
          <div className="flex items-center gap-3 mb-4">
            <StarRating rating={product.averageRating || 0} size="md" />
            <span className="text-sm text-gray-500">({product.numReviews || 0} reviews)</span>
          </div>
          <div className="flex items-end gap-3 mb-6">
            <span className="text-4xl font-extrabold text-gray-900">${product.price?.toFixed(2)}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-xl text-gray-400 line-through">${product.originalPrice?.toFixed(2)}</span>
                <span className="badge bg-red-100 text-red-600">Save {Math.round((1 - product.price / product.originalPrice) * 100)}%</span>
              </>
            )}
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.description}</p>

          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium mb-6 ${product.stock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
            <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-gray-200 rounded-xl">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-l-xl">
                <FiMinus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-semibold">{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} disabled={qty >= product.stock} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-r-xl disabled:opacity-40">
                <FiPlus className="w-4 h-4" />
              </button>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => addItem(product, qty)}
              disabled={product.stock === 0}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition-colors ${inCart ? 'bg-green-500 hover:bg-green-600' : 'bg-primary-600 hover:bg-primary-700'} disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {inCart ? <><FiCheck className="w-5 h-5" /> In Cart</> : <><FiShoppingCart className="w-5 h-5" /> Add to Cart</>}
            </motion.button>
            <button
              onClick={() => toggle(product)}
              className={`w-12 h-12 flex items-center justify-center rounded-xl border-2 transition-colors ${wished ? 'bg-red-500 border-red-500 text-white' : 'border-gray-200 text-gray-600 hover:border-red-300'}`}
            >
              <FiHeart className={`w-5 h-5 ${wished ? 'fill-current' : ''}`} />
            </button>
          </div>

          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map(t => (
                <span key={t} className="badge bg-gray-100 text-gray-600">#{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-b border-gray-200 mb-8">
        <div className="flex gap-1">
          {['description', 'reviews'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${tab === t ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
            >
              {t} {t === 'reviews' && `(${reviews.length})`}
            </button>
          ))}
        </div>
      </div>

      {tab === 'description' ? (
        <div className="prose max-w-none text-gray-600 text-sm leading-relaxed">
          <p>{product.description}</p>
          {product.specifications && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(product.specifications).map(([k, v]) => (
                  <div key={k} className="flex gap-2 text-sm">
                    <span className="font-medium text-gray-700 capitalize">{k}:</span>
                    <span className="text-gray-500">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          {user && (
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Write a Review</h3>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Your Rating</p>
                <StarRating
                  rating={reviewForm.rating}
                  size="lg"
                  interactive
                  onRate={(r) => setReviewForm(f => ({ ...f, rating: r }))}
                />
              </div>
              <textarea
                value={reviewForm.comment}
                onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                placeholder="Share your experience with this product..."
                rows={4}
                className="input-field mb-4 resize-none"
              />
              <button
                onClick={() => reviewMutation.mutate(reviewForm)}
                disabled={!reviewForm.rating || !reviewForm.comment || reviewMutation.isLoading}
                className="btn-primary"
              >
                {reviewMutation.isLoading ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          )}

          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No reviews yet. Be the first!</p>
          ) : (
            <div className="space-y-4">
              {reviews.map(r => (
                <motion.div key={r._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-gray-100 rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-700 font-semibold text-sm">{r.user?.name?.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-900">{r.user?.name}</p>
                        <StarRating rating={r.rating} size="sm" />
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{format(new Date(r.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                  <p className="text-sm text-gray-600">{r.comment}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
