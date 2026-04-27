export const sonsieServicePeriods = [
  "Brunch",
  "Lunch",
  "Light Fare",
  "Dinner",
  "Bar",
  "Private Events",
] as const

export const sonsieForecastCards = [
  { label: "Brunch Forecast", projectedDemand: 142, note: "Sparkling brunch service and cafe traffic" },
  { label: "Lunch Forecast", projectedDemand: 118, note: "Caesar, burger, and pizza lift" },
  { label: "Dinner Forecast", projectedDemand: 176, note: "Raw bar, entrees, and brick oven peak" },
  { label: "Bar Forecast", projectedDemand: 94, note: "Cocktail citrus, Aperol, and glass pours" },
  { label: "Private Event Forecast", projectedDemand: 54, note: "Upstairs room prep and glassware staging" },
]

export const weeklyServiceMix = [
  { day: "Mon", brunch: 24, lunch: 68, dinner: 102, bar: 42, projected: 236 },
  { day: "Tue", brunch: 22, lunch: 64, dinner: 96, bar: 38, projected: 220 },
  { day: "Wed", brunch: 26, lunch: 70, dinner: 108, bar: 44, projected: 248 },
  { day: "Thu", brunch: 28, lunch: 74, dinner: 118, bar: 52, projected: 272 },
  { day: "Fri", brunch: 32, lunch: 82, dinner: 142, bar: 68, projected: 324 },
  { day: "Sat", brunch: 88, lunch: 76, dinner: 154, bar: 74, projected: 392 },
  { day: "Sun", brunch: 92, lunch: 72, dinner: 128, bar: 48, projected: 340 },
]

export const monthlyServiceTrends = [
  { month: "Jan", actual: 5100, projected: 5000, variance: 2 },
  { month: "Feb", actual: 4860, projected: 4900, variance: -0.8 },
  { month: "Mar", actual: 5480, projected: 5350, variance: 2.4 },
  { month: "Apr", actual: null, projected: 5750, variance: null },
  { month: "May", actual: null, projected: 6080, variance: null },
  { month: "Jun", actual: null, projected: 6420, variance: null },
]

export interface SonsieProjectedNeed {
  item: string
  currentStock: number
  weeklyNeed: number
  monthlyNeed: number
  unit: string
  status: "critical" | "low" | "adequate"
}

export const sonsieProjectedNeeds: SonsieProjectedNeed[] = [
  { item: "Island Creek Oysters", currentStock: 8, weeklyNeed: 18, monthlyNeed: 72, unit: "dozen", status: "critical" },
  { item: "Brick Oven Pizza Dough", currentStock: 26, weeklyNeed: 54, monthlyNeed: 216, unit: "tray", status: "critical" },
  { item: "Burrata", currentStock: 14, weeklyNeed: 22, monthlyNeed: 88, unit: "each", status: "low" },
  { item: "Aperol", currentStock: 9, weeklyNeed: 8, monthlyNeed: 32, unit: "bottle", status: "adequate" },
  { item: "Prosecco", currentStock: 22, weeklyNeed: 18, monthlyNeed: 72, unit: "bottle", status: "adequate" },
  { item: "Linen Napkins", currentStock: 340, weeklyNeed: 420, monthlyNeed: 1680, unit: "each", status: "critical" },
]
