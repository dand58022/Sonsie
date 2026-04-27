"use client"

import { createContext, useContext, useMemo, useState } from "react"

import { mockOrders, type Order } from "@/data/orders"

interface OrderContextValue {
  orders: Order[]
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>
  addOrder: (order: Order) => void
  updateOrder: (orderId: string, updater: (order: Order) => Order) => void
}

const OrderContext = createContext<OrderContextValue | undefined>(undefined)

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(mockOrders)

  const value = useMemo<OrderContextValue>(
    () => ({
      orders,
      setOrders,
      addOrder: (order) => setOrders((current) => [order, ...current]),
      updateOrder: (orderId, updater) =>
        setOrders((current) => current.map((order) => (order.id === orderId ? updater(order) : order))),
    }),
    [orders],
  )

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}

export function useOrders() {
  const context = useContext(OrderContext)

  if (!context) {
    throw new Error("useOrders must be used within OrderProvider")
  }

  return context
}
