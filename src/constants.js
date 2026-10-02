import { LayoutDashboard, TrendingUp, ShoppingCart, Package, Users, FileText } from 'lucide-react'

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, subtitle: 'Your store performance at a glance', searchHint: 'Search orders or customers' },
  { id: 'sales', label: 'Sales', icon: TrendingUp, subtitle: 'Revenue, profit and buying patterns', searchHint: 'Search sales by customer' },
  { id: 'orders', label: 'Orders', icon: ShoppingCart, subtitle: 'Every order in the selected period', searchHint: 'Search order ID, customer or email' },
  { id: 'products', label: 'Products', icon: Package, subtitle: 'Catalogue, stock and best sellers', searchHint: 'Search products' },
  { id: 'customers', label: 'Customers', icon: Users, subtitle: 'Who is buying and how much they spend', searchHint: 'Search customers' },
  { id: 'reports', label: 'Reports', icon: FileText, subtitle: 'Insights and downloadable CSV reports', searchHint: 'Search is available on other pages' },
]

export const RANGES = [
  { value: '7', label: 'Last 7 days', days: 7 },
  { value: '30', label: 'Last 30 days', days: 30 },
  { value: '90', label: 'Last 90 days', days: 90 },
  { value: 'all', label: 'All time', days: null },
]

export const ORDER_STATUSES = ['Completed', 'Shipped', 'Pending', 'Cancelled', 'Refunded']

// Chart colours (soft pastels that work in light and dark mode)
export const CHART_COLORS = {
  revenue: '#7FA68F',
  profit: '#8EA9C4',
  orders: '#E0B48A',
  accent: '#D9A5A0',
}
