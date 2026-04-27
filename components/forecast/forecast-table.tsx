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
import { EmptyState } from "@/components/feedback"
import { ForecastRiskBadge } from "@/components/forecast/forecast-risk-badge"
import type { ForecastItem } from "@/data/forecast"

export function ForecastTable({ items }: { items: ForecastItem[] }) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "daysRemaining", desc: false }])

  const columns = useMemo<ColumnDef<ForecastItem>[]>(
    () => [
      {
        accessorKey: "item",
        header: ({ column }) => <SortableHeader column={column}>Item</SortableHeader>,
        cell: ({ row }) => <span className="font-medium text-foreground">{row.original.item}</span>,
      },
      {
        accessorKey: "categoryLabel",
        header: ({ column }) => <SortableHeader column={column}>Category</SortableHeader>,
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.categoryLabel}</span>,
      },
      {
        accessorKey: "currentStock",
        header: ({ column }) => <SortableHeader column={column}>Current stock</SortableHeader>,
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.currentStock.toLocaleString()} {row.original.unit}
          </span>
        ),
        meta: { headerClassName: "text-right", cellClassName: "text-right" },
      },
      {
        accessorKey: "averageDailyUsage",
        header: ({ column }) => <SortableHeader column={column}>Avg daily usage</SortableHeader>,
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.averageDailyUsage.toLocaleString()} {row.original.unit}
          </span>
        ),
        meta: { headerClassName: "text-right", cellClassName: "text-right" },
      },
      {
        accessorKey: "daysRemaining",
        header: ({ column }) => <SortableHeader column={column}>Days remaining</SortableHeader>,
        cell: ({ row }) => (
          <span className="font-medium text-foreground">{row.original.daysRemaining.toFixed(1)} days</span>
        ),
        meta: { headerClassName: "text-right", cellClassName: "text-right" },
      },
      {
        accessorKey: "reorderDate",
        header: ({ column }) => <SortableHeader column={column}>Reorder date</SortableHeader>,
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.reorderDate}</span>,
      },
      {
        accessorKey: "riskLevel",
        header: ({ column }) => <SortableHeader column={column}>Risk</SortableHeader>,
        cell: ({ row }) => <ForecastRiskBadge risk={row.original.riskLevel} />,
      },
      {
        accessorKey: "supplier",
        header: ({ column }) => <SortableHeader column={column}>Supplier</SortableHeader>,
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.supplier}</span>,
      },
    ],
    [],
  )

  const table = useReactTable({
    data: items,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (items.length === 0) {
    return (
      <EmptyState
        title="No forecast items"
        description="Forecast data will appear here when inventory items include enough mock service history."
      />
    )
  }

  return (
    <DataTable
      table={table}
      emptyMessage="No forecast rows found."
      containerClassName="max-h-[520px]"
    />
  )
}
