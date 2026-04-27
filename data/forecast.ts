import {
  getInventoryCategoryLabel,
  mockInventory,
  type InventoryItem,
} from "@/data/inventory"

export type ForecastRiskLevel = "Critical" | "Low" | "Stable"

export interface ForecastItem {
  id: string
  item: string
  category: InventoryItem["category"]
  categoryLabel: string
  currentStock: number
  unit: string
  averageDailyUsage: number
  daysRemaining: number
  reorderDate: string
  riskLevel: ForecastRiskLevel
  supplier: string
}

export interface ForecastSummary {
  itemsAtRiskNextSevenDays: number
  averageDaysRemaining: number
  projectedReorderCount: number
  highRiskItems: number
}

export interface ForecastChartPoint {
  day: string
  projectedStock: number
  usage: number
  criticalLine: number
}

export interface UsageTrendPoint {
  day: string
  brunch: number
  dinner: number
  bar: number
}

const MOCK_TODAY = new Date("2026-04-25T12:00:00")

const averageUsageByItemId: Record<string, number> = {
  "SON-SEAFOOD-OYSTER-IC": 2,
  "SON-SEAFOOD-SHRIMP": 2,
  "SON-PROD-BASIL": 1,
  "SON-PROD-LEMON": 1,
  "SON-DAIRY-BURRATA": 2,
  "SON-BAKERY-PIZZA-DOUGH": 4,
  "SON-SUPPLY-LINEN-NAPKIN": 60,
  "SON-BAR-ORANGE-JUICE": 2,
  "SON-TOOL-BAR-SHAKER": 1,
}

export function getForecastItems(items: InventoryItem[] = mockInventory): ForecastItem[] {
  return items
    .filter((item) => item.category !== "tool" || item.quantity < item.parLevel)
    .map((item) => {
      const averageDailyUsage = averageUsageByItemId[item.id] ?? Math.max(1, Math.round(item.parLevel / 14))
      const daysRemaining = Number((item.quantity / averageDailyUsage).toFixed(1))
      const reorderDate = getReorderDate(daysRemaining)

      return {
        id: item.id,
        item: item.name,
        category: item.category,
        categoryLabel: getInventoryCategoryLabel(item.category),
        currentStock: item.quantity,
        unit: item.unit,
        averageDailyUsage,
        daysRemaining,
        reorderDate,
        riskLevel: getForecastRiskLevel(daysRemaining),
        supplier: item.supplier,
      }
    })
    .sort((a, b) => a.daysRemaining - b.daysRemaining)
}

export function getForecastSummary(forecastItems: ForecastItem[]): ForecastSummary {
  const averageDaysRemaining =
    forecastItems.reduce((total, item) => total + item.daysRemaining, 0) / Math.max(1, forecastItems.length)

  return {
    itemsAtRiskNextSevenDays: forecastItems.filter((item) => item.daysRemaining <= 7).length,
    averageDaysRemaining: Number(averageDaysRemaining.toFixed(1)),
    projectedReorderCount: forecastItems.filter((item) => item.daysRemaining <= 5).length,
    highRiskItems: forecastItems.filter((item) => item.riskLevel === "Critical").length,
  }
}

export function getInventoryDepletionChart(forecastItems: ForecastItem[]): ForecastChartPoint[] {
  const watchedItems = forecastItems.slice(0, 5)

  return Array.from({ length: 8 }).map((_, index) => ({
    day: index === 0 ? "Today" : `+${index}d`,
    projectedStock: Math.max(
      0,
      Math.round(
        watchedItems.reduce(
          (total, item) => total + Math.max(0, item.currentStock - item.averageDailyUsage * index),
          0,
        ),
      ),
    ),
    usage: Math.round(watchedItems.reduce((total, item) => total + item.averageDailyUsage, 0)),
    criticalLine: Math.round(watchedItems.reduce((total, item) => total + item.averageDailyUsage * 2, 0)),
  }))
}

export const usageTrendData: UsageTrendPoint[] = [
  { day: "Mon", brunch: 38, dinner: 94, bar: 30 },
  { day: "Tue", brunch: 34, dinner: 88, bar: 28 },
  { day: "Wed", brunch: 36, dinner: 96, bar: 34 },
  { day: "Thu", brunch: 40, dinner: 104, bar: 38 },
  { day: "Fri", brunch: 44, dinner: 126, bar: 56 },
  { day: "Sat", brunch: 82, dinner: 138, bar: 64 },
  { day: "Sun", brunch: 88, dinner: 112, bar: 46 },
]

function getForecastRiskLevel(daysRemaining: number): ForecastRiskLevel {
  if (daysRemaining <= 2) {
    return "Critical"
  }

  if (daysRemaining <= 7) {
    return "Low"
  }

  return "Stable"
}

function getReorderDate(daysRemaining: number) {
  const reorderDate = new Date(MOCK_TODAY)
  const daysUntilReorder = Math.max(0, Math.floor(daysRemaining - 2))
  reorderDate.setDate(MOCK_TODAY.getDate() + daysUntilReorder)

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(reorderDate)
}
