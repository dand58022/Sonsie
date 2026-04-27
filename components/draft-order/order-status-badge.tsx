"use client"

import { Badge } from "@/components/ui/badge"
import type { DraftOrderStatus } from "@/data/draft-order"
import { cn } from "@/lib/utils"

interface OrderStatusBadgeProps {
  status: DraftOrderStatus
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const label = {
    draft: "Draft",
    ready: "Ready",
    prepared: "Prepared",
  }[status]

  return (
    <Badge
      variant="outline"
      className={cn(
        "whitespace-nowrap font-medium",
        status === "draft" && "bg-muted text-muted-foreground border-border",
        status === "ready" && "bg-primary/10 text-primary border-primary/20",
        status === "prepared" && "bg-success/10 text-success border-success/20",
      )}
    >
      {label}
    </Badge>
  )
}
