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
import type { CsvParsedOrderRow } from "@/data/ingest"
import { cn } from "@/lib/utils"
import { MatchStatusBadge } from "./match-status-badge"

interface CSVPreviewTableProps {
  rows: CsvParsedOrderRow[]
}

const categoryLabel: Record<CsvParsedOrderRow["category"], string> = {
  ingredient: "Ingredient",
  supply: "Supply",
  tool: "Tool",
  unmapped: "Unmapped",
}

export function CSVPreviewTable({ rows }: CSVPreviewTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo<ColumnDef<CsvParsedOrderRow>[]>(
    () => [
      {
        accessorKey: "sourceRow",
        header: ({ column }) => <SortableHeader column={column}>Row</SortableHeader>,
        meta: { headerClassName: "w-16", cellClassName: "text-muted-foreground" },
      },
      {
        accessorKey: "itemName",
        header: ({ column }) => <SortableHeader column={column}>Item name</SortableHeader>,
        cell: ({ row }) => (
          <div className="min-w-48">
            <p className="font-medium text-foreground">{row.original.itemName}</p>
            {row.original.matchedInventoryItemName && (
              <p className="text-xs text-muted-foreground">Matched to {row.original.matchedInventoryItemName}</p>
            )}
          </div>
        ),
      },
      {
        accessorKey: "category",
        header: ({ column }) => <SortableHeader column={column}>Category</SortableHeader>,
        cell: ({ row }) => <span className="text-muted-foreground">{categoryLabel[row.original.category]}</span>,
      },
      {
        accessorKey: "quantity",
        header: ({ column }) => <SortableHeader column={column}>Qty</SortableHeader>,
        cell: ({ row }) => <span className="font-medium text-foreground">{row.original.quantity}</span>,
        meta: { headerClassName: "text-right", cellClassName: "text-right" },
      },
      {
        accessorKey: "unit",
        header: "Unit",
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.unit}</span>,
      },
      {
        accessorKey: "source",
        header: ({ column }) => <SortableHeader column={column}>Source</SortableHeader>,
        cell: ({ row }) => (
          <div className="min-w-36 text-xs text-muted-foreground">
            <p>{row.original.source}</p>
            <p>{row.original.businessDate}</p>
          </div>
        ),
      },
      {
        accessorKey: "confidence",
        header: ({ column }) => <SortableHeader column={column}>Confidence</SortableHeader>,
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.confidence}%</span>,
        meta: { headerClassName: "text-right", cellClassName: "text-right" },
      },
      {
        accessorKey: "matchStatus",
        header: ({ column }) => <SortableHeader column={column}>Match</SortableHeader>,
        cell: ({ row }) => (
          <div className="flex min-w-48 flex-col gap-1">
            <MatchStatusBadge status={row.original.matchStatus} className="w-fit" />
            {row.original.message && <span className="text-xs text-muted-foreground">{row.original.message}</span>}
          </div>
        ),
      },
    ],
    [],
  )

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <DataTable
      table={table}
      emptyMessage="No parsed rows are ready for review."
      rowClassName={(row) =>
        cn(
          row.matchStatus === "unmatched" && "bg-destructive/5",
          row.matchStatus === "needs_review" && "bg-warning/5",
        )
      }
    />
  )
}
