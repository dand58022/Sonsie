export {
  forecastData,
  mockLocations,
  usageChartData,
  type Location,
} from "./sonsieInventory"

import {
  monthlyServiceTrends,
  sonsieProjectedNeeds,
  weeklyServiceMix,
} from "./sonsieForecast"

export const weeklyForecastData = weeklyServiceMix

export const monthlyTrendsData = monthlyServiceTrends

export interface ProjectedNeed {
  item: string
  currentStock: number
  weeklyNeed: number
  monthlyNeed: number
  unit: string
  status: 'critical' | 'low' | 'adequate'
}

export const projectedNeeds: ProjectedNeed[] = sonsieProjectedNeeds
