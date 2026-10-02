import { useEffect, useMemo, useState } from 'react'
import { UserCheck, UserRound, Users, Wallet } from 'lucide-react'
import { Card, CardHeader } from '../components/Card.jsx'
import Select from '../components/Select.jsx'
import Pagination from '../components/Pagination.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { customerStats } from '../utils/analytics.js'
import { formatDate, formatMoney, formatNumber, initials } from '../utils/format.js'
import { customers } from '../data/index.js'

const SORTS = [
  { value: 'spent', label: 'Highest spend' },
  { value: 'orders', label: 'Most orders' },
  { value: 'recent', label: 'Most recent order' },
  { value: 'name', label: 'Name (A-Z)' },
]
const TINTS = ['bg-sage-l text-sage-d', 'bg-blue-l text-blue-d', 'bg-peach-l text-peach-d', 'bg-rose-l text-rose-d', 'bg-lav-l text-lav-d']
const PAGE_SIZE = 10

export default function CustomersView({ orders, search, onSearch, range }) {
  const [sort, setSort] = useState('spent')
  const [page, setPage] = useState(1)
  const term = search.trim().toLowerCase()

  const stats = useMemo(() => customerStats(orders, customers), [orders])
  const active = stats.filter((c) => c.orders > 0)
  const totalSpent = active.reduce((sum, c) => sum + c.spent, 0)
  const repeat = active.filter((c) => c.orders > 1).length

  const list = useMemo(() => {
    const rows = stats.filter((c) => !term || c.name.toLowerCase().includes(term) || c.email.includes(term) || c.city.toLowerCase().includes(term))
    const sorters = {
      spent: (a, b) => b.spent - a.spent,
      orders: (a, b) => b.orders - a.orders,
      recent: (a, b) => (b.lastOrder || '').localeCompare(a.lastOrder || ''),
      name: (a, b) => a.name.localeCompare(b.name),
    }
    return rows.sort(sorters[sort])
  }, [stats, term, sort])

  useEffect(() => setPage(1), [term, sort, orders])
  const rows = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const cards = [
    { label: 'Active customers', value: formatNumber(active.length), icon: Users, tint: 'bg-sage-l text-sage-d' },
    { label: 'Repeat buyers', value: formatNumber(repeat), icon: UserCheck, tint: 'bg-blue-l text-blue-d' },
    { label: 'Avg. spend per customer', value: formatMoney(active.length ? totalSpent / active.length : 0), icon: Wallet, tint: 'bg-peach-l text-peach-d' },
  ]

  return (
    <div className="view-in space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {cards.map(({ label, value, icon: Icon, tint }) => (
          <div key={label} className="flex items-center gap-4 rounded-3xl border border-line/70 bg-surface p-5 shadow-soft">
            <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tint}`}>
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm text-muted">{label}</p>
              <p className="text-2xl font-bold text-ink">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader
          title="Customers"
          subtitle={`${range.label} - demo data`}
          action={<Select value={sort} onChange={setSort} options={SORTS} ariaLabel="Sort customers" className="w-full sm:w-52" />}
        />

        {rows.length === 0 ? (
          <EmptyState icon={UserRound} title="No customers found" message="Try a different search term." actionLabel={term ? 'Clear search' : undefined} onAction={() => onSearch('')} />
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-xs text-muted">
                    <th className="pb-3 font-semibold">Customer</th>
                    <th className="pb-3 font-semibold">City</th>
                    <th className="pb-3 text-right font-semibold">Orders</th>
                    <th className="pb-3 text-right font-semibold">Total spent</th>
                    <th className="pb-3 pl-6 font-semibold">Last order</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((c, i) => (
                    <tr key={c.id} className="border-b border-line/60 last:border-0 hover:bg-soft/60">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <span className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold ${TINTS[(Number(c.id.slice(1)) + i) % TINTS.length]}`}>{initials(c.name)}</span>
                          <div>
                            <p className="font-medium text-ink">{c.name}</p>
                            <p className="text-xs text-muted">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-muted">{c.city}</td>
                      <td className="py-3 text-right text-ink">{formatNumber(c.orders)}</td>
                      <td className="py-3 text-right font-semibold text-ink">{formatMoney(c.spent)}</td>
                      <td className="whitespace-nowrap py-3 pl-6 text-muted">{c.lastOrder ? formatDate(c.lastOrder) : 'No orders'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="space-y-3 md:hidden">
              {rows.map((c, i) => (
                <li key={c.id} className="flex items-center gap-3 rounded-2xl bg-soft/70 p-4">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${TINTS[(Number(c.id.slice(1)) + i) % TINTS.length]}`}>{initials(c.name)}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{c.name}</p>
                    <p className="truncate text-xs text-muted">{c.city} - {c.orders} orders</p>
                  </div>
                  <p className="text-sm font-bold text-ink">{formatMoney(c.spent)}</p>
                </li>
              ))}
            </ul>

            <Pagination page={page} pageSize={PAGE_SIZE} total={list.length} onChange={setPage} />
          </>
        )}
      </Card>
    </div>
  )
}
