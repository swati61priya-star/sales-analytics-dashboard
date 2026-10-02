import { useMemo, useState } from 'react'
import { Download, FileSpreadsheet, Lightbulb, Printer } from 'lucide-react'
import { Card, CardHeader } from '../components/Card.jsx'
import { categoryBreakdown, computeKpis, customerStats, groupBy, productStats, weekdayRevenue } from '../utils/analytics.js'
import { downloadCsv, toCsv } from '../utils/csv.js'
import { formatMoney, formatNumber } from '../utils/format.js'
import { categories, customers, products } from '../data/index.js'

export default function ReportsView({ orders, range }) {
  const [notice, setNotice] = useState(null)
  const stamp = new Date().toISOString().slice(0, 10)

  const reports = useMemo(() => {
    const productRows = productStats(orders, products)
    const customerRows = customerStats(orders, customers)
    const categoryRows = categoryBreakdown(orders, categories)
    return [
      {
        id: 'orders',
        title: 'Orders report',
        description: 'Every order with customer, amount, payment method and status.',
        rows: orders,
        file: `orders-${range.value}-${stamp}.csv`,
        columns: [
          { label: 'Order ID', value: (o) => o.id },
          { label: 'Customer', value: (o) => o.customer },
          { label: 'Date', value: (o) => o.date.slice(0, 10) },
          { label: 'Amount', value: (o) => o.amount.toFixed(2) },
          { label: 'Profit', value: (o) => o.profit.toFixed(2) },
          { label: 'Payment Method', value: (o) => o.payment },
          { label: 'Status', value: (o) => o.status },
        ],
      },
      {
        id: 'products',
        title: 'Product performance',
        description: 'Units sold, revenue and current stock for each product.',
        rows: productRows,
        file: `products-${range.value}-${stamp}.csv`,
        columns: [
          { label: 'Product', value: (p) => p.name },
          { label: 'Category', value: (p) => p.category },
          { label: 'Price', value: (p) => p.price },
          { label: 'Units Sold', value: (p) => p.units },
          { label: 'Revenue', value: (p) => p.revenue },
          { label: 'Stock', value: (p) => p.stock },
        ],
      },
      {
        id: 'customers',
        title: 'Customer summary',
        description: 'Orders, total spend and last order date for each customer.',
        rows: customerRows,
        file: `customers-${range.value}-${stamp}.csv`,
        columns: [
          { label: 'Customer', value: (c) => c.name },
          { label: 'Email', value: (c) => c.email },
          { label: 'City', value: (c) => c.city },
          { label: 'Orders', value: (c) => c.orders },
          { label: 'Total Spent', value: (c) => c.spent },
          { label: 'Last Order', value: (c) => (c.lastOrder ? c.lastOrder.slice(0, 10) : '') },
        ],
      },
      {
        id: 'categories',
        title: 'Category summary',
        description: 'Revenue, profit and units sold for each product category.',
        rows: categoryRows,
        file: `categories-${range.value}-${stamp}.csv`,
        columns: [
          { label: 'Category', value: (c) => c.name },
          { label: 'Units', value: (c) => c.units },
          { label: 'Revenue', value: (c) => c.revenue },
          { label: 'Profit', value: (c) => c.profit },
        ],
      },
    ]
  }, [orders, range, stamp])

  const insights = useMemo(() => {
    const kpis = computeKpis(orders)
    const topCategory = categoryBreakdown(orders, categories)[0]
    const topProduct = productStats(orders, products).sort((a, b) => b.revenue - a.revenue)[0]
    const topCustomer = customerStats(orders, customers).sort((a, b) => b.spent - a.spent)[0]
    const bestDay = weekdayRevenue(orders).sort((a, b) => b.revenue - a.revenue)[0]
    const topPayment = groupBy(orders, 'payment', true)[0]
    const refunded = orders.filter((o) => o.status === 'Refunded').length
    const list = []
    if (orders.length === 0) return list
    list.push(`You earned ${formatMoney(kpis.revenue)} from ${formatNumber(kpis.orders)} orders, with a profit margin of ${kpis.revenue ? ((kpis.profit / kpis.revenue) * 100).toFixed(1) : 0}%.`)
    if (topCategory) list.push(`${topCategory.name} is the strongest category with ${formatMoney(topCategory.revenue)} in revenue.`)
    if (topProduct && topProduct.units > 0) list.push(`${topProduct.name} is the best seller: ${formatNumber(topProduct.units)} units and ${formatMoney(topProduct.revenue)}.`)
    if (topCustomer && topCustomer.spent > 0) list.push(`${topCustomer.name} is the top customer, spending ${formatMoney(topCustomer.spent)}.`)
    if (bestDay && bestDay.revenue > 0) list.push(`${bestDay.name} is the best day of the week for sales.`)
    if (topPayment) list.push(`${topPayment.name} is the most popular payment method (${formatNumber(topPayment.orders)} orders).`)
    list.push(`${formatNumber(refunded)} orders were refunded in this period (${((refunded / orders.length) * 100).toFixed(1)}% of all orders).`)
    return list
  }, [orders])

  const download = (report) => {
    if (report.rows.length === 0) {
      setNotice({ type: 'error', text: `${report.title} has no rows for this date range.` })
      return
    }
    const ok = downloadCsv(report.file, toCsv(report.rows, report.columns))
    setNotice(ok ? { type: 'ok', text: `${report.title} downloaded (${formatNumber(report.rows.length)} rows).` } : { type: 'error', text: 'Download failed. Please try again.' })
  }

  return (
    <div className="view-in space-y-5">
      {notice && (
        <p role="status" className={`rounded-2xl px-4 py-3 text-sm font-medium ${notice.type === 'ok' ? 'bg-sage-l text-sage-d' : 'bg-rose-l text-rose-d'}`}>
          {notice.text}
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <Card>
            <CardHeader title="Download reports" subtitle={`CSV files for ${range.label.toLowerCase()}. Open them in Excel or Google Sheets.`} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {reports.map((r) => (
                <div key={r.id} className="flex flex-col rounded-2xl bg-soft/70 p-4">
                  <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-sage-l text-sage-d">
                    <FileSpreadsheet className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="text-sm font-semibold text-ink">{r.title}</h3>
                  <p className="mt-1 flex-1 text-sm text-muted">{r.description}</p>
                  <button
                    type="button"
                    onClick={() => download(r)}
                    className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-sage-d px-4 py-2.5 text-sm font-semibold text-surface transition hover:opacity-90"
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                    Download CSV ({formatNumber(r.rows.length)} rows)
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader
            title="Key insights"
            subtitle={range.label}
            action={
              <button type="button" onClick={() => window.print()} className="flex items-center gap-2 rounded-xl bg-blue-l px-3 py-1.5 text-xs font-semibold text-blue-d transition hover:opacity-80">
                <Printer className="h-3.5 w-3.5" aria-hidden="true" />
                Print
              </button>
            }
          />
          {insights.length === 0 ? (
            <p className="text-sm text-muted">No orders in this period yet.</p>
          ) : (
            <ul className="space-y-3">
              {insights.map((text) => (
                <li key={text} className="flex gap-3 text-sm text-ink">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-peach-l text-peach-d">
                    <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}
