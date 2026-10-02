import { useMemo, useState } from 'react'
import { PackageSearch } from 'lucide-react'
import { Card } from '../components/Card.jsx'
import Select from '../components/Select.jsx'
import ProductTile from '../components/ProductTile.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { productStats } from '../utils/analytics.js'
import { formatMoney, formatMoneyExact, formatNumber } from '../utils/format.js'
import { categories, products } from '../data/index.js'

const SORTS = [
  { value: 'revenue', label: 'Top revenue' },
  { value: 'units', label: 'Most units sold' },
  { value: 'price-high', label: 'Price: high to low' },
  { value: 'price-low', label: 'Price: low to high' },
  { value: 'stock', label: 'Lowest stock' },
]

export default function ProductsView({ orders, search, onSearch, range }) {
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('revenue')
  const term = search.trim().toLowerCase()

  const list = useMemo(() => {
    const rows = productStats(orders, products)
      .filter((p) => category === 'All' || p.category === category)
      .filter((p) => !term || p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term))
    const sorters = {
      revenue: (a, b) => b.revenue - a.revenue,
      units: (a, b) => b.units - a.units,
      'price-high': (a, b) => b.price - a.price,
      'price-low': (a, b) => a.price - b.price,
      stock: (a, b) => a.stock - b.stock,
    }
    return rows.sort(sorters[sort])
  }, [orders, category, sort, term])

  const colorOf = (name) => categories.find((c) => c.name === name)?.color
  const clear = () => {
    setCategory('All')
    onSearch('')
  }

  return (
    <div className="view-in space-y-5">
      <Card className="!p-4">
        <div className="flex flex-wrap items-center gap-2">
          {['All', ...categories.map((c) => c.name)].map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setCategory(name)}
              aria-pressed={category === name}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${category === name ? 'bg-sage-d text-surface' : 'bg-soft text-ink hover:bg-sage-l'}`}
            >
              {name}
            </button>
          ))}
          <Select value={sort} onChange={setSort} options={SORTS} ariaLabel="Sort products" className="w-full sm:ml-auto sm:w-52" />
        </div>
      </Card>

      {list.length === 0 ? (
        <Card>
          <EmptyState icon={PackageSearch} title="No products found" message="Try another category or search term." actionLabel="Clear filters" onAction={clear} />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {list.map((p) => {
            const low = p.stock < 15
            return (
              <article key={p.id} className="rounded-3xl border border-line/70 bg-surface p-5 shadow-soft">
                <div className="flex items-start gap-4">
                  <ProductTile emoji={p.emoji} color={colorOf(p.category)} size="h-16 w-16 text-3xl" />
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-ink">{p.name}</h3>
                    <p className="text-xs text-muted">{p.category}</p>
                    <p className="mt-1 text-lg font-bold text-ink">{formatMoneyExact(p.price)}</p>
                  </div>
                </div>
                <dl className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-soft/70 p-3 text-center">
                  <div>
                    <dt className="text-xs text-muted">Sold</dt>
                    <dd className="text-sm font-bold text-ink">{formatNumber(p.units)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Revenue</dt>
                    <dd className="text-sm font-bold text-ink">{formatMoney(p.revenue)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Stock</dt>
                    <dd className={`text-sm font-bold ${low ? 'text-rose-d' : 'text-ink'}`}>{p.stock}</dd>
                  </div>
                </dl>
                <p className="mt-3 text-xs text-muted">
                  {range.label} {low && <span className="ml-1 rounded-full bg-rose-l px-2 py-0.5 font-semibold text-rose-d">Low stock</span>}
                </p>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
