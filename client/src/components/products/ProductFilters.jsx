import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronDown, FiX } from 'react-icons/fi'

const PRICE_MAX = 2000

export default function ProductFilters({ filters, onChange, categories = [] }) {
  const [openSections, setOpenSections] = useState({ category: true, price: true, rating: true, sort: true })
  const toggle = (k) => setOpenSections(prev => ({ ...prev, [k]: !prev[k] }))

  const activeCount = [
    filters.category, filters.minPrice, filters.maxPrice, filters.minRating
  ].filter(Boolean).length

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">Filters {activeCount > 0 && <span className="ml-1 badge bg-primary-100 text-primary-700">{activeCount}</span>}</h3>
        {activeCount > 0 && (
          <button
            onClick={() => onChange({ category: '', minPrice: '', maxPrice: '', minRating: '' })}
            className="text-xs text-primary-600 hover:underline flex items-center gap-1"
          >
            <FiX className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>

      <Section title="Sort By" open={openSections.sort} onToggle={() => toggle('sort')}>
        <select
          value={filters.sort || ''}
          onChange={e => onChange({ ...filters, sort: e.target.value })}
          className="input-field text-sm"
        >
          <option value="">Default</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Best Rating</option>
          <option value="newest">Newest First</option>
          <option value="popular">Most Popular</option>
        </select>
      </Section>

      <Section title="Category" open={openSections.category} onToggle={() => toggle('category')}>
        <div className="space-y-1">
          <button
            onClick={() => onChange({ ...filters, category: '' })}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!filters.category ? 'bg-primary-50 text-primary-700 font-medium' : 'hover:bg-gray-50 text-gray-700'}`}
          >
            All Categories
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => onChange({ ...filters, category: cat })}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm capitalize transition-colors ${filters.category === cat ? 'bg-primary-50 text-primary-700 font-medium' : 'hover:bg-gray-50 text-gray-700'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Price Range" open={openSections.price} onToggle={() => toggle('price')}>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={e => onChange({ ...filters, minPrice: e.target.value })}
              className="input-field text-sm"
              min={0}
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={e => onChange({ ...filters, maxPrice: e.target.value })}
              className="input-field text-sm"
              min={0}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {[50, 100, 200, 500].map(p => (
              <button
                key={p}
                onClick={() => onChange({ ...filters, maxPrice: p })}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${Number(filters.maxPrice) === p ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-200 hover:border-primary-300 text-gray-600'}`}
              >
                Under ${p}
              </button>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Min Rating" open={openSections.rating} onToggle={() => toggle('rating')}>
        <div className="space-y-1">
          {[4, 3, 2, 1].map(r => (
            <button
              key={r}
              onClick={() => onChange({ ...filters, minRating: filters.minRating == r ? '' : r })}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${Number(filters.minRating) === r ? 'bg-primary-50 text-primary-700 font-medium' : 'hover:bg-gray-50 text-gray-700'}`}
            >
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className={`text-sm ${i < r ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                ))}
              </div>
              <span>& up</span>
            </button>
          ))}
        </div>
      </Section>
    </div>
  )
}

function Section({ title, open, onToggle, children }) {
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-sm font-semibold text-gray-900 hover:bg-gray-50"
      >
        {title}
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <FiChevronDown className="w-4 h-4 text-gray-500" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
