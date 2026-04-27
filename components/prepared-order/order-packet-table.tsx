"use client"

import { useMemo, useState } from "react"
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import { Flag, Trash2 } from "lucide-react"

import { DataTable, SortableHeader } from "@/components/data-table"
import { QuantityInput } from "@/components/draft-order"
import { Button } from "@/components/ui/button"
import type { DraftOrderLineItem } from "@/data/draft-order"
import { cn } from "@/lib/utils"

interface OrderPacketTableProps {
  items: DraftOrderLineItem[]
  flaggedIds: Set<string>
  onToggleFlag: (recommendationId: string) => void
  onQuantityChange: (recommendationId: string, quantity: number) => void
  onRemove: (recommendationId: string) => void
}

export function OrderPacketTable({
  items,
  flaggedIds,
  onToggleFlag,
  onQuantityChange,
  onRemove,
}: OrderPacketTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo<ColumnDef<DraftOrderLineItem>[]>(
    () => [
      {
        accessorKey: "itemName",
        header: ({ column }) => <SortableHeader column={column}>Item</SortableHeader>,
        cell: ({ row }) => {
          const flagged = flaggedIds.has(row.original.recommendationId)

          return (
            <div className="min-w-52">
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground">{row.original.itemName}</p>
                {flagged && <span className="text-xs font-medium text-warning">Flagged</span>}
              </div>
              {row.original.warning && <p className="text-xs text-destructive">{row.original.warning}</p>}
            </div>
          )
        },
      },
      {
        accessorKey: "quantity",
        header: ({ column }) => <SortableHeader column={column}>Qty</SortableHeader>,
        cell: ({ row }) => (
          <QuantityInput
            value={row.original.quantity}
            ariaLabel={`Prepared order quantity for ${row.original.itemName}`}
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
        accessorKey: "unitCost",
        header: ({ column }) => <SortableHeader column={column}>Unit cost</SortableHeader>,
        cell: ({ row }) => <span className="text-muted-foreground">${row.original.unitCost.toFixed(2)}</span>,
        meta: { headerClassName: "text-right", cellClassName: "text-right" },
      },
      {
        accessorKey: "estimatedCost",
        header: ({ column }) => <SortableHeader column={column}>Line total</SortableHeader>,
        cell: ({ row }) => (
          <span className="font-medium text-foreground">${row.original.estimatedCost.toFixed(2)}</span>
        ),
        meta: { headerClassName: "text-right", cellClassName: "text-right" },
      },
      {
        accessorKey: "leadTimeDays",
        header: ({ column }) => <SortableHeader column={column}>Lead</SortableHeader>,
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.leadTimeDays}d</span>,
        meta: { headerClassName: "text-right", cellClassName: "text-right" },
      },
      {
        id: "reviewActions",
        header: "Review",
        enableSorting: false,
        cell: ({ row }) => {
          const flagged = flaggedIds.has(row.original.recommendationId)

          return (
            <div className="flex justify-end gap-1">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 text-muted-foreground",
                  flagged && "text-warning hover:text-warning",
                )}
                aria-label={`${flagged ? "Clear flag for" : "Flag"} ${row.original.itemName}`}
                onClick={() => onToggleFlag(row.original.recommendationId)}
              >
                <Flag className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                aria-label={`Remove ${row.original.itemName} from prepared order`}
                onClick={() => onRemove(row.original.recommendationId)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )
        },
        meta: { headerClassName: "w-24 text-right", cellClassName: "w-24 text-right" },
      },
    ],
    [flaggedIds, onQuantityChange, onRemove, onToggleFlag],
  )

  const table = useReactTable({
    data: items,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return <DataTable table={table} emptyMessage="No items left in this prepared supplier packet." />
}
