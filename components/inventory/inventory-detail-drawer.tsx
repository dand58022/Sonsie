"use client"

import { useEffect, useState } from "react"
import { Boxes, ClipboardList, MapPinned, X } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  getInventoryDetailMetadata,
  getInventoryStockHistory,
  getInventorySubcategoryLabel,
  type InventoryStockHistoryEntry,
  type ToolInventoryItem,
} from "@/data/inventory"
import { getInventoryStatus, normalizeInventoryItemStatus } from "@/lib/operations"

import { InventoryStatusBadge } from "./inventory-status-badge"
import type { InventoryTableItem } from "./inventory-category-table"

interface InventoryDetailDrawerProps {
  item: InventoryTableItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaveItem?: (item: InventoryTableItem) => void
}

function isToolInventoryItem(item: InventoryTableItem): item is ToolInventoryItem {
  return item.category === "tool" && "condition" in item
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function DetailField({
  label,
  value,
  type = "text",
  min,
  step,
  onChange,
}: {
  label: string
  value: string | number
  type?: "text" | "number"
  min?: number
  step?: number
  onChange?: (value: string) => void
}) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input
        readOnly={!onChange}
        type={type}
        min={min}
        step={step}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className="h-9 bg-secondary/70 text-sm read-only:cursor-default"
      />
    </div>
  )
}

function DetailSection({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Boxes
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="grid gap-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      {children}
    </section>
  )
}

function HistoryRow({ entry }: { entry: InventoryStockHistoryEntry }) {
  const sign = entry.change > 0 ? "+" : ""

  return (
    <div className="grid gap-1 rounded-md border border-border bg-secondary/30 p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-medium text-foreground">{entry.action}</div>
        <div className="text-xs text-muted-foreground">{formatDate(entry.timestamp)}</div>
      </div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-muted-foreground">{entry.note}</span>
        <span className="whitespace-nowrap font-medium">
          {sign}
          {entry.change} {entry.unit}
        </span>
      </div>
      <div className="text-xs text-muted-foreground">
        {entry.user} | Result: {entry.resultingQuantity.toLocaleString()} {entry.unit}
      </div>
    </div>
  )
}

