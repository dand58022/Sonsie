"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileUp, ShoppingCart, RefreshCw, TrendingUp, Flame } from "lucide-react"

const actions = [
  {
    icon: FileUp,
    label: "Upload CSV",
    description: "Daily orders",
    href: "/dashboard/csv-import",
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
    borderColor: "border-primary/30",
  },
  {
    icon: RefreshCw,
    label: "View Reorders",
    description: "Stock risks",
    href: "/dashboard/reorder",
    gradient: "from-chart-2/20 to-chart-2/5",
    iconColor: "text-chart-2",
    borderColor: "border-chart-2/30",
  },
  {
    icon: ShoppingCart,
    label: "Draft Orders",
    description: "Review prep",
    href: "/dashboard/reorder",
    gradient: "from-chart-3/20 to-chart-3/5",
    iconColor: "text-chart-3",
    borderColor: "border-chart-3/30",
  },
  {
    icon: TrendingUp,
    label: "View Forecast",
    description: "7-day risk",
    href: "/dashboard/forecast",
    gradient: "from-chart-5/20 to-chart-5/5",
    iconColor: "text-chart-5",
    borderColor: "border-chart-5/30",
  },
]

export function QuickActions() {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
          <Flame className="h-5 w-5 text-primary" />
          Common Tasks
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <Link key={action.label} href={action.href}>
            <Button
              variant="outline"
              className={`h-auto w-full flex-col items-center gap-2 border bg-gradient-to-br ${action.gradient} p-4 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20 ${action.borderColor}`}
            >
              <div className={`rounded-lg bg-secondary/80 p-2.5 ${action.iconColor}`}>
                <action.icon className="h-5 w-5" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">{action.label}</p>
                <p className="text-[10px] text-muted-foreground">{action.description}</p>
              </div>
            </Button>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
