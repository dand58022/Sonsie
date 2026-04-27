"use client"

import { CalendarDays, Clock, StickyNote } from "lucide-react"

import { OrderPacketTable } from "@/components/prepared-order/order-packet-table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { DraftSupplierGroup } from "@/data/draft-order"

interface SupplierOrderSectionProps {
  group: DraftSupplierGroup
  orderDate: string
  notes: string
  flaggedIds: Set<string>
  onNotesChange: (notes: string) => void
  onToggleFlag: (recommendationId: string) => void
  onQuantityChange: (recommendationId: string, quantity: number) => void
  onRemove: (recommendationId: string) => void
}

export function SupplierOrderSection({
  group,
  orderDate,
  notes,
  flaggedIds,
  onNotesChange,
  onToggleFlag,
  onQuantityChange,
  onRemove,
}: SupplierOrderSectionProps) {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="border-b border-border">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <CardTitle className="flex flex-wrap items-center gap-2">
              {group.supplier.name}
              <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">
                Prepared packet
              </Badge>
            </CardTitle>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" />
                {orderDate}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {group.maxLeadTimeDays} day max lead time
              </span>
              {group.supplier.minimumOrder && (
                <span>Order minimum ${group.supplier.minimumOrder.toFixed(2)}</span>
              )}
            </div>
          </div>
          <div className="text-left lg:text-right">
            <p className="text-xs text-muted-foreground">Supplier total</p>
            <p className="text-2xl font-semibold text-foreground">${group.totalCost.toFixed(2)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 p-4">
        {group.warning && (
          <div className="rounded-lg border border-warning/20 bg-warning/5 p-3 text-sm text-warning">
            {group.warning}
          </div>
        )}
        <OrderPacketTable
          items={group.items}
          flaggedIds={flaggedIds}
          onToggleFlag={onToggleFlag}
          onQuantityChange={onQuantityChange}
          onRemove={onRemove}
        />
        <div className="grid gap-2">
          <Label htmlFor={`supplier-notes-${group.supplier.id}`} className="flex items-center gap-2">
            <StickyNote className="h-4 w-4 text-muted-foreground" />
            Notes / instructions
          </Label>
          <Textarea
            id={`supplier-notes-${group.supplier.id}`}
            value={notes}
            onChange={(event) => onNotesChange(event.target.value)}
            placeholder="Add prep notes for the manager reviewing this supplier packet."
            className="min-h-20 bg-secondary"
          />
        </div>
      </CardContent>
    </Card>
  )
}
