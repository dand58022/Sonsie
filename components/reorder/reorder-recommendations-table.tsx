"use client"

import { useMemo, useState } from "react"
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"

import { DataTable, SortableHeader } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  getReorderCategoryLabel,
  type ReorderRecommendation,
} from "@/data/reorder"
import { cn } from "@/lib/utils"
import { ReorderReasonTag } from "./reorder-reason-tag"
import { ReorderUrgencyBadge } from "./reorder-urgency-badge"

interface ReorderRecommendationsTableProps {
  recommendations: ReorderRecommendation[]
  draftIds: Set<string>
  quantities: Record<string, number>
  onQuantityChange: (recommendationId: string, quantity: number) => void
  onAddToDraft: (recommendationId: string) => void
  onRowClick: (recommendation: ReorderRecommendation) => void
}

export function ReorderRecommendationsTable({
  recommendations,
  draftIds,
  quantities,
  onQuantityChange,
  onAddToDraft,
  onRowClick,
}: ReorderRecommendationsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "urgency", desc: false }])

  const columns = useMemo<ColumnDef<ReorderRecommendation>[]>(
    () => [
      {
        accessorFn: (row) => row.item.name,
        id: "item",
        header: ({ column }) => <SortableHeader column={column}>Item name</SortableHeader>,
        cell: ({ row }) => (
          <div className="min-w-52">
            <p className="font-medium text-foreground">{row.original.item.name}</p>
            {draftIds.has(row.original.id) && <p className="text-xs text-primary">Staged in draft</p>}
          </div>
        ),
      },
      {
        accessorFn: (row) => row.item.category,
        id: "category",
        header: ({ column }) => <SortableHeader column={column}>Category</SortableHeader>,
        cell: ({ row }) => (
          <span className="text-muted-foreground">{getReorderCategoryLabel(row.original.item.category)}</span>
        ),
      },
      {
        accessorFn: (row) => row.item.quantity,
        id: "currentQty",
        header: ({ column }) => <SortableHeader column={column}>Current</SortableHeader>,
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.item.quantity.toLocaleString()} {row.original.item.unit}
          </span>
        ),
        meta: { headerClassName: "text-right", cellClassName: "text-right" },
      },
      {
        accessorFn: (row) => row.item.parLevel,
        id: "parLevel",
        header: ({ column }) => <SortableHeader column={column}>Par</SortableHeader>,
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.item.parLevel.toLocaleString()}</span>,
        meta: { headerClassName: "text-right", cellClassName: "text-right" },
      },
      {
        accessorFn: (row) => row.item.reorderPoint,
        id: "reorderPoint",
        header: ({ column }) => <SortableHeader column={column}>Reorder pt.</SortableHeader>,
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.item.reorderPoint.toLocaleString()}</span>,
        meta: { headerClassName: "text-right", cellClassName: "text-right" },
      },
      {
        accessorKey: "recommendedQuantity",
        header: ({ column }) => <SortableHeader column={column}>Recommended</SortableHeader>,
        cell: ({ row }) => {
          const quantity = quantities[row.original.id] ?? row.original.recommendedQuantity

          return (
            <Input
              type="number"
              value={quantity}
              min={0}
              onClick={(event) => event.stopPropagation()}
              onChange={(event) => onQuantityChange(row.original.id, Number(event.target.value) || 0)}
              className="h-8 w-24 border-border bg-secondary text-right"
              aria-label={`Recommended reorder quantity for ${row.original.item.name}`}
            />
          )
        },
        meta: { headerClassName: "text-right", cellClassName: "text-right" },
      },
      {
        accessorFn: (row) => row.supplier.name,
        id: "supplier",
        header: ({ column }) => <SortableHeader column={column}>Vendor</SortableHeader>,
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.supplier.name}</span>,
      },
      {
        accessorKey: "urgency",
        header: ({ column }) => <SortableHeader column={column}>Urgency</SortableHeader>,
        cell: ({ row }) => <ReorderUrgencyBadge urgency={row.original.urgency} />,
      },
      {
        accessorKey: "primaryReason",
        header: ({ column }) => <SortableHeader column={column}>Reason</SortableHeader>,
        cell: ({ row }) => <ReorderReasonTag reason={row.original.primaryReason} />,
      },
      {
        accessorKey: "leadTimeDays",
        header: ({ column }) => <SortableHeader column={column}>Lead</SortableHeader>,
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.leadTimeDays}d</span>,
        meta: { headerClassName: "text-right", cellClassName: "text-right" },
      },
      {
        accessorKey: "estimatedCost",
        header: ({ column }) => <SortableHeader column={column}>Est. cost</SortableHeader>,
        cell: ({ row }) => {
          const quantity = quantities[row.original.id] ?? row.original.recommendedQuantity
          return <span className="font-medium text-foreground">${(quantity * row.original.item.unitCost).toFixed(2)}</span>
        },
        meta: { headerClassName: "text-right", cellClassName: "text-right" },
      },
      {
        id: "action",
        header: "Draft",
        enableSorting: false,
        cell: ({ row }) => {
          const isStaged = draftIds.has(row.original.id)

          return (
            <Button
              variant={isStaged ? "secondary" : "outline"}
              size="sm"
              className="h-8 whitespace-nowrap"
              onClick={(event) => {
                event.stopPropagation()
                onAddToDraft(row.original.id)
              }}
              disabled={isStaged}
            >
              {isStaged ? "Staged" : "Stage"}
            </Button>
          )
        },
        meta: { headerClassName: "w-24 text-right", cellClassName: "w-24 text-right" },
      },
    ],
    [
      draftIds,
      onAddToDraft,
      onQuantityChange,
      quantities,
    ],
  )

  const table = useReactTable({
    data: recommendations,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <DataTable
      table={table}
      emptyMessage="No reorder recommendations match the current filters."
      onRowClick={onRowClick}
      rowClassName={(row) =>
        cn(
          row.urgency === "Critical" && "border-l-2 border-l-destructive/60",
        )
      }
    />
  )
}
