"use client"

import { createContext, useContext, useMemo, useState } from "react"

import {
  mockIngredients,
  mockInventorySupplies,
  mockTools,
  type InventoryItem,
  type ToolInventoryItem,
} from "@/data/inventory"
import { normalizeInventoryItemStatus } from "@/lib/operations"

import type { InventoryTableItem } from "./inventory-category-table"

interface InventoryContextValue {
  inventory: InventoryTableItem[]
  ingredients: InventoryItem[]
  supplies: InventoryItem[]
  tools: ToolInventoryItem[]
  updateInventoryItem: (item: InventoryTableItem) => void
  addInventoryItem: (item: InventoryTableItem) => void
}

const InventoryContext = createContext<InventoryContextValue | undefined>(undefined)

const initialInventory: InventoryTableItem[] = [
  ...mockIngredients,
  ...mockInventorySupplies,
  ...mockTools,
].map((item) => normalizeInventoryItemStatus(item))

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [inventory, setInventory] = useState<InventoryTableItem[]>(initialInventory)

  const value = useMemo<InventoryContextValue>(() => {
    const ingredients = inventory.filter((item): item is InventoryItem => item.category === "ingredient")
    const supplies = inventory.filter((item): item is InventoryItem => item.category === "supply")
    const tools = inventory.filter((item): item is ToolInventoryItem => item.category === "tool" && "condition" in item)

    return {
      inventory,
      ingredients,
      supplies,
      tools,
      updateInventoryItem: (updatedItem) => {
        const normalizedItem = normalizeInventoryItemStatus(updatedItem)

        setInventory((current) =>
          current.map((item) => (item.id === normalizedItem.id ? normalizedItem : item)),
        )
      },
      addInventoryItem: (newItem) => {
        setInventory((current) => [...current, normalizeInventoryItemStatus(newItem)])
      },
    }
  }, [inventory])

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>
}

export function useInventory() {
  const context = useContext(InventoryContext)

  if (!context) {
    throw new Error("useInventory must be used within InventoryProvider")
  }

  return context
}
