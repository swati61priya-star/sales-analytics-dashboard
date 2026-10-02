import { useMemo } from 'react'
import { PiggyBank, Receipt, ShoppingBag, Wallet } from 'lucide-react'
import KpiCard from '../components/KpiCard.jsx'
import SalesChart from '../components/SalesChart.jsx'
import CategoryDonut from '../components/CategoryDonut.jsx'
import TopProducts from '../components/TopProducts.jsx'
import OrdersTable from '../components/OrdersTable.jsx'
import { buildSeries, categoryBreakdown, computeKpis, matchesOrder, percentChange, topProducts } from '../utils/analytics.js'
import { formatDate, formatMoney, formatMoneyExact, formatNumber } from '../utils/format.js'
import { categories, products } from '../data/index.js'

export default function DashboardView({ orders, prevOrders, days, range, search, onSearch, onNavigate }) {
  const kpis = useMemo(() => computeKpis(orders), [orders])
  const prev = useMemo(() => (prevOrders ? computeKpis(prevOrders) : null), [prevOrders])
  const series = useMemo(() => buildSeries(orders, days), [orders, days])
  const categoryData = useMemo(() => categoryBreakdown(orders, categories), [orders])
  const best = useMemo(() => topProducts(orders, products, 5), [orders])
  const term = search.trim().toLowerCase()
  const tableOrders = useMemo(() => orders.filter((o) => matchesOrder(o, term)), [orders, term])

  const comparison = days ? `vs previous ${days} days` : 'All-time total'
  const change = (key) => (prev ? percentChange(kpis[key], prev[key]) : null)

  const first = orders.length ? formatDate(orders[0].date) : '-'
  const subtitle = days ? `Last ${days} days compared with the ${days} days before` : `All orders since ${first}`

  return (
    <div className="view-in space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard id="revenue" title="Total Revenue" value={formatMoney(kpis.revenue)} change={change('revenue')} comparisonLabel={comparison} icon={Wallet} color="#8FAE9B" series={series} dataKey="revenue" />
        <KpiCard id="orders" title="Total Orders" value={formatNumber(kpis.orders)} change={change('orders')} comparisonLabel={comparison} icon={ShoppingBag} color="#9DB4C8" series={series} dataKey="orders" />
        <KpiCard id="aov" title="Average Order Value" value={formatMoneyExact(kpis.aov)} change={change('aov')} comparisonLabel={comparison} icon={Receipt} color="#E8C4A0" series={series} dataKey="aov" />
        <KpiCard id="profit" title="Total Profit" value={formatMoney(kpis.profit)} change={change('profit')} comparisonLabel={comparison} icon={PiggyBank} color="#D9A5A0" series={series} dataKey="profit" />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <SalesChart series={series} subtitle={`${subtitle} (${range.label.toLowerCase()})`} />
        </div>
        <CategoryDonut data={categoryData} />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <TopProducts items={best} onViewAll={() => onNavigate('products')} />
        <div className="min-w-0 xl:col-span-2">
          <OrdersTable
            title="Recent orders"
            subtitle="Demo data - newest first"
            orders={tableOrders}
            categories={categories}
            limit={7}
            search={search}
            onClearSearch={() => onSearch('')}
            onViewAll={() => onNavigate('orders')}
          />
        </div>
      </div>
    </div>
  )
}
