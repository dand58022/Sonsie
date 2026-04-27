"use client"

import { useMemo, useState } from "react"
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import { Trash2 } from "lucide-react"

import { DataTable, SortableHeader } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import type { DraftOrderLineItem } from "@/data/draft-order"
import { QuantityInput } from "./quantity-input"

interface DraftOrderTableProps {
  items: DraftOrderLineItem[]
  onQuantityChange: (recommendationId: string, quantity: number) => void
  onRemove: (recommendationId: string) => void
}

export function DraftOrderTable({ items, onQuantityChange, onRemove }: DraftOrderTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo<ColumnDef<DraftOrderLineItem>[]>(
    () => [
      {
        accessorKey: "itemName",
        header: ({ column }) => <SortableHeader column={column}>Item</SortableHeader>,
        cell: ({ row }) => (
          <div className="min-w-52">
            <p className="font-medium text-foreground">{row.original.itemName}</p>
            {row.original.warning && <p className="text-xs text-destructive">{row.original.warning}</p>}
          </div>
        ),
      },
      {
        accessorFn: (row) => row.supplier.name,
        id: "supplier",
        header: ({ column }) => <SortableHeader column={column}>Supplier</SortableHeader>,
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.supplier.name}</span>,
      },
      {
        accessorKey: "quantity",
        header: ({ column }) => <SortableHeader column={column}>Quantity</SortableHeader>,
        cell: ({ row }) => (
          <QuantityInput
            value={row.original.quantity}
            ariaLabel={`Draft order quantity for ${row.original.itemName}`}
            onChange={(quantity) => onQuantityChange(row.original.recommendationId, quantity)}
          />
        ),
        meta: { headerClassName: "text-right", cellClassName: "text-right" },
      },
      {
        accessorKey: "unit",
        header: "Unit",
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.unit}</span>,
      },
      {
        accessorKey: "estimatedCost",
        header: ({ column }) => <SortableHeader column={column}>Estimated cost</SortableHeader>,
        cell: ({ row }) => (
          <span className="font-medium text-foreground">${row.original.estimatedCost.toFixed(2)}</span>
        ),
        meta: { headerClassName: "text-right", cellClassName: "text-right" },
      },
      {
        accessorKey: "leadTimeDays",
        header: ({ column }) => <SortableHeader column={column}>Lead time</SortableHeader>,
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.leadTimeDays}d</span>,
        meta: { headerClassName: "text-right", cellClassName: "text-right" },
      },
      {
        id: "remove",
        header: "Remove",
        enableSorting: false,
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            aria-label={`Remove ${row.original.itemName} from draft order`}
            onClick={() => onRemove(row.original.recommendationId)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        ),
        meta: { headerClassName: "w-20", cellClassName: "w-20" },
      },
    ],
    [onQuantityChange, onRemove],
  )

  const table = useReactTable({
    data: items,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return <DataTable table={table} emptyMessage="No draft items staged for this supplier." />
}
