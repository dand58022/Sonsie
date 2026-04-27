"use client"

import type { ChangeEvent, DragEvent } from "react"
import { AlertTriangle, Download, FileText, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export type CsvUploadDropzoneState = "idle" | "drag-active" | "uploading" | "uploaded" | "error"

interface CSVUploadDropzoneProps {
  state: CsvUploadDropzoneState
  fileName?: string
  progress: number
  errorMessage?: string
  onDragEnter: (event: DragEvent<HTMLDivElement>) => void
  onDragLeave: (event: DragEvent<HTMLDivElement>) => void
  onDragOver: (event: DragEvent<HTMLDivElement>) => void
  onDrop: (event: DragEvent<HTMLDivElement>) => void
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  onDownloadTemplate: () => void
}

export function CSVUploadDropzone({
  state,
  fileName,
  progress,
  errorMessage,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileChange,
  onDownloadTemplate,
}: CSVUploadDropzoneProps) {
  const isBusy = state === "uploading"
  const isDragActive = state === "drag-active"
  const isError = state === "error"
  const isUploaded = state === "uploaded"

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Upload Today&apos;s Order History</CardTitle>
        <CardDescription>
          Drop the daily POS order CSV to preview how service usage maps into inventory counts.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={cn(
            "relative flex min-h-72 flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors",
            isDragActive && "border-primary bg-primary/10",
            !isDragActive && !isError && "border-border hover:border-primary/50 hover:bg-secondary/50",
            isError && "border-destructive/50 bg-destructive/5",
            isUploaded && "border-success/40 bg-success/5",
            isBusy && "pointer-events-none",
          )}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          {isBusy ? (
            <div className="flex w-full max-w-sm flex-col items-center gap-4">
              <div className="rounded-full bg-primary/10 p-4">
                <FileText className="h-8 w-8 animate-pulse text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Reading {fileName}...</p>
                <p className="mt-1 text-sm text-muted-foreground">{progress}% parsed for preview</p>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          ) : isError ? (
            <div className="flex max-w-md flex-col items-center gap-4">
              <div className="rounded-full bg-destructive/10 p-4">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <div>
                <p className="font-medium text-foreground">CSV file required</p>
                <p className="mt-1 text-sm text-muted-foreground">{errorMessage}</p>
              </div>
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={onFileChange}
                className="absolute inset-0 cursor-pointer opacity-0"
                aria-label="Choose CSV file"
              />
              <Button variant="outline">Choose a CSV</Button>
            </div>
          ) : isUploaded ? (
            <div className="flex max-w-md flex-col items-center gap-4">
              <div className="rounded-full bg-success/10 p-4">
                <FileText className="h-8 w-8 text-success" />
              </div>
              <div>
                <p className="font-medium text-foreground">{fileName}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Parsing complete. Review matches before confirming the import.
                </p>
              </div>
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={onFileChange}
                className="absolute inset-0 cursor-pointer opacity-0"
                aria-label="Choose another CSV file"
              />
              <Button variant="outline">Choose Another File</Button>
            </div>
          ) : (
            <>
              <div className="rounded-full bg-secondary p-4">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="mt-4">
                <p className="font-medium text-foreground">
                  {isDragActive ? "Drop the CSV to start preview" : "Drag and drop today's order CSV here"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">or click to choose the POS export</p>
              </div>
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={onFileChange}
                className="absolute inset-0 cursor-pointer opacity-0"
                aria-label="Choose CSV file"
              />
              <Button variant="outline" className="mt-4">
                Select CSV File
              </Button>
            </>
          )}
        </div>

        <div className="flex flex-col gap-3 rounded-lg bg-secondary/50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Download className="h-4 w-4" />
            Template columns: date, source, item name, category, quantity, unit
          </div>
          <Button variant="link" className="h-auto p-0 text-primary" onClick={onDownloadTemplate}>
            View sample CSV format
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
