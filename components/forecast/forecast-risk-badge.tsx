"use client"

import { StatusBadge } from "@/components/feedback"
import type { ForecastRiskLevel } from "@/data/forecast"

export function ForecastRiskBadge({ risk }: { risk: ForecastRiskLevel }) {
  if (risk === "Critical") {
    return <StatusBadge tone="critical">Critical</StatusBadge>
  }

  if (risk === "Low") {
    return <StatusBadge tone="warning">Low</StatusBadge>
  }

  return <StatusBadge tone="good">Stable</StatusBadge>
}
