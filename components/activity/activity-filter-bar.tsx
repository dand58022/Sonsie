"use client"

import { Search } from "lucide-react"

import { activityTypeLabels } from "@/components/activity/activity-type-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { orderActivityTypes, type OrderActivityType } from "@/data/order-activity"

interface ActivityFilterBarProps {
  searchQuery: string
  actionFilter: "all" | OrderActivityType
  supplierFilter: string
  dateFilter: string
  suppliers: string[]
  onSearchChange: (value: string) => void
  onActionFilterChange: (value: "all" | OrderActivityType) => void
  onSupplierFilterChange: (value: string) => void
  onDateFilterChange: (value: string) => void
  onClearFilters: () => void
}

export function ActivityFilterBar({
  searchQuery,
  actionFilter,
  supplierFilter,
  dateFilter,
  suppliers,
  onSearchChange,
  onActionFilterChange,
  onSupplierFilterChange,
  onDateFilterChange,
  onClearFilters,
}: ActivityFilterBarProps) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="grid gap-4 p-4 lg:grid-cols-[minmax(240px,1fr)_180px_200px_170px_auto] lg:items-end">
        <div className="grid gap-2">
          <Label htmlFor="activity-search">Search item or notes</Label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="activity-search"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search oysters, bar prep, review notes"
              className="border-border bg-secondary pl-9"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label>Action</Label>
          <Select value={actionFilter} onValueChange={(value) => onActionFilterChange(value as "all" | OrderActivityType)}>
            <SelectTrigger className="border-border bg-secondary">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All actions</SelectItem>
              {orderActivityTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {activityTypeLabels[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label>Supplier</Label>
          <Select value={supplierFilter} onValueChange={onSupplierFilterChange}>
            <SelectTrigger className="border-border bg-secondary">
              <SelectValue placeholder="Supplier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All suppliers</SelectItem>
              {suppliers.map((supplier) => (
                <SelectItem key={supplier} value={supplier}>
                  {supplier}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label>Date range</Label>
          <Select value={dateFilter} onValueChange={onDateFilterChange}>
            <SelectTrigger className="border-border bg-secondary">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" onClick={onClearFilters}>
          Clear Filters
        </Button>
      </CardContent>
    </Card>
  )
}
