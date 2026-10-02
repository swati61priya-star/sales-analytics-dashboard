export function Card({ className = '', children }) {
  return (
    <section className={`min-w-0 rounded-3xl border border-line/70 bg-surface p-5 shadow-soft ${className}`}>
      {children}
    </section>
  )
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-base font-semibold text-ink">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
