export type OrderActivityType =
  | "draft_created"
  | "item_added"
  | "item_removed"
  | "quantity_updated"
  | "draft_cleared"
  | "order_reviewed"
  | "order_ready"

export interface OrderActivityEntry {
  id: string
  timestamp: string
  actionType: OrderActivityType
  items: string[]
  supplier: string
  user: string
  notes: string
  orderId: string
}

export const orderActivityTypes: OrderActivityType[] = [
  "draft_created",
  "item_added",
  "item_removed",
  "quantity_updated",
  "draft_cleared",
  "order_reviewed",
  "order_ready",
]

export const mockOrderActivityEntries: OrderActivityEntry[] = [
  {
    id: "act-001",
    timestamp: "2026-04-25T08:15:00",
    actionType: "draft_created",
    items: ["Island Creek Oysters", "Fresh Basil"],
    supplier: "Boston Seafood Co.",
    user: "SonsieAdmin",
    notes: "Perishable priority draft started before dinner and bar service.",
    orderId: "DRAFT-2026-0425-01",
  },
  {
    id: "act-002",
    timestamp: "2026-04-25T08:18:00",
    actionType: "item_added",
    items: ["Lemon", "Orange Juice"],
    supplier: "Back Bay Produce",
    user: "SonsieAdmin",
    notes: "Added citrus support for brunch cocktails and raw bar setup.",
    orderId: "DRAFT-2026-0425-01",
  },
  {
    id: "act-003",
    timestamp: "2026-04-25T08:22:00",
    actionType: "quantity_updated",
    items: ["Brick Oven Pizza Dough"],
    supplier: "Artisan Bread & Dough",
    user: "SonsieAdmin",
    notes: "Raised dough quantity for weekend prep and private events.",
    orderId: "DRAFT-2026-0425-01",
  },
  {
    id: "act-004",
    timestamp: "2026-04-25T08:27:00",
    actionType: "item_removed",
    items: ["Coffee Cups"],
    supplier: "Cafe Supply Co.",
    user: "SonsieAdmin",
    notes: "Removed after cafe station verified on-hand stock.",
    orderId: "DRAFT-2026-0425-01",
  },
  {
    id: "act-005",
    timestamp: "2026-04-25T08:29:00",
    actionType: "draft_cleared",
    items: ["Wine Glasses"],
    supplier: "Restaurant Paper Supply",
    user: "SonsieAdmin",
    notes: "Removed a stale serviceware draft after event reconciliation.",
    orderId: "DRAFT-2026-0424-00",
  },
  {
    id: "act-006",
    timestamp: "2026-04-25T08:31:00",
    actionType: "order_reviewed",
    items: ["Island Creek Oysters", "Fresh Basil", "Lemon", "Brick Oven Pizza Dough"],
    supplier: "Multiple suppliers",
    user: "SonsieAdmin",
    notes: "Prepared order review opened for perishable priority and weekend prep. No supplier submission occurred.",
    orderId: "DRAFT-2026-0425-01",
  },
  {
    id: "act-007",
    timestamp: "2026-04-25T08:34:00",
    actionType: "order_ready",
    items: ["Island Creek Oysters", "Fresh Basil", "Lemon", "Brick Oven Pizza Dough"],
    supplier: "Multiple suppliers",
    user: "SonsieAdmin",
    notes: "Order packet marked ready for internal review only.",
    orderId: "DRAFT-2026-0425-01",
  },
  {
    id: "act-008",
    timestamp: "2026-04-24T16:05:00",
    actionType: "draft_created",
    items: ["Linen Napkins", "Wine Glasses"],
    supplier: "Restaurant Paper Supply",
    user: "SonsieAdmin",
    notes: "Serviceware draft created after private event breakdown.",
    orderId: "DRAFT-2026-0424-02",
  },
  {
    id: "act-009",
    timestamp: "2026-04-24T16:12:00",
    actionType: "quantity_updated",
    items: ["Linen Napkins"],
    supplier: "Restaurant Paper Supply",
    user: "SonsieAdmin",
    notes: "Raised quantity to cover weekend and event prep.",
    orderId: "DRAFT-2026-0424-02",
  },
]

export function getOrderActivitySuppliers(entries: OrderActivityEntry[]) {
  return Array.from(new Set(entries.map((entry) => entry.supplier))).sort()
}

export function getOrderActivitySummary(entries: OrderActivityEntry[]) {
  return {
    total: entries.length,
    reviewed: entries.filter((entry) => entry.actionType === "order_reviewed").length,
    ready: entries.filter((entry) => entry.actionType === "order_ready").length,
    updated: entries.filter((entry) => entry.actionType === "quantity_updated").length,
  }
}
