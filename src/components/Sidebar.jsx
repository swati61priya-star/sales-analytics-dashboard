import { BarChart3, Database, X } from 'lucide-react'
import { NAV_ITEMS } from '../constants.js'
import { formatNumber } from '../utils/format.js'

export default function Sidebar({ active, onNavigate, open, onClose, totalOrders }) {
  return (
    <>
      {/* Dark overlay behind the drawer on small screens */}
      <div
        className={`fixed inset-0 z-30 bg-ink/30 backdrop-blur-sm transition-opacity lg:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        aria-label="Main navigation"
        className={`fixed inset-y-3 left-3 z-40 flex w-64 flex-col rounded-[2rem] bg-sidebar p-5 text-white shadow-lift transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-[120%]'} lg:sticky lg:top-5 lg:h-[calc(100vh-2.5rem)] lg:shrink-0 lg:translate-x-0`}
      >
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/25">
              <BarChart3 className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-bold tracking-tight">SalesPulse</span>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 hover:bg-white/20 lg:hidden" aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1.5">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = id === active
            return (
              <button
                key={id}
                type="button"
                onClick={() => onNavigate(id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition
                  ${isActive ? 'bg-surface text-ink shadow-soft' : 'text-white/90 hover:bg-white/20'}`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                {label}
              </button>
            )
          })}
        </nav>

        <div className="rounded-3xl bg-white/20 p-4">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white/25">
            <Database className="h-4 w-4" aria-hidden="true" />
          </div>
          <p className="text-sm font-semibold">Demo data</p>
          <p className="mt-0.5 text-xs leading-relaxed text-white/85">
            {formatNumber(totalOrders)} sample orders generated for the last 12 months. Nothing is sent to a server.
          </p>
        </div>
      </aside>
    </>
  )
}
