"use client"

import { createContext, useContext, useMemo, useState } from "react"

import type { OrderActivityEntry, OrderActivityType } from "@/data/order-activity"

interface AddActivityEventInput {
  actionType: OrderActivityType
  items: string[]
  supplier: string
  notes?: string
  orderId?: string
}

interface ActivityContextValue {
  sessionEntries: OrderActivityEntry[]
  addActivityEvent: (event: AddActivityEventInput) => void
  clearSessionActivity: () => void
}

const ActivityContext = createContext<ActivityContextValue | undefined>(undefined)
const SESSION_ORDER_ID = "SESSION-SONSIE-DRAFT"

export function ActivityProvider({ children }: { children: React.ReactNode }) {
  const [sessionEntries, setSessionEntries] = useState<OrderActivityEntry[]>([])

  const value = useMemo<ActivityContextValue>(
    () => ({
      sessionEntries,
      addActivityEvent: (event) => {
        setSessionEntries((current) => [
          {
            id: `session-${Date.now()}-${current.length + 1}`,
            timestamp: new Date().toISOString(),
            actionType: event.actionType,
            items: event.items,
            supplier: event.supplier,
            user: "SonsieAdmin",
            notes: event.notes ?? "Session-only Sonsie manager activity.",
            orderId: event.orderId ?? SESSION_ORDER_ID,
          },
          ...current,
        ])
      },
      clearSessionActivity: () => setSessionEntries([]),
    }),
    [sessionEntries],
  )

  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>
}

export function useActivity() {
  const context = useContext(ActivityContext)

  if (!context) {
    throw new Error("useActivity must be used within ActivityProvider")
  }

  return context
}
