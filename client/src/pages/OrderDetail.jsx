import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiPackage } from 'react-icons/fi'
import { getOrder, cancelOrder } from '../api/orders'
import Spinner from '../components/common/Spinner'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered']
const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
}

export default function OrderDetail() {
  const { id } = useParams()
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey: ['order', id], queryFn: () => getOrder(id) })
  const cancelMutation = useMutation({
    mutationFn: () => cancelOrder(id),
    onSuccess: () => { toast.success('Order cancelled'); qc.invalidateQueries(['order', id]) },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to cancel'),
  })
  const order = data?.order
  if (isLoading) return <div className="page-container flex justify-center py-20"><Spinner size="lg" /></div>
  if (!order) return <div className="page-container text-center py-20"><p className="text-gray-500">Order not found</p></div>

  const stepIdx = STATUS_STEPS.indexOf(order.status)

  return (
    <div className="page-container max-w-3xl mx-auto">
      <Link to="/orders" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6">
        <FiArrowLeft className="w-4 h-4" /> Back to Orders
      </Link>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order #{order._id.slice(-8).toUpperCase()}</h1>
          <p className="text-sm text-gray-500 mt-1">{format(new Date(order.createdAt), 'MMMM d, yyyy h:mm a')}</p>
        </div>
        <span className={`badge text-sm px-3 py-1.5 ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>{order.status}</span>
      </div>

      {order.status !== 'cancelled' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <div className="flex justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-100 z-0" />
            <div className="absolute top-4 left-0 h-0.5 bg-primary-500 z-0 transition-all duration-500" style={{ width: `${(stepIdx / (STATUS_STEPS.length - 1)) * 100}%` }} />
            {STATUS_STEPS.map((s, i) => (
              <div key={s} className="flex flex-col items-center gap-2 z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${i <= stepIdx ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                  {i < stepIdx ? '✓' : i + 1}
                </div>
                <span className={`text-xs capitalize font-medium ${i <= stepIdx ? 'text-primary-600' : 'text-gray-400'}`}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Items</h3>
        <div className="space-y-3">
          {order.items?.map(item => (
            <div key={item._id} className="flex items-center gap-3">
              <img src={item.product?.images?.[0] || 'https://placehold.co/48x48'} alt={item.product?.name} className="w-12 h-12 object-cover rounded-xl" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{item.product?.name || 'Product'}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
              <span className="font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-3">Shipping Address</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p className="font-medium text-gray-900">{order.shippingAddress?.fullName}</p>
            <p>{order.shippingAddress?.street}</p>
            <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</p>
            <p>{order.shippingAddress?.country}</p>
            <p>{order.shippingAddress?.phone}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>${order.subtotal?.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span>{order.shippingCost === 0 ? 'FREE' : `$${order.shippingCost?.toFixed(2)}`}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Tax</span><span>${order.tax?.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold border-t border-gray-100 pt-2"><span>Total</span><span>${order.totalAmount?.toFixed(2)}</span></div>
          </div>
        </div>
      </div>

      {order.status === 'pending' && (
        <button onClick={() => cancelMutation.mutate()} disabled={cancelMutation.isLoading} className="btn-danger">
          {cancelMutation.isLoading ? 'Cancelling...' : 'Cancel Order'}
        </button>
      )}
    </div>
  )
}
