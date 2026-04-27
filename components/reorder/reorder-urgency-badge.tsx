"use client"

import { Badge } from "@/components/ui/badge"
import type { ReorderUrgency } from "@/data/reorder"
import { cn } from "@/lib/utils"

interface ReorderUrgencyBadgeProps {
  urgency: ReorderUrgency
  className?: string
}

export function ReorderUrgencyBadge({ urgency, className }: ReorderUrgencyBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "whitespace-nowrap font-medium",
        urgency === "Critical" && "bg-destructive/10 text-destructive border-destructive/20",
        urgency === "High" && "bg-chart-1/10 text-chart-1 border-chart-1/20",
        urgency === "Medium" && "bg-warning/10 text-warning border-warning/20",
        urgency === "Low" && "bg-muted text-muted-foreground border-border",
        className,
      )}
    >
      {urgency}
    </Badge>
  )
}
