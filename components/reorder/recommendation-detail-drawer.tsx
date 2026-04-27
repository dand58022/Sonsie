"use client"

import { ClipboardList, Package, ShoppingCart, Truck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  getReorderCategoryLabel,
  getReorderReasonLabel,
  type ReorderRecommendation,
} from "@/data/reorder"
import { ReorderReasonTag } from "./reorder-reason-tag"
import { ReorderUrgencyBadge } from "./reorder-urgency-badge"

interface RecommendationDetailDrawerProps {
  recommendation: ReorderRecommendation | null
  open: boolean
  draftStaged: boolean
  onOpenChange: (open: boolean) => void
  onAddToDraft: (recommendationId: string) => void
}

function DetailField({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input readOnly value={value} className="h-9 bg-secondary/70 text-sm" />
    </div>
  )
}

function DetailSection({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Package
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

export function RecommendationDetailDrawer({
  recommendation,
  open,
  draftStaged,
  onOpenChange,
  onAddToDraft,
}: RecommendationDetailDrawerProps) {
  const item = recommendation?.item

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        {recommendation && item ? (
          <>
            <SheetHeader className="border-b border-border px-5 py-4">
              <div className="flex items-start justify-between gap-4 pr-8">
                <div className="grid gap-1">
                  <SheetTitle className="text-lg">{item.name}</SheetTitle>
                  <SheetDescription>
                    {getReorderCategoryLabel(item.category)} | {recommendation.supplier.name}
                  </SheetDescription>
                </div>
                <ReorderUrgencyBadge urgency={recommendation.urgency} />
              </div>
            </SheetHeader>

            <div className="grid gap-6 px-5 pb-6">
              <DetailSection icon={Package} title="Current Stock Snapshot">
                <div className="grid grid-cols-2 gap-3">
                  <DetailField label="Current quantity" value={`${item.quantity.toLocaleString()} ${item.unit}`} />
                  <DetailField label="Recommended reorder" value={`${recommendation.recommendedQuantity.toLocaleString()} ${item.unit}`} />
                  <DetailField label="Par level" value={`${item.parLevel.toLocaleString()} ${item.unit}`} />
                  <DetailField label="Reorder point" value={`${item.reorderPoint.toLocaleString()} ${item.unit}`} />
                  <DetailField label="Projected days left" value={recommendation.projectedDaysRemaining} />
                  <DetailField label="Estimated cost" value={`$${recommendation.estimatedCost.toFixed(2)}`} />
                </div>
              </DetailSection>

              <Separator />

              <DetailSection icon={ClipboardList} title="Service Rationale">
                <div className="flex flex-wrap gap-2">
                  {recommendation.reasons.map((reason) => (
                    <ReorderReasonTag key={reason} reason={reason} />
                  ))}
                </div>
                <div className="rounded-md border border-border bg-secondary/30 p-3 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">{getReorderReasonLabel(recommendation.primaryReason)}</p>
                  <p className="mt-1">{recommendation.notes}</p>
                  <p className="mt-2">{recommendation.recentUsageTrend}</p>
                </div>
              </DetailSection>

              <Separator />

              <DetailSection icon={Truck} title="Vendor Context">
                <div className="grid gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <DetailField label="Vendor" value={recommendation.supplier.name} />
                    <DetailField label="Lead time" value={`${recommendation.leadTimeDays} days`} />
                    <DetailField label="Order window" value={recommendation.supplier.orderWindow} />
                    <DetailField
                      label="Order minimum"
                      value={recommendation.supplier.minimumOrder ? `$${recommendation.supplier.minimumOrder}` : "Not set"}
                    />
                  </div>
                  <div className="rounded-md border border-border bg-secondary/30 p-3 text-sm text-muted-foreground">
                    {recommendation.supplier.contactLabel}. Direct vendor ordering is intentionally a future
                    integration boundary.
                  </div>
                </div>
              </DetailSection>

              <Separator />

              <DetailSection icon={ShoppingCart} title="Draft Staging">
                <div className="rounded-md border border-dashed border-border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">Vendor draft staging</p>
                      <p className="text-sm text-muted-foreground">
                        This action prepares the row for vendor-grouped purchasing review.
                      </p>
                    </div>
                    <Badge variant={draftStaged ? "default" : "outline"}>
                      {draftStaged ? "Staged" : "Not staged"}
                    </Badge>
                  </div>
                  <Button
                    className="mt-4"
                    onClick={() => onAddToDraft(recommendation.id)}
                    disabled={draftStaged}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {draftStaged ? "Added to Draft" : "Add to Vendor Draft"}
                  </Button>
                </div>
              </DetailSection>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
