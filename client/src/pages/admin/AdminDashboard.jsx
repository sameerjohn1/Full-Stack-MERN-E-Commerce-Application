import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiPackage, FiUsers, FiShoppingCart, FiDollarSign, FiArrowRight } from 'react-icons/fi'
import api from '../../api/axios'
import Spinner from '../../components/common/Spinner'

const getStats = () => api.get('/admin/stats').then(r => r.data)

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({ queryKey: ['admin-stats'], queryFn: getStats })
  const stats = data?.stats || {}

  const cards = [
    { label: 'Total Revenue', value: `$${(stats.revenue || 0).toFixed(2)}`, icon: FiDollarSign, color: 'from-green-400 to-emerald-600', link: '/admin/orders' },
    { label: 'Total Orders', value: stats.orders || 0, icon: FiShoppingCart, color: 'from-blue-400 to-indigo-600', link: '/admin/orders' },
    { label: 'Total Products', value: stats.products || 0, icon: FiPackage, color: 'from-purple-400 to-violet-600', link: '/admin/products' },
    { label: 'Total Users', value: stats.users || 0, icon: FiUsers, color: 'from-orange-400 to-red-600', link: '/admin/users' },
  ]

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map(({ label, value, icon: Icon, color, link }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link to={link} className={`block bg-gradient-to-br ${color} rounded-2xl p-5 text-white hover:shadow-lg transition-shadow`}>
                  <div className="flex items-start justify-between mb-3">
                    <Icon className="w-6 h-6 opacity-80" />
                    <FiArrowRight className="w-4 h-4 opacity-60" />
                  </div>
                  <p className="text-3xl font-extrabold mb-1">{value}</p>
                  <p className="text-sm opacity-80">{label}</p>
                </Link>
              </motion.div>
            ))}
          </div>

          {data?.recentOrders && (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Recent Orders</h3>
                <Link to="/admin/orders" className="text-sm text-primary-600 hover:underline">View all</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                    <tr>
                      <th className="text-left px-5 py-3">Order</th>
                      <th className="text-left px-5 py-3">Customer</th>
                      <th className="text-left px-5 py-3">Amount</th>
                      <th className="text-left px-5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.recentOrders.map(order => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-5 py-3 font-mono text-xs">#{order._id.slice(-8).toUpperCase()}</td>
                        <td className="px-5 py-3">{order.user?.name}</td>
                        <td className="px-5 py-3 font-semibold">${order.totalAmount?.toFixed(2)}</td>
                        <td className="px-5 py-3">
                          <span className={`badge ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : order.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-700'}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
