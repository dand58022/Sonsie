"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function TableSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="grid gap-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="grid grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((__, cellIndex) => (
              <Skeleton key={cellIndex} className="h-8" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <Skeleton className="mb-4 h-5 w-40" />
      <Skeleton className="h-72 w-full" />
    </div>
  )
}
