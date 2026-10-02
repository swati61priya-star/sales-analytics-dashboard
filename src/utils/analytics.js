import { formatShortDate } from './format.js'

const DAY = 24 * 60 * 60 * 1000

export const isRevenueOrder = (order) => order.status !== 'Cancelled' && order.status !== 'Refunded'

function startOfTomorrow() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.getTime() + DAY
}

// Orders from the last `days` days (including today). `offsetDays` shifts the window back,
// so filterByRange(orders, 30, 30) gives the 30 days *before* the current 30.
export function filterByRange(orders, days, offsetDays = 0) {
  if (!days) return orders
  const end = startOfTomorrow() - offsetDays * DAY
  const start = end - days * DAY
  return orders.filter((o) => {
    const t = new Date(o.date).getTime()
    return t >= start && t < end
  })
}

export function computeKpis(orders) {
  const valid = orders.filter(isRevenueOrder)
  const revenue = valid.reduce((sum, o) => sum + o.amount, 0)
  const profit = valid.reduce((sum, o) => sum + o.profit, 0)
  const count = valid.length
  return { revenue, profit, orders: count, aov: count ? revenue / count : 0 }
}

export function percentChange(current, previous) {
  if (!previous) return null
  return ((current - previous) / previous) * 100
}

// Groups orders into chart points: daily (<=30 days), weekly (90 days) or monthly (all time).
export function buildSeries(orders, days) {
  const valid = orders.filter(isRevenueOrder)
  let buckets = []
  let indexOf

  if (days) {
    const start = startOfTomorrow() - days * DAY
    const size = days <= 30 ? DAY : 7 * DAY
    const count = Math.ceil((days * DAY) / size)
    buckets = Array.from({ length: count }, (_, i) => ({
      label: formatShortDate(new Date(start + i * size)),
      revenue: 0,
      profit: 0,
      orders: 0,
    }))
    indexOf = (o) => Math.floor((new Date(o.date).getTime() - start) / size)
  } else {
    const monthKey = (o) => {
      const d = new Date(o.date)
      return d.getFullYear() * 12 + d.getMonth()
    }
    const keys = [...new Set(valid.map(monthKey))].sort((a, b) => a - b)
    const lookup = new Map(keys.map((k, i) => [k, i]))
    buckets = keys.map((k) => {
      const d = new Date(Math.floor(k / 12), k % 12, 1)
      const month = d.toLocaleDateString('en-US', { month: 'short' })
      return { label: `${month} '${String(d.getFullYear()).slice(2)}`, revenue: 0, profit: 0, orders: 0 }
    })
    indexOf = (o) => lookup.get(monthKey(o))
  }

  valid.forEach((o) => {
    const bucket = buckets[indexOf(o)]
    if (!bucket) return
    bucket.revenue += o.amount
    bucket.profit += o.profit
    bucket.orders += 1
  })

  return buckets.map((b) => ({
    ...b,
    revenue: Math.round(b.revenue),
    profit: Math.round(b.profit),
    aov: b.orders ? Math.round(b.revenue / b.orders) : 0,
  }))
}

export function categoryBreakdown(orders, categories) {
  const totals = new Map()
  orders.filter(isRevenueOrder).forEach((o) => {
    o.items.forEach((it) => {
      const row = totals.get(it.category) || { revenue: 0, profit: 0, units: 0 }
      row.revenue += it.price * it.qty
      row.profit += (it.price - it.cost) * it.qty
      row.units += it.qty
      totals.set(it.category, row)
    })
  })
  return categories
    .map((c) => {
      const row = totals.get(c.name) || { revenue: 0, profit: 0, units: 0 }
      return { name: c.name, color: c.color, revenue: Math.round(row.revenue), profit: Math.round(row.profit), units: row.units }
    })
    .filter((c) => c.revenue > 0)
    .sort((a, b) => b.revenue - a.revenue)
}

// Sales per product (all products included, even with zero sales)
export function productStats(orders, products) {
  const totals = new Map()
  orders.filter(isRevenueOrder).forEach((o) => {
    o.items.forEach((it) => {
      const row = totals.get(it.productId) || { units: 0, revenue: 0 }
      row.units += it.qty
      row.revenue += it.price * it.qty
      totals.set(it.productId, row)
    })
  })
  return products.map((p) => {
    const row = totals.get(p.id) || { units: 0, revenue: 0 }
    return { ...p, units: row.units, revenue: Math.round(row.revenue) }
  })
}

export function topProducts(orders, products, limit = 5) {
  return productStats(orders, products)
    .filter((p) => p.units > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit)
}

export function customerStats(orders, customers) {
  const totals = new Map()
  orders.forEach((o) => {
    const row = totals.get(o.customerId) || { orders: 0, spent: 0, lastOrder: null }
    if (isRevenueOrder(o)) {
      row.orders += 1
      row.spent += o.amount
    }
    if (!row.lastOrder || o.date > row.lastOrder) row.lastOrder = o.date
    totals.set(o.customerId, row)
  })
  return customers.map((c) => {
    const row = totals.get(c.id) || { orders: 0, spent: 0, lastOrder: null }
    return { ...c, orders: row.orders, spent: Math.round(row.spent), lastOrder: row.lastOrder }
  })
}

// Generic "count and revenue by field" helper (payment method, status ...)
export function groupBy(orders, field, onlyRevenue = false) {
  const map = new Map()
  const source = onlyRevenue ? orders.filter(isRevenueOrder) : orders
  source.forEach((o) => {
    const row = map.get(o[field]) || { name: o[field], orders: 0, revenue: 0 }
    row.orders += 1
    row.revenue += o.amount
    map.set(o[field], row)
  })
  return [...map.values()].map((r) => ({ ...r, revenue: Math.round(r.revenue) })).sort((a, b) => b.orders - a.orders)
}

export function weekdayRevenue(orders) {
  const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const rows = names.map((name) => ({ name, revenue: 0 }))
  orders.filter(isRevenueOrder).forEach((o) => {
    rows[new Date(o.date).getDay()].revenue += o.amount
  })
  // Start the week on Monday
  return [...rows.slice(1), rows[0]].map((r) => ({ ...r, revenue: Math.round(r.revenue) }))
}

// Search helpers used by the header search box
export function matchesOrder(order, term) {
  if (!term) return true
  return [order.id, order.customer, order.email, order.payment, order.status].some((v) => v.toLowerCase().includes(term))
}
