import { useEffect, useMemo, useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Header from './components/Header.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import DashboardView from './views/DashboardView.jsx'
import SalesView from './views/SalesView.jsx'
import OrdersView from './views/OrdersView.jsx'
import ProductsView from './views/ProductsView.jsx'
import CustomersView from './views/CustomersView.jsx'
import ReportsView from './views/ReportsView.jsx'
import useLocalStorage from './hooks/useLocalStorage.js'
import { NAV_ITEMS, RANGES } from './constants.js'
import { filterByRange } from './utils/analytics.js'
import { orders as allOrders } from './data/index.js'

const VIEWS = {
  dashboard: DashboardView,
  sales: SalesView,
  orders: OrdersView,
  products: ProductsView,
  customers: CustomersView,
  reports: ReportsView,
}

export default function App() {
  const [view, setView] = useState('dashboard')
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [rangeValue, setRangeValue] = useLocalStorage('salespulse-range', '30')
  const [theme, setTheme] = useLocalStorage('salespulse-theme', 'light')

  // Apply the theme class to <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const range = RANGES.find((r) => r.value === rangeValue) || RANGES[1]
  const days = range.days

  // Everything below is calculated from the selected date range
  const orders = useMemo(() => filterByRange(allOrders, days), [days])
  const prevOrders = useMemo(() => (days ? filterByRange(allOrders, days, days) : null), [days])

  const navigate = (id) => {
    setView(id)
    setMenuOpen(false)
    window.scrollTo({ top: 0 })
  }

  const current = NAV_ITEMS.find((n) => n.id === view) || NAV_ITEMS[0]
  const ActiveView = VIEWS[current.id]

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto flex max-w-[1700px] gap-5 p-3 sm:p-5">
        <Sidebar active={current.id} onNavigate={navigate} open={menuOpen} onClose={() => setMenuOpen(false)} totalOrders={allOrders.length} />

        <main className="min-w-0 flex-1 pb-6">
          <Header
            title={current.label}
            subtitle={current.subtitle}
            range={range.value}
            onRangeChange={setRangeValue}
            search={search}
            onSearch={setSearch}
            searchHint={current.searchHint}
            searchDisabled={current.id === 'reports'}
            theme={theme}
            onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            onOpenMenu={() => setMenuOpen(true)}
          />

          <ErrorBoundary key={current.id}>
            <ActiveView
              orders={orders}
              prevOrders={prevOrders}
              days={days}
              range={range}
              search={search}
              onSearch={setSearch}
              onNavigate={navigate}
            />
          </ErrorBoundary>

          <footer className="mt-8 text-center text-xs text-muted">
            SalesPulse - all figures come from randomly generated demo data. Built with React, Tailwind CSS and Recharts.
          </footer>
        </main>
      </div>
    </div>
  )
}
