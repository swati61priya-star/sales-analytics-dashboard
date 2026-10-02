import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { formatPercent } from '../utils/format.js'

// One summary card: icon, value, % change vs the previous period and a tiny trend line.
export default function KpiCard({ id, title, value, change, comparisonLabel, icon: Icon, color, series, dataKey }) {
  const hasChange = change !== null && change !== undefined
  const positive = hasChange && change >= 0

  return (
    <div className="min-w-0 rounded-3xl border border-line/70 bg-surface p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted">{title}</p>
          <p className="mt-1.5 truncate text-2xl font-bold tracking-tight text-ink">{value}</p>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl" style={{ background: `${color}40`, color: 'rgb(var(--c-ink))' }}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>

      <div className="mt-3 h-10" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.5} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fill={`url(#spark-${id})`} dot={false} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
        {hasChange ? (
          <>
            <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-1 font-semibold ${positive ? 'bg-sage-l text-sage-d' : 'bg-rose-l text-rose-d'}`}>
              {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              {formatPercent(change)}
            </span>
            <span className="text-muted">{comparisonLabel}</span>
          </>
        ) : (
          <span className="rounded-full bg-soft px-2 py-1 font-medium text-muted">{comparisonLabel}</span>
        )}
      </div>
    </div>
  )
}
