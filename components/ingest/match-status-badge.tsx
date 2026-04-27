"use client"

import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import type { CsvImportMatchStatus } from "@/data/ingest"
import { cn } from "@/lib/utils"

interface MatchStatusBadgeProps {
  status: CsvImportMatchStatus
  className?: string
}

const statusLabel: Record<CsvImportMatchStatus, string> = {
  matched: "Matched",
  needs_review: "Needs review",
  unmatched: "Unmatched",
}

export function MatchStatusBadge({ status, className }: MatchStatusBadgeProps) {
  const Icon = status === "matched" ? CheckCircle2 : status === "needs_review" ? AlertTriangle : XCircle

  return (
    <Badge
      variant="outline"
      className={cn(
        "whitespace-nowrap font-medium",
        status === "matched" && "bg-success/10 text-success border-success/20",
        status === "needs_review" && "bg-warning/10 text-warning border-warning/20",
        status === "unmatched" && "bg-destructive/10 text-destructive border-destructive/20",
        className,
      )}
    >
      <Icon className="mr-1 h-3 w-3" />
      {statusLabel[status]}
    </Badge>
  )
}
