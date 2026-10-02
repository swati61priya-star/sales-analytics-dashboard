import { useEffect, useMemo, useState } from 'react'
import { Download, FilterX, ShoppingBag } from 'lucide-react'
import { Card, CardHeader } from './Card.jsx'
import Select from './Select.jsx'
import StatusBadge from './StatusBadge.jsx'
import EmptyState from './EmptyState.jsx'
import Pagination from './Pagination.jsx'
import { ORDER_STATUSES } from '../constants.js'
import { downloadCsv, toCsv } from '../utils/csv.js'
import { formatDate, formatMoneyExact } from '../utils/format.js'

const CSV_COLUMNS = [
  { label: 'Order ID', value: (o) => o.id },
  { label: 'Customer', value: (o) => o.customer },
  { label: 'Email', value: (o) => o.email },
  { label: 'Date', value: (o) => new Date(o.date).toISOString().slice(0, 10) },
  { label: 'Categories', value: (o) => [...new Set(o.items.map((i) => i.category))].join(' / ') },
  { label: 'Items', value: (o) => o.items.reduce((sum, i) => sum + i.qty, 0) },
  { label: 'Amount', value: (o) => o.amount.toFixed(2) },
  { label: 'Payment Method', value: (o) => o.payment },
  { label: 'Status', value: (o) => o.status },
]

const mainCategory = (order) => {
  const first = order.items[0].category
  const extra = new Set(order.items.map((i) => i.category)).size - 1
  return extra > 0 ? `${first} +${extra}` : first
}

// `limit` shows only the newest N rows (dashboard). `pageSize` adds pagination (Orders page).
export default function OrdersTable({ orders, categories, title, subtitle, limit = 0, pageSize = 0, search = '', onClearSearch, onViewAll }) {
  const [status, setStatus] = useState('All')
  const [category, setCategory] = useState('All')
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState(null)

  const filtered = useMemo(() => {
    return orders
      .filter((o) => (status === 'All' ? true : o.status === status))
      .filter((o) => (category === 'All' ? true : o.items.some((i) => i.category === category)))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [orders, status, category])

  useEffect(() => setPage(1), [orders, status, category])
  useEffect(() => {
    if (!notice) return undefined
    const timer = setTimeout(() => setNotice(null), 3500)
    return () => clearTimeout(timer)
  }, [notice])

  const rows = limit ? filtered.slice(0, limit) : pageSize ? filtered.slice((page - 1) * pageSize, page * pageSize) : filtered
  const hasFilters = status !== 'All' || category !== 'All' || search.trim() !== ''

  const clearFilters = () => {
    setStatus('All')
    setCategory('All')
    if (onClearSearch) onClearSearch()
  }

  const exportCsv = () => {
    if (filtered.length === 0) {
      setNotice({ type: 'error', text: 'There are no orders to export. Clear the filters and try again.' })
      return
    }
    const stamp = new Date().toISOString().slice(0, 10)
    const ok = downloadCsv(`orders-${stamp}.csv`, toCsv(filtered, CSV_COLUMNS))
    setNotice(ok ? { type: 'ok', text: `Exported ${filtered.length} orders to CSV.` } : { type: 'error', text: 'Export failed. Please try again.' })
  }

  const statusOptions = [{ value: 'All', label: 'All statuses' }, ...ORDER_STATUSES.map((s) => ({ value: s, label: s }))]
  const categoryOptions = [{ value: 'All', label: 'All categories' }, ...categories.map((c) => ({ value: c.name, label: c.name }))]

  return (
    <Card>
      <CardHeader
        title={title}
        subtitle={subtitle}
        action={
          onViewAll && (
            <button type="button" onClick={onViewAll} className="rounded-xl bg-sage-l px-3 py-1.5 text-xs font-semibold text-sage-d transition hover:opacity-80">
              View all orders
            </button>
          )
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Select value={status} onChange={setStatus} options={statusOptions} ariaLabel="Filter by status" className="w-full sm:w-40" />
        <Select value={category} onChange={setCategory} options={categoryOptions} ariaLabel="Filter by category" className="w-full sm:w-44" />
        {hasFilters && (
          <button type="button" onClick={clearFilters} className="flex h-10 items-center gap-2 rounded-2xl px-3 text-sm font-semibold text-rose-d transition hover:bg-rose-l">
            <FilterX className="h-4 w-4" aria-hidden="true" />
            Clear filters
          </button>
        )}
        <button
          type="button"
          onClick={exportCsv}
          className="flex h-10 items-center gap-2 rounded-2xl bg-sage-d px-4 text-sm font-semibold text-surface transition hover:opacity-90 sm:ml-auto"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Export CSV
        </button>
      </div>

      {notice && (
        <p role="status" className={`mb-3 rounded-xl px-3 py-2 text-sm font-medium ${notice.type === 'ok' ? 'bg-sage-l text-sage-d' : 'bg-rose-l text-rose-d'}`}>
          {notice.text}
        </p>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No orders found"
          message="Try a different search, status or category, or choose a longer date range."
          actionLabel={hasFilters ? 'Clear filters' : undefined}
          onAction={clearFilters}
        />
      ) : (
        <>
          {/* Table for tablets and desktops */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs font-semibold text-muted">
                  <th className="pb-3 pr-3 font-semibold">Order</th>
                  <th className="pb-3 pr-3 font-semibold">Customer</th>
                  <th className="hidden pb-3 pr-3 font-semibold xl:table-cell">Category</th>
                  <th className="pb-3 pr-3 font-semibold">Date</th>
                  <th className="pb-3 pr-3 text-right font-semibold">Amount</th>
                  <th className="pb-3 pr-3 font-semibold">Payment</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((o) => (
                  <tr key={o.id} className="border-b border-line/60 last:border-0 hover:bg-soft/60">
                    <td className="py-3 pr-3 font-semibold text-ink">#{o.id}</td>
                    <td className="py-3 pr-3">
                      <p className="font-medium text-ink">{o.customer}</p>
                      <p className="hidden text-xs text-muted lg:block">{o.email}</p>
                    </td>
                    <td className="hidden py-3 pr-3 text-muted xl:table-cell">{mainCategory(o)}</td>
                    <td className="whitespace-nowrap py-3 pr-3 text-muted">{formatDate(o.date)}</td>
                    <td className="py-3 pr-3 text-right font-semibold text-ink">{formatMoneyExact(o.amount)}</td>
                    <td className="whitespace-nowrap py-3 pr-3 text-muted">{o.payment}</td>
                    <td className="py-3">
                      <StatusBadge status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards for phones */}
          <ul className="space-y-3 md:hidden">
            {rows.map((o) => (
              <li key={o.id} className="rounded-2xl bg-soft/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink">#{o.id}</p>
                    <p className="truncate text-sm text-muted">{o.customer}</p>
                  </div>
                  <StatusBadge status={o.status} />
                </div>
                <div className="mt-3 flex items-end justify-between text-sm">
                  <div className="text-xs text-muted">
                    <p>{formatDate(o.date)}</p>
                    <p>{o.payment}</p>
                  </div>
                  <p className="text-base font-bold text-ink">{formatMoneyExact(o.amount)}</p>
                </div>
              </li>
            ))}
          </ul>

          {pageSize > 0 && <Pagination page={page} pageSize={pageSize} total={filtered.length} onChange={setPage} />}
          {limit > 0 && filtered.length > limit && (
            <p className="mt-3 text-center text-xs text-muted">Showing the {limit} newest of {filtered.length} orders.</p>
          )}
        </>
      )}
    </Card>
  )
}
