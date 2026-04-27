"use client"

import { Badge } from "@/components/ui/badge"
import { getReorderReasonLabel, type ReorderReason } from "@/data/reorder"

interface ReorderReasonTagProps {
  reason: ReorderReason
}

export function ReorderReasonTag({ reason }: ReorderReasonTagProps) {
  return (
    <Badge variant="secondary" className="whitespace-nowrap font-normal">
      {getReorderReasonLabel(reason)}
    </Badge>
  )
}
