import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../../api/axios'
import { FiSearch, FiUser } from 'react-icons/fi'
import { useDebounce } from '../../hooks/useDebounce'
import Spinner from '../../components/common/Spinner'
import { format } from 'date-fns'

const getUsers = (params) => api.get('/admin/users', { params }).then(r => r.data)

export default function AdminUsers() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', debouncedSearch],
    queryFn: () => getUsers({ search: debouncedSearch }),
  })
  const users = data?.users || []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Users</h2>
        <span className="badge bg-primary-100 text-primary-700">{data?.total || 0} total</span>
      </div>
      <div className="relative mb-5">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="input-field pl-9" />
      </div>
      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left px-5 py-3">User</th>
                <th className="text-left px-5 py-3">Email</th>
                <th className="text-left px-5 py-3">Role</th>
                <th className="text-left px-5 py-3">Joined</th>
                <th className="text-left px-5 py-3">Orders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-gray-400">No users found</td></tr>
              ) : users.map(u => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-700 font-semibold text-xs">{u.name?.charAt(0).toUpperCase()}</span>
                      </div>
                      <span className="font-medium text-gray-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{u.email}</td>
                  <td className="px-5 py-3">
                    <span className={`badge ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>{u.role}</span>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{format(new Date(u.createdAt), 'MMM d, yyyy')}</td>
                  <td className="px-5 py-3">{u.orderCount || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
