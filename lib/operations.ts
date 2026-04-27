import type { InventoryItem } from "@/data/inventory"
import type { Order } from "@/data/orders"

export const INVENTORY_STATUS_SEVERITY: Record<InventoryItem["status"], number> = {
  "Out of Stock": 0,
  Critical: 1,
  "Low Stock": 2,
  "In Stock": 3,
}

export type OperationalStockStatus = InventoryItem["status"] | "Low" | "Good"

const OPERATIONAL_STATUS_ALIASES: Record<OperationalStockStatus, InventoryItem["status"]> = {
  "Out of Stock": "Out of Stock",
  Critical: "Critical",
  "Low Stock": "Low Stock",
  Low: "Low Stock",
  "In Stock": "In Stock",
  Good: "In Stock",
}

export type OrderBucket = "Draft" | "Active" | "Received"

export interface InventoryOperationsSummary {
  criticalLowStockItems: number
  itemsBelowPar: number
  itemsAboveParPercent: number
  criticalItems: InventoryItem[]
  belowParItems: InventoryItem[]
}

export function getOperationalStatusSeverity(status: OperationalStockStatus) {
  return INVENTORY_STATUS_SEVERITY[OPERATIONAL_STATUS_ALIASES[status]] ?? Number.MAX_SAFE_INTEGER
}

export function getInventoryStatusSeverity(status: InventoryItem["status"]) {
  return getOperationalStatusSeverity(status)
}

export function compareOperationalStatus(
  left: OperationalStockStatus,
  right: OperationalStockStatus,
) {
  return getOperationalStatusSeverity(left) - getOperationalStatusSeverity(right)
}

export function compareInventoryStatus(
  left: InventoryItem["status"],
  right: InventoryItem["status"],
) {
  return compareOperationalStatus(left, right)
}

export function getDerivedInventoryStatus(item: Pick<InventoryItem, "quantity" | "parLevel" | "reorderPoint">) {
  if (item.quantity <= 0) {
    return "Out of Stock" as const
  }

  if (item.quantity <= Math.max(item.parLevel * 0.25, item.reorderPoint * 0.5)) {
    return "Critical" as const
  }

  if (item.quantity <= item.reorderPoint) {
    return "Low Stock" as const
  }

  return "In Stock" as const
}

export function getInventoryStatus(item: Pick<InventoryItem, "quantity" | "parLevel" | "reorderPoint">) {
  return getDerivedInventoryStatus(item)
}

export function normalizeInventoryItemStatus<TItem extends InventoryItem>(item: TItem): TItem {
  return {
    ...item,
    status: getInventoryStatus(item),
  }
}

export function isCriticalLowStock(item: Pick<InventoryItem, "quantity" | "parLevel" | "reorderPoint">) {
  return getInventoryStatus(item) === "Out of Stock" || getInventoryStatus(item) === "Critical"
}

export function getInventoryOperationsSummary(items: InventoryItem[]): InventoryOperationsSummary {
  const uniqueItems = Array.from(new Map(items.map((item) => [item.id, normalizeInventoryItemStatus(item)])).values())
  const criticalItems = uniqueItems
    .filter(isCriticalLowStock)
    .sort((left, right) => {
      const statusDelta = compareInventoryStatus(getInventoryStatus(left), getInventoryStatus(right))

      if (statusDelta !== 0) {
        return statusDelta
      }

      return left.quantity / Math.max(left.parLevel, 1) - right.quantity / Math.max(right.parLevel, 1)
    })
  const belowPar = uniqueItems.filter((item) => item.quantity < item.parLevel && !isCriticalLowStock(item))
  const aboveParPercent =
    uniqueItems.length === 0
      ? 0
      : Math.round((uniqueItems.filter((item) => item.quantity >= item.parLevel).length / uniqueItems.length) * 100)

  return {
    criticalLowStockItems: criticalItems.length,
    itemsBelowPar: belowPar.length,
    itemsAboveParPercent: aboveParPercent,
    criticalItems,
    belowParItems: belowPar,
  }
}

export function getOrderBucket(order: Pick<Order, "status">): OrderBucket {
  if (order.status === "Received") {
    return "Received"
  }

  if (order.status === "Draft") {
    return "Draft"
  }

  return "Active"
}

export function formatRelativeTime(input: string | number | Date, nowInput: Date = new Date()) {
  const timestamp = new Date(input).getTime()
  const now = nowInput.getTime()

  if (!Number.isFinite(timestamp)) {
    return "Just now"
  }

  const diffMs = Math.max(0, now - timestamp)
  const diffMinutes = Math.round(diffMs / 60000)

  if (diffMinutes < 1) {
    return "Just now"
  }

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`
  }

  const diffHours = Math.round(diffMinutes / 60)

  if (diffHours < 24) {
    return `${diffHours}h ago`
  }

  return `${Math.round(diffHours / 24)}d ago`
}
