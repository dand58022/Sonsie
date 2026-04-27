"use client"

import { useCallback, useMemo, useState } from "react"
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type FilterFn,
  type SortingState,
} from "@tanstack/react-table"

import { DataTable, SortableHeader } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import {
  getInventorySubcategoryLabel,
  type InventoryItem,
  type ToolInventoryItem,
} from "@/data/inventory"
import { compareInventoryStatus, getInventoryStatus } from "@/lib/operations"
import { cn } from "@/lib/utils"

import { InventoryStatusBadge } from "./inventory-status-badge"

const coreRowModel = getCoreRowModel()
const filteredRowModel = getFilteredRowModel()
const sortedRowModel = getSortedRowModel()

export type InventoryTableKind = "ingredients" | "supplies" | "tools"
export type InventoryTableItem = InventoryItem | ToolInventoryItem

interface InventoryCategoryTableProps<TItem extends InventoryTableItem> {
  kind: InventoryTableKind
  items: TItem[]
  searchQuery: string
  statusFilter: string
  onRowClick: (item: TItem) => void
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const formatQuantity = (value: number) => value.toLocaleString()

const inventoryGlobalFilter: FilterFn<InventoryTableItem> = (row, _columnId, filterValue) => {
  const search = String(filterValue ?? "").trim().toLowerCase()

  if (!search) {
    return true
  }

  const item = row.original
  const searchable = [
    item.name,
    item.unit,
    item.supplier,
    getInventoryStatus(item),
    item.subcategory ? getInventorySubcategoryLabel(item.subcategory) : "",
    "assignedArea" in item ? item.assignedArea : "",
    "condition" in item ? item.condition : "",
  ]

  return searchable.some((value) => value.toLowerCase().includes(search))
}

export const ingredientColumns: ColumnDef<InventoryItem>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column}>Item name</SortableHeader>,
    cell: ({ row }) => <span className="font-medium text-foreground">{row.original.name}</span>,
    meta: { cellClassName: "min-w-52" },
  },
  {
    accessorKey: "subcategory",
    header: "Category",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{getInventorySubcategoryLabel(row.original.subcategory)}</span>
    ),
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => <SortableHeader column={column}>Quantity on hand</SortableHeader>,
    cell: ({ row }) => <span className="font-medium">{formatQuantity(row.original.quantity)}</span>,
    meta: { cellClassName: "text-right", headerClassName: "text-right" },
  },
  {
    accessorKey: "unit",
    header: "Unit",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.unit}</span>,
  },
  {
    accessorKey: "parLevel",
    header: ({ column }) => <SortableHeader column={column}>Par level</SortableHeader>,
    cell: ({ row }) => <span className="text-muted-foreground">{formatQuantity(row.original.parLevel)}</span>,
    meta: { cellClassName: "text-right", headerClassName: "text-right" },
  },
  {
    accessorKey: "reorderPoint",
    header: ({ column }) => <SortableHeader column={column}>Reorder point</SortableHeader>,
    cell: ({ row }) => <span className="text-muted-foreground">{formatQuantity(row.original.reorderPoint)}</span>,
    meta: { cellClassName: "text-right", headerClassName: "text-right" },
  },
  {
    accessorKey: "supplier",
    header: "Vendor",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.supplier}</span>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <SortableHeader column={column}>Status</SortableHeader>,
    cell: ({ row }) => <InventoryStatusBadge status={getInventoryStatus(row.original)} />,
    sortingFn: (left, right, columnId) =>
      compareInventoryStatus(
        left.getValue<InventoryItem["status"]>(columnId),
        right.getValue<InventoryItem["status"]>(columnId),
      ),
  },
  {
    accessorKey: "lastUpdated",
    header: ({ column }) => <SortableHeader column={column}>Last updated</SortableHeader>,
    cell: ({ row }) => <span className="text-xs text-muted-foreground">{formatDate(row.original.lastUpdated)}</span>,
  },
]

