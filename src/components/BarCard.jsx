import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { BarChart3 } from 'lucide-react'
import { Card, CardHeader } from './Card.jsx'
import ChartTooltip from './ChartTooltip.jsx'
import EmptyState from './EmptyState.jsx'
import { formatCompact } from '../utils/format.js'

// A simple reusable bar chart card.
export default function BarCard({ title, subtitle, data, xKey = 'label', yKey, name, color, valueFormatter = (v) => v, axisFormatter = formatCompact }) {
  const hasData = data.some((d) => d[yKey] > 0)
  return (
    <Card>
      <CardHeader title={title} subtitle={subtitle} />
      {hasData ? (
        <div className="h-60 w-full text-muted">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="currentColor" strokeOpacity={0.18} />
              <XAxis dataKey={xKey} tickLine={false} axisLine={false} tick={{ fill: 'currentColor', fontSize: 12 }} minTickGap={16} />
              <YAxis tickFormatter={axisFormatter} tickLine={false} axisLine={false} width={48} tick={{ fill: 'currentColor', fontSize: 12 }} />
              <Tooltip content={<ChartTooltip formatter={valueFormatter} />} cursor={{ fill: 'currentColor', fillOpacity: 0.08 }} />
              <Bar dataKey={yKey} name={name} fill={color} radius={[8, 8, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <EmptyState icon={BarChart3} title="No data to chart" message="Choose a longer date range." />
      )}
    </Card>
  )
}
