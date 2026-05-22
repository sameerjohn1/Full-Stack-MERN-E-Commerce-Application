export default function ProductSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-200 rounded-full w-1/3" />
        <div className="h-4 bg-gray-200 rounded-full w-full" />
        <div className="h-4 bg-gray-200 rounded-full w-2/3" />
        <div className="h-3 bg-gray-200 rounded-full w-1/2" />
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-200 rounded-full w-1/4" />
          <div className="w-9 h-9 bg-gray-200 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }, (_, i) => <ProductSkeleton key={i} />)}
    </div>
  )
}
