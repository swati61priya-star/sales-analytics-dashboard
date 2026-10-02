import { useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { PieChart as PieIcon } from 'lucide-react'
import { Card, CardHeader } from './Card.jsx'
import ChartTooltip from './ChartTooltip.jsx'
import EmptyState from './EmptyState.jsx'
import { formatCompact, formatMoney } from '../utils/format.js'

export default function CategoryDonut({ data }) {
  const [active, setActive] = useState(null)
  const total = data.reduce((sum, c) => sum + c.revenue, 0)
  const focus = active !== null ? data[active] : null

  return (
    <Card>
      <CardHeader title="Sales by category" subtitle="Share of revenue" />

      {total > 0 ? (
        <>
          <div className="relative mx-auto h-52 w-full max-w-[13rem]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="revenue"
                  nameKey="name"
                  innerRadius="68%"
                  outerRadius="100%"
                  paddingAngle={3}
                  cornerRadius={8}
                  stroke="none"
                  onMouseEnter={(_, i) => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                >
                  {data.map((c, i) => (
                    <Cell key={c.name} fill={c.color} opacity={active === null || active === i ? 1 : 0.45} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip formatter={formatMoney} />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="max-w-[6rem] truncate text-xs text-muted">{focus ? focus.name : 'Total revenue'}</span>
              <span className="text-xl font-bold text-ink">{formatCompact(focus ? focus.revenue : total)}</span>
              {focus && <span className="text-xs font-medium text-muted">{((focus.revenue / total) * 100).toFixed(1)}%</span>}
            </div>
          </div>

          <ul className="mt-4 space-y-2">
            {data.map((c, i) => (
              <li
                key={c.name}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className="flex items-center justify-between gap-3 rounded-xl px-2 py-1 text-sm hover:bg-soft"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: c.color }} />
                  <span className="truncate text-ink">{c.name}</span>
                </span>
                <span className="shrink-0 font-semibold text-ink">{((c.revenue / total) * 100).toFixed(0)}%</span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <EmptyState icon={PieIcon} title="No category data" message="There were no sales in the selected period." />
      )}
    </Card>
  )
}
