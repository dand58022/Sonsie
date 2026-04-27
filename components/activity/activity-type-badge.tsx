"use client"

import { CheckCircle2, ClipboardList, MinusCircle, Pencil, PlusCircle, SearchCheck, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import type { OrderActivityType } from "@/data/order-activity"
import { cn } from "@/lib/utils"

interface ActivityTypeBadgeProps {
  type: OrderActivityType
}

export function ActivityTypeBadge({ type }: ActivityTypeBadgeProps) {
  const config = activityTypeConfig[type]
  const Icon = config.icon

  return (
    <Badge variant="outline" className={cn("whitespace-nowrap font-medium", config.className)}>
      <Icon className="mr-1 h-3.5 w-3.5" />
      {config.label}
    </Badge>
  )
}

export const activityTypeLabels: Record<OrderActivityType, string> = {
  draft_created: "Draft created",
  item_added: "Item added",
  item_removed: "Item removed",
  quantity_updated: "Quantity updated",
  draft_cleared: "Draft cleared",
  order_reviewed: "Order reviewed",
  order_ready: "Order ready",
}

const activityTypeConfig = {
  draft_created: {
    label: activityTypeLabels.draft_created,
    icon: ClipboardList,
    className: "border-primary/20 bg-primary/10 text-primary",
  },
  item_added: {
    label: activityTypeLabels.item_added,
    icon: PlusCircle,
    className: "border-success/20 bg-success/10 text-success",
  },
  item_removed: {
    label: activityTypeLabels.item_removed,
    icon: MinusCircle,
    className: "border-destructive/20 bg-destructive/10 text-destructive",
  },
  quantity_updated: {
    label: activityTypeLabels.quantity_updated,
    icon: Pencil,
    className: "border-chart-2/20 bg-chart-2/10 text-chart-2",
  },
  draft_cleared: {
    label: activityTypeLabels.draft_cleared,
    icon: Trash2,
    className: "border-destructive/20 bg-destructive/10 text-destructive",
  },
  order_reviewed: {
    label: activityTypeLabels.order_reviewed,
    icon: SearchCheck,
    className: "border-warning/20 bg-warning/10 text-warning",
  },
  order_ready: {
    label: activityTypeLabels.order_ready,
    icon: CheckCircle2,
    className: "border-success/20 bg-success/10 text-success",
  },
} satisfies Record<
  OrderActivityType,
  {
    label: string
    icon: typeof ClipboardList
    className: string
  }
>
