import { useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { LineChart as ChartIcon } from 'lucide-react'
import { Card, CardHeader } from './Card.jsx'
import ChartTooltip from './ChartTooltip.jsx'
import EmptyState from './EmptyState.jsx'
import { CHART_COLORS } from '../constants.js'
import { formatCompact, formatMoney } from '../utils/format.js'

const SERIES = [
  { key: 'revenue', label: 'Revenue', color: CHART_COLORS.revenue },
  { key: 'profit', label: 'Profit', color: CHART_COLORS.profit },
]

export default function SalesChart({ series, subtitle, height = 'h-72' }) {
  const [visible, setVisible] = useState({ revenue: true, profit: true })
  const hasData = series.some((p) => p.revenue > 0)

  // Keep at least one line visible
  const toggle = (key) => {
    const next = { ...visible, [key]: !visible[key] }
    if (next.revenue || next.profit) setVisible(next)
  }

  return (
    <Card>
      <CardHeader
        title="Sales overview"
        subtitle={subtitle}
        action={
          <div className="flex gap-2">
            {SERIES.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => toggle(s.key)}
                aria-pressed={visible[s.key]}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${visible[s.key] ? 'border-line bg-soft text-ink' : 'border-line/60 text-muted opacity-60'}`}
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                {s.label}
              </button>
            ))}
          </div>
        }
      />

      {hasData ? (
        <div className={`${height} w-full text-muted`}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
              <defs>
                {SERIES.map((s) => (
                  <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={s.color} stopOpacity={0.45} />
                    <stop offset="100%" stopColor={s.color} stopOpacity={0.02} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="currentColor" strokeOpacity={0.18} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: 'currentColor', fontSize: 12 }} minTickGap={24} />
              <YAxis tickFormatter={formatCompact} tickLine={false} axisLine={false} width={52} tick={{ fill: 'currentColor', fontSize: 12 }} />
              <Tooltip content={<ChartTooltip formatter={formatMoney} />} cursor={{ stroke: 'currentColor', strokeOpacity: 0.25 }} />
              {SERIES.filter((s) => visible[s.key]).map((s) => (
                <Area
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.label}
                  stroke={s.color}
                  strokeWidth={2.5}
                  fill={`url(#grad-${s.key})`}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <EmptyState icon={ChartIcon} title="No sales in this period" message="Pick a longer date range to see revenue and profit." />
      )}
    </Card>
  )
}
