import { Card, CardHeader } from './Card.jsx'
import EmptyState from './EmptyState.jsx'
import { formatMoney, formatNumber } from '../utils/format.js'

// Rows with a pastel progress bar, e.g. orders by payment method.
export default function BreakdownList({ title, subtitle, rows, colors }) {
  const total = rows.reduce((sum, r) => sum + r.orders, 0)
  return (
    <Card>
      <CardHeader title={title} subtitle={subtitle} />
      {total === 0 ? (
        <EmptyState title="No data" message="There were no orders in the selected period." />
      ) : (
        <ul className="space-y-4">
          {rows.map((r, i) => (
            <li key={r.name}>
              <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
                <span className="font-medium text-ink">{r.name}</span>
                <span className="text-muted">
                  {formatNumber(r.orders)} orders <span className="text-ink">· {formatMoney(r.revenue)}</span>
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-soft">
                <div className="h-full rounded-full" style={{ width: `${(r.orders / total) * 100}%`, background: colors[i % colors.length] }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
