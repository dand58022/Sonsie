"use client"

import { useMemo, useState } from "react"
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable, SortableHeader } from "@/components/data-table"
import { mockSupplies, getSupplyStatusColor, type SupplyItem } from "@/data/supplies"
import { compareOperationalStatus } from "@/lib/operations"
import { Pencil, Check, X, Package } from "lucide-react"
import { cn } from "@/lib/utils"

function getSupplyStatus(quantity: number, parLevel: number): SupplyItem["status"] {
  if (quantity <= 0 || quantity <= parLevel * 0.4) {
    return "Critical"
  }

  if (quantity <= parLevel * 0.6) {
    return "Low"
  }

  return "Good"
}

export function SuppliesTable() {
  const [supplies, setSupplies] = useState(mockSupplies)
  const [sorting, setSorting] = useState<SortingState>([{ id: "status", desc: false }])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<string>("")

  const startEdit = (item: SupplyItem) => {
    setEditingId(item.id)
    setEditValue(item.quantity.toString())
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditValue("")
  }

  const saveEdit = (id: string) => {
    const newQty = parseInt(editValue)
    if (!isNaN(newQty) && newQty >= 0) {
      setSupplies(prev => prev.map(item => {
        if (item.id === id) {
          return { ...item, quantity: newQty, status: getSupplyStatus(newQty, item.parLevel) }
        }
        return item
      }))
    }
    setEditingId(null)
    setEditValue("")
  }

  const getParPercentage = (qty: number, par: number) => {
    return Math.min((qty / par) * 100, 100)
  }

  const columns = useMemo<ColumnDef<SupplyItem>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => <SortableHeader column={column}>Item</SortableHeader>,
        cell: ({ row }) => <span className="font-medium text-foreground">{row.original.name}</span>,
      },
      {
        accessorKey: "quantity",
        header: ({ column }) => <SortableHeader column={column}>Quantity</SortableHeader>,
        cell: ({ row }) => {
          const item = row.original

          return editingId === item.id ? (
            <Input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="h-8 w-24 bg-secondary text-sm"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEdit(item.id)
                if (e.key === 'Escape') cancelEdit()
              }}
            />
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground">
                {item.quantity.toLocaleString()} {item.unit}
              </span>
              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    item.status === 'Good' ? "bg-success" :
                    item.status === 'Low' ? "bg-warning" : "bg-destructive"
                  )}
                  style={{ width: `${getParPercentage(item.quantity, item.parLevel)}%` }}
                />
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: "parLevel",
        header: ({ column }) => <SortableHeader column={column}>Par Level</SortableHeader>,
        cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.parLevel.toLocaleString()}</span>,
      },
      {
        accessorKey: "status",
        header: ({ column }) => <SortableHeader column={column}>Status</SortableHeader>,
        sortingFn: (left, right, columnId) =>
          compareOperationalStatus(
            left.getValue<SupplyItem["status"]>(columnId),
            right.getValue<SupplyItem["status"]>(columnId),
          ),
        cell: ({ row }) => (
          <Badge variant="outline" className={cn("text-xs font-medium", getSupplyStatusColor(row.original.status))}>
            {row.original.status}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: "",
        meta: {
          headerClassName: "w-16",
          cellClassName: "w-16",
        },
        enableSorting: false,
        cell: ({ row }) => {
          const item = row.original

          return editingId === item.id ? (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-success hover:bg-success/10 hover:text-success"
                onClick={() => saveEdit(item.id)}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={cancelEdit}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={() => startEdit(item)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          )
        },
      },
    ],
    [editValue, editingId],
  )

  const table = useReactTable({
    data: supplies,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <Card
      className="border-dashboard-border-strong/70 bg-dashboard-surface-raised shadow-sm shadow-black/5 dark:shadow-black/25"
      data-demo-target="overview-supplies"
    >
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
          <Package className="h-5 w-5 text-chart-2" />
          Supplies Inventory
        </CardTitle>
        <Badge variant="outline" className="border-warning/25 bg-warning/10 text-xs font-semibold text-warning">
          {supplies.filter(s => s.status === 'Low' || s.status === 'Critical').length} Need Attention
        </Badge>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        <DataTable table={table} emptyMessage="No supplies found." className="border-border/80" />
      </CardContent>
    </Card>
  )
}
