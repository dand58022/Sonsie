import {
  getInventoryCategoryLabel,
  mockInventory,
  type InventoryItem,
} from "./inventory"
import { getInventoryStatus } from "@/lib/operations"
import { sonsieVendors } from "./sonsieVendors"

export type ReorderUrgency = "Critical" | "High" | "Medium" | "Low"

export type ReorderReason =
  | "below_reorder_point"
  | "usage_spike"
  | "low_days_remaining"
  | "upcoming_demand"

export interface SupplierMetadata {
  id: string
  name: string
  type: "broadline" | "local_farm" | "specialty" | "kitchen_supply"
  leadTimeDays: number
  orderWindow: string
  contactLabel: string
  minimumOrder?: number
}

export interface ReorderRecommendation {
  id: string
  item: InventoryItem
  recommendedQuantity: number
  urgency: ReorderUrgency
  reasons: ReorderReason[]
  primaryReason: ReorderReason
  projectedDaysRemaining: number
  recentUsageTrend: string
  leadTimeDays: number
  supplier: SupplierMetadata
  estimatedCost: number
  notes: string
}

export interface ReorderSummary {
  totalRecommendations: number
  criticalItems: number
  highPriorityItems: number
  supplierCount: number
  estimatedTotal: number
}

export const mockSupplierMetadata: SupplierMetadata[] = [
  {
    id: "vendor-boston-seafood",
    name: "Boston Seafood Co.",
    type: "specialty",
    leadTimeDays: 1,
    orderWindow: "Raw bar order closes at 11:00 AM",
    contactLabel: "Seafood desk",
    minimumOrder: 300,
  },
  {
    id: "vendor-back-bay-produce",
    name: "Back Bay Produce",
    type: "local_farm",
    leadTimeDays: 1,
    orderWindow: "Produce orders close at 10:00 AM",
    contactLabel: "Produce buyer",
    minimumOrder: 180,
  },
  {
    id: "vendor-new-england-dairy",
    name: "New England Dairy & Cheese",
    type: "specialty",
    leadTimeDays: 2,
    orderWindow: "Cheese orders close at 2:00 PM",
    contactLabel: "Cheese desk",
    minimumOrder: 220,
  },
  {
    id: "vendor-artisan-bread",
    name: "Artisan Bread & Dough",
    type: "specialty",
    leadTimeDays: 1,
    orderWindow: "Bakery route closes at 3:00 PM",
    contactLabel: "Bakery route",
    minimumOrder: 140,
  },
  {
    id: "vendor-beverage-wine",
    name: "Beverage & Wine Distributor",
    type: "broadline",
    leadTimeDays: 4,
    orderWindow: "Beverage window closes Tuesday 1:00 PM",
    contactLabel: "Beverage account",
    minimumOrder: 500,
  },
  {
    id: "vendor-paper-supply",
    name: "Restaurant Paper Supply",
    type: "kitchen_supply",
    leadTimeDays: 5,
    orderWindow: "Supply orders reviewed weekly",
    contactLabel: "Ops supply desk",
    minimumOrder: 180,
  },
]

const supplierByName = new Map(mockSupplierMetadata.map((supplier) => [supplier.name, supplier]))
function getItem(id: string, items: InventoryItem[] = mockInventory): InventoryItem {
  const inventoryById = new Map(items.map((item) => [item.id, item]))
  const item = inventoryById.get(id)

  if (!item) {
    throw new Error(`Missing inventory item ${id}`)
  }

  return item
}

function getSupplier(item: InventoryItem) {
  const supplier = supplierByName.get(item.supplier) ?? {
    id: `supplier-${item.supplier.toLowerCase().replaceAll(" ", "-")}`,
    name: item.supplier,
    type: "specialty" as const,
    leadTimeDays: 3,
    orderWindow: "Supplier order window not set",
    contactLabel: "Supplier contact not set",
  }

  return {
    ...supplier,
    leadTimeDays: item.leadTimeDays ?? supplier.leadTimeDays,
  }
}

function makeRecommendation(
  id: string,
  itemId: string,
  recommendedQuantity: number,
  urgency: ReorderUrgency,
  reasons: ReorderReason[],
  projectedDaysRemaining: number,
  recentUsageTrend: string,
  notes: string,
  items: InventoryItem[] = mockInventory,
): ReorderRecommendation {
  const item = getItem(itemId, items)
  const supplier = getSupplier(item)
  const status = getInventoryStatus(item)
  const effectiveUrgency =
    status === "Out of Stock" || status === "Critical"
      ? "Critical"
      : status === "Low Stock" && urgency === "Critical"
        ? "High"
        : urgency

  return {
    id,
    item,
    recommendedQuantity,
    urgency: effectiveUrgency,
    reasons,
    primaryReason: reasons[0],
    projectedDaysRemaining,
    recentUsageTrend,
    leadTimeDays: supplier.leadTimeDays,
    supplier,
    estimatedCost: recommendedQuantity * item.unitCost,
    notes,
  }
}

