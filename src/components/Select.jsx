import { ChevronDown } from 'lucide-react'

export default function Select({ value, onChange, options, ariaLabel, icon: Icon, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      {Icon && <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />}
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-10 w-full cursor-pointer appearance-none rounded-2xl border border-line bg-surface pr-9 text-sm font-medium text-ink transition hover:border-sage focus:border-sage ${Icon ? 'pl-9' : 'pl-3.5'}`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
    </div>
  )
}