export function InventoryDetailDrawer({ item, open, onOpenChange, onSaveItem }: InventoryDetailDrawerProps) {
  const [draftItem, setDraftItem] = useState<InventoryTableItem | null>(item)
  const activeItem = draftItem ?? item
  const metadata = activeItem ? getInventoryDetailMetadata(activeItem.id) : null
  const stockHistory = activeItem ? getInventoryStockHistory(activeItem.id) : []
  const selectedItemId = item?.id ?? null

  useEffect(() => {
    if (open) {
      setDraftItem(item ? { ...item } : null)
    } else {
      setDraftItem(null)
    }
  }, [open, selectedItemId, item])

  const updateDraft = <TKey extends keyof InventoryTableItem>(key: TKey, value: InventoryTableItem[TKey]) => {
    setDraftItem((current) => (current ? { ...current, [key]: value } : current))
  }

  const updateNumber = (key: "quantity" | "parLevel" | "reorderPoint" | "unitCost" | "leadTimeDays", value: string) => {
    const parsedValue = Number(value)

    if (!Number.isFinite(parsedValue)) {
      return
    }

    setDraftItem((current) => (current ? { ...current, [key]: Math.max(0, parsedValue) } : current))
  }

  const handleSave = () => {
    if (!draftItem) {
      toast.error("Item could not be saved", {
        description: "Select an inventory item and try again.",
      })
      return
    }

    const normalizedItem = normalizeInventoryItemStatus({
      ...draftItem,
      unitCost: Math.max(0, Number(draftItem.unitCost) || 0),
      leadTimeDays: Math.max(0, Number(draftItem.leadTimeDays ?? 2) || 0),
      lastUpdated: new Date().toISOString(),
    })

    setDraftItem(normalizedItem)
    onSaveItem?.(normalizedItem)
    onOpenChange(false)
    toast.success("Inventory item updated", {
      description: `${draftItem.name} changes were applied.`,
    })
  }

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm" data-row-click-ignore="true">
      <div className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col overflow-y-auto border-l border-border bg-card shadow-2xl">
        {!item ? (
          <div className="grid h-full place-items-center px-6 text-center">
            <div className="max-w-sm rounded-lg border border-dashed border-border p-6">
              <p className="font-medium text-foreground">Loading item detail</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Select an inventory row to open stock controls.
              </p>
            </div>
          </div>
        ) : activeItem && metadata ? (
          <>
            <div className="border-b border-border px-5 py-4">
              <div className="flex items-start justify-between gap-4 pr-10">
                <div className="grid gap-1">
                  <h2 className="text-lg font-semibold text-foreground">{activeItem.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {activeItem.category === "ingredient"
                      ? getInventorySubcategoryLabel(activeItem.subcategory)
                      : activeItem.category === "supply"
                        ? "Service supply"
                        : "Kitchen tool"}{" "}
                    | {activeItem.supplier}
                  </p>
                </div>
                <InventoryStatusBadge status={getInventoryStatus(activeItem)} />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-3 top-3 h-8 w-8"
                onClick={() => onOpenChange(false)}
                aria-label="Close inventory detail"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-6 px-5 pb-6">
              <div data-demo-target="inventory-detail-count-editor">
                <DetailSection icon={Boxes} title="Count Summary">
                  <div className="grid grid-cols-2 gap-3">
                    <DetailField
                      label={activeItem.category === "tool" ? "Quantity" : "Quantity on hand"}
                      value={activeItem.quantity}
                      type="number"
                      min={0}
                      onChange={(value) => updateNumber("quantity", value)}
                    />
                    <DetailField label="Unit" value={activeItem.unit} onChange={(value) => updateDraft("unit", value)} />
                    <DetailField
                      label="Par level"
                      value={activeItem.parLevel}
                      type="number"
                      min={0}
                      onChange={(value) => updateNumber("parLevel", value)}
                    />
                    <DetailField
                      label="Reorder point"
                      value={activeItem.reorderPoint}
                      type="number"
                      min={0}
                      onChange={(value) => updateNumber("reorderPoint", value)}
                    />
                    <DetailField label="Vendor" value={activeItem.supplier} onChange={(value) => updateDraft("supplier", value)} />
                    <DetailField
                      label="Unit price"
                      value={activeItem.unitCost}
                      type="number"
                      min={0}
                      step={0.01}
                      onChange={(value) => updateNumber("unitCost", value)}
                    />
                    <DetailField
                      label="Lead time days"
                      value={activeItem.leadTimeDays ?? 2}
                      type="number"
                      min={0}
                      onChange={(value) => updateNumber("leadTimeDays", value)}
                    />
                    <div className="grid gap-1.5">
                      <Label className="text-xs text-muted-foreground">Stock status</Label>
                      <div className="flex h-9 items-center rounded-md border border-input bg-secondary/70 px-3 text-sm text-foreground">
                        {getInventoryStatus(activeItem)}
                      </div>
                      <p className="text-xs text-muted-foreground">Calculated from quantity, par, and reorder point.</p>
                    </div>
                    <DetailField label="Last updated" value={formatDate(activeItem.lastUpdated)} />
                    {isToolInventoryItem(activeItem) ? (
                      <>
                        <DetailField label="Condition" value={activeItem.condition} />
                        <DetailField label="Assigned area" value={activeItem.assignedArea} />
                      </>
                    ) : null}
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-secondary/30 p-3 text-sm text-muted-foreground">
                    <span>Changes apply to the current inventory workspace.</span>
                    <Button type="button" size="sm" onClick={handleSave}>
                      Save changes
                    </Button>
                  </div>
                </DetailSection>
              </div>

              <Separator />

              <DetailSection icon={MapPinned} title="Operations Metadata">
                <div className="grid gap-3">
                  <DetailField label="Storage location" value={metadata.storageLocation} />
                  <div className="grid grid-cols-2 gap-3">
                    <DetailField label="Count cadence" value={metadata.countCadence} />
                    <DetailField label="Last counted by" value={metadata.lastCountedBy} />
                  </div>
                  <div className="rounded-md border border-border bg-secondary/30 p-3 text-sm text-muted-foreground">
                    {metadata.notes}
                  </div>
                </div>
              </DetailSection>

              <Separator />

              <DetailSection icon={ClipboardList} title="Stock History Preview">
                <div className="grid gap-2">
                  {stockHistory.length > 0 ? (
                    stockHistory.slice(0, 3).map((entry) => <HistoryRow key={entry.id} entry={entry} />)
                  ) : (
                    <div className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
                      No stock history has been recorded for this item yet.
                    </div>
                  )}
                </div>
              </DetailSection>

              <Separator />

              <DetailSection icon={ClipboardList} title="Item Mapping">
                <div className="grid gap-3 rounded-md border border-border bg-secondary/30 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-foreground">Mapping status</span>
                    <Badge variant="outline">{metadata.mappingStatus}</Badge>
                  </div>
                  {activeItem.category === "ingredient" ? (
                    metadata.mappedMenuItems.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {metadata.mappedMenuItems.map((menuItem) => (
                          <Badge key={menuItem} variant="secondary">
                            {menuItem}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Ingredient mapping is ready for the future menu-to-ingredient workflow.
                      </p>
                    )
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Mapping is reserved for ingredient-driven menu forecasting. This item can still use stock history
                      and reorder metadata.
                    </p>
                  )}
                </div>
              </DetailSection>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
