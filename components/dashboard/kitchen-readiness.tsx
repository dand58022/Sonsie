"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Flame, AlertTriangle, CheckCircle2 } from "lucide-react"
import { kitchenReadiness } from "@/data/inventory"
import { cn } from "@/lib/utils"

export function KitchenReadiness() {
  const { itemsAbovePar, criticalShortages, prepStatus } = kitchenReadiness

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready':
        return 'bg-success/15 text-success border-success/30'
      case 'Prep Needed':
        return 'bg-warning/15 text-warning border-warning/30'
      case 'Critical':
        return 'bg-destructive/15 text-destructive border-destructive/30'
      default:
        return 'bg-muted text-muted-foreground border-border'
    }
  }

  return (
    <Card className="border-border bg-gradient-to-br from-card via-card to-secondary/30">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
          <Flame className="h-5 w-5 text-primary" />
          Kitchen Readiness
        </CardTitle>
        <Badge 
          variant="outline" 
          className={cn("font-semibold", getStatusColor(prepStatus))}
        >
          {prepStatus === 'Ready' && <CheckCircle2 className="mr-1 h-3 w-3" />}
          {prepStatus}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items Above Par */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Items Above Par Level</span>
            <span className="text-lg font-bold text-foreground">{itemsAbovePar}%</span>
          </div>
          <div className="relative">
            <Progress 
              value={itemsAbovePar} 
              className="h-3 bg-secondary" 
            />
            <div 
              className="absolute inset-0 h-3 rounded-full bg-gradient-to-r from-primary/80 to-primary"
              style={{ width: `${itemsAbovePar}%` }}
            />
          </div>
        </div>

        {/* Critical Shortages */}
        <div className="flex items-center justify-between rounded-lg bg-destructive/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <span className="text-sm font-medium text-foreground">Critical Shortages</span>
          </div>
          <span className="text-2xl font-bold text-destructive">{criticalShortages}</span>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="rounded-lg bg-secondary/50 p-3 text-center">
            <p className="text-2xl font-bold text-chart-1">24</p>
            <p className="text-xs text-muted-foreground">Meats</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-3 text-center">
            <p className="text-2xl font-bold text-chart-2">8</p>
            <p className="text-xs text-muted-foreground">Seafood</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-3 text-center">
            <p className="text-2xl font-bold text-chart-3">16</p>
            <p className="text-xs text-muted-foreground">Veggies</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
