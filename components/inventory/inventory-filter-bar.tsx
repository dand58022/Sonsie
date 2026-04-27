"use client"

import { Filter, Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface InventoryFilterBarProps {
  searchQuery: string
  statusFilter: string
  categoryFilter: string
  onSearchChange: (value: string) => void
  onStatusFilterChange: (value: string) => void
  onCategoryFilterChange: (value: string) => void
}

export function InventoryFilterBar({
  searchQuery,
  statusFilter,
  categoryFilter,
  onSearchChange,
  onStatusFilterChange,
  onCategoryFilterChange,
}: InventoryFilterBarProps) {
  return (
    <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative max-w-md flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search inventory, vendor, area..."
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          className="bg-secondary pl-9 border-border"
        />
      </div>
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
          <SelectTrigger className="w-44 bg-secondary border-border">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="produce">Produce</SelectItem>
            <SelectItem value="seafood">Seafood</SelectItem>
            <SelectItem value="meat">Meat</SelectItem>
            <SelectItem value="dairy">Dairy</SelectItem>
            <SelectItem value="bakery">Bakery</SelectItem>
            <SelectItem value="dry_goods">Dry Goods</SelectItem>
            <SelectItem value="sauce">Sauces</SelectItem>
            <SelectItem value="bar">Bar</SelectItem>
            <SelectItem value="wine">Wine</SelectItem>
            <SelectItem value="coffee">Coffee</SelectItem>
            <SelectItem value="supply">Supplies</SelectItem>
            <SelectItem value="tool">Tools</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-40 bg-secondary border-border">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="In Stock">Good</SelectItem>
            <SelectItem value="Low Stock">Below Par</SelectItem>
            <SelectItem value="Critical">Critical</SelectItem>
            <SelectItem value="Out of Stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