export const supplyColumns: ColumnDef<InventoryItem>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column}>Item name</SortableHeader>,
    cell: ({ row }) => <span className="font-medium text-foreground">{row.original.name}</span>,
    meta: { cellClassName: "min-w-52" },
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => <SortableHeader column={column}>Quantity on hand</SortableHeader>,
    cell: ({ row }) => <span className="font-medium">{formatQuantity(row.original.quantity)}</span>,
    meta: { cellClassName: "text-right", headerClassName: "text-right" },
  },
  {
    accessorKey: "unit",
    header: "Unit",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.unit}</span>,
  },
  {
    accessorKey: "parLevel",
    header: ({ column }) => <SortableHeader column={column}>Par level</SortableHeader>,
    cell: ({ row }) => <span className="text-muted-foreground">{formatQuantity(row.original.parLevel)}</span>,
    meta: { cellClassName: "text-right", headerClassName: "text-right" },
  },
  {
    accessorKey: "reorderPoint",
    header: ({ column }) => <SortableHeader column={column}>Reorder point</SortableHeader>,
    cell: ({ row }) => <span className="text-muted-foreground">{formatQuantity(row.original.reorderPoint)}</span>,
    meta: { cellClassName: "text-right", headerClassName: "text-right" },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <SortableHeader column={column}>Status</SortableHeader>,
    cell: ({ row }) => <InventoryStatusBadge status={getInventoryStatus(row.original)} />,
    sortingFn: (left, right, columnId) =>
      compareInventoryStatus(
        left.getValue<InventoryItem["status"]>(columnId),
        right.getValue<InventoryItem["status"]>(columnId),
      ),
  },
  {
    accessorKey: "lastUpdated",
    header: ({ column }) => <SortableHeader column={column}>Last updated</SortableHeader>,
    cell: ({ row }) => <span className="text-xs text-muted-foreground">{formatDate(row.original.lastUpdated)}</span>,
  },
]

export const toolColumns: ColumnDef<ToolInventoryItem>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column}>Item name</SortableHeader>,
    cell: ({ row }) => <span className="font-medium text-foreground">{row.original.name}</span>,
    meta: { cellClassName: "min-w-52" },
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => <SortableHeader column={column}>Quantity</SortableHeader>,
    cell: ({ row }) => <span className="font-medium">{formatQuantity(row.original.quantity)}</span>,
    meta: { cellClassName: "text-right", headerClassName: "text-right" },
  },
  {
    accessorKey: "condition",
    header: "Condition",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={cn(
          "whitespace-nowrap font-medium",
          row.original.condition === "Ready" && "bg-success/10 text-success border-success/20",
          row.original.condition === "Needs Cleaning" && "bg-warning/10 text-warning border-warning/20",
          row.original.condition === "Needs Repair" && "bg-destructive/10 text-destructive border-destructive/20",
          row.original.condition === "Retired" && "bg-muted text-muted-foreground border-border",
        )}
      >
        {row.original.condition}
      </Badge>
    ),
  },
  {
    accessorKey: "assignedArea",
    header: ({ column }) => <SortableHeader column={column}>Assigned area</SortableHeader>,
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.assignedArea}</span>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <SortableHeader column={column}>Status</SortableHeader>,
    cell: ({ row }) => <InventoryStatusBadge status={getInventoryStatus(row.original)} />,
    sortingFn: (left, right, columnId) =>
      compareInventoryStatus(
        left.getValue<InventoryItem["status"]>(columnId),
        right.getValue<InventoryItem["status"]>(columnId),
      ),
  },
  {
    accessorKey: "lastUpdated",
    header: ({ column }) => <SortableHeader column={column}>Last updated</SortableHeader>,
    cell: ({ row }) => <span className="text-xs text-muted-foreground">{formatDate(row.original.lastUpdated)}</span>,
  },
]

export function InventoryCategoryTable<TItem extends InventoryTableItem>({
  kind,
  items,
  searchQuery,
  statusFilter,
  onRowClick,
}: InventoryCategoryTableProps<TItem>) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "name", desc: false }])

  const columns = useMemo(() => {
    if (kind === "ingredients") {
      return ingredientColumns as ColumnDef<TItem>[]
    }

    if (kind === "supplies") {
      return supplyColumns as ColumnDef<TItem>[]
    }

    return toolColumns as ColumnDef<TItem>[]
  }, [kind])

  const columnFilters = useMemo(
    () => (statusFilter === "all" ? [] : [{ id: "status", value: statusFilter }]),
    [statusFilter],
  )

  const table = useReactTable({
    data: items,
    columns,
    state: {
      sorting,
      globalFilter: searchQuery,
      columnFilters,
    },
    onSortingChange: setSorting,
    getCoreRowModel: coreRowModel,
    getFilteredRowModel: filteredRowModel,
    getSortedRowModel: sortedRowModel,
    globalFilterFn: inventoryGlobalFilter as unknown as FilterFn<TItem>,
  })

  const rowClassName = useCallback((row: TItem) => {
    const status = getInventoryStatus(row)
    return status === "Critical" || status === "Out of Stock" ? "bg-destructive/5" : undefined
  }, [])

  return (
    <DataTable
      table={table}
      onRowClick={onRowClick}
      emptyMessage="No inventory items match the current filters."
      rowClassName={rowClassName}
    />
  )
}
