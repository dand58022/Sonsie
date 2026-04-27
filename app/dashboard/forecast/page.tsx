"use client"

import { useMemo } from "react"
import { AlertTriangle, CalendarClock, ClipboardList, TimerReset } from "lucide-react"

import { Header } from "@/components/dashboard/header"
import { ChartSkeleton, TableSkeleton } from "@/components/feedback"
import { ForecastCharts, ForecastTable } from "@/components/forecast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  getForecastItems,
  getForecastSummary,
  getInventoryDepletionChart,
  usageTrendData,
} from "@/data/forecast"
import { sonsieForecastCards } from "@/data/sonsieForecast"

export default function ForecastPage() {
  const forecastItems = useMemo(() => getForecastItems(), [])
  const summary = useMemo(() => getForecastSummary(forecastItems), [forecastItems])
  const depletionData = useMemo(() => getInventoryDepletionChart(forecastItems), [forecastItems])

  return (
    <div className="flex flex-col">
      <Header
        title="Service Forecast"
        subtitle="Brunch, dinner, bar, and event demand planning for the next service window"
      />
      <div className="flex-1 space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {sonsieForecastCards.map((card, index) => (
            <SummaryCard
              key={card.label}
              icon={index % 2 === 0 ? CalendarClock : index === 3 ? TimerReset : index === 4 ? AlertTriangle : ClipboardList}
              label={card.label}
              value={card.projectedDemand}
              helper={card.note}
              tone={index === 4 ? "critical" : index === 3 ? "info" : "warning"}
            />
          ))}
        </div>

        <Card className="border-border bg-card" data-demo-target="forecast-basis">
          <CardHeader>
            <CardTitle>Forecast Basis</CardTitle>
            <CardDescription>
              Uses deterministic mock service demand, perishability, and vendor lead times for planning.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {depletionData.length > 0 ? (
              <ForecastCharts depletionData={depletionData} usageTrendData={usageTrendData} />
            ) : (
              <ChartSkeleton />
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="sticky top-16 z-20 border-b border-border bg-card/95 backdrop-blur">
            <CardTitle>Service Demand Table</CardTitle>
            <CardDescription>
              Sort by days remaining, reorder date, or supplier to plan brunch, dinner, bar, and event readiness.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {forecastItems.length > 0 ? <ForecastTable items={forecastItems} /> : <TableSkeleton />}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  helper,
  tone,
}: {
  icon: typeof AlertTriangle
  label: string
  value: string | number
  helper: string
  tone: "critical" | "warning" | "info"
}) {
  const toneClass = {
    critical: "bg-destructive/10 text-destructive",
    warning: "bg-warning/10 text-warning",
    info: "bg-chart-2/10 text-chart-2",
  }[tone]

  return (
    <Card className="border-border bg-card">
      <CardContent className="flex items-center gap-3 p-4">
        <div className={`rounded-lg p-2.5 ${toneClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold text-foreground" data-typography="metric">{value}</p>
          <p className="text-xs text-muted-foreground">{helper}</p>
        </div>
      </CardContent>
    </Card>
  )
}
