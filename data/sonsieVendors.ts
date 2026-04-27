export interface SonsieVendor {
  id: string
  name: string
  category: string
  leadTimeDays: number
  minimumOrder: number
  deliveryDays: string
  contactPlaceholder: string
  lastOrderDate: string
  nextSuggestedOrder: string
}

export const sonsieVendors: SonsieVendor[] = [
  {
    id: "vendor-boston-seafood",
    name: "Boston Seafood Co.",
    category: "Seafood",
    leadTimeDays: 1,
    minimumOrder: 300,
    deliveryDays: "Daily",
    contactPlaceholder: "Seafood desk",
    lastOrderDate: "2026-04-24",
    nextSuggestedOrder: "2026-04-26",
  },
  {
    id: "vendor-back-bay-produce",
    name: "Back Bay Produce",
    category: "Produce",
    leadTimeDays: 1,
    minimumOrder: 180,
    deliveryDays: "Mon-Sat",
    contactPlaceholder: "Produce buyer",
    lastOrderDate: "2026-04-24",
    nextSuggestedOrder: "2026-04-26",
  },
  {
    id: "vendor-new-england-dairy",
    name: "New England Dairy & Cheese",
    category: "Dairy",
    leadTimeDays: 2,
    minimumOrder: 220,
    deliveryDays: "Tue, Thu, Sat",
    contactPlaceholder: "Cheese desk",
    lastOrderDate: "2026-04-23",
    nextSuggestedOrder: "2026-04-27",
  },
  {
    id: "vendor-premium-meats",
    name: "Premium Meats Northeast",
    category: "Meat",
    leadTimeDays: 2,
    minimumOrder: 400,
    deliveryDays: "Mon, Wed, Fri",
    contactPlaceholder: "Protein buyer",
    lastOrderDate: "2026-04-23",
    nextSuggestedOrder: "2026-04-27",
  },
  {
    id: "vendor-artisan-bread",
    name: "Artisan Bread & Dough",
    category: "Bakery",
    leadTimeDays: 1,
    minimumOrder: 140,
    deliveryDays: "Daily",
    contactPlaceholder: "Bakery route",
    lastOrderDate: "2026-04-24",
    nextSuggestedOrder: "2026-04-26",
  },
  {
    id: "vendor-beverage-wine",
    name: "Beverage & Wine Distributor",
    category: "Bar & Wine",
    leadTimeDays: 4,
    minimumOrder: 500,
    deliveryDays: "Tue, Thu",
    contactPlaceholder: "Beverage account",
    lastOrderDate: "2026-04-22",
    nextSuggestedOrder: "2026-04-29",
  },
  {
    id: "vendor-cafe-supply",
    name: "Cafe Supply Co.",
    category: "Coffee & Cafe",
    leadTimeDays: 3,
    minimumOrder: 120,
    deliveryDays: "Tue, Fri",
    contactPlaceholder: "Cafe support",
    lastOrderDate: "2026-04-21",
    nextSuggestedOrder: "2026-04-28",
  },
  {
    id: "vendor-paper-supply",
    name: "Restaurant Paper Supply",
    category: "Supplies",
    leadTimeDays: 5,
    minimumOrder: 180,
    deliveryDays: "Wed",
    contactPlaceholder: "Ops supply desk",
    lastOrderDate: "2026-04-20",
    nextSuggestedOrder: "2026-04-30",
  },
]
