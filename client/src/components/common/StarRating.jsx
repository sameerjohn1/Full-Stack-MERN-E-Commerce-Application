import { FiStar } from 'react-icons/fi'
import { FaStar, FaStarHalfAlt } from 'react-icons/fa'

export default function StarRating({ rating = 0, max = 5, size = 'sm', showCount, count, interactive, onRate }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' }
  const stars = Array.from({ length: max }, (_, i) => {
    const val = i + 1
    if (rating >= val) return 'full'
    if (rating >= val - 0.5) return 'half'
    return 'empty'
  })

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {stars.map((type, i) => (
          <button
            key={i}
            className={`${sizes[size]} text-yellow-400 ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
            onClick={() => interactive && onRate && onRate(i + 1)}
          >
            {type === 'full' ? <FaStar className={sizes[size]} /> :
             type === 'half' ? <FaStarHalfAlt className={sizes[size]} /> :
             <FiStar className={sizes[size]} />}
          </button>
        ))}
      </div>
      {showCount && count !== undefined && (
        <span className="text-xs text-gray-500">({count})</span>
      )}
    </div>
  )
}
