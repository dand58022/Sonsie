"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { usageChartData } from "@/data/forecasting"
import { cn } from "@/lib/utils"

const categories = [
  { key: 'produce', label: 'Produce', color: 'oklch(0.62 0.13 145)', fillId: 'colorProduce' },
  { key: 'seafood', label: 'Seafood', color: 'oklch(0.67 0.13 45)', fillId: 'colorSeafood' },
  { key: 'bar', label: 'Bar', color: 'oklch(0.48 0.14 28)', fillId: 'colorBar' },
]

export function UsageChart() {
  const [activeCategories, setActiveCategories] = useState<string[]>(['produce', 'seafood', 'bar'])

  const toggleCategory = (key: string) => {
    setActiveCategories(prev => 
      prev.includes(key) 
        ? prev.filter(k => k !== key)
        : [...prev, key]
    )
  }

  return (
    <Card
      className="border-dashboard-border-strong/70 bg-dashboard-surface-raised shadow-sm shadow-black/5 dark:shadow-black/25"
      data-demo-target="overview-usage-chart"
    >
      <CardHeader className="flex flex-row items-center justify-between pb-1">
        <CardTitle className="text-base font-semibold text-foreground">
          Service Usage (Last 7 Days)
        </CardTitle>
        <div className="flex gap-2">
          {categories.map((cat) => (
            <Button
              key={cat.key}
              variant="outline"
              size="sm"
              onClick={() => toggleCategory(cat.key)}
              className={cn(
                "h-7 border px-2.5 text-xs font-semibold transition-colors",
                activeCategories.includes(cat.key)
                  ? "bg-secondary text-foreground shadow-xs dark:bg-secondary/70"
                  : "border-border bg-transparent text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              )}
              style={activeCategories.includes(cat.key) ? {
                borderColor: cat.color,
                borderWidth: '1px'
              } : undefined}
            >
              <span 
                className="mr-1.5 inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: activeCategories.includes(cat.key) ? cat.color : 'transparent', border: `1px solid ${cat.color}` }}
              />
              {cat.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[210px] w-full rounded-lg border border-border/80 bg-dashboard-surface-inner px-2 py-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={usageChartData} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}>
              <defs>
                {categories.map((cat) => (
                  <linearGradient key={cat.fillId} id={cat.fillId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={cat.color} stopOpacity={0.16} />
                    <stop offset="95%" stopColor={cat.color} stopOpacity={0.02} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--dashboard-border-strong)" strokeOpacity={0.7} vertical={false} />
              <XAxis
                dataKey="date"
                stroke="var(--muted-foreground)"
                fontSize={12}
                fontWeight={600}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={12}
                fontWeight={600}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value}lbs`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--dashboard-surface-raised)",
                  border: "1px solid var(--dashboard-border-strong)",
                  borderRadius: "8px",
                  boxShadow: "0 10px 30px rgb(0 0 0 / 0.24)",
                }}
                labelStyle={{ color: "var(--foreground)", fontWeight: 700 }}
                itemStyle={{ color: "var(--foreground)", fontWeight: 600 }}
              />
              {activeCategories.includes('produce') && (
                <Area
                  type="monotone"
                  dataKey="produce"
                  name="Produce"
                  stroke={categories[0].color}
                  fillOpacity={1}
                  fill="url(#colorProduce)"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2 }}
                />
              )}
              {activeCategories.includes('seafood') && (
                <Area
                  type="monotone"
                  dataKey="seafood"
                  name="Seafood"
                  stroke={categories[1].color}
                  fillOpacity={1}
                  fill="url(#colorSeafood)"
                  strokeWidth={2.35}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2 }}
                />
              )}
              {activeCategories.includes('bar') && (
                <Area
                  type="monotone"
                  dataKey="bar"
                  name="Bar"
                  stroke={categories[2].color}
                  fillOpacity={1}
                  fill="url(#colorBar)"
                  strokeWidth={2.35}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2 }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
