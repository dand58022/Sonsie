import * as inventoryData from "./sonsieInventory"

export {
  getStatusColor,
  getSupplyStatusColor,
  getUrgencyColor,
  getInventoryCategoryLabel,
  getInventorySubcategoryLabel,
  kitchenReadiness,
  kpiData,
  mockAuditLogs,
  mockInventory,
  mockSupplies,
  reorderRecommendations,
  type InventoryItem,
  type SupplyItem,
} from "./mock-data"

export type InventoryToolCondition = "Ready" | "Needs Cleaning" | "Needs Repair" | "Retired"

export interface ToolInventoryItem extends inventoryData.InventoryItem {
  category: "tool"
  condition: InventoryToolCondition
  assignedArea: string
  serviceDue?: string
}

export interface InventoryStockHistoryEntry {
  id: string
  itemId: string
  timestamp: string
  action: "Count" | "Usage" | "Delivery" | "Adjustment"
  change: number
  resultingQuantity: number
  unit: string
  user: string
  note: string
}

export interface InventoryDetailMetadata {
  itemId: string
  storageLocation: string
  countCadence: string
  lastCountedBy: string
  mappingStatus: "Mapped" | "Partially mapped" | "Not mapped" | "Not applicable"
  mappedMenuItems: string[]
  notes: string
}

const toolDetailById: Record<string, Pick<ToolInventoryItem, "condition" | "assignedArea" | "serviceDue">> = {
  "SON-TOOL-BRICK-OVEN-PEEL": { condition: "Ready", assignedArea: "Brick Oven", serviceDue: "2026-05-06" },
  "SON-TOOL-OYSTER-KNIFE": { condition: "Ready", assignedArea: "Pantry", serviceDue: "2026-05-03" },
  "SON-TOOL-BAR-SHAKER": { condition: "Needs Cleaning", assignedArea: "Bar", serviceDue: "2026-04-27" },
  "SON-TOOL-LABEL-PRINTER": { condition: "Ready", assignedArea: "Prep", serviceDue: "2026-05-10" },
}

export const mockIngredients = inventoryData.mockInventory.filter(
  (item) => item.category === "ingredient",
)

export const mockInventorySupplies = inventoryData.mockInventory.filter(
  (item) => item.category === "supply",
)

export const mockTools: ToolInventoryItem[] = inventoryData.mockInventory
  .filter((item): item is inventoryData.InventoryItem & { category: "tool" } => item.category === "tool")
  .map((item) => ({
    ...item,
    condition: toolDetailById[item.id]?.condition ?? "Ready",
    assignedArea: toolDetailById[item.id]?.assignedArea ?? "Kitchen",
    serviceDue: toolDetailById[item.id]?.serviceDue,
  }))

export const mockInventoryStockHistory: InventoryStockHistoryEntry[] = [
  { id: "h1", itemId: "SON-SEAFOOD-OYSTER-IC", timestamp: "2026-04-25T09:30:00", action: "Count", change: -2, resultingQuantity: 8, unit: "dozen", user: "Floor Manager", note: "Dinner service count lowered raw bar cushion." },
  { id: "h2", itemId: "SON-SEAFOOD-OYSTER-IC", timestamp: "2026-04-24T22:15:00", action: "Usage", change: -3, resultingQuantity: 10, unit: "dozen", user: "System", note: "Private event oyster station closed above expected demand." },
  { id: "h3", itemId: "SON-BAKERY-PIZZA-DOUGH", timestamp: "2026-04-25T06:30:00", action: "Adjustment", change: 4, resultingQuantity: 26, unit: "tray", user: "SonsieAdmin", note: "Weekend brick oven prep par increased." },
  { id: "h4", itemId: "SON-BAR-ORANGE-JUICE", timestamp: "2026-04-25T07:20:00", action: "Count", change: -2, resultingQuantity: 6, unit: "gallon", user: "Floor Manager", note: "Brunch cocktail station restaged after Friday close." },
  { id: "h5", itemId: "SON-SUPPLY-LINEN-NAPKIN", timestamp: "2026-04-25T07:30:00", action: "Adjustment", change: -80, resultingQuantity: 340, unit: "each", user: "Event Captain", note: "Private event recovery count completed." },
  { id: "h6", itemId: "SON-SUPPLY-WINE-GLASS", timestamp: "2026-04-24T23:20:00", action: "Count", change: -12, resultingQuantity: 96, unit: "each", user: "Event Captain", note: "Wine glass reset after upstairs event." },
  { id: "h7", itemId: "SON-TOOL-BAR-SHAKER", timestamp: "2026-04-24T20:30:00", action: "Adjustment", change: -1, resultingQuantity: 7, unit: "each", user: "Floor Manager", note: "One shaker moved to cleaning rotation." },
  { id: "h8", itemId: "SON-TOOL-OYSTER-KNIFE", timestamp: "2026-04-24T19:10:00", action: "Count", change: 0, resultingQuantity: 6, unit: "each", user: "Floor Manager", note: "Raw bar tools checked before weekend." },
]

