"use client"

import { AlertTriangle, CheckCircle2, ShoppingCart, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { DraftOrderSummaryModel } from "@/data/draft-order"
import { OrderStatusBadge } from "./order-status-badge"

interface DraftOrderSummaryProps {
  summary: DraftOrderSummaryModel
  prepared: boolean
  onClearDraft: () => void
  onPrepareOrder: () => void
}

export function DraftOrderSummary({
  summary,
  prepared,
  onClearDraft,
  onPrepareOrder,
}: DraftOrderSummaryProps) {
  const status = prepared ? "prepared" : summary.status
  const readyToOrder = summary.totalItems > 0 && summary.warnings.length === 0

  return (
    <Card className="border-border bg-card">
      <CardHeader className="gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            Vendor Draft Summary
            <OrderStatusBadge status={status} />
          </CardTitle>
          <CardDescription>Purchasing review for vendor-ready draft order packets.</CardDescription>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={onClearDraft} disabled={summary.totalItems === 0}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Draft
          </Button>
          <Button onClick={onPrepareOrder} disabled={summary.totalItems === 0 || prepared}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            {prepared ? "Prepared" : "Prepare Review"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-3">
          <SummaryMetric label="Total items" value={summary.totalItems.toLocaleString()} />
          <SummaryMetric label="Vendors" value={summary.supplierCount.toLocaleString()} />
          <SummaryMetric label="Estimated total" value={`$${summary.totalCost.toFixed(2)}`} />
          <SummaryMetric label="Ready to order" value={readyToOrder ? "Yes" : "Review"} />
        </div>

        {summary.warnings.length > 0 ? (
          <div className="rounded-lg border border-warning/20 bg-warning/5 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-warning">
              <AlertTriangle className="h-4 w-4" />
              Warnings
            </div>
            <div className="mt-2 grid gap-1 text-sm text-muted-foreground">
              {summary.warnings.map((warning) => (
                <p key={warning}>{warning}</p>
              ))}
            </div>
          </div>
        ) : summary.totalItems > 0 ? (
          <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-primary">
            <CheckCircle2 className="h-4 w-4" />
            Draft is ready for manager review. No live vendor submission will occur.
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
            Add items from reorder recommendations to start a vendor draft.
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-secondary/40 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold text-foreground">{value}</p>
    </div>
  )
}
