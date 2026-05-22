import { NavLink, Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHome, FiPackage, FiShoppingBag, FiUsers, FiMessageCircle } from 'react-icons/fi'

const links = [
  { to: '/admin', icon: FiHome, label: 'Dashboard', end: true },
  { to: '/admin/products', icon: FiPackage, label: 'Products' },
  { to: '/admin/orders', icon: FiShoppingBag, label: 'Orders' },
  { to: '/admin/users', icon: FiUsers, label: 'Users' },
  { to: '/admin/messages', icon: FiMessageCircle, label: 'Messages' },
]

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          <aside className="w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-3 sticky top-24">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 mb-2">Admin Panel</p>
              <nav className="space-y-1">
                {links.map(({ to, icon: Icon, label, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </aside>
          <main className="flex-1 min-w-0">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Outlet />
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}