export const mockInventoryDetailMetadata: InventoryDetailMetadata[] = [
  { itemId: "SON-SEAFOOD-OYSTER-IC", storageLocation: "Walk-In Cooler", countCadence: "Before lunch and before dinner", lastCountedBy: "Floor Manager", mappingStatus: "Mapped", mappedMenuItems: ["Island Creek Oysters"], notes: "Weekend raw bar demand makes this a high-risk item even when counts look healthy." },
  { itemId: "SON-BAKERY-PIZZA-DOUGH", storageLocation: "Brick Oven Station", countCadence: "Every opening shift", lastCountedBy: "SonsieAdmin", mappingStatus: "Mapped", mappedMenuItems: ["Margherita Pizza", "Mortadella Pizza"], notes: "Review weekend and private event demand before locking dough production." },
  { itemId: "SON-SUPPLY-LINEN-NAPKIN", storageLocation: "Dish / Service Storage", countCadence: "Daily close", lastCountedBy: "Event Captain", mappingStatus: "Not applicable", mappedMenuItems: [], notes: "Private event counts can swing this item faster than dining room service alone." },
  { itemId: "SON-SUPPLY-WINE-GLASS", storageLocation: "Dish / Service Storage", countCadence: "After events", lastCountedBy: "Event Captain", mappingStatus: "Not applicable", mappedMenuItems: [], notes: "Track breakage after upstairs events and bar-heavy Saturdays." },
  { itemId: "SON-TOOL-BAR-SHAKER", storageLocation: "Bar Storage", countCadence: "Daily close", lastCountedBy: "Floor Manager", mappingStatus: "Not applicable", mappedMenuItems: [], notes: "Keep one shaker in cleaning rotation during weekend service." },
  { itemId: "SON-TOOL-BRICK-OVEN-PEEL", storageLocation: "Brick Oven Station", countCadence: "Weekly", lastCountedBy: "SonsieAdmin", mappingStatus: "Not applicable", mappedMenuItems: [], notes: "Check handle wear before high-volume patio weekends." },
]

export function getInventoryStockHistory(itemId: string) {
  return mockInventoryStockHistory.filter((entry) => entry.itemId === itemId)
}

export function getInventoryDetailMetadata(itemId: string): InventoryDetailMetadata {
  return (
    mockInventoryDetailMetadata.find((metadata) => metadata.itemId === itemId) ?? {
      itemId,
      storageLocation: "Storage location not set",
      countCadence: "Count cadence not set",
      lastCountedBy: "Not counted yet",
      mappingStatus: "Not applicable",
      mappedMenuItems: [],
      notes: "No operating notes have been added for this item.",
    }
  )
}

export const itemUsageHistoryData = [
  { date: "04/13", usage: 8 },
  { date: "04/14", usage: 10 },
  { date: "04/15", usage: 9 },
  { date: "04/16", usage: 11 },
  { date: "04/17", usage: 12 },
  { date: "04/18", usage: 14 },
  { date: "04/19", usage: 15 },
  { date: "04/20", usage: 13 },
  { date: "04/21", usage: 12 },
  { date: "04/22", usage: 14 },
  { date: "04/23", usage: 16 },
  { date: "04/24", usage: 18 },
  { date: "04/25", usage: 17 },
]

export const relatedMenuItemUsage = [
  { name: "Island Creek Oysters", usage: "0.5 dozen" },
  { name: "Sonsie Caesar", usage: "0.3 case" },
  { name: "Margherita Pizza", usage: "0.4 tray" },
  { name: "Private Event Raw Bar", usage: "1.2 dozen" },
]
