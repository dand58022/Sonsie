"use client"

import { CheckCircle2, Download, Send } from "lucide-react"

import { Button } from "@/components/ui/button"

interface OrderActionBarProps {
  canReview: boolean
  prepared: boolean
  onMarkReady: () => void
  onMockDownload: () => void
}

export function OrderActionBar({
  canReview,
  prepared,
  onMarkReady,
  onMockDownload,
}: OrderActionBarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium text-foreground">Preparation-only order packet</p>
        <p className="text-xs text-muted-foreground">
          Supplier submission is disabled until production integrations are approved.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" onClick={onMockDownload} disabled={!canReview}>
          <Download className="mr-2 h-4 w-4" />
          Download Order
        </Button>
        <Button onClick={onMarkReady} disabled={!canReview || prepared}>
          <CheckCircle2 className="mr-2 h-4 w-4" />
          {prepared ? "Marked Ready" : "Mark as Ready"}
        </Button>
        <Button variant="secondary" disabled title="Future supplier API integration">
          <Send className="mr-2 h-4 w-4" />
          Send to Supplier
        </Button>
      </div>
    </div>
  )
}
