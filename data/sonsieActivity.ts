export interface SonsieAlert {
  id: string
  type: "critical" | "warning" | "info"
  message: string
  item?: string
  timestamp: string
  timeRemaining?: string
}

export const sonsieAlerts: SonsieAlert[] = [
  {
    id: "alert-1",
    type: "critical",
    message: "Oysters marked critical before Friday dinner service",
    item: "Island Creek Oysters",
    timestamp: "2026-04-25T10:15:00",
    timeRemaining: "Tonight",
  },
  {
    id: "alert-2",
    type: "warning",
    message: "Brick oven dough par increased for weekend prep",
    item: "Brick Oven Pizza Dough",
    timestamp: "2026-04-25T09:20:00",
    timeRemaining: "Weekend prep",
  },
  {
    id: "alert-3",
    type: "warning",
    message: "Aperol and Prosecco flagged for brunch cocktail demand",
    item: "Bar Restock",
    timestamp: "2026-04-25T08:10:00",
    timeRemaining: "Sunday brunch",
  },
  {
    id: "alert-4",
    type: "info",
    message: "Wine glass count updated after private event",
    item: "Private Event Prep",
    timestamp: "2026-04-24T23:45:00",
    timeRemaining: "Next event review",
  },
]
