import { Package } from 'lucide-react'
import { Card, CardHeader } from './Card.jsx'
import EmptyState from './EmptyState.jsx'
import ProductTile from './ProductTile.jsx'
import categories from '../data/categories.json'
import { formatMoney, formatNumber } from '../utils/format.js'

export default function TopProducts({ items, onViewAll }) {
  const best = items[0]?.revenue || 1
  const colorOf = (name) => categories.find((c) => c.name === name)?.color || '#D8CBB0'

  return (
    <Card>
      <CardHeader
        title="Top-selling products"
        subtitle="Ranked by revenue"
        action={
          onViewAll && (
            <button type="button" onClick={onViewAll} className="rounded-xl bg-sage-l px-3 py-1.5 text-xs font-semibold text-sage-d transition hover:opacity-80">
              View all
            </button>
          )
        }
      />

      {items.length === 0 ? (
        <EmptyState icon={Package} title="No product sales" message="Nothing was sold in the selected period." />
      ) : (
        <ul className="space-y-4">
          {items.map((p, i) => (
            <li key={p.id} className="flex items-center gap-3">
              <ProductTile emoji={p.emoji} color={colorOf(p.category)} size="h-12 w-12 text-2xl" />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-ink">
                    {i + 1}. {p.name}
                  </p>
                  <p className="shrink-0 text-sm font-bold text-ink">{formatMoney(p.revenue)}</p>
                </div>
                <div className="mt-1 flex items-center justify-between gap-2 text-xs text-muted">
                  <span className="truncate">{p.category}</span>
                  <span className="shrink-0">{formatNumber(p.units)} sold</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-soft">
                  <div className="h-full rounded-full" style={{ width: `${(p.revenue / best) * 100}%`, background: colorOf(p.category) }} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
