import products from './products.json'
import customers from './customers.json'

// Demo data: orders are generated once when the app loads.
// A fixed seed makes the numbers identical on every run, and the dates are
// always relative to "today" so the 7 / 30 / 90 day filters always have data.

const PAYMENT_METHODS = ['Credit Card', 'Debit Card', 'PayPal', 'UPI', 'Net Banking']
const DAYS_OF_HISTORY = 365

// Small seeded random number generator (mulberry32)
function createRandom(seed) {
  let a = seed
  return function random() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pickStatus(random, ageInDays) {
  const r = random()
  if (ageInDays <= 3) return r < 0.4 ? 'Pending' : r < 0.85 ? 'Shipped' : 'Completed'
  if (ageInDays <= 10) return r < 0.05 ? 'Pending' : r < 0.35 ? 'Shipped' : r < 0.95 ? 'Completed' : 'Cancelled'
  return r < 0.86 ? 'Completed' : r < 0.93 ? 'Cancelled' : 'Refunded'
}

export function generateOrders() {
  const random = createRandom(20261002)
  const totalWeight = products.reduce((sum, p) => sum + p.popularity, 0)

  const pickProduct = () => {
    let target = random() * totalWeight
    for (const p of products) {
      target -= p.popularity
      if (target <= 0) return p
    }
    return products[0]
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const nowHour = new Date().getHours()

  const orders = []

  for (let back = DAYS_OF_HISTORY - 1; back >= 0; back--) {
    const day = new Date(today)
    day.setDate(day.getDate() - back)

    const weekend = day.getDay() === 0 || day.getDay() === 6 ? 1.25 : 1
    const growth = 0.7 + 0.5 * ((DAYS_OF_HISTORY - back) / DAYS_OF_HISTORY)
    const season = 1 + 0.15 * Math.sin((day.getMonth() / 12) * Math.PI * 2)
    const ordersToday = Math.max(1, Math.round((3 + random() * 2.5) * growth * weekend * season))

    for (let i = 0; i < ordersToday; i++) {
      const customer = customers[Math.floor(Math.pow(random(), 1.6) * customers.length)]

      const itemCount = 1 + Math.floor(random() * 3)
      const items = []
      for (let k = 0; k < itemCount; k++) {
        const product = pickProduct()
        const qty = 1 + Math.floor(random() * 2.4)
        const existing = items.find((it) => it.productId === product.id)
        if (existing) {
          existing.qty += qty
        } else {
          items.push({
            productId: product.id,
            name: product.name,
            category: product.category,
            qty,
            price: product.price,
            cost: product.cost,
          })
        }
      }

      const amount = items.reduce((sum, it) => sum + it.price * it.qty, 0)
      const profit = items.reduce((sum, it) => sum + (it.price - it.cost) * it.qty, 0)

      const maxHour = back === 0 ? Math.max(8, nowHour) : 22
      const date = new Date(day)
      date.setHours(8 + Math.floor(random() * (maxHour - 8 + 1)), Math.floor(random() * 60))

      orders.push({
        customerId: customer.id,
        customer: customer.name,
        email: customer.email,
        date: date.toISOString(),
        items,
        amount: Math.round(amount * 100) / 100,
        profit: Math.round(profit * 100) / 100,
        payment: PAYMENT_METHODS[Math.floor(random() * PAYMENT_METHODS.length)],
        status: pickStatus(random, back),
      })
    }
  }

  orders.sort((a, b) => new Date(a.date) - new Date(b.date))
  return orders.map((order, index) => ({ id: `ORD-${10001 + index}`, ...order }))
}
