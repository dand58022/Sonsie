"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { ArrowLeft, Save, Package, TrendingUp, Calendar, Building2 } from "lucide-react"
import {
  getInventoryCategoryLabel,
  getStatusColor,
  itemUsageHistoryData,
  mockAuditLogs,
  mockInventory,
  relatedMenuItemUsage,
} from "@/data/inventory"
import { cn } from "@/lib/utils"

export default function ItemDetailPage() {
  const params = useParams()
  const router = useRouter()
  const item = mockInventory.find((i) => i.id === params.id)
  
  const [isEditing, setIsEditing] = useState(false)
  const [editedItem, setEditedItem] = useState(item)

  if (!item || !editedItem) {
    return (
      <div className="flex flex-col">
        <Header title="Item Not Found" />
        <div className="flex-1 p-6">
          <p className="text-muted-foreground">The requested item could not be found.</p>
          <Link href="/dashboard/inventory">
            <Button className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Inventory
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const itemAuditLogs = mockAuditLogs.filter(log => 
    log.itemName.toLowerCase().includes(item.name.toLowerCase().split(' ')[0])
  )

  const handleSave = () => {
    setIsEditing(false)
    // In a real app, this would save to the backend
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="flex flex-col">
      <Header title={item.name} subtitle={`${getInventoryCategoryLabel(item.category)} - ${item.supplier}`} />
      <div className="flex-1 p-6">
        <div className="mb-6">
          <Link href="/dashboard/inventory">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Inventory
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Item Summary Card */}
          <Card className="border-border bg-card lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold text-foreground">Item Details</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={cn("font-medium", getStatusColor(item.status))}>
                  {item.status}
                </Badge>
                {isEditing ? (
                  <Button onClick={handleSave} size="sm">
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                ) : (
                  <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Item Name</Label>
                  {isEditing ? (
                    <Input
                      value={editedItem.name}
                      onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
                      className="bg-secondary border-border"
                    />
                  ) : (
                    <p className="text-foreground font-medium">{item.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Category</Label>
                  {isEditing ? (
                    <Select
                      value={editedItem.category}
                      onValueChange={(value: typeof item.category) =>
                        setEditedItem({ ...editedItem, category: value })
                      }
                    >
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ingredient">Ingredients</SelectItem>
                        <SelectItem value="supply">Supplies</SelectItem>
                        <SelectItem value="tool">Tools</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-foreground">{getInventoryCategoryLabel(item.category)}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Supplier</Label>
                  {isEditing ? (
                    <Input
                      value={editedItem.supplier}
                      onChange={(e) => setEditedItem({ ...editedItem, supplier: e.target.value })}
                      className="bg-secondary border-border"
                    />
                  ) : (
                    <p className="text-foreground">{item.supplier}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Unit Cost</Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      step="0.01"
                      value={editedItem.unitCost}
                      onChange={(e) => setEditedItem({ ...editedItem, unitCost: parseFloat(e.target.value) })}
                      className="bg-secondary border-border"
                    />
                  ) : (
                    <p className="text-foreground">${item.unitCost.toFixed(2)}</p>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Current Quantity</Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editedItem.quantity}
                      onChange={(e) => setEditedItem({ ...editedItem, quantity: parseInt(e.target.value) })}
                      className="bg-secondary border-border"
                    />
                  ) : (
                    <p className="text-foreground font-medium">{item.quantity} {item.unit}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Par Level</Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editedItem.parLevel}
                      onChange={(e) => setEditedItem({ ...editedItem, parLevel: parseInt(e.target.value) })}
                      className="bg-secondary border-border"
                    />
                  ) : (
                    <p className="text-foreground">{item.parLevel} {item.unit}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Reorder Point</Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editedItem.reorderPoint}
                      onChange={(e) => setEditedItem({ ...editedItem, reorderPoint: parseInt(e.target.value) })}
                      className="bg-secondary border-border"
                    />
                  ) : (
                    <p className="text-foreground">{item.reorderPoint} {item.unit}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Last Updated</Label>
                  <p className="text-foreground">{formatDate(item.lastUpdated)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="space-y-6">
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2.5">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Value</p>
                    <p className="text-xl font-semibold text-foreground">
                      ${(item.quantity * item.unitCost).toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-chart-2/10 p-2.5">
                    <TrendingUp className="h-5 w-5 text-chart-2" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Daily Usage</p>
                    <p className="text-xl font-semibold text-foreground">19.5 {item.unit}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-chart-3/10 p-2.5">
                    <Calendar className="h-5 w-5 text-chart-3" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Days Until Reorder</p>
                    <p className="text-xl font-semibold text-foreground">
                      {Math.max(0, Math.floor((item.quantity - item.reorderPoint) / 19.5))} days
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-chart-4/10 p-2.5">
                    <Building2 className="h-5 w-5 text-chart-4" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Supplier</p>
                    <p className="text-lg font-semibold text-foreground">{item.supplier}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Usage History Chart */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-foreground">Usage History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={itemUsageHistoryData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0 0)" vertical={false} />
                    <XAxis
                      dataKey="date"
                      stroke="oklch(0.65 0 0)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="oklch(0.65 0 0)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(0.13 0 0)",
                        border: "1px solid oklch(0.22 0 0)",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "oklch(0.95 0 0)" }}
                      itemStyle={{ color: "oklch(0.65 0.2 145)" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="usage"
                      stroke="oklch(0.65 0.2 145)"
                      strokeWidth={2}
                      dot={{ fill: "oklch(0.65 0.2 145)", strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: "oklch(0.65 0.2 145)" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Related Menu Items */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-foreground">Menu Item Relationships</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Menu Item</TableHead>
                    <TableHead className="text-muted-foreground text-right">Usage per Serving</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {relatedMenuItemUsage.map((related, index) => (
                    <TableRow key={index} className="border-border">
                      <TableCell className="text-foreground">{related.name}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{related.usage}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Audit Log */}
        <Card className="mt-6 border-border bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-foreground">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">User</TableHead>
                  <TableHead className="text-muted-foreground">Action</TableHead>
                  <TableHead className="text-muted-foreground">Old Value</TableHead>
                  <TableHead className="text-muted-foreground">New Value</TableHead>
                  <TableHead className="text-muted-foreground">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itemAuditLogs.length > 0 ? itemAuditLogs.map((log) => (
                  <TableRow key={log.id} className="border-border">
                    <TableCell className="text-foreground">{log.user}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-secondary text-secondary-foreground">
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{log.oldValue}</TableCell>
                    <TableCell className="text-muted-foreground">{log.newValue}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{formatDate(log.timestamp)}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No recent activity for this item
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
