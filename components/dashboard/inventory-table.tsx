"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Eye, Trash2, Check, X } from "lucide-react"
import { DataTable, SortableHeader } from "@/components/data-table"
import {
  getInventoryCategoryLabel,
  getInventorySubcategoryLabel,
  getStatusColor,
  type InventoryItem,
} from "@/data/inventory"
import { cn } from "@/lib/utils"

interface InventoryTableProps {
  items: InventoryItem[]
  onUpdateQuantity?: (id: string, quantity: number) => void
}

export function InventoryTable({ items, onUpdateQuantity }: InventoryTableProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "name", desc: false }])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<string>('')

  const handleStartEdit = (item: InventoryItem) => {
    setEditingId(item.id)
    setEditValue(item.quantity.toString())
  }

  const handleSaveEdit = (id: string) => {
    const newQuantity = parseInt(editValue)
    if (!isNaN(newQuantity) && newQuantity >= 0 && onUpdateQuantity) {
      onUpdateQuantity(id, newQuantity)
    }
    setEditingId(null)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditValue('')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const columns = useMemo<ColumnDef<InventoryItem>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => <SortableHeader column={column}>Item Name</SortableHeader>,
        cell: ({ row }) => (
          <Link
            href={`/dashboard/inventory/${row.original.id}`}
            className="font-medium text-foreground hover:text-primary hover:underline"
          >
            {row.original.name}
          </Link>
        ),
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-foreground">{getInventoryCategoryLabel(row.original.category)}</span>
            <span className="text-xs text-muted-foreground">
              {getInventorySubcategoryLabel(row.original.subcategory)}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "quantity",
        header: ({ column }) => <SortableHeader column={column}>Quantity</SortableHeader>,
        cell: ({ row }) => {
          const item = row.original

          return editingId === item.id ? (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="h-8 w-20 bg-secondary"
                min={0}
                autoFocus
              />
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleSaveEdit(item.id)}>
                <Check className="h-4 w-4 text-primary" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCancelEdit}>
                <X className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ) : (
            <button className="text-foreground hover:text-primary" onClick={() => handleStartEdit(item)}>
              {item.quantity.toLocaleString()}
            </button>
          )
        },
      },
      {
        accessorKey: "unit",
        header: "Unit",
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.unit}</span>,
      },
      {
        accessorKey: "parLevel",
        header: ({ column }) => <SortableHeader column={column}>Par Level</SortableHeader>,
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.parLevel.toLocaleString()}</span>,
      },
      {
        accessorKey: "reorderPoint",
        header: "Reorder Point",
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.reorderPoint.toLocaleString()}</span>,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge variant="outline" className={cn("font-medium", getStatusColor(row.original.status))}>
            {row.original.status}
          </Badge>
        ),
      },
      {
        accessorKey: "lastUpdated",
        header: ({ column }) => <SortableHeader column={column}>Last Updated</SortableHeader>,
        cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatDate(row.original.lastUpdated)}</span>,
      },
      {
        id: "actions",
        header: "",
        meta: {
          headerClassName: "w-12",
          cellClassName: "w-12",
        },
        enableSorting: false,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/inventory/${row.original.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStartEdit(row.original)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Quantity
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Item
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [editValue, editingId],
  )

  const table = useReactTable({
    data: items,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <DataTable table={table} emptyMessage="No inventory items match the current filters." />
  )
}
