// Change CURRENCY / LOCALE here to switch the whole dashboard (e.g. 'INR' + 'en-IN').
const CURRENCY = 'USD'
const LOCALE = 'en-US'

const money = new Intl.NumberFormat(LOCALE, { style: 'currency', currency: CURRENCY, maximumFractionDigits: 0 })
const money2 = new Intl.NumberFormat(LOCALE, { style: 'currency', currency: CURRENCY, minimumFractionDigits: 2, maximumFractionDigits: 2 })
const compact = new Intl.NumberFormat(LOCALE, { style: 'currency', currency: CURRENCY, notation: 'compact', maximumFractionDigits: 1 })
const plain = new Intl.NumberFormat(LOCALE)

export const formatMoney = (n) => money.format(n || 0)
export const formatMoneyExact = (n) => money2.format(n || 0)
export const formatCompact = (n) => compact.format(n || 0)
export const formatNumber = (n) => plain.format(n || 0)

export const formatPercent = (n) => `${Math.abs(n).toFixed(1)}%`

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString(LOCALE, { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatShortDate(date) {
  return date.toLocaleDateString(LOCALE, { day: 'numeric', month: 'short' })
}

export function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
