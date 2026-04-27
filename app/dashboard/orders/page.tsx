"use client"

import { useMemo, useState } from "react"
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable, SortableHeader } from "@/components/data-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Plus, 
  Eye, 
  Send, 
  Check, 
  FileText,
  Truck,
  Package,
  Clock,
  Building2,
  ExternalLink
} from "lucide-react"
import { toast } from "sonner"
import { useOrders } from "@/components/orders"
import type { Order } from "@/data/orders"
import { getOrderBucket, type OrderBucket } from "@/lib/operations"
import { cn } from "@/lib/utils"

export default function OrdersPage() {
  const { orders, addOrder, updateOrder } = useOrders()
  const [sorting, setSorting] = useState<SortingState>([{ id: "createdAt", desc: true }])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false)
  const [newOrderSupplier, setNewOrderSupplier] = useState("Boston Seafood Co.")
  const [newOrderNotes, setNewOrderNotes] = useState("")

  const draftOrders = orders.filter(o => getOrderBucket(o) === 'Draft')
  const activeOrders = orders.filter(o => getOrderBucket(o) === 'Active')
  const receivedOrders = orders.filter(o => getOrderBucket(o) === 'Received')

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const getOrderBucketColor = (bucket: OrderBucket) => {
    switch (bucket) {
      case "Draft":
        return "bg-muted text-muted-foreground border-border"
      case "Active":
        return "bg-chart-2/10 text-chart-2 border-chart-2/20"
      case "Received":
        return "bg-success/10 text-success border-success/20"
    }
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailOpen(true)
  }

  const handleActivateOrder = (orderId: string) => {
    const order = orders.find((item) => item.id === orderId)

    updateOrder(orderId, (item) => ({
      ...item,
      status: 'Submitted' as const,
      expectedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    }))
    toast.success("Order marked active", {
      description: order ? `${order.orderNumber} is now in the active order queue.` : "Order state updated.",
    })
  }

  const handleReceiveOrder = (orderId: string) => {
    const order = orders.find((item) => item.id === orderId)

    updateOrder(orderId, (item) => ({
      ...item,
      status: 'Received' as const,
      receivedAt: new Date().toISOString(),
    }))
    setIsDetailOpen(false)
    toast.success("Order received", {
      description: order ? `${order.orderNumber} was marked received.` : "Order state updated.",
    })
  }

  const handleCreateDraftOrder = () => {
    const draftOrder: Order = {
      id: `draft-${Date.now()}`,
      orderNumber: `DRAFT-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}`,
      supplier: newOrderSupplier,
      status: "Draft",
      items: [],
      totalCost: 0,
      createdAt: new Date().toISOString(),
    }

    addOrder(draftOrder)
    setNewOrderNotes("")
    setIsNewOrderOpen(false)
    toast.success("Draft order created", {
      description: `${newOrderSupplier} draft is ready for line items.`,
    })
  }

  const orderColumns = useMemo<ColumnDef<Order>[]>(
    () => [
      {
        accessorKey: "orderNumber",
        header: ({ column }) => <SortableHeader column={column}>Order #</SortableHeader>,
        cell: ({ row }) => <span className="font-medium text-foreground">{row.original.orderNumber}</span>,
      },
      {
        accessorKey: "supplier",
        header: ({ column }) => <SortableHeader column={column}>Supplier</SortableHeader>,
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.supplier}</span>,
      },
      {
        id: "items",
        accessorFn: (row) => row.items.length,
        header: ({ column }) => <SortableHeader column={column}>Items</SortableHeader>,
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.items.length} items</span>,
      },
      {
        accessorKey: "totalCost",
        header: ({ column }) => <SortableHeader column={column}>Total</SortableHeader>,
        cell: ({ row }) => <span className="font-medium text-foreground">${row.original.totalCost.toFixed(2)}</span>,
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => <SortableHeader column={column}>Date</SortableHeader>,
        cell: ({ row }) => <span className="text-muted-foreground">{formatDate(row.original.createdAt)}</span>,
      },
      {
        accessorKey: "status",
        header: ({ column }) => <SortableHeader column={column}>Status</SortableHeader>,
        cell: ({ row }) => (
          <Badge variant="outline" className={cn("font-medium", getOrderBucketColor(getOrderBucket(row.original)))}>
            {getOrderBucket(row.original)}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        meta: { headerClassName: "w-24", cellClassName: "w-24" },
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleViewOrder(row.original)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            {getOrderBucket(row.original) === 'Draft' && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary"
                onClick={() => handleActivateOrder(row.original.id)}
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
            {getOrderBucket(row.original) === 'Active' && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary"
                onClick={() => handleReceiveOrder(row.original.id)}
              >
                <Check className="h-4 w-4" />
              </Button>
            )}
          </div>
        ),
      },
    ],
    [orders],
  )

  const OrdersTable = ({ orderList }: { orderList: Order[] }) => {
    const table = useReactTable({
      data: orderList,
      columns: orderColumns,
      state: { sorting },
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
    })

    return <DataTable table={table} emptyMessage="No orders found." />
  }

  return (
    <div className="flex flex-col">
      <Header title="Vendor Orders" subtitle="Review draft, active, and received mock vendor orders" />
      <div className="flex-1 p-6">
        {/* Summary Cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-4">
          <Card className="border-border bg-card">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-muted p-2.5">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Draft Orders</p>
                <p className="text-2xl font-semibold text-foreground" data-typography="metric">{draftOrders.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-chart-2/10 p-2.5">
                <Send className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Orders</p>
                <p className="text-2xl font-semibold text-foreground" data-typography="metric">{activeOrders.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <Check className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Received</p>
                <p className="text-2xl font-semibold text-foreground" data-typography="metric">{receivedOrders.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-chart-3/10 p-2.5">
                <Truck className="h-5 w-5 text-chart-3" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Open Suppliers</p>
                <p className="text-2xl font-semibold text-foreground" data-typography="metric">
                  {new Set(activeOrders.map((order) => order.supplier)).size}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Tabs */}
        <Card className="border-border bg-card" data-demo-target="orders-table">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle>Purchase Orders</CardTitle>
                  <CardDescription>View and manage all mock vendor orders</CardDescription>
            </div>
            <Dialog open={isNewOrderOpen} onOpenChange={setIsNewOrderOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Order
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Order</DialogTitle>
                  <DialogDescription>
                    Start a new purchase order. You can add items from the reorder recommendations page.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Supplier</Label>
                    <Select value={newOrderSupplier} onValueChange={setNewOrderSupplier}>
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Boston Seafood Co.">Boston Seafood Co.</SelectItem>
                        <SelectItem value="Back Bay Produce">Back Bay Produce</SelectItem>
                        <SelectItem value="New England Dairy & Cheese">New England Dairy & Cheese</SelectItem>
                        <SelectItem value="Artisan Bread & Dough">Artisan Bread & Dough</SelectItem>
                        <SelectItem value="Beverage & Wine Distributor">Beverage & Wine Distributor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Notes</Label>
                    <Input
                      value={newOrderNotes}
                      onChange={(event) => setNewOrderNotes(event.target.value)}
                      placeholder="Optional notes for this order"
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewOrderOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateDraftOrder}>Create Draft</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4 bg-secondary">
                <TabsTrigger value="all" className="data-[state=active]:bg-background">
                  All ({orders.length})
                </TabsTrigger>
                <TabsTrigger value="draft" className="data-[state=active]:bg-background">
                  Draft ({draftOrders.length})
                </TabsTrigger>
                <TabsTrigger value="active" className="data-[state=active]:bg-background">
                  Active ({activeOrders.length})
                </TabsTrigger>
                <TabsTrigger value="received" className="data-[state=active]:bg-background">
                  Received ({receivedOrders.length})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <OrdersTable orderList={orders} />
              </TabsContent>
              <TabsContent value="draft">
                <OrdersTable orderList={draftOrders} />
              </TabsContent>
              <TabsContent value="active">
                <OrdersTable orderList={activeOrders} />
              </TabsContent>
              <TabsContent value="received">
                <OrdersTable orderList={receivedOrders} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Supplier Integration */}
        <Card className="mt-6 border-border bg-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-chart-2/10 p-2.5">
                  <Building2 className="h-5 w-5 text-chart-2" />
                </div>
                <div>
                  <CardTitle>Vendor Integration</CardTitle>
                  <CardDescription>Vendor connections are managed by operations</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
                Review only
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-4">
              <div>
                <p className="text-sm text-foreground">Vendor review workflow</p>
                <p className="text-xs text-muted-foreground">Draft order prep stays in manager review until operations submits it.</p>
              </div>
              <Button variant="outline" size="sm" disabled>
                <ExternalLink className="mr-2 h-4 w-4" />
                Supplier setup later
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Detail Sheet */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          {selectedOrder && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3">
                  {selectedOrder.orderNumber}
                  <Badge variant="outline" className={cn("font-medium", getOrderBucketColor(getOrderBucket(selectedOrder)))}>
                    {getOrderBucket(selectedOrder)}
                  </Badge>
                </SheetTitle>
                <SheetDescription>
                  Order details and line items
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="grid gap-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-secondary p-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Supplier</p>
                      <p className="font-medium text-foreground">{selectedOrder.supplier}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-secondary p-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Created</p>
                      <p className="font-medium text-foreground">
                        {formatDate(selectedOrder.createdAt)} at {formatTime(selectedOrder.createdAt)}
                      </p>
                    </div>
                  </div>
                  {selectedOrder.expectedDelivery && (
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-secondary p-2">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Expected Delivery</p>
                        <p className="font-medium text-foreground">{formatDate(selectedOrder.expectedDelivery)}</p>
                      </div>
                    </div>
                  )}
                  {selectedOrder.receivedAt && (
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Received</p>
                        <p className="font-medium text-foreground">
                          {formatDate(selectedOrder.receivedAt)} at {formatTime(selectedOrder.receivedAt)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="mb-3 font-medium text-foreground">Order Items</h4>
                  <div className="rounded-lg border border-border">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                          <TableHead className="text-muted-foreground">Item</TableHead>
                          <TableHead className="text-muted-foreground text-right">Qty</TableHead>
                          <TableHead className="text-muted-foreground text-right">Price</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.items.length > 0 ? (
                          selectedOrder.items.map((item, index) => (
                            <TableRow key={index} className="border-border">
                              <TableCell className="text-foreground">{item.name}</TableCell>
                              <TableCell className="text-right text-muted-foreground">{item.quantity}</TableCell>
                              <TableCell className="text-right text-foreground">
                                ${(item.quantity * item.unitCost).toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow className="border-border">
                            <TableCell colSpan={3} className="py-6 text-center text-sm text-muted-foreground">
                              No line items yet. Add recommendations from the Reorder page before supplier review.
                            </TableCell>
                          </TableRow>
                        )}
                        <TableRow className="border-border bg-secondary/50">
                          <TableCell colSpan={2} className="font-medium text-foreground">Total</TableCell>
                          <TableCell className="text-right font-bold text-foreground">
                            ${selectedOrder.totalCost.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="flex gap-3">
                  {getOrderBucket(selectedOrder) === 'Draft' && (
                    <Button 
                      className="flex-1" 
                      onClick={() => {
                        handleActivateOrder(selectedOrder.id)
                        setIsDetailOpen(false)
                      }}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Mark Active
                    </Button>
                  )}
                  {getOrderBucket(selectedOrder) === 'Active' && (
                    <Button 
                      className="flex-1"
                      onClick={() => handleReceiveOrder(selectedOrder.id)}
                    >
                      <Package className="mr-2 h-4 w-4" />
                      Mark as Received
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
