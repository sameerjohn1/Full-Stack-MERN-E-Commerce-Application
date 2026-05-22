import { useState, lazy, Suspense, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { FiFilter, FiGrid, FiList, FiX } from 'react-icons/fi'
import { getProducts, getCategories } from '../api/products'
import { useDebounce } from '../hooks/useDebounce'
import ProductFilters from '../components/products/ProductFilters'
import { ProductGridSkeleton } from '../components/products/ProductSkeleton'
import Pagination from '../components/common/Pagination'
import EmptyState from '../components/common/EmptyState'
import ErrorBoundary from '../components/common/ErrorBoundary'
import { Link } from 'react-router-dom'

const ProductCard = lazy(() => import('../components/products/ProductCard'))

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [view, setView] = useState('grid')

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    page: 1,
  })

  const debouncedSearch = useDebounce(filters.search, 400)

  const queryParams = { ...filters, search: debouncedSearch }

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', queryParams],
    queryFn: () => getProducts(queryParams),
    keepPreviousData: true,
  })

  const { data: catData } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  const updateFilters = useCallback((newFilters) => {
    setFilters({ ...newFilters, page: 1 })
  }, [])

  const products = data?.products || []
  const totalPages = data?.totalPages || 1
  const total = data?.total || 0
  const categories = catData?.categories || []

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
          <p className="text-sm text-gray-500 mt-1">{total} products found</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView(v => v === 'grid' ? 'list' : 'grid')}
            className="p-2.5 border border-gray-200 rounded-xl hover:border-primary-300 transition-colors hidden md:flex"
          >
            {view === 'grid' ? <FiList className="w-4 h-4" /> : <FiGrid className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setFiltersOpen(true)}
            className="md:hidden flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:border-primary-300"
          >
            <FiFilter className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={filters.search}
          onChange={e => setFilters(f => ({ ...f, search: e.target.value, page: 1 }))}
          placeholder="Search products..."
          className="input-field max-w-md"
        />
      </div>

      <div className="flex gap-6">
        <aside className="hidden md:block w-64 flex-shrink-0">
          <ProductFilters filters={filters} onChange={updateFilters} categories={categories} />
        </aside>

        <div className="flex-1 min-w-0">
          <ErrorBoundary>
            {isLoading ? (
              <ProductGridSkeleton count={8} />
            ) : error ? (
              <EmptyState icon="❌" title="Failed to load products" description={error.message} />
            ) : products.length === 0 ? (
              <EmptyState
                icon="🔍"
                title="No products found"
                description="Try adjusting your filters or search term"
                action={
                  <button onClick={() => updateFilters({ search: '', category: '', sort: '', minPrice: '', maxPrice: '', minRating: '' })} className="btn-primary">
                    Clear Filters
                  </button>
                }
              />
            ) : (
              <Suspense fallback={<ProductGridSkeleton count={8} />}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={JSON.stringify(queryParams)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={view === 'grid'
                      ? 'grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5'
                      : 'flex flex-col gap-4'
                    }
                  >
                    {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
                  </motion.div>
                </AnimatePresence>
                <Pagination
                  page={filters.page}
                  totalPages={totalPages}
                  onPageChange={p => setFilters(f => ({ ...f, page: p }))}
                />
              </Suspense>
            )}
          </ErrorBoundary>
        </div>
      </div>

      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setFiltersOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-80 bg-white z-50 overflow-y-auto p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <button onClick={() => setFiltersOpen(false)}><FiX className="w-5 h-5" /></button>
              </div>
              <ProductFilters filters={filters} onChange={(f) => { updateFilters(f); setFiltersOpen(false) }} categories={categories} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
