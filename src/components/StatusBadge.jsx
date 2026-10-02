const STYLES = {
  Completed: 'bg-sage-l text-sage-d',
  Shipped: 'bg-blue-l text-blue-d',
  Pending: 'bg-peach-l text-peach-d',
  Cancelled: 'bg-rose-l text-rose-d',
  Refunded: 'bg-lav-l text-lav-d',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${STYLES[status] || 'bg-soft text-muted'}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  )
}
