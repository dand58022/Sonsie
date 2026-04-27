"use client"

import { useMemo, useState } from "react"
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DataTable, SortableHeader } from "@/components/data-table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Search, 
  Download,
  Filter,
  Calendar,
  User,
  FileText,
  Pencil,
  Trash2,
  Upload,
  ArrowDownToLine
} from "lucide-react"
import { toast } from "sonner"
import { extendedAuditLogs, type AuditLog } from "@/data/activity"
import { formatRelativeTime } from "@/lib/operations"
import { cn } from "@/lib/utils"

export default function AuditPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [actionFilter, setActionFilter] = useState<string>("all")
  const [userFilter, setUserFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("7days")
  const [sorting, setSorting] = useState<SortingState>([{ id: "timestamp", desc: true }])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const getActionIcon = (action: AuditLog['action']) => {
    switch (action) {
      case 'Create':
        return <FileText className="h-4 w-4" />
      case 'Update':
        return <Pencil className="h-4 w-4" />
      case 'Delete':
        return <Trash2 className="h-4 w-4" />
      case 'Import':
        return <Upload className="h-4 w-4" />
      case 'Export':
        return <ArrowDownToLine className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getActionColor = (action: AuditLog['action']) => {
    switch (action) {
      case 'Create':
        return 'bg-primary/10 text-primary border-primary/20'
      case 'Update':
        return 'bg-chart-2/10 text-chart-2 border-chart-2/20'
      case 'Delete':
        return 'bg-destructive/10 text-destructive border-destructive/20'
      case 'Import':
        return 'bg-chart-3/10 text-chart-3 border-chart-3/20'
      case 'Export':
        return 'bg-chart-4/10 text-chart-4 border-chart-4/20'
      default:
        return 'bg-muted text-muted-foreground border-border'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const filteredLogs = extendedAuditLogs.filter(log => {
    const matchesSearch = 
      log.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesAction = actionFilter === "all" || log.action === actionFilter
    const matchesUser = userFilter === "all" || log.user === userFilter
    return matchesSearch && matchesAction && matchesUser
  })

  const actionCounts = {
    total: extendedAuditLogs.length,
    create: extendedAuditLogs.filter(l => l.action === 'Create').length,
    update: extendedAuditLogs.filter(l => l.action === 'Update').length,
    delete: extendedAuditLogs.filter(l => l.action === 'Delete').length,
    import: extendedAuditLogs.filter(l => l.action === 'Import').length,
    export: extendedAuditLogs.filter(l => l.action === 'Export').length,
  }

  const uniqueUsers = [...new Set(extendedAuditLogs.map(l => l.user))]

  const columns = useMemo<ColumnDef<AuditLog>[]>(
    () => [
      {
        accessorKey: "timestamp",
        header: ({ column }) => <SortableHeader column={column}>Timestamp</SortableHeader>,
        cell: ({ row }) => (
          <div>
            <p className="text-sm text-foreground">{formatRelativeTime(row.original.timestamp)}</p>
            <p className="text-xs text-muted-foreground">{formatDate(row.original.timestamp)}</p>
          </div>
        ),
      },
      {
        accessorKey: "user",
        header: ({ column }) => <SortableHeader column={column}>User</SortableHeader>,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-medium text-foreground">
              {row.original.user.split(' ').map(n => n[0]).join('')}
            </div>
            <span className="text-foreground">{row.original.user}</span>
          </div>
        ),
      },
      {
        accessorKey: "action",
        header: ({ column }) => <SortableHeader column={column}>Action</SortableHeader>,
        cell: ({ row }) => (
          <Badge variant="outline" className={cn("font-medium", getActionColor(row.original.action))}>
            <span className="mr-1">{getActionIcon(row.original.action)}</span>
            {row.original.action}
          </Badge>
        ),
      },
      {
        accessorKey: "itemName",
        header: ({ column }) => <SortableHeader column={column}>Item</SortableHeader>,
        cell: ({ row }) => <span className="font-medium text-foreground">{row.original.itemName}</span>,
      },
      {
        accessorKey: "oldValue",
        header: "Old Value",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.oldValue === '-' ? <span className="text-muted-foreground/50">-</span> : row.original.oldValue}
          </span>
        ),
      },
      {
        accessorKey: "newValue",
        header: "New Value",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.newValue === '-' ? <span className="text-muted-foreground/50">-</span> : row.original.newValue}
          </span>
        ),
      },
    ],
    [],
  )

  const table = useReactTable({
    data: filteredLogs,
    columns,
    state: {
      columnFilters,
      sorting,
    },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="flex flex-col">
      <Header title="Audit Log" subtitle="Track all inventory changes and system activity" />
      <div className="flex-1 p-6">
        {/* Summary Cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-5">
          <Card className="border-border bg-card">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-semibold text-foreground" data-typography="metric">{actionCounts.total}</p>
              <p className="text-sm text-muted-foreground">Total Actions</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-semibold text-primary" data-typography="metric">{actionCounts.create}</p>
              <p className="text-sm text-muted-foreground">Created</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-semibold text-chart-2" data-typography="metric">{actionCounts.update}</p>
              <p className="text-sm text-muted-foreground">Updated</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-semibold text-destructive" data-typography="metric">{actionCounts.delete}</p>
              <p className="text-sm text-muted-foreground">Deleted</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-semibold text-chart-3" data-typography="metric">{actionCounts.import + actionCounts.export}</p>
              <p className="text-sm text-muted-foreground">Import/Export</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6 border-border bg-card">
          <CardContent className="flex flex-wrap items-center gap-4 p-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by item or user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-secondary border-border"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-36 bg-secondary border-border">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="Create">Create</SelectItem>
                <SelectItem value="Update">Update</SelectItem>
                <SelectItem value="Delete">Delete</SelectItem>
                <SelectItem value="Import">Import</SelectItem>
                <SelectItem value="Export">Export</SelectItem>
              </SelectContent>
            </Select>
            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger className="w-40 bg-secondary border-border">
                <User className="mr-2 h-4 w-4" />
                <SelectValue placeholder="User" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {uniqueUsers.map(user => (
                  <SelectItem key={user} value={user}>{user}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-40 bg-secondary border-border">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() =>
                toast("Export queued", {
                  description: "Audit export is queued for manager review.",
                })
              }
            >
              <Download className="mr-2 h-4 w-4" />
              Export Log
            </Button>
          </CardContent>
        </Card>

        {/* Audit Log Table */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-4">
            <CardTitle>Activity History</CardTitle>
            <CardDescription>
              Showing {filteredLogs.length} of {extendedAuditLogs.length} entries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable table={table} emptyMessage="No audit entries found matching your filters." />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
