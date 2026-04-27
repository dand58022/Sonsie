"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import type { ForecastChartPoint, UsageTrendPoint } from "@/data/forecast"

interface ForecastChartsProps {
  depletionData: ForecastChartPoint[]
  usageTrendData: UsageTrendPoint[]
}

export function ForecastCharts({ depletionData, usageTrendData }: ForecastChartsProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <ChartFrame title="Service Depletion">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={depletionData} margin={{ top: 12, right: 18, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
            <Line type="monotone" dataKey="projectedStock" stroke="var(--primary)" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="criticalLine" stroke="var(--destructive)" strokeDasharray="5 5" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartFrame>

      <ChartFrame title="Service Mix">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={usageTrendData} margin={{ top: 12, right: 18, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
            <Bar dataKey="brunch" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="dinner" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="bar" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartFrame>
    </div>
  )
}

function ChartFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="mb-3 text-sm font-medium text-foreground">{title}</p>
      <div className="h-72 min-w-0">{children}</div>
    </div>
  )
}
