"use client"

import { useMemo, useState } from "react"

import { OrderActionBar } from "@/components/prepared-order/order-action-bar"
import { OrderSummaryPanel } from "@/components/prepared-order/order-summary-panel"
import { SupplierOrderSection } from "@/components/prepared-order/supplier-order-section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { DraftOrderSummaryModel, DraftSupplierGroup } from "@/data/draft-order"

interface PreparedOrderViewProps {
  open: boolean
  prepared: boolean
  groups: DraftSupplierGroup[]
  summary: DraftOrderSummaryModel
  onOpenChange: (open: boolean) => void
  onMarkReady: () => void
  onMockDownload: () => void
  onQuantityChange: (recommendationId: string, quantity: number) => void
  onRemove: (recommendationId: string) => void
}

export function PreparedOrderView({
  open,
  prepared,
  groups,
  summary,
  onOpenChange,
  onMarkReady,
  onMockDownload,
  onQuantityChange,
  onRemove,
}: PreparedOrderViewProps) {
  const [notesBySupplier, setNotesBySupplier] = useState<Record<string, string>>({})
  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(new Set())
  const orderDate = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date()),
    [],
  )

  const toggleFlag = (recommendationId: string) => {
    setFlaggedIds((current) => {
      const next = new Set(current)

      if (next.has(recommendationId)) {
        next.delete(recommendationId)
      } else {
        next.add(recommendationId)
      }

      return next
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto border-border bg-background p-0 sm:max-w-5xl">
        <SheetHeader className="border-b border-border p-6 pr-12">
          <SheetTitle className="text-2xl">Prepared Vendor Review</SheetTitle>
          <SheetDescription>
            Review vendor-ready order packets before internal purchasing action.
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-6 p-6">
          <OrderActionBar
            canReview={summary.totalItems > 0}
            prepared={prepared}
            onMarkReady={onMarkReady}
            onMockDownload={onMockDownload}
          />

          <OrderSummaryPanel
            summary={summary}
            groups={groups}
            flaggedCount={flaggedIds.size}
          />

          <div className="space-y-4">
            {groups.length > 0 ? (
              groups.map((group) => (
                <SupplierOrderSection
                  key={group.supplier.id}
                  group={group}
                  orderDate={orderDate}
                  notes={notesBySupplier[group.supplier.id] ?? ""}
                  flaggedIds={flaggedIds}
                  onNotesChange={(notes) =>
                    setNotesBySupplier((current) => ({
                      ...current,
                      [group.supplier.id]: notes,
                    }))
                  }
                  onToggleFlag={toggleFlag}
                  onQuantityChange={onQuantityChange}
                  onRemove={onRemove}
                />
              ))
            ) : (
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>No prepared vendor items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
                    Add reorder recommendations to the draft order before reviewing vendor packets.
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
