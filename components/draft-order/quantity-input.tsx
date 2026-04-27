"use client"

import { Input } from "@/components/ui/input"

interface QuantityInputProps {
  value: number
  ariaLabel: string
  onChange: (quantity: number) => void
}

export function QuantityInput({ value, ariaLabel, onChange }: QuantityInputProps) {
  return (
    <Input
      type="number"
      min={0}
      value={value}
      aria-label={ariaLabel}
      onClick={(event) => event.stopPropagation()}
      onChange={(event) => onChange(Number(event.target.value) || 0)}
      className="h-8 w-24 border-border bg-secondary text-right"
    />
  )
}
