"use client"

import { PackageOpen } from "lucide-react"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

interface EmptyStateProps {
  title: string
  description: string
  icon?: React.ComponentType<{ className?: string }>
}

export function EmptyState({ title, description, icon: Icon = PackageOpen }: EmptyStateProps) {
  return (
    <Empty className="border border-dashed border-border bg-secondary/20">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon className="h-5 w-5" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
