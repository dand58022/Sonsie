"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, AlertCircle, Clock, ChevronRight, ShoppingCart, Pencil } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { alerts } from "@/data/activity"
import { formatRelativeTime } from "@/lib/operations"

export function AlertsPanel() {
  const [reorderItems, setReorderItems] = useState<Set<string>>(new Set())

  const handleReorder = (item: string | undefined) => {
    if (!item) {
      return
    }

    setReorderItems((current) => new Set(current).add(item))
    toast.success(`Added ${item} to reorder list`, {
      description: "This dashboard alert action is staged for current service review.",
    })
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-semibold text-foreground">Alerts</CardTitle>
        <Badge variant="outline" className="bg-destructive/15 text-destructive border-destructive/30 font-semibold">
          {alerts.filter(a => a.type === 'critical').length} Critical
        </Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        {alerts.slice(0, 5).map((alert) => (
          <div
            key={alert.id}
            className={cn(
              "group flex items-center gap-3 rounded-lg border p-3 transition-all hover:shadow-md",
              alert.type === 'critical' && "border-destructive/30 bg-gradient-to-r from-destructive/10 to-transparent",
              alert.type === 'warning' && "border-warning/30 bg-gradient-to-r from-warning/10 to-transparent",
              alert.type === 'info' && "border-chart-2/30 bg-gradient-to-r from-chart-2/10 to-transparent"
            )}
          >
            {/* Icon */}
            {alert.type === 'critical' && (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-destructive/20">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
            )}
            {alert.type === 'warning' && (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-warning/20">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{alert.item}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-muted-foreground">{alert.message}</span>
                {alert.timeRemaining && (
                  <span className={cn(
                    "flex items-center gap-1 text-xs font-medium",
                    alert.timeRemaining === 'Urgent' ? "text-destructive" : "text-warning"
                  )}>
                    <Clock className="h-3 w-3" />
                    {alert.timeRemaining}
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(alert.timestamp)}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-chart-2 hover:bg-chart-2/10 hover:text-chart-2"
                title={reorderItems.has(alert.item ?? "") ? "Already staged" : "Order Now"}
                onClick={() => handleReorder(alert.item)}
              >
                <ShoppingCart className="h-3.5 w-3.5" />
              </Button>
              <Link href="/dashboard/inventory">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  title="Adjust Stock"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
        
        <Link href="/dashboard/inventory">
          <Button 
            variant="ghost" 
            className="w-full justify-between text-muted-foreground hover:text-foreground mt-2"
          >
            View all {alerts.length} alerts
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
