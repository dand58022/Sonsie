"use client"

import { AlertTriangle, CheckCircle2, FileText, Loader2, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { CsvImportSummary, CsvSampleFileMetadata } from "@/data/ingest"

interface ImportSummaryCardProps {
  fileName?: string
  metadata: CsvSampleFileMetadata
  summary: CsvImportSummary
  isImporting: boolean
  onConfirm: () => void
  onCancel: () => void
  onReviewUnmatched: () => void
}

export function ImportSummaryCard({
  fileName,
  metadata,
  summary,
  isImporting,
  onConfirm,
  onCancel,
  onReviewUnmatched,
}: ImportSummaryCardProps) {
  const hasUnmatched = summary.unmatchedRows > 0 || summary.needsReviewRows > 0
  const canImport = summary.matchedRows + summary.needsReviewRows > 0

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Import Summary</CardTitle>
        <CardDescription>
          Import preview for {metadata.location} service on {metadata.businessDate}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-4">
          <SummaryMetric icon={FileText} label="Rows found" value={summary.totalRows} />
          <SummaryMetric icon={CheckCircle2} label="Matched" value={summary.matchedRows} tone="success" />
          <SummaryMetric icon={AlertTriangle} label="Needs review" value={summary.needsReviewRows} tone="warning" />
          <SummaryMetric icon={XCircle} label="Unmatched" value={summary.unmatchedRows} tone="destructive" />
        </div>

        <div className="rounded-lg border border-border bg-secondary/40 p-4">
          <div className="flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:justify-between">
            <span className="font-medium text-foreground">{fileName ?? metadata.fileName}</span>
            <span className="text-muted-foreground">{metadata.source}</span>
          </div>
          {summary.warnings.length > 0 && (
            <div className="mt-3 space-y-1">
              {summary.warnings.slice(0, 4).map((warning) => (
                <p key={warning} className="text-xs text-muted-foreground">
                  {warning}
                </p>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Confirm Import applies the reviewed rows to the current inventory workspace.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={onCancel} disabled={isImporting}>
              Cancel
            </Button>
            {hasUnmatched && (
              <Button variant="secondary" onClick={onReviewUnmatched} disabled={isImporting}>
                Review Unmatched
              </Button>
            )}
            <Button onClick={onConfirm} disabled={!canImport || isImporting}>
              {isImporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Import
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface SummaryMetricProps {
  icon: typeof FileText
  label: string
  value: number
  tone?: "default" | "success" | "warning" | "destructive"
}

function SummaryMetric({ icon: Icon, label, value, tone = "default" }: SummaryMetricProps) {
  const toneClass = {
    default: "bg-secondary text-muted-foreground",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    destructive: "bg-destructive/10 text-destructive",
  }[tone]

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-background/40 p-3">
      <div className={`rounded-lg p-2 ${toneClass}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-semibold text-foreground">{value}</p>
      </div>
    </div>
  )
}
