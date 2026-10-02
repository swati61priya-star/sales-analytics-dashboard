import { SearchX } from 'lucide-react'

export default function EmptyState({ icon: Icon = SearchX, title, message, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-soft/70 px-6 py-10 text-center">
      <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-sage-l text-sage-d">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      {message && <p className="mt-1 max-w-xs text-sm text-muted">{message}</p>}
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 rounded-xl bg-sage-d px-4 py-2 text-sm font-semibold text-surface transition hover:opacity-90"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
