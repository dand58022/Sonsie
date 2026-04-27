"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type StatusTone = "good" | "warning" | "critical" | "ready" | "info"

interface StatusBadgeProps {
  tone: StatusTone
  children: React.ReactNode
  className?: string
}

export function StatusBadge({ tone, children, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "whitespace-nowrap font-medium",
        tone === "good" && "border-success/20 bg-success/10 text-success",
        tone === "warning" && "border-warning/20 bg-warning/10 text-warning",
        tone === "critical" && "border-destructive/20 bg-destructive/10 text-destructive",
        tone === "ready" && "border-primary/20 bg-primary/10 text-primary",
        tone === "info" && "border-chart-2/20 bg-chart-2/10 text-chart-2",
        className,
      )}
    >
      {children}
    </Badge>
  )
}
