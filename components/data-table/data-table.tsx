"use client"

import type { MouseEvent } from "react"
import {
  flexRender,
  type Table as TanStackTable,
} from "@tanstack/react-table"
import { SearchX } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface DataTableProps<TData> {
  table: TanStackTable<TData>
  emptyMessage?: string
  className?: string
  containerClassName?: string
  rowClassName?: (row: TData) => string | undefined
  onRowClick?: (row: TData) => void
}

export function DataTable<TData>({
  table,
  emptyMessage = "No results found",
  className,
  containerClassName,
  rowClassName,
  onRowClick,
}: DataTableProps<TData>) {
  const columns = table.getAllLeafColumns()
  const handleRowClick = (event: MouseEvent<HTMLTableRowElement>, row: TData) => {
    const target = event.target as HTMLElement | null

    if (
      target?.closest(
        'button, a, input, select, textarea, [role="button"], [role="checkbox"], [data-row-click-ignore="true"]',
      )
    ) {
      return
    }

    onRowClick?.(row)
  }

  return (
    <div className={cn("overflow-hidden rounded-lg border border-border/80 bg-dashboard-surface-inner", className)}>
      <div className={cn("max-w-full overflow-auto", containerClassName)}>
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-dashboard-surface-raised shadow-sm shadow-background/40">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-border hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    "h-10 whitespace-nowrap bg-dashboard-surface-raised text-xs font-semibold text-muted-foreground",
                    header.column.columnDef.meta?.headerClassName,
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={(event) => handleRowClick(event, row.original)}
                className={cn(
                  "border-border/80 transition-colors hover:bg-secondary/50 data-[state=selected]:bg-secondary/70",
                  onRowClick && "cursor-pointer",
                  rowClassName?.(row.original),
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn("py-2.5 align-middle", cell.column.columnDef.meta?.cellClassName)}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length || 1}
                className="h-32 text-center text-muted-foreground"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="rounded-lg bg-secondary p-2 text-muted-foreground">
                    <SearchX className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-medium text-foreground">No rows to show</p>
                  <p className="max-w-sm text-xs text-muted-foreground">{emptyMessage}</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </div>
    </div>
  )
}
