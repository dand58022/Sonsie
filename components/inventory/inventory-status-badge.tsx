"use client"

import { Badge } from "@/components/ui/badge"
import { getStatusColor, type InventoryItem } from "@/data/inventory"
import { cn } from "@/lib/utils"

interface InventoryStatusBadgeProps {
  status: InventoryItem["status"]
  className?: string
}

export function InventoryStatusBadge({ status, className }: InventoryStatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn("whitespace-nowrap font-medium", getStatusColor(status), className)}>
      {status}
    </Badge>
  )
}