export function getMockReorderRecommendations(items: InventoryItem[] = mockInventory): ReorderRecommendation[] {
  return [
  makeRecommendation(
    "rec-oysters",
    "SON-SEAFOOD-OYSTER-IC",
    10,
    "Critical",
    ["below_reorder_point", "low_days_remaining", "upcoming_demand"],
    0.8,
    "Weekend dinner and private event demand are trending above baseline.",
    "Raw bar demand makes oysters the top perishable priority before weekend service.",
    items,
  ),
  makeRecommendation(
    "rec-basil",
    "SON-PROD-BASIL",
    6,
    "Critical",
    ["below_reorder_point", "usage_spike"],
    0.9,
    "Brick oven volume and garnish prep are pulling basil faster than forecast.",
    "Fresh basil supports pizza and plating; stage with the produce order now.",
    items,
  ),
  makeRecommendation(
    "rec-lemon",
    "SON-PROD-LEMON",
    4,
    "Critical",
    ["below_reorder_point", "upcoming_demand"],
    1.2,
    "Citrus demand is elevated across oysters, seafood, and the bar program.",
    "Lemons are below par and needed for both service and event prep.",
    items,
  ),
  makeRecommendation(
    "rec-dough",
    "SON-BAKERY-PIZZA-DOUGH",
    18,
    "High",
    ["below_reorder_point", "upcoming_demand"],
    2.1,
    "Weekend patio traffic and private events both lift brick oven demand.",
    "Weekend prep should lock in dough before Friday service.",
    items,
  ),
  makeRecommendation(
    "rec-burrata",
    "SON-DAIRY-BURRATA",
    12,
    "Medium",
    ["low_days_remaining"],
    2.6,
    "Seasonal appetizer demand is steady and short shelf life reduces cushion.",
    "Bundle with dairy replenishment if the order already meets minimums.",
    items,
  ),
  makeRecommendation(
    "rec-orange-juice",
    "SON-BAR-ORANGE-JUICE",
    6,
    "Medium",
    ["usage_spike"],
    2.4,
    "Brunch cocktail demand is increasing ahead of the weekend.",
    "Add with the next beverage restock to avoid a Sunday squeeze.",
    items,
  ),
  makeRecommendation(
    "rec-linen-napkins",
    "SON-SUPPLY-LINEN-NAPKIN",
    180,
    "Medium",
    ["below_reorder_point"],
    3.5,
    "Event prep and Saturday dinner turns are depleting linen inventory.",
    "Stage service supplies separately so ops can review event readiness.",
    items,
  ),
  makeRecommendation(
    "rec-bar-shaker",
    "SON-TOOL-BAR-SHAKER",
    2,
    "Low",
    ["upcoming_demand"],
    6.5,
    "One shaker is in cleaning rotation ahead of a bar-heavy weekend.",
    "Keep as a future equipment note, not a same-day purchasing priority.",
    items,
  ),
  ]
}

export const mockReorderRecommendations: ReorderRecommendation[] = getMockReorderRecommendations()

export function getReorderReasonLabel(reason: ReorderReason) {
  switch (reason) {
    case "below_reorder_point":
      return "Below reorder point"
    case "usage_spike":
      return "Usage spike"
    case "low_days_remaining":
      return "Low days remaining"
    case "upcoming_demand":
      return "Upcoming demand"
  }
}

export function getReorderCategoryLabel(category: InventoryItem["category"]) {
  return getInventoryCategoryLabel(category)
}

export function getReorderSummary(recommendations: ReorderRecommendation[]): ReorderSummary {
  return {
    totalRecommendations: recommendations.length,
    criticalItems: recommendations.filter((recommendation) => recommendation.urgency === "Critical").length,
    highPriorityItems: recommendations.filter((recommendation) => recommendation.urgency === "High").length,
    supplierCount: new Set(recommendations.map((recommendation) => recommendation.supplier.id)).size,
    estimatedTotal: recommendations.reduce((total, recommendation) => total + recommendation.estimatedCost, 0),
  }
}

export function getDraftOrderTotal(
  recommendations: ReorderRecommendation[],
  selectedIds: Set<string>,
  quantities: Record<string, number>,
) {
  return recommendations.reduce((total, recommendation) => {
    if (!selectedIds.has(recommendation.id)) {
      return total
    }

    const quantity = quantities[recommendation.id] ?? recommendation.recommendedQuantity
    return total + quantity * recommendation.item.unitCost
  }, 0)
}
