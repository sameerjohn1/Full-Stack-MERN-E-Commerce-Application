import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { FiEye } from 'react-icons/fi'
import { getAllOrders, updateOrderStatus } from '../../api/orders'
import Modal from '../../components/common/Modal'
import Spinner from '../../components/common/Spinner'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
}
const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

export default function AdminOrders() {
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [filterStatus, setFilterStatus] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', page, filterStatus],
    queryFn: () => getAllOrders({ page, limit: 15, status: filterStatus }),
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateOrderStatus(id, status),
    onSuccess: () => { toast.success('Status updated!'); qc.invalidateQueries(['admin-orders']) },
    onError: () => toast.error('Failed to update status'),
  })

  const orders = data?.orders || []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Orders</h2>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="input-field w-40 text-sm">
          <option value="">All Status</option>
          {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="text-left px-5 py-3">Order ID</th>
                  <th className="text-left px-5 py-3">Customer</th>
                  <th className="text-left px-5 py-3">Date</th>
                  <th className="text-left px-5 py-3">Total</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-400">No orders found</td></tr>
                ) : orders.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-mono text-xs">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="px-5 py-3">{order.user?.name || 'N/A'}</td>
                    <td className="px-5 py-3 text-gray-500">{format(new Date(order.createdAt), 'MMM d, yyyy')}</td>
                    <td className="px-5 py-3 font-semibold">${order.totalAmount?.toFixed(2)}</td>
                    <td className="px-5 py-3">
                      <select
                        value={order.status}
                        onChange={e => statusMutation.mutate({ id: order._id, status: e.target.value })}
                        className={`text-xs font-medium px-2 py-1 rounded-lg border-0 focus:ring-1 focus:ring-primary-500 ${STATUS_COLORS[order.status] || ''}`}
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-5 py-3">
                      <button onClick={() => setSelectedOrder(order)} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg">
                        <FiEye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title="Order Details" size="lg">
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Customer</p>
                <p className="font-medium">{selectedOrder.user?.name}</p>
                <p className="text-gray-500">{selectedOrder.user?.email}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Shipping To</p>
                <p className="font-medium">{selectedOrder.shippingAddress?.fullName}</p>
                <p className="text-gray-500">{selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}</p>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm font-medium text-gray-700 mb-3">Items</p>
              <div className="space-y-2">
                {selectedOrder.items?.map(item => (
                  <div key={item._id} className="flex items-center gap-3 text-sm">
                    <img src={item.product?.images?.[0] || 'https://placehold.co/40x40'} className="w-10 h-10 rounded-lg object-cover" />
                    <span className="flex-1">{item.product?.name}</span>
                    <span className="text-gray-500">×{item.quantity}</span>
                    <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-gray-100 pt-4 flex justify-between font-bold">
              <span>Total</span>
              <span>${selectedOrder.totalAmount?.toFixed(2)}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
