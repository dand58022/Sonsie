"use client"

import { useMemo, useState } from "react"
import { CheckCircle2, ClipboardList, Pencil, SearchCheck } from "lucide-react"

import { ActivityFilterBar, ActivityLogTable, ActivityTypeBadge, useActivity } from "@/components/activity"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  getOrderActivitySummary,
  getOrderActivitySuppliers,
  mockOrderActivityEntries,
  type OrderActivityEntry,
  type OrderActivityType,
} from "@/data/order-activity"
import { formatRelativeTime } from "@/lib/operations"

type ActivityFilter = "all" | OrderActivityType

export default function PreparedOrderActivityPage() {
  const { sessionEntries } = useActivity()
  const [searchQuery, setSearchQuery] = useState("")
  const [actionFilter, setActionFilter] = useState<ActivityFilter>("all")
  const [supplierFilter, setSupplierFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("7days")
  const [selectedEntry, setSelectedEntry] = useState<OrderActivityEntry | null>(null)

  const allEntries = useMemo(
    () =>
      [...sessionEntries, ...mockOrderActivityEntries].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      ),
    [sessionEntries],
  )
  const suppliers = useMemo(() => getOrderActivitySuppliers(allEntries), [allEntries])
  const summary = useMemo(() => getOrderActivitySummary(allEntries), [allEntries])

  const filteredEntries = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return allEntries.filter((entry) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        entry.items.some((item) => item.toLowerCase().includes(normalizedQuery)) ||
        entry.notes.toLowerCase().includes(normalizedQuery) ||
        entry.orderId.toLowerCase().includes(normalizedQuery)
      const matchesAction = actionFilter === "all" || entry.actionType === actionFilter
      const matchesSupplier = supplierFilter === "all" || entry.supplier === supplierFilter
      const matchesDate = matchesDateFilter(entry.timestamp, dateFilter)

      return matchesSearch && matchesAction && matchesSupplier && matchesDate
    })
  }, [actionFilter, allEntries, dateFilter, searchQuery, supplierFilter])

  const clearFilters = () => {
    setSearchQuery("")
    setActionFilter("all")
    setSupplierFilter("all")
    setDateFilter("7days")
  }

  return (
    <div className="flex flex-col">
      <Header
        title="Activity Log"
        subtitle="Track deliveries, adjustments, vendor draft reviews, and manager actions"
      />
      <div className="flex-1 space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-4">
          <SummaryCard icon={ClipboardList} label="Total events" value={summary.total} tone="primary" />
          <SummaryCard icon={SearchCheck} label="Vendor reviews" value={summary.reviewed} tone="warning" />
          <SummaryCard icon={CheckCircle2} label="Ready packets" value={summary.ready} tone="success" />
          <SummaryCard icon={Pencil} label="Count edits" value={summary.updated} tone="secondary" />
        </div>

        <ActivityFilterBar
          searchQuery={searchQuery}
          actionFilter={actionFilter}
          supplierFilter={supplierFilter}
          dateFilter={dateFilter}
          suppliers={suppliers}
          onSearchChange={setSearchQuery}
          onActionFilterChange={setActionFilter}
          onSupplierFilterChange={setSupplierFilter}
          onDateFilterChange={setDateFilter}
          onClearFilters={clearFilters}
        />

        <Card className="border-border bg-card" data-demo-target="activity-log">
          <CardHeader className="gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <CardTitle>Operations History</CardTitle>
              <CardDescription>
                Showing {filteredEntries.length} of {allEntries.length} order events.
              </CardDescription>
            </div>
            <p className="max-w-lg text-sm text-muted-foreground">
              Entries represent manager review actions. Live vendor submission is handled outside this screen.
            </p>
          </CardHeader>
          <CardContent>
            <ActivityLogTable entries={filteredEntries} onEntryClick={setSelectedEntry} />
          </CardContent>
        </Card>

        <ActivityDetailSheet
          entry={selectedEntry}
          open={selectedEntry !== null}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedEntry(null)
            }
          }}
        />
      </div>
    </div>
  )
}

function ActivityDetailSheet({
  entry,
  open,
  onOpenChange,
}: {
  entry: OrderActivityEntry | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="border-border bg-background sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Activity Detail</SheetTitle>
          <SheetDescription>
            Context for the selected Sonsie operations entry.
          </SheetDescription>
        </SheetHeader>
        {entry && (
          <div className="grid gap-4 p-4">
            <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
              <div>
                <p className="text-xs text-muted-foreground">Order</p>
                <p className="font-medium text-foreground">{entry.orderId}</p>
              </div>
              <ActivityTypeBadge type={entry.actionType} />
            </div>

            <DetailBlock label="Time" value={formatRelativeTime(entry.timestamp)} />
            <DetailBlock label="Supplier" value={entry.supplier} />
            <DetailBlock label="User" value={entry.user} />
            <DetailBlock label="Items" value={entry.items.join(", ")} />
            <DetailBlock label="Notes" value={entry.notes} />

            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-primary">
              Related order highlighting is available for review context. This does not submit a live vendor order.
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof ClipboardList
  label: string
  value: string | number
  tone: "primary" | "warning" | "success" | "secondary"
}) {
  const toneClass = {
    primary: "bg-primary/10 text-primary",
    warning: "bg-warning/10 text-warning",
    success: "bg-success/10 text-success",
    secondary: "bg-chart-2/10 text-chart-2",
  }[tone]

  return (
    <Card className="border-border bg-card">
      <CardContent className="flex items-center gap-3 p-4">
        <div className={`rounded-lg p-2.5 ${toneClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold text-foreground" data-typography="metric">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function DetailBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  )
}

function matchesDateFilter(timestamp: string, filter: string) {
  if (filter === "all") {
    return true
  }

  const eventDate = new Date(timestamp)
  const now = new Date("2026-04-13T12:00:00")

  if (filter === "today") {
    return eventDate.toDateString() === now.toDateString()
  }

  const days = filter === "30days" ? 30 : 7
  const lowerBound = new Date(now)
  lowerBound.setDate(now.getDate() - days)

  return eventDate >= lowerBound && eventDate <= now
}
