import { CalendarDays, Menu, Moon, Search, Sun, X } from 'lucide-react'
import Select from './Select.jsx'
import { RANGES } from '../constants.js'

export default function Header({ title, subtitle, range, onRangeChange, search, onSearch, searchHint, searchDisabled, theme, onToggleTheme, onOpenMenu }) {
  return (
    <header className="mb-6 flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={onOpenMenu}
        className="flex h-10 w-10 items-center justify-center rounded-2xl border border-line bg-surface lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-2xl font-bold tracking-tight text-ink">{title}</h1>
        <p className="truncate text-sm text-muted">{subtitle}</p>
      </div>

      <div className="relative order-last w-full md:order-none md:w-64 lg:w-72">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
        <input
          type="search"
          value={search}
          disabled={searchDisabled}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={searchHint}
          aria-label="Search"
          className="h-10 w-full rounded-2xl border border-line bg-surface pl-10 pr-9 text-sm text-ink placeholder:text-muted/80 focus:border-sage disabled:cursor-not-allowed disabled:opacity-60 [&::-webkit-search-cancel-button]:hidden"
        />
        {search && (
          <button type="button" onClick={() => onSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-muted hover:text-ink" aria-label="Clear search">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <Select
        value={range}
        onChange={onRangeChange}
        options={RANGES}
        ariaLabel="Date range"
        icon={CalendarDays}
        className="w-44"
      />

      <button
        type="button"
        onClick={onToggleTheme}
        className="flex h-10 w-10 items-center justify-center rounded-2xl border border-line bg-surface text-ink transition hover:border-sage"
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
      >
        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>

      <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface py-1 pl-1 pr-1 sm:pr-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-peach-l text-sm font-bold text-peach-d" aria-hidden="true">
          AM
        </span>
        <div className="hidden text-left leading-tight sm:block">
          <p className="text-sm font-semibold text-ink">Alex Morgan</p>
          <p className="text-xs text-muted">Sales Manager</p>
        </div>
      </div>
    </header>
  )
}
