"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { mockActivityFeed } from "@/data/activity"
import { Activity, ChevronRight, Package, Truck, AlertCircle, RefreshCw } from "lucide-react"
import { formatRelativeTime } from "@/lib/operations"
import { cn } from "@/lib/utils"
import Link from "next/link"

function getActivityIcon(type: string) {
  switch (type) {
    case 'update':
      return <RefreshCw className="h-3.5 w-3.5" />
    case 'order':
      return <Package className="h-3.5 w-3.5" />
    case 'delivery':
      return <Truck className="h-3.5 w-3.5" />
    case 'alert':
      return <AlertCircle className="h-3.5 w-3.5" />
    default:
      return <Activity className="h-3.5 w-3.5" />
  }
}

function getActivityColor(type: string) {
  switch (type) {
    case 'update':
      return 'bg-chart-2/12 text-chart-2 ring-1 ring-chart-2/25'
    case 'order':
      return 'bg-primary/12 text-primary ring-1 ring-primary/25'
    case 'delivery':
      return 'bg-success/12 text-success ring-1 ring-success/25'
    case 'alert':
      return 'bg-destructive/12 text-destructive ring-1 ring-destructive/25'
    default:
      return 'bg-secondary text-muted-foreground ring-1 ring-border'
  }
}

export function ActivityFeed() {
  return (
    <Card className="border-dashboard-border-strong/70 bg-dashboard-surface-raised shadow-sm shadow-black/5 dark:shadow-black/25">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
          <Activity className="h-5 w-5 text-chart-2" />
          {"Service Activity"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {mockActivityFeed.slice(0, 3).map((activity, index) => (
          <div 
            key={activity.id}
            className={cn(
              "flex items-start gap-3 pb-2.5",
              index !== mockActivityFeed.slice(0, 3).length - 1 && "border-b border-border/70"
            )}
          >
            {/* Activity Type Icon */}
            <div className={cn(
              "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
              getActivityColor(activity.type)
            )}>
              {getActivityIcon(activity.type)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm leading-snug text-foreground">
                <span className="font-bold text-foreground">{activity.user}</span>
                {' '}
                <span className="text-foreground/80">{activity.action}</span>
                {' '}
                {activity.item && <span className="font-semibold text-primary">{activity.item}</span>}
              </p>
              <p className="mt-1 text-xs font-medium text-muted-foreground/80">
                {formatRelativeTime(activity.timestamp)}
              </p>
            </div>
          </div>
        ))}

        <Link href="/dashboard/activity">
          <Button 
            variant="ghost" 
            className="w-full justify-between text-muted-foreground hover:text-foreground"
          >
            View full service log
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
