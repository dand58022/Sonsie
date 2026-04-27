"use client"

import { useEffect, useMemo, useState } from "react"
import { useTheme } from "next-themes"
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable, SortableHeader } from "@/components/data-table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Users,
  Building2,
  Plug,
  Settings,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Shield,
  Bell,
  Moon,
} from "lucide-react"
import { mockUsers, type User } from "@/data/restaurant-context"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [userSorting, setUserSorting] = useState<SortingState>([{ id: "role", desc: false }])
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Staff' as User['role'], location: 'Back Bay / Newbury Street' })

  // Preferences state
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    lowStockAlerts: true,
    orderUpdates: true,
    dailyReport: false,
    autoRefresh: true,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleAddUser = () => {
    const user: User = {
      id: (users.length + 1).toString(),
      ...newUser,
    }
    setUsers([...users, user])
    setIsAddUserOpen(false)
    setNewUser({ name: '', email: '', role: 'Staff', location: 'Main Dining Room' })
  }

  const getRoleBadgeColor = (role: User['role']) => {
    switch (role) {
      case 'Admin':
        return 'bg-primary/10 text-primary border-primary/20'
      case 'Manager':
        return 'bg-chart-2/10 text-chart-2 border-chart-2/20'
      case 'Staff':
        return 'bg-muted text-muted-foreground border-border'
    }
  }

  const userColumns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => <SortableHeader column={column}>Name</SortableHeader>,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
              {row.original.name.split(' ').map(n => n[0]).join('')}
            </div>
            <span className="font-medium text-foreground">{row.original.name}</span>
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: ({ column }) => <SortableHeader column={column}>Email</SortableHeader>,
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.email}</span>,
      },
      {
        accessorKey: "role",
        header: ({ column }) => <SortableHeader column={column}>Role</SortableHeader>,
        cell: ({ row }) => (
          <Badge variant="outline" className={cn("font-medium", getRoleBadgeColor(row.original.role))}>
            {row.original.role === 'Admin' && <Shield className="mr-1 h-3 w-3" />}
            {row.original.role}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        meta: { headerClassName: "w-24", cellClassName: "w-24" },
        enableSorting: false,
        cell: () => (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled title="Managed by operations">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" disabled title="Managed by operations">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [],
  )

  const usersTable = useReactTable({
    data: users,
    columns: userColumns,
    state: { sorting: userSorting },
    onSortingChange: setUserSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="flex flex-col">
      <Header title="Settings" subtitle="Manage Sonsie users, theme, and mock integration preferences" />
      <div className="flex-1 p-6">
        <Tabs defaultValue="users" className="space-y-6" data-demo-target="settings-overview">
          <TabsList className="bg-secondary">
            <TabsTrigger value="users" className="data-[state=active]:bg-background">
              <Users className="mr-2 h-4 w-4" />
              User Roles
            </TabsTrigger>
            <TabsTrigger value="integrations" className="data-[state=active]:bg-background">
              <Plug className="mr-2 h-4 w-4" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:bg-background">
              <Settings className="mr-2 h-4 w-4" />
              Preferences
            </TabsTrigger>
          </TabsList>

          {/* User Roles Tab */}
          <TabsContent value="users">
            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage the Sonsie team and restaurant-level access</CardDescription>
                </div>
                <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                      <DialogDescription>
                        Create a new user account with role-based access.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label>Full Name</Label>
                        <Input
                          value={newUser.name}
                          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                          className="bg-secondary border-border"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                          className="bg-secondary border-border"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Role</Label>
                        <Select
                          value={newUser.role}
                          onValueChange={(value: User['role']) => setNewUser({ ...newUser, role: value })}
                        >
                          <SelectTrigger className="bg-secondary border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Manager">Manager</SelectItem>
                            <SelectItem value="Staff">Staff</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>Cancel</Button>
                      <Button onClick={handleAddUser} disabled={!newUser.name || !newUser.email}>Add User</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <DataTable table={usersTable} emptyMessage="No users found." />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Vendor Integration */}
              <Card className="border-border bg-card">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-chart-2/10 p-2.5">
                        <Building2 className="h-5 w-5 text-chart-2" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Restaurant Name</CardTitle>
                        <CardDescription>Sonsie</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
                      Planned
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-secondary/50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">Concept</p>
                        <p className="text-sm text-muted-foreground">American Bistro & Wine Bar</p>
                      </div>
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">Warm Bistro</Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Location</Label>
                      <span className="text-sm text-muted-foreground">Back Bay / Newbury Street</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Default Service Periods</Label>
                      <span className="text-sm text-muted-foreground">Brunch, Lunch, Light Fare, Dinner, Bar</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border pt-4">
                  <Button variant="outline" className="w-full" disabled>Branding locked for demo</Button>
                </CardFooter>
              </Card>

              {/* DeepSeek Integration */}
              <Card className="border-border bg-card">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-chart-4/10 p-2.5">
                        <Plug className="h-5 w-5 text-chart-4" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Future Forecast Assistant</CardTitle>
                        <CardDescription>Future forecast review configuration</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
                      Not set up
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Forecast assistant setup is reserved for approved operations configuration.
                  </p>
                  <div className="grid gap-3">
                    <div className="grid gap-2">
                      <Label>API Key</Label>
                      <Input
                        type="password"
                        placeholder="API key"
                        className="bg-secondary border-border"
                        disabled
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border pt-4">
                  <Button className="w-full" disabled>
                    Setup later
                  </Button>
                </CardFooter>
              </Card>

              {/* US Foods Integration */}
              <Card className="border-border bg-card">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-chart-3/10 p-2.5">
                        <Building2 className="h-5 w-5 text-chart-3" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Vendor Accounts</CardTitle>
                        <CardDescription>Supplier review placeholders</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
                      Not set up
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Vendor account setup is managed by operations before supplier sync is enabled.
                  </p>
                </CardContent>
                <CardFooter className="border-t border-border pt-4">
                  <Button variant="outline" className="w-full" disabled>
                    Setup later
                  </Button>
                </CardFooter>
              </Card>

              {/* POS Integration */}
              <Card className="border-border bg-card">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-chart-5/10 p-2.5">
                        <Plug className="h-5 w-5 text-chart-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">POS System</CardTitle>
                        <CardDescription>Point of sale integration</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
                      Planned
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    POS ingestion is managed through approved operations workflows. CSV import remains available for order history review.
                  </p>
                </CardContent>
                <CardFooter className="border-t border-border pt-4">
                  <Button variant="outline" className="w-full" disabled>
                    Setup later
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-border bg-card">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notifications
                  </CardTitle>
                  <CardDescription>Configure how you receive alerts and updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-foreground">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                    <Switch
                      checked={preferences.emailNotifications}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, emailNotifications: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-foreground">Low Stock Alerts</Label>
                      <p className="text-sm text-muted-foreground">Get notified when items are low</p>
                    </div>
                    <Switch
                      checked={preferences.lowStockAlerts}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, lowStockAlerts: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-foreground">Order Updates</Label>
                      <p className="text-sm text-muted-foreground">Track order status changes</p>
                    </div>
                    <Switch
                      checked={preferences.orderUpdates}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, orderUpdates: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-foreground">Daily Report</Label>
                      <p className="text-sm text-muted-foreground">Receive daily inventory summary</p>
                    </div>
                    <Switch
                      checked={preferences.dailyReport}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, dailyReport: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Display
                  </CardTitle>
                  <CardDescription>Customize your dashboard appearance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Moon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label className="text-foreground">Dark Mode</Label>
                        <p className="text-sm text-muted-foreground">Use dark theme</p>
                      </div>
                    </div>
                    <Switch
                      checked={mounted && resolvedTheme === "dark"}
                      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                      disabled={!mounted}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-foreground">Auto-Refresh Data</Label>
                      <p className="text-sm text-muted-foreground">Update dashboard every 5 minutes</p>
                    </div>
                    <Switch
                      checked={preferences.autoRefresh}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, autoRefresh: checked })}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
