import { useMemo } from 'react'
import SalesChart from '../components/SalesChart.jsx'
import BarCard from '../components/BarCard.jsx'
import BreakdownList from '../components/BreakdownList.jsx'
import { Card, CardHeader } from '../components/Card.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { buildSeries, categoryBreakdown, computeKpis, groupBy, matchesOrder, weekdayRevenue } from '../utils/analytics.js'
import { formatMoney, formatMoneyExact, formatNumber } from '../utils/format.js'
import { CHART_COLORS } from '../constants.js'
import { categories } from '../data/index.js'

const PALETTE = ['#8FAE9B', '#9DB4C8', '#E8C4A0', '#D9A5A0', '#B9B0D0']

export default function SalesView({ orders, days, range, search }) {
  const term = search.trim().toLowerCase()
  const scoped = useMemo(() => orders.filter((o) => matchesOrder(o, term)), [orders, term])

  const kpis = useMemo(() => computeKpis(scoped), [scoped])
  const series = useMemo(() => buildSeries(scoped, days), [scoped, days])
  const weekdays = useMemo(() => weekdayRevenue(scoped), [scoped])
  const payments = useMemo(() => groupBy(scoped, 'payment', true), [scoped])
  const categoryData = useMemo(() => categoryBreakdown(scoped, categories), [scoped])
  const margin = kpis.revenue ? (kpis.profit / kpis.revenue) * 100 : 0
  const bestPeriod = series.reduce((top, p) => (p.revenue > (top?.revenue || 0) ? p : top), null)

  const stats = [
    { label: 'Revenue', value: formatMoney(kpis.revenue) },
    { label: 'Profit margin', value: `${margin.toFixed(1)}%` },
    { label: 'Items per order', value: kpis.orders ? (scoped.filter((o) => o.status !== 'Cancelled' && o.status !== 'Refunded').reduce((s, o) => s + o.items.reduce((n, i) => n + i.qty, 0), 0) / kpis.orders).toFixed(1) : '0' },
    { label: 'Best period', value: bestPeriod ? bestPeriod.label : '-' },
  ]

  if (scoped.length === 0) {
    return (
      <div className="view-in">
        <Card>
          <EmptyState title="No sales found" message={term ? 'No sales match your search in this date range.' : 'There were no sales in the selected period.'} />
        </Card>
      </div>
    )
  }

  return (
    <div className="view-in space-y-5">
      <div className="grid grid-cols-2 gap-5 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-3xl border border-line/70 bg-surface p-5 shadow-soft">
            <p className="text-sm text-muted">{s.label}</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-ink">{s.value}</p>
          </div>
        ))}
      </div>

      <SalesChart series={series} subtitle={`Revenue and profit - ${range.label.toLowerCase()}`} height="h-80" />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <BarCard title="Orders over time" subtitle="Completed, shipped and pending orders" data={series} yKey="orders" name="Orders" color={CHART_COLORS.orders} valueFormatter={formatNumber} axisFormatter={formatNumber} />
        <BarCard title="Revenue by weekday" subtitle="Which days sell the most" data={weekdays} xKey="name" yKey="revenue" name="Revenue" color={CHART_COLORS.revenue} valueFormatter={formatMoney} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <BreakdownList title="Payment methods" subtitle="Orders and revenue by method" rows={payments} colors={PALETTE} />
        <Card>
          <CardHeader title="Category performance" subtitle="Revenue, profit and units sold" />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs text-muted">
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 text-right font-semibold">Units</th>
                  <th className="pb-3 text-right font-semibold">Revenue</th>
                  <th className="pb-3 text-right font-semibold">Profit</th>
                </tr>
              </thead>
              <tbody>
                {categoryData.map((c) => (
                  <tr key={c.name} className="border-b border-line/60 last:border-0">
                    <td className="py-3">
                      <span className="flex items-center gap-2 font-medium text-ink">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
                        {c.name}
                      </span>
                    </td>
                    <td className="py-3 text-right text-muted">{formatNumber(c.units)}</td>
                    <td className="py-3 text-right font-semibold text-ink">{formatMoney(c.revenue)}</td>
                    <td className="py-3 text-right text-muted">{formatMoney(c.profit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted">Average order value: {formatMoneyExact(kpis.aov)}</p>
        </Card>
      </div>
    </div>
  )
}
