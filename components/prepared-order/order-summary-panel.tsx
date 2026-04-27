"use client"

import { AlertTriangle, ClipboardList, DollarSign, Truck } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DraftOrderSummaryModel, DraftSupplierGroup } from "@/data/draft-order"

interface OrderSummaryPanelProps {
  summary: DraftOrderSummaryModel
  groups: DraftSupplierGroup[]
  flaggedCount: number
}

export function OrderSummaryPanel({ summary, groups, flaggedCount }: OrderSummaryPanelProps) {
  const warnings = getReviewWarnings(groups, flaggedCount, summary.warnings)

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Order Review Summary</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <SummaryMetric icon={Truck} label="Suppliers" value={summary.supplierCount.toLocaleString()} />
          <SummaryMetric icon={ClipboardList} label="Total items" value={summary.totalItems.toLocaleString()} />
          <SummaryMetric icon={DollarSign} label="Estimated cost" value={`$${summary.totalCost.toFixed(2)}`} />
        </div>

        <div className="rounded-lg border border-border bg-secondary/30 p-4">
          <p className="text-sm font-medium text-foreground">Supplier breakdown</p>
          <div className="mt-3 grid gap-2">
            {groups.length > 0 ? (
              groups.map((group) => (
                <div key={group.supplier.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">{group.supplier.name}</span>
                  <span className="font-medium text-foreground">${group.totalCost.toFixed(2)}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No supplier packets are staged.</p>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-warning/20 bg-warning/5 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-warning">
            <AlertTriangle className="h-4 w-4" />
            Review warnings
          </div>
          <div className="mt-2 grid gap-1 text-sm text-muted-foreground">
            {warnings.length > 0 ? (
              warnings.map((warning) => <p key={warning}>{warning}</p>)
            ) : (
              <p>No review warnings found. Review supplier packets before marking ready.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function getReviewWarnings(
  groups: DraftSupplierGroup[],
  flaggedCount: number,
  baseWarnings: string[],
) {
  const warnings = new Set(baseWarnings)

  groups.forEach((group) => {
    if (group.warning) {
      warnings.add(`${group.supplier.name}: ${group.warning}`)
    }

    if (group.totalCost > 1000) {
      warnings.add(`${group.supplier.name}: high order cost`)
    }

    group.items.forEach((item) => {
      if (item.warning) {
        warnings.add(`${item.itemName}: ${item.warning.toLowerCase()}`)
      }

      if (item.quantity >= 500) {
        warnings.add(`${item.itemName}: unusual quantity for manager review`)
      }
    })
  })

  if (flaggedCount > 0) {
    warnings.add(`${flaggedCount} line item${flaggedCount === 1 ? "" : "s"} flagged for review`)
  }

  return Array.from(warnings)
}

function SummaryMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Truck
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border border-border bg-secondary/40 p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="mt-1 text-lg font-semibold text-foreground">{value}</p>
    </div>
  )
}
