"use client"

import { useEffect, useMemo, useState } from "react"
import { AlertTriangle, CheckCircle2, Filter, Package, Search, ShoppingCart, Truck } from "lucide-react"
import { toast } from "sonner"

import { useActivity } from "@/components/activity"
import { Header } from "@/components/dashboard/header"
import { DraftOrderSummary, SupplierGroupSection } from "@/components/draft-order"
import { useInventory } from "@/components/inventory"
import { PreparedOrderView } from "@/components/prepared-order"
import {
  RecommendationDetailDrawer,
  ReorderRecommendationsTable,
} from "@/components/reorder"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  getDraftOrderItems,
  getDraftOrderSummary,
  getDraftSupplierGroups,
} from "@/data/draft-order"
import {
  getReorderSummary,
  getMockReorderRecommendations,
  type ReorderRecommendation,
  type ReorderUrgency,
} from "@/data/reorder"

type ReorderCategoryFilter = "all" | ReorderRecommendation["item"]["category"]
type ReorderUrgencyFilter = "all" | ReorderUrgency

export default function ReorderPage() {
  const { addActivityEvent } = useActivity()
  const { inventory } = useInventory()
  const reorderRecommendations = useMemo(
    () => getMockReorderRecommendations(inventory),
    [inventory],
  )
  const [draftIds, setDraftIds] = useState<Set<string>>(new Set())
  const [prepared, setPrepared] = useState(false)
  const [preparedReviewOpen, setPreparedReviewOpen] = useState(false)
  const [draftFeedback, setDraftFeedback] = useState<string | null>(null)
  const [activeRecommendation, setActiveRecommendation] = useState<ReorderRecommendation | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<ReorderCategoryFilter>("all")
  const [urgencyFilter, setUrgencyFilter] = useState<ReorderUrgencyFilter>("all")
  const [supplierFilter, setSupplierFilter] = useState("all")
  const [criticalOnly, setCriticalOnly] = useState(false)
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    Object.fromEntries(
      reorderRecommendations.map((recommendation) => [
        recommendation.id,
        recommendation.recommendedQuantity,
      ]),
    ),
  )

  useEffect(() => {
    setQuantities((current) => {
      const next = { ...current }

      for (const recommendation of reorderRecommendations) {
        next[recommendation.id] ??= recommendation.recommendedQuantity
      }

      return next
    })
  }, [reorderRecommendations])

  const suppliers = useMemo(
    () => Array.from(new Set(reorderRecommendations.map((recommendation) => recommendation.supplier.name))),
    [reorderRecommendations],
  )

  const filteredRecommendations = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return reorderRecommendations.filter((recommendation) => {
      const item = recommendation.item
      const matchesSearch =
        normalizedQuery.length === 0 ||
        item.name.toLowerCase().includes(normalizedQuery) ||
        recommendation.supplier.name.toLowerCase().includes(normalizedQuery) ||
        recommendation.notes.toLowerCase().includes(normalizedQuery)
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
      const matchesUrgency = urgencyFilter === "all" || recommendation.urgency === urgencyFilter
      const matchesCriticalOnly = !criticalOnly || recommendation.urgency === "Critical"
      const matchesSupplier = supplierFilter === "all" || recommendation.supplier.name === supplierFilter

      return matchesSearch && matchesCategory && matchesUrgency && matchesCriticalOnly && matchesSupplier
    })
  }, [categoryFilter, criticalOnly, reorderRecommendations, searchQuery, supplierFilter, urgencyFilter])

  const summary = useMemo(() => getReorderSummary(reorderRecommendations), [reorderRecommendations])
  const draftItems = useMemo(
    () => getDraftOrderItems(reorderRecommendations, draftIds, quantities),
    [draftIds, quantities, reorderRecommendations],
  )
  const draftGroups = useMemo(() => getDraftSupplierGroups(draftItems), [draftItems])
  const draftSummary = useMemo(() => getDraftOrderSummary(draftItems), [draftItems])

  const updateQuantity = (recommendationId: string, quantity: number) => {
    const recommendation = reorderRecommendations.find((item) => item.id === recommendationId)
    const previousQuantity = quantities[recommendationId] ?? recommendation?.recommendedQuantity

    setQuantities((current) => ({ ...current, [recommendationId]: quantity }))
    setPrepared(false)

    if (recommendation && draftIds.has(recommendationId) && previousQuantity !== quantity) {
      addActivityEvent({
        actionType: "quantity_updated",
        items: [recommendation.item.name],
        supplier: recommendation.supplier.name,
        notes: `Quantity updated from ${previousQuantity} ${recommendation.item.unit} to ${quantity} ${recommendation.item.unit}.`,
      })
      toast("Draft quantity updated", {
        description: `${recommendation.item.name}: ${quantity} ${recommendation.item.unit}.`,
      })
    }
  }

  const addOneToDraft = (recommendationId: string) => {
    const alreadyStaged = draftIds.has(recommendationId)
    const recommendation = reorderRecommendations.find((item) => item.id === recommendationId)

    setDraftIds((current) => new Set(current).add(recommendationId))
    setPrepared(false)
    if (recommendation && !alreadyStaged) {
      if (draftIds.size === 0) {
        addActivityEvent({
          actionType: "draft_created",
          items: [recommendation.item.name],
          supplier: recommendation.supplier.name,
          notes: "Draft order created from a reorder recommendation.",
        })
      }

      addActivityEvent({
        actionType: "item_added",
        items: [recommendation.item.name],
        supplier: recommendation.supplier.name,
        notes: `${recommendation.item.name} added to the session draft order.`,
      })
    }
    setDraftFeedback(
      recommendation
        ? `${recommendation.item.name} added to the draft order.`
        : "Recommendation added to the draft order.",
    )
    toast(recommendation && !alreadyStaged ? "Item added to draft" : "Already staged", {
      description: recommendation
        ? `${recommendation.item.name} is in the draft order.`
        : "Recommendation is in the draft order.",
    })
  }

  const removeFromDraft = (recommendationId: string) => {
    const recommendation = reorderRecommendations.find((item) => item.id === recommendationId)

    setDraftIds((current) => {
      const next = new Set(current)
      next.delete(recommendationId)
      return next
    })
    setPrepared(false)
    if (recommendation && draftIds.has(recommendationId)) {
      addActivityEvent({
        actionType: "item_removed",
        items: [recommendation.item.name],
        supplier: recommendation.supplier.name,
        notes: `${recommendation.item.name} removed from the session draft order.`,
      })
    }
    setDraftFeedback("Item removed from the draft order.")
    toast("Item removed", {
      description: recommendation
        ? `${recommendation.item.name} removed from the draft order.`
        : "Item removed from the draft order.",
    })
  }

  const clearDraft = () => {
    if (draftItems.length > 0) {
      addActivityEvent({
        actionType: "draft_cleared",
        items: draftItems.map((item) => item.itemName),
        supplier: getSupplierLabelFromNames(draftItems.map((item) => item.supplier.name)),
        notes: "Session draft order cleared before supplier submission.",
      })
    }
    setDraftIds(new Set())
    setPrepared(false)
    setPreparedReviewOpen(false)
    setDraftFeedback("Draft order cleared.")
    toast("Draft cleared", {
      description: "Session draft order has been reset.",
    })
  }

  const prepareOrder = () => {
    if (draftItems.length > 0) {
      addActivityEvent({
        actionType: "order_reviewed",
        items: draftItems.map((item) => item.itemName),
        supplier: getSupplierLabelFromNames(draftItems.map((item) => item.supplier.name)),
        notes: "Prepared order review opened for session draft packets. No supplier submission occurred.",
      })
    }
    setPreparedReviewOpen(true)
    setDraftFeedback("Prepared order review opened. No supplier submission was made.")
    toast("Prepared order review opened", {
      description: "Manager review opened; no supplier submission occurred.",
    })
  }

  const markOrderReady = () => {
    if (draftItems.length > 0) {
      addActivityEvent({
        actionType: "order_ready",
        items: draftItems.map((item) => item.itemName),
        supplier: getSupplierLabelFromNames(draftItems.map((item) => item.supplier.name)),
        notes: "Order packet marked ready for internal review only.",
      })
    }
    setPrepared(true)
    setDraftFeedback("Order packet marked ready for internal review. No supplier submission was made.")
    toast.success("Order marked ready", {
      description: "Internal review state updated without supplier submission.",
    })
  }

  const mockDownloadOrder = () => {
    setDraftFeedback("Order packet prepared for review. No file was generated and no supplier received it.")
    toast("Order packet review", {
      description: "No file was generated and no supplier received an order.",
    })
  }

  const clearFilters = () => {
    setSearchQuery("")
    setCategoryFilter("all")
    setUrgencyFilter("all")
    setSupplierFilter("all")
    setCriticalOnly(false)
  }

  return (
    <div className="flex flex-col">
      <Header
        title="Suggested Vendor Orders"
        subtitle="Prioritize perishable risk, weekend prep, event prep, and bar restock"
      />
      <div className="flex-1 space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-4">
          <SummaryCard
            icon={AlertTriangle}
            label="Perishable Priority"
            value={summary.criticalItems}
            tone="destructive"
          />
          <SummaryCard
            icon={Package}
            label="Low Par Items"
            value={summary.highPriorityItems}
            tone="warning"
          />
          <SummaryCard
            icon={Truck}
            label="Vendor Orders"
            value={summary.supplierCount}
            tone="primary"
          />
          <SummaryCard
            icon={ShoppingCart}
            label="Weekend Prep"
            value={`$${summary.estimatedTotal.toFixed(2)}`}
            tone="secondary"
          />
        </div>

        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <CardTitle>Find Items to Stage</CardTitle>
                <CardDescription>
                  Filter by category, urgency, or vendor, adjust quantity, then stage items for review.
                </CardDescription>
              </div>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-3 lg:grid-cols-[minmax(220px,1fr)_repeat(3,180px)_auto] lg:items-end">
              <div className="grid gap-2">
                <Label htmlFor="reorder-search">Search recommendations</Label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="reorder-search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search item, vendor, or service rationale"
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Category</Label>
                <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as ReorderCategoryFilter)}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    <SelectItem value="ingredient">Inventory</SelectItem>
                    <SelectItem value="supply">Supplies</SelectItem>
                    <SelectItem value="tool">Tools</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Urgency</Label>
                <Select value={urgencyFilter} onValueChange={(value) => setUrgencyFilter(value as ReorderUrgencyFilter)}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All urgency</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Vendor</Label>
                <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                  <SelectTrigger className="bg-secondary border-border">
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

              <div className="flex h-10 items-center gap-2 rounded-md border border-border bg-secondary px-3">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="critical-only" className="whitespace-nowrap text-sm">
                  Perishable only
                </Label>
                <Switch id="critical-only" checked={criticalOnly} onCheckedChange={setCriticalOnly} />
              </div>
            </div>
          </CardContent>
        </Card>

        {draftFeedback && (
          <Alert className="border-primary/20 bg-primary/5">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <AlertTitle>Vendor draft updated</AlertTitle>
            <AlertDescription>{draftFeedback}</AlertDescription>
          </Alert>
        )}

        <Card className="border-border bg-card" data-demo-target="reorder-recommendations">
          <CardHeader className="gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <CardTitle>Recommended Vendor Orders</CardTitle>
              <CardDescription>
                Click a row for stock rationale, vendor context, and service-period notes.
              </CardDescription>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredRecommendations.length} of {reorderRecommendations.length} recommendations visible
            </div>
          </CardHeader>
          <CardContent>
            <ReorderRecommendationsTable
              recommendations={filteredRecommendations}
              draftIds={draftIds}
              quantities={quantities}
              onQuantityChange={updateQuantity}
              onAddToDraft={addOneToDraft}
              onRowClick={setActiveRecommendation}
            />
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="flex flex-col gap-4">
            {draftGroups.length > 0 ? (
              draftGroups.map((group) => (
                <SupplierGroupSection
                  key={group.supplier.id}
                  group={group}
                  onQuantityChange={updateQuantity}
                  onRemove={removeFromDraft}
                />
              ))
            ) : (
              <Card className="flex h-full flex-col border-border bg-card">
                <CardHeader>
                  <CardTitle>Vendor Draft Queue</CardTitle>
                  <CardDescription>
                    Add recommendations to stage vendor-grouped draft order packets.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 items-center">
                  <div className="w-full rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                    No draft items yet. Use Stage on the right side of a recommendation row to build a vendor draft.
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          <DraftOrderSummary
            summary={draftSummary}
            prepared={prepared}
            onClearDraft={clearDraft}
            onPrepareOrder={prepareOrder}
          />
        </div>

        <RecommendationDetailDrawer
          recommendation={activeRecommendation}
          open={activeRecommendation !== null}
          draftStaged={activeRecommendation ? draftIds.has(activeRecommendation.id) : false}
          onOpenChange={(open) => {
            if (!open) {
              setActiveRecommendation(null)
            }
          }}
          onAddToDraft={addOneToDraft}
        />

        <PreparedOrderView
          open={preparedReviewOpen}
          prepared={prepared}
          groups={draftGroups}
          summary={draftSummary}
          onOpenChange={setPreparedReviewOpen}
          onMarkReady={markOrderReady}
          onMockDownload={mockDownloadOrder}
          onQuantityChange={updateQuantity}
          onRemove={removeFromDraft}
        />
      </div>
    </div>
  )
}

interface SummaryCardProps {
  icon: typeof AlertTriangle
  label: string
  value: string | number
  tone: "destructive" | "warning" | "primary" | "secondary"
}

function SummaryCard({ icon: Icon, label, value, tone }: SummaryCardProps) {
  const toneClass = {
    destructive: "bg-destructive/10 text-destructive",
    warning: "bg-warning/10 text-warning",
    primary: "bg-primary/10 text-primary",
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

function getSupplierLabelFromNames(suppliers: string[]) {
  const uniqueSuppliers = Array.from(new Set(suppliers))

  return uniqueSuppliers.length === 1 ? uniqueSuppliers[0] : "Multiple suppliers"
}
