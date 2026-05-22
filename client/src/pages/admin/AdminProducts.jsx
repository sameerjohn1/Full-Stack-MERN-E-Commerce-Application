import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi'
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../api/products'
import { useDebounce } from '../../hooks/useDebounce'
import Modal from '../../components/common/Modal'
import Spinner from '../../components/common/Spinner'
import toast from 'react-hot-toast'

const CATEGORIES = ['electronics', 'clothing', 'shoes', 'books', 'sports', 'home', 'beauty', 'toys', 'food', 'furniture', 'jewelry']

const defaultForm = { name: '', description: '', price: '', originalPrice: '', category: 'electronics', stock: '', tags: '', featured: false }

export default function AdminProducts() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(defaultForm)
  const [editing, setEditing] = useState(null)
  const debouncedSearch = useDebounce(search, 400)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', debouncedSearch, page],
    queryFn: () => getProducts({ search: debouncedSearch, page, limit: 12 }),
  })
  const products = data?.products || []

  const saveMutation = useMutation({
    mutationFn: (fd) => editing ? updateProduct(editing, fd) : createProduct(fd),
    onSuccess: () => {
      toast.success(editing ? 'Product updated!' : 'Product created!')
      qc.invalidateQueries(['admin-products'])
      qc.invalidateQueries(['featured-products'])
      setModal(null)
      setEditing(null)
      setForm(defaultForm)
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to save'),
  })
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => { toast.success('Product deleted'); qc.invalidateQueries(['admin-products']) },
    onError: () => toast.error('Failed to delete'),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    saveMutation.mutate(fd)
  }

  const openEdit = (p) => {
    setEditing(p._id)
    setForm({ name: p.name, description: p.description, price: p.price, originalPrice: p.originalPrice || '', category: p.category, stock: p.stock, tags: p.tags?.join(', ') || '', featured: p.featured || false })
    setModal('form')
  }

  const set = (f) => (e) => setForm(prev => ({ ...prev, [f]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Products</h2>
        <button onClick={() => { setEditing(null); setForm(defaultForm); setModal('form') }} className="btn-primary flex items-center gap-2 text-sm">
          <FiPlus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="relative mb-5">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search products..." className="input-field pl-9" />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="text-left px-5 py-3">Product</th>
                  <th className="text-left px-5 py-3">Category</th>
                  <th className="text-left px-5 py-3">Price</th>
                  <th className="text-left px-5 py-3">Stock</th>
                  <th className="text-left px-5 py-3">Featured</th>
                  <th className="text-left px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-400">No products found</td></tr>
                ) : products.map(p => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.images?.[0] || 'https://placehold.co/40x40'} alt={p.name} className="w-10 h-10 object-cover rounded-lg" />
                        <span className="font-medium text-gray-900 line-clamp-1 max-w-xs">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 capitalize">{p.category}</td>
                    <td className="px-5 py-3 font-semibold">${p.price?.toFixed(2)}</td>
                    <td className="px-5 py-3">
                      <span className={`badge ${p.stock > 10 ? 'bg-green-100 text-green-700' : p.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-600'}`}>{p.stock}</span>
                    </td>
                    <td className="px-5 py-3">
                      {p.featured ? <span className="badge bg-primary-100 text-primary-700">Yes</span> : <span className="text-gray-400">No</span>}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"><FiEdit2 className="w-4 h-4" /></button>
                        <button onClick={() => { if (confirm('Delete this product?')) deleteMutation.mutate(p._id) }} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors"><FiTrash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={modal === 'form'} onClose={() => setModal(null)} title={editing ? 'Edit Product' : 'Add New Product'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input value={form.name} onChange={set('name')} className="input-field" placeholder="Product name" required />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={form.description} onChange={set('description')} className="input-field resize-none" rows={3} placeholder="Product description" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input type="number" value={form.price} onChange={set('price')} className="input-field" min={0} step="0.01" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Original Price ($)</label>
              <input type="number" value={form.originalPrice} onChange={set('originalPrice')} className="input-field" min={0} step="0.01" placeholder="Optional" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={form.category} onChange={set('category')} className="input-field">
                {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input type="number" value={form.stock} onChange={set('stock')} className="input-field" min={0} required />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
              <input value={form.tags} onChange={set('tags')} className="input-field" placeholder="tag1, tag2, tag3" />
            </div>
            <div className="col-span-2 flex items-center gap-3">
              <input type="checkbox" id="featured" checked={form.featured} onChange={set('featured')} className="w-4 h-4 text-primary-600 rounded" />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700">Featured product</label>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModal(null)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={saveMutation.isLoading} className="btn-primary flex-1">
              {saveMutation.isLoading ? 'Saving...' : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
