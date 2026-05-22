import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { FiPackage, FiChevronRight } from 'react-icons/fi'
import { getMyOrders } from '../api/orders'
import Spinner from '../components/common/Spinner'
import EmptyState from '../components/common/EmptyState'
import { format } from 'date-fns'

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
}

export default function Orders() {
  const { data, isLoading } = useQuery({ queryKey: ['my-orders'], queryFn: getMyOrders })
  const orders = data?.orders || []

  if (isLoading) return <div className="page-container flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="page-container max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <EmptyState
          icon="📦"
          title="No orders yet"
          description="Start shopping to see your orders here"
          action={<Link to="/products" className="btn-primary">Shop Now</Link>}
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link to={`/orders/${order._id}`} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 hover:border-primary-200 transition-colors block">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiPackage className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-sm text-gray-900 truncate">Order #{order._id.slice(-8).toUpperCase()}</p>
                    <span className={`badge ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'} flex-shrink-0`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{format(new Date(order.createdAt), 'MMM d, yyyy')}</p>
                  <p className="text-sm text-gray-700 mt-1">
                    {order.items?.length} item{order.items?.length !== 1 ? 's' : ''} · <strong>${order.totalAmount?.toFixed(2)}</strong>
                  </p>
                </div>
                <FiChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
