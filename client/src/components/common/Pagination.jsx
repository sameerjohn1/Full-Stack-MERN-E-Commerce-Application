import { motion } from 'framer-motion'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = []
  const delta = 2
  for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
    pages.push(i)
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-lg border border-gray-200 hover:border-primary-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <FiChevronLeft className="w-4 h-4" />
      </button>

      {pages[0] > 1 && (
        <>
          <PageBtn num={1} active={page === 1} onClick={() => onPageChange(1)} />
          {pages[0] > 2 && <span className="px-2 text-gray-400">...</span>}
        </>
      )}

      {pages.map(n => (
        <PageBtn key={n} num={n} active={page === n} onClick={() => onPageChange(n)} />
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && <span className="px-2 text-gray-400">...</span>}
          <PageBtn num={totalPages} active={page === totalPages} onClick={() => onPageChange(totalPages)} />
        </>
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="p-2 rounded-lg border border-gray-200 hover:border-primary-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <FiChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}

function PageBtn({ num, active, onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
        active ? 'bg-primary-600 text-white' : 'border border-gray-200 hover:border-primary-500 text-gray-700'
      }`}
    >
      {num}
    </motion.button>
  )
}
