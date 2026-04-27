"use client"

import { useMemo } from "react"
import dynamic from "next/dynamic"

import { Header } from "@/components/dashboard/header"
import { KPICard } from "@/components/dashboard/kpi-card"
import { usageChartData } from "@/data/forecasting"
import { useInventory } from "@/components/inventory"
import { useOrders } from "@/components/orders"
import { getInventoryOperationsSummary, getOrderBucket } from "@/lib/operations"

const UsageChart = dynamic(
  () => import("@/components/dashboard/usage-chart").then((mod) => mod.UsageChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-[298px] rounded-xl border border-dashboard-border-strong/70 bg-dashboard-surface-raised" />
    ),
  },
)

const ActivityFeed = dynamic(
  () => import("@/components/dashboard/activity-feed").then((mod) => mod.ActivityFeed),
  {
    ssr: false,
    loading: () => (
      <div className="h-[298px] rounded-xl border border-dashboard-border-strong/70 bg-dashboard-surface-raised" />
    ),
  },
)

const SuppliesTable = dynamic(
  () => import("@/components/dashboard/supplies-table").then((mod) => mod.SuppliesTable),
  {
    ssr: false,
    loading: () => (
      <div className="h-[420px] rounded-xl border border-dashboard-border-strong/70 bg-dashboard-surface-raised" />
    ),
  },
)

export default function DashboardPage() {
  const { inventory } = useInventory()
  const { orders } = useOrders()

  const inventorySummary = useMemo(() => getInventoryOperationsSummary(inventory), [inventory])
  const pendingOrders = useMemo(
    () => orders.filter((order) => getOrderBucket(order) !== "Received").length,
    [orders],
  )
  const todaysUsage = useMemo(() => {
    const latest = usageChartData.at(-1)

    if (!latest) {
      return 0
    }

    return latest.produce + latest.seafood + latest.bar
  }, [])
  const privateEventPrep = useMemo(
    () => inventory.filter((item) => item.serviceUse?.includes("Private Events") && item.quantity < item.parLevel).length,
    [inventory],
  )
  const highRiskPerishables = useMemo(
    () => inventory.filter((item) => item.perishability === "High" && item.quantity <= item.parLevel).length,
    [inventory],
  )

  return (
    <div className="flex flex-col">
      <Header 
        title="Overview" 
        subtitle="Daily Sonsie readiness across service, bar, and private event prep"
      />
      <div className="flex-1 space-y-4 p-4 xl:space-y-5 xl:p-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <KPICard
            demoTarget="kpi-critical"
            title="Needs Attention"
            value={inventorySummary.criticalLowStockItems}
            iconType="alert"
            variant="critical"
            href="/dashboard/reorder"
          />
          <KPICard
            title="Below Par"
            value={inventorySummary.itemsBelowPar}
            iconType="package"
            variant="warning"
            href="/dashboard/inventory"
          />
          <KPICard
            title="Vendor Orders"
            value={pendingOrders}
            iconType="cart"
            variant="ember"
            href="/dashboard/orders"
          />
          <KPICard
            title="Projected Service Demand"
            value={`${todaysUsage} pts`}
            iconType="trend"
            variant="gold"
            href="/dashboard/forecast"
          />
          <KPICard
            title="High-Risk Perishables"
            value={highRiskPerishables}
            iconType="alert"
            variant="warning"
            href="/dashboard/forecast"
          />
          <KPICard
            title="Private Event Prep"
            value={privateEventPrep}
            iconType="package"
            variant="primary"
            href="/dashboard/activity"
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            <UsageChart />
          </div>
          <div>
            <ActivityFeed />
          </div>
        </div>

        <div>
          <SuppliesTable />
        </div>
      </div>
    </div>
  )
}
