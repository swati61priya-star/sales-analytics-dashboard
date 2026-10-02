import { useMemo } from 'react'
import OrdersTable from '../components/OrdersTable.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { ORDER_STATUSES } from '../constants.js'
import { matchesOrder } from '../utils/analytics.js'
import { formatNumber } from '../utils/format.js'
import { categories } from '../data/index.js'

export default function OrdersView({ orders, search, onSearch, range }) {
  const term = search.trim().toLowerCase()
  const searched = useMemo(() => orders.filter((o) => matchesOrder(o, term)), [orders, term])
  const counts = useMemo(() => {
    const map = Object.fromEntries(ORDER_STATUSES.map((s) => [s, 0]))
    searched.forEach((o) => (map[o.status] += 1))
    return map
  }, [searched])

  return (
    <div className="view-in space-y-5">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
        {ORDER_STATUSES.map((s) => (
          <div key={s} className="rounded-3xl border border-line/70 bg-surface p-4 shadow-soft">
            <StatusBadge status={s} />
            <p className="mt-3 text-2xl font-bold text-ink">{formatNumber(counts[s])}</p>
            <p className="text-xs text-muted">{range.label.toLowerCase()}</p>
          </div>
        ))}
      </div>

      <OrdersTable
        title="All orders"
        subtitle={`${formatNumber(searched.length)} orders - demo data`}
        orders={searched}
        categories={categories}
        pageSize={10}
        search={search}
        onClearSearch={() => onSearch('')}
      />
    </div>
  )
}
