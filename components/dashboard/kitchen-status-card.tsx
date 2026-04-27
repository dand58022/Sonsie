"use client"

import { useMemo, useState } from "react"
import { AlertTriangle, CheckCircle2, Pencil, ShoppingCart } from "lucide-react"
import { toast } from "sonner"

import { InventoryDetailDrawer, type InventoryTableItem } from "@/components/inventory"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { InventoryItem } from "@/data/inventory"
import { getInventoryOperationsSummary, getInventoryStatus } from "@/lib/operations"

interface KitchenStatusCardProps {
  items: InventoryItem[]
  onSaveItem: (item: InventoryTableItem) => void
}

export function KitchenStatusCard({ items, onSaveItem }: KitchenStatusCardProps) {
  const summary = useMemo(() => getInventoryOperationsSummary(items), [items])
  const [reorderIds, setReorderIds] = useState<Set<string>>(new Set())
  const [selectedItem, setSelectedItem] = useState<InventoryTableItem | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const criticalPreview = summary.criticalItems.slice(0, 3)

  const addToReorder = (item: InventoryItem) => {
    setReorderIds((current) => new Set(current).add(item.id))
    toast.success(`Added ${item.name} to reorder list`, {
      description: "This item is staged in the dashboard reorder queue.",
    })
  }

  const openEditor = (item: InventoryItem) => {
    setSelectedItem(item)
    setDetailOpen(true)
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="gap-2 border-b border-border py-4">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Kitchen Status
            </CardTitle>
            <CardDescription>What needs attention before the next service window.</CardDescription>
          </div>
          <Badge variant="outline" className="w-fit border-destructive/25 bg-destructive/10 text-destructive">
            {summary.criticalLowStockItems} critical
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <StatusMetric label="Critical items" value={summary.criticalLowStockItems} tone="critical" />
          <StatusMetric label="Items below par" value={summary.itemsBelowPar} tone="warning" />
          <div className="rounded-lg border border-border bg-secondary/30 p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Items above par</p>
              <p className="text-xl font-semibold text-foreground" data-typography="metric">{summary.itemsAboveParPercent}%</p>
            </div>
            <Progress value={summary.itemsAboveParPercent} className="mt-3 h-2" />
          </div>
        </div>

        <div className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-foreground">Top critical items</h3>
            {reorderIds.size > 0 && (
              <span className="text-xs text-muted-foreground">
                {reorderIds.size} staged for reorder
              </span>
            )}
          </div>

          {criticalPreview.length > 0 ? (
            <div className="grid gap-2">
              {criticalPreview.map((item) => (
                <div
                  key={item.id}
                className="flex flex-col gap-2 rounded-lg border border-border bg-secondary/20 p-2.5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-foreground">{item.name}</p>
                      <Badge variant="outline" className="border-destructive/25 bg-destructive/10 text-destructive">
                        {getInventoryStatus(item)}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.quantity.toLocaleString()} {item.unit} on hand, par {item.parLevel.toLocaleString()}.
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button size="sm" variant="outline" className="h-8" onClick={() => addToReorder(item)}>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {reorderIds.has(item.id) ? "Staged" : "Reorder"}
                    </Button>
                    <Button size="sm" className="h-8" onClick={() => openEditor(item)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
              <CheckCircle2 className="mx-auto mb-2 h-5 w-5 text-success" />
              No critical stock blockers in the current inventory.
            </div>
          )}
        </div>
      </CardContent>

      <InventoryDetailDrawer
        item={selectedItem}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onSaveItem={(updatedItem) => {
          onSaveItem(updatedItem)
          setSelectedItem(updatedItem)
        }}
      />
    </Card>
  )
}

function StatusMetric({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: "critical" | "warning"
}) {
  return (
    <div className="rounded-lg border border-border bg-secondary/30 p-3">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p
        className={tone === "critical" ? "mt-1 text-2xl font-semibold text-destructive" : "mt-1 text-2xl font-semibold text-warning"}
        data-typography="metric"
      >
        {value}
      </p>
    </div>
  )
}
