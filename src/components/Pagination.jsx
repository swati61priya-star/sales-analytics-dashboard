import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, pageSize, total, onChange }) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  if (total <= pageSize) return null
  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)
  const btn = 'flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface text-ink transition hover:border-sage disabled:cursor-not-allowed disabled:opacity-40'

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted">
        Showing {from}-{to} of {total}
      </p>
      <div className="flex items-center gap-2">
        <button type="button" className={btn} onClick={() => onChange(page - 1)} disabled={page <= 1} aria-label="Previous page">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="min-w-[4.5rem] text-center text-sm font-medium text-ink">
          {page} / {pageCount}
        </span>
        <button type="button" className={btn} onClick={() => onChange(page + 1)} disabled={page >= pageCount} aria-label="Next page">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
