import type { ReorderRecommendation, SupplierMetadata } from "./reorder"

export type DraftOrderStatus = "draft" | "ready" | "prepared"

export interface DraftOrderLineItem {
  recommendationId: string
  itemId: string
  itemName: string
  category: ReorderRecommendation["item"]["category"]
  supplier: SupplierMetadata
  quantity: number
  unit: string
  unitCost: number
  leadTimeDays: number
  estimatedCost: number
  warning?: string
}

export interface DraftSupplierGroup {
  supplier: SupplierMetadata
  items: DraftOrderLineItem[]
  totalCost: number
  maxLeadTimeDays: number
  warning?: string
}

export interface DraftOrderSummaryModel {
  totalItems: number
  totalCost: number
  supplierCount: number
  status: DraftOrderStatus
  warnings: string[]
}

export function createDraftOrderLineItem(
  recommendation: ReorderRecommendation,
  quantity: number,
): DraftOrderLineItem {
  const normalizedQuantity = Math.max(0, quantity)

  return {
    recommendationId: recommendation.id,
    itemId: recommendation.item.id,
    itemName: recommendation.item.name,
    category: recommendation.item.category,
    supplier: recommendation.supplier,
    quantity: normalizedQuantity,
    unit: recommendation.item.unit,
    unitCost: recommendation.item.unitCost,
    leadTimeDays: recommendation.leadTimeDays,
    estimatedCost: normalizedQuantity * recommendation.item.unitCost,
    warning: recommendation.urgency === "Critical" ? "Critical stock risk" : undefined,
  }
}

export function getDraftOrderItems(
  recommendations: ReorderRecommendation[],
  draftIds: Set<string>,
  quantities: Record<string, number>,
) {
  return recommendations
    .filter((recommendation) => draftIds.has(recommendation.id))
    .map((recommendation) =>
      createDraftOrderLineItem(
        recommendation,
        quantities[recommendation.id] ?? recommendation.recommendedQuantity,
      ),
    )
}

export function getDraftSupplierGroups(items: DraftOrderLineItem[]): DraftSupplierGroup[] {
  const groupsBySupplier = new Map<string, DraftOrderLineItem[]>()

  items.forEach((item) => {
    const currentItems = groupsBySupplier.get(item.supplier.id) ?? []
    groupsBySupplier.set(item.supplier.id, [...currentItems, item])
  })

  return Array.from(groupsBySupplier.values()).map((groupItems) => {
    const supplier = groupItems[0].supplier
    const totalCost = groupItems.reduce((total, item) => total + item.estimatedCost, 0)
    const maxLeadTimeDays = Math.max(...groupItems.map((item) => item.leadTimeDays))

    return {
      supplier,
      items: groupItems,
      totalCost,
      maxLeadTimeDays,
      warning:
        supplier.minimumOrder && totalCost < supplier.minimumOrder
          ? `Below minimum order of $${supplier.minimumOrder.toFixed(2)}`
          : undefined,
    }
  })
}

export function getDraftOrderSummary(items: DraftOrderLineItem[]): DraftOrderSummaryModel {
  const groups = getDraftSupplierGroups(items)
  const warnings = groups
    .map((group) => group.warning)
    .filter((warning): warning is string => Boolean(warning))

  return {
    totalItems: items.reduce((total, item) => total + item.quantity, 0),
    totalCost: items.reduce((total, item) => total + item.estimatedCost, 0),
    supplierCount: groups.length,
    status: items.length === 0 ? "draft" : warnings.length === 0 ? "ready" : "draft",
    warnings,
  }
}
