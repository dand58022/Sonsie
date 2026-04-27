"use client"

import { useMemo, useState } from "react"
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"

import { ActivityTypeBadge } from "@/components/activity/activity-type-badge"
import { DataTable, SortableHeader } from "@/components/data-table"
import type { OrderActivityEntry } from "@/data/order-activity"
import { formatRelativeTime } from "@/lib/operations"

interface ActivityLogTableProps {
  entries: OrderActivityEntry[]
  onEntryClick: (entry: OrderActivityEntry) => void
}

export function ActivityLogTable({ entries, onEntryClick }: ActivityLogTableProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "timestamp", desc: true }])

  const columns = useMemo<ColumnDef<OrderActivityEntry>[]>(
    () => [
      {
        accessorKey: "timestamp",
        header: ({ column }) => <SortableHeader column={column}>Time</SortableHeader>,
        cell: ({ row }) => (
          <div className="whitespace-nowrap">
            <p className="text-sm font-medium text-foreground">{formatRelativeTime(row.original.timestamp)}</p>
            <p className="text-xs text-muted-foreground">{formatActivityDate(row.original.timestamp)}</p>
          </div>
        ),
      },
      {
        accessorKey: "actionType",
        header: ({ column }) => <SortableHeader column={column}>Action</SortableHeader>,
        cell: ({ row }) => <ActivityTypeBadge type={row.original.actionType} />,
      },
      {
        accessorFn: (row) => row.items.join(", "),
        id: "items",
        header: ({ column }) => <SortableHeader column={column}>Item(s)</SortableHeader>,
        cell: ({ row }) => (
          <div className="max-w-72">
            <p className="truncate font-medium text-foreground">{row.original.items.join(", ")}</p>
            <p className="text-xs text-muted-foreground">{row.original.orderId}</p>
          </div>
        ),
      },
      {
        accessorKey: "supplier",
        header: ({ column }) => <SortableHeader column={column}>Supplier</SortableHeader>,
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.supplier}</span>,
      },
      {
        accessorKey: "user",
        header: ({ column }) => <SortableHeader column={column}>User</SortableHeader>,
        cell: ({ row }) => (
          <span className="rounded-md border border-border bg-secondary px-2 py-1 text-sm text-foreground">
            {row.original.user}
          </span>
        ),
      },
      {
        accessorKey: "notes",
        header: "Notes",
        cell: ({ row }) => <span className="line-clamp-2 text-sm text-muted-foreground">{row.original.notes}</span>,
      },
    ],
    [],
  )

  const table = useReactTable({
    data: entries,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <DataTable
      table={table}
      emptyMessage="No prepared-order activity entries match those filters."
      rowClassName={() => "border-l-2 border-l-primary/30"}
      onRowClick={onEntryClick}
    />
  )
}

function formatActivityDate(timestamp: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(timestamp))
}
