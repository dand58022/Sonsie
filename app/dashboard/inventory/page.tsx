"use client"

import { useCallback, useMemo, useState } from "react"
import { Header } from "@/components/dashboard/header"
import {
  InventoryCategoryTable,
  InventoryDetailDrawer,
  InventoryFilterBar,
  useInventory,
  type InventoryTableItem,
} from "@/components/inventory"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import {
  type InventoryItem,
} from "@/data/inventory"
import { getInventoryStatus, normalizeInventoryItemStatus } from "@/lib/operations"

export default function InventoryPage() {
  const { inventory, ingredients, supplies, tools, updateInventoryItem, addInventoryItem } = useInventory()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryTableItem | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [newItem, setNewItem] = useState({
    name: "",
    category: "ingredient" as InventoryItem['category'],
    quantity: 0,
    unit: "",
    parLevel: 0,
    reorderPoint: 0,
    supplier: "",
    unitCost: 0,
    leadTimeDays: 2,
  })

  const stableIngredients = useMemo(() => ingredients.map((item) => normalizeInventoryItemStatus(item)), [ingredients])
  const stableSupplies = useMemo(() => supplies.map((item) => normalizeInventoryItemStatus(item)), [supplies])
  const stableTools = useMemo(() => tools.map((item) => normalizeInventoryItemStatus(item)), [tools])

  const filterItems = (items: InventoryTableItem[]) => {
    return items.filter((item) => {
      const search = searchQuery.toLowerCase()
      const status = getInventoryStatus(item)
      const matchesSearch =
        item.name.toLowerCase().includes(search) ||
        item.supplier.toLowerCase().includes(search) ||
        item.unit.toLowerCase().includes(search) ||
        ("assignedArea" in item && item.assignedArea.toLowerCase().includes(search)) ||
        ("condition" in item && item.condition.toLowerCase().includes(search))
      const matchesStatus = statusFilter === "all" || status === statusFilter
      const matchesCategory =
        categoryFilter === "all" ||
        item.subcategory === categoryFilter ||
        (categoryFilter === "supply" && item.category === "supply") ||
        (categoryFilter === "tool" && item.category === "tool")
      return matchesSearch && matchesStatus && matchesCategory
    })
  }

  const handleOpenDetail = useCallback((item: InventoryTableItem) => {
    if (!item?.id) {
      return
    }

    setSelectedItem(item)
    setIsDetailOpen(true)
  }, [])

  const handleSaveItem = useCallback((updatedItem: InventoryTableItem) => {
    updateInventoryItem(updatedItem)
    setSelectedItem(normalizeInventoryItemStatus(updatedItem))
  }, [updateInventoryItem])

  const handleDetailOpenChange = useCallback((open: boolean) => {
    setIsDetailOpen(open)

    if (!open) {
      setSelectedItem(null)
    }
  }, [])

  const handleAddItem = () => {
    const baseItem: InventoryItem = {
      id: (inventory.length + 1).toString(),
      ...newItem,
      status: "In Stock",
      lastUpdated: new Date().toISOString(),
    }

    const newInventoryItem: InventoryTableItem =
      baseItem.category === "tool"
        ? {
            ...baseItem,
            category: "tool",
            condition: "Ready",
            assignedArea: "Kitchen",
          }
        : baseItem

    addInventoryItem(newInventoryItem)
    setIsAddDialogOpen(false)
    setNewItem({
      name: "",
      category: "ingredient",
      quantity: 0,
      unit: "",
      parLevel: 0,
      reorderPoint: 0,
      supplier: "",
      unitCost: 0,
      leadTimeDays: 2,
    })
  }

  return (
    <div className="flex flex-col">
      <Header title="Sonsie Inventory" subtitle="Track produce, raw bar, brick oven, bar, supplies, and tools" />
      <div className="flex-1 p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" data-demo-target="inventory-toolbar">
          <InventoryFilterBar
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            categoryFilter={categoryFilter}
            onSearchChange={setSearchQuery}
            onStatusFilterChange={setStatusFilter}
            onCategoryFilterChange={setCategoryFilter}
          />
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Add Inventory Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Item</DialogTitle>
                <DialogDescription>
                  Add a new Sonsie inventory item. Fill in the required fields.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Item Name</Label>
                  <Input
                    id="name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newItem.category}
                      onValueChange={(value: InventoryItem['category']) =>
                        setNewItem({ ...newItem, category: value })
                      }
                    >
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ingredient">Inventory</SelectItem>
                        <SelectItem value="supply">Supplies</SelectItem>
                        <SelectItem value="tool">Tools</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      value={newItem.unit}
                      onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                      placeholder="lbs, units, etc."
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="parLevel">Par Level</Label>
                    <Input
                      id="parLevel"
                      type="number"
                      value={newItem.parLevel}
                      onChange={(e) => setNewItem({ ...newItem, parLevel: parseInt(e.target.value) || 0 })}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="reorderPoint">Reorder Point</Label>
                    <Input
                      id="reorderPoint"
                      type="number"
                      value={newItem.reorderPoint}
                      onChange={(e) => setNewItem({ ...newItem, reorderPoint: parseInt(e.target.value) || 0 })}
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="supplier">Supplier</Label>
                    <Input
                      id="supplier"
                      value={newItem.supplier}
                      onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="unitCost">Unit Cost ($)</Label>
                    <Input
                      id="unitCost"
                      type="number"
                      step="0.01"
                      value={newItem.unitCost}
                      onChange={(e) => setNewItem({ ...newItem, unitCost: parseFloat(e.target.value) || 0 })}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="leadTimeDays">Lead Time (days)</Label>
                    <Input
                      id="leadTimeDays"
                      type="number"
                      min={0}
                      value={newItem.leadTimeDays}
                      onChange={(e) => setNewItem({ ...newItem, leadTimeDays: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddItem} disabled={!newItem.name || !newItem.unit}>
                  Add Item
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="ingredients" className="w-full">
          <TabsList className="mb-4 bg-secondary">
            <TabsTrigger value="ingredients" className="data-[state=active]:bg-background">
              Inventory ({filterItems(stableIngredients).length})
            </TabsTrigger>
            <TabsTrigger value="supplies" className="data-[state=active]:bg-background">
              Supplies ({filterItems(stableSupplies).length})
            </TabsTrigger>
            <TabsTrigger value="tools" className="data-[state=active]:bg-background">
              Tools ({filterItems(stableTools).length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="ingredients" data-demo-target="inventory-table">
            <InventoryCategoryTable
              kind="ingredients"
              items={stableIngredients}
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              onRowClick={handleOpenDetail}
            />
          </TabsContent>
          <TabsContent value="supplies">
            <InventoryCategoryTable
              kind="supplies"
              items={stableSupplies}
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              onRowClick={handleOpenDetail}
            />
          </TabsContent>
          <TabsContent value="tools">
            <InventoryCategoryTable
              kind="tools"
              items={stableTools}
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              onRowClick={handleOpenDetail}
            />
          </TabsContent>
        </Tabs>
        <InventoryDetailDrawer
          item={selectedItem}
          open={isDetailOpen}
          onOpenChange={handleDetailOpenChange}
          onSaveItem={handleSaveItem}
        />
      </div>
    </div>
  )
}
