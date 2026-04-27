"use client"

import type { ChangeEvent, DragEvent } from "react"
import { useCallback, useMemo, useRef, useState } from "react"
import { CheckCircle2, ClipboardList, FileText } from "lucide-react"
import { toast } from "sonner"

import { Header } from "@/components/dashboard/header"
import {
  CSVPreviewTable,
  CSVUploadDropzone,
  type CsvUploadDropzoneState,
  ImportSummaryCard,
} from "@/components/ingest"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  getCsvImportSummary,
  mockCsvParsedRows,
  mockCsvSampleFile,
  mockCsvTemplateRows,
  type CsvParsedOrderRow,
} from "@/data/ingest"

type UploadState = "idle" | "uploading" | "parsed" | "importing" | "complete" | "error"

export default function CSVImportPage() {
  const [uploadState, setUploadState] = useState<UploadState>("idle")
  const [file, setFile] = useState<File | null>(null)
  const [parsedRows, setParsedRows] = useState<CsvParsedOrderRow[]>([])
  const [progress, setProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()
  const unmatchedReviewRef = useRef<HTMLDivElement>(null)

  const summary = useMemo(() => getCsvImportSummary(parsedRows), [parsedRows])

  const previewReady = uploadState === "parsed" || uploadState === "importing" || uploadState === "complete"

  const dropzoneState: CsvUploadDropzoneState = uploadState === "uploading"
    ? "uploading"
    : uploadState === "error"
      ? "error"
      : previewReady
        ? "uploaded"
        : dragActive
          ? "drag-active"
          : "idle"

  const handleDrag = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (uploadState === "uploading" || uploadState === "importing") {
      return
    }

    if (event.type === "dragenter" || event.type === "dragover") {
      setDragActive(true)
      return
    }

    if (event.type === "dragleave") {
      setDragActive(false)
    }
  }, [uploadState])

  const handleDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setDragActive(false)

    const droppedFile = event.dataTransfer.files?.[0]
    if (droppedFile) {
      void handleFile(droppedFile)
    }
  }, [])

  const handleFileInput = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      void handleFile(selectedFile)
    }

    event.target.value = ""
  }

  const handleFile = async (nextFile: File) => {
    setFile(nextFile)
    setErrorMessage(undefined)
    setParsedRows([])
    setProgress(0)

    if (!isCsvFile(nextFile)) {
      setUploadState("error")
      setErrorMessage("Choose a .csv export from the POS order history report.")
      toast.error("CSV rejected", {
        description: "Choose a .csv export from the POS order history report.",
      })
      return
    }

    setUploadState("uploading")

    for (let value = 20; value <= 100; value += 20) {
      await delay(140)
      setProgress(value)
    }

    await delay(250)
    setParsedRows(mockCsvParsedRows)
    setUploadState("parsed")
    toast.success("CSV parsed", {
      description: "Order rows are ready for review.",
    })
  }

  const handleImport = async () => {
    setUploadState("importing")
    setProgress(0)

    for (let value = 10; value <= 100; value += 10) {
      await delay(90)
      setProgress(value)
    }

    setUploadState("complete")
    toast.success("Import complete", {
      description: "Reviewed import rows were accepted.",
    })
  }

  const handleReset = () => {
    setFile(null)
    setParsedRows([])
    setUploadState("idle")
    setProgress(0)
    setDragActive(false)
    setErrorMessage(undefined)
    toast("CSV import reset", {
      description: "Upload state cleared.",
    })
  }

  const handleReviewUnmatched = () => {
    unmatchedReviewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const handleDownloadTemplate = () => {
    window.alert(mockCsvTemplateRows.join("\n"))
  }

  return (
    <div className="flex flex-col">
      <Header title="CSV Import" subtitle="Upload today's order history and preview inventory mapping" />
      <div className="flex-1 p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <div data-demo-target="csv-upload">
            <CSVUploadDropzone
              state={dropzoneState}
              fileName={file?.name}
              progress={progress}
              errorMessage={errorMessage}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onFileChange={handleFileInput}
              onDownloadTemplate={handleDownloadTemplate}
            />
          </div>

          {previewReady && (
            <>
              <ImportSummaryCard
                fileName={file?.name}
                metadata={mockCsvSampleFile}
                summary={summary}
                isImporting={uploadState === "importing"}
                onConfirm={handleImport}
                onCancel={handleReset}
                onReviewUnmatched={handleReviewUnmatched}
              />

              <Card className="border-border bg-card" ref={unmatchedReviewRef}>
                <CardHeader className="gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <CardTitle>Parsed Order Preview</CardTitle>
                    <CardDescription>
                      Review matched, questionable, and unmatched rows before applying this import.
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2 text-sm text-muted-foreground">
                    <ClipboardList className="h-4 w-4" />
                    {summary.totalRows} rows from {mockCsvSampleFile.location}
                  </div>
                </CardHeader>
                <CardContent>
                  <CSVPreviewTable rows={parsedRows} />
                </CardContent>
              </Card>

              {uploadState === "importing" && (
                <Card className="border-border bg-card">
                  <CardContent className="flex flex-col items-center gap-4 py-8">
                    <div className="rounded-full bg-primary/10 p-4">
                      <FileText className="h-8 w-8 animate-pulse text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-foreground">Applying import...</p>
                      <p className="mt-1 text-sm text-muted-foreground">{progress}% complete</p>
                    </div>
                    <Progress value={progress} className="w-full max-w-sm" />
                  </CardContent>
                </Card>
              )}

              {uploadState === "complete" && (
                <Alert className="border-success/20 bg-success/5">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <AlertTitle>Import preview complete</AlertTitle>
                  <AlertDescription>
                    {summary.matchedRows + summary.needsReviewRows} rows were accepted into the inventory review flow.
                    {summary.unmatchedRows > 0 ? ` ${summary.unmatchedRows} unmatched row(s) remain for mapping review.` : ""}
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function isCsvFile(file: File) {
  return file.name.toLowerCase().endsWith(".csv") || file.type === "text/csv"
}

function delay(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}
