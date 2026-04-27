"use client"

import { Clock, Truck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { DraftSupplierGroup } from "@/data/draft-order"
import { DraftOrderTable } from "./draft-order-table"

interface SupplierGroupSectionProps {
  group: DraftSupplierGroup
  onQuantityChange: (recommendationId: string, quantity: number) => void
  onRemove: (recommendationId: string) => void
}

export function SupplierGroupSection({
  group,
  onQuantityChange,
  onRemove,
}: SupplierGroupSectionProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            {group.supplier.name}
          </CardTitle>
          <CardDescription>{group.supplier.orderWindow}</CardDescription>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {group.warning && (
            <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
              {group.warning}
            </Badge>
          )}
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            {group.maxLeadTimeDays}d lead
          </Badge>
          <Badge variant="outline">${group.totalCost.toFixed(2)}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <DraftOrderTable items={group.items} onQuantityChange={onQuantityChange} onRemove={onRemove} />
        <div className="mt-3 rounded-md border border-dashed border-border p-3 text-sm text-muted-foreground">
          Future Submit to Supplier controls belong here after supplier integration contracts are defined.
        </div>
      </CardContent>
    </Card>
  )
}
