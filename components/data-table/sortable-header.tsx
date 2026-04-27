"use client"

import type { Column } from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SortableHeaderProps<TData, TValue> {
  column: Column<TData, TValue>
  children: React.ReactNode
  className?: string
}

export function SortableHeader<TData, TValue>({
  column,
  children,
  className,
}: SortableHeaderProps<TData, TValue>) {
  const direction = column.getIsSorted()

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={cn("-ml-3 h-8 px-2 text-xs font-semibold text-muted-foreground hover:text-foreground", className)}
      onClick={() => column.toggleSorting(direction === "asc")}
    >
      {children}
      {direction === "asc" ? (
        <ChevronUp className="ml-1 h-3.5 w-3.5" />
      ) : direction === "desc" ? (
        <ChevronDown className="ml-1 h-3.5 w-3.5" />
      ) : (
        <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-60" />
      )}
    </Button>
  )
}
