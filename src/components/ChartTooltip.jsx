// Shared tooltip for Recharts. Pass `formatter` to change how values are shown.
export default function ChartTooltip({ active, payload, label, formatter }) {
  if (!active || !payload || payload.length === 0) return null
  return (
    <div className="rounded-2xl border border-line bg-surface px-3.5 py-2.5 text-sm shadow-lift">
      <p className="mb-1 font-semibold text-ink">{label ?? payload[0].payload?.name}</p>
      {payload.map((p) => (
        <p key={p.dataKey || p.name} className="flex items-center gap-2 text-muted">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color || p.payload?.color || p.fill }} />
          <span>{p.name}:</span>
          <span className="font-semibold text-ink">{formatter ? formatter(p.value) : p.value}</span>
        </p>
      ))}
    </div>
  )
}
