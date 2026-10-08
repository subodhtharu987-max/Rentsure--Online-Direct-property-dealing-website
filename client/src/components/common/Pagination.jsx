export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">← Prev</button>
      {pages.map(p => (
        <button key={p} onClick={() => onPageChange(p)} className={`w-9 h-9 text-sm rounded-lg border transition-colors ${p === currentPage ? 'bg-primary-500 text-white border-primary-500' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}>{p}</button>
      ))}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Next →</button>
    </div>
  )
}
