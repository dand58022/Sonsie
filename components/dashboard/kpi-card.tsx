"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus, DollarSign, AlertTriangle, ShoppingCart, Package } from "lucide-react"

interface KPICardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  iconType: 'dollar' | 'alert' | 'cart' | 'trend' | 'package'
  variant?: 'default' | 'primary' | 'warning' | 'critical' | 'ember' | 'gold'
  demoTarget?: string
  href?: string
}

const iconMap = {
  dollar: DollarSign,
  alert: AlertTriangle,
  cart: ShoppingCart,
  trend: TrendingUp,
  package: Package,
}

export function KPICard({ 
  title, 
  value, 
  change, 
  changeLabel, 
  iconType,
  variant = 'default',
  demoTarget,
  href,
}: KPICardProps) {
  const isPositive = change && change > 0
  const isNegative = change && change < 0
  const isNeutral = change === 0

  const Icon = iconMap[iconType]

  const variantStyles = {
    default: {
      card: "border-border bg-dashboard-surface-raised shadow-sm",
      accent: "w-1 bg-border",
      iconBg: "bg-secondary/80 text-muted-foreground ring-1 ring-border",
      iconColor: "text-muted-foreground",
      value: "text-foreground",
      label: "text-muted-foreground",
    },
    primary: {
      card: "border-primary/35 bg-dashboard-surface-raised shadow-sm",
      accent: "w-1 bg-primary",
      iconBg: "bg-primary/12 text-primary ring-1 ring-primary/25",
      iconColor: "text-primary",
      value: "text-foreground",
      label: "text-muted-foreground",
    },
    warning: {
      card: "border-warning/35 bg-dashboard-surface-raised shadow-sm",
      accent: "w-1 bg-warning",
      iconBg: "bg-warning/12 text-warning ring-1 ring-warning/25",
      iconColor: "text-warning",
      value: "text-foreground",
      label: "text-muted-foreground",
    },
    critical: {
      card: "border-destructive/60 bg-dashboard-surface-raised shadow-md shadow-black/10 dark:shadow-black/35",
      accent: "w-1.5 bg-destructive",
      iconBg: "bg-destructive/14 text-destructive ring-1 ring-destructive/35",
      iconColor: "text-destructive",
      value: "text-foreground",
      label: "text-foreground/85",
    },
    ember: {
      card: "border-border bg-dashboard-surface-raised shadow-sm",
      accent: "w-1 bg-primary/55",
      iconBg: "bg-secondary/80 text-muted-foreground ring-1 ring-border",
      iconColor: "text-muted-foreground",
      value: "text-foreground",
      label: "text-muted-foreground",
    },
    gold: {
      card: "border-border bg-dashboard-surface-raised shadow-sm",
      accent: "w-0.5 bg-muted-foreground/60",
      iconBg: "bg-secondary/70 text-muted-foreground ring-1 ring-border/80",
      iconColor: "text-muted-foreground",
      value: "text-foreground",
      label: "text-muted-foreground",
    }
  }

  const styles = variantStyles[variant]

  const card = (
    <Card
      className={cn(
        "relative overflow-hidden border transition-[border-color,background-color,box-shadow,transform] hover:border-dashboard-border-strong",
        href && "cursor-pointer hover:-translate-y-0.5 hover:shadow-md focus-within:border-primary",
        styles.card,
      )}
      data-demo-target={demoTarget}
    >
      <div className={cn("absolute inset-y-0 left-0", styles.accent)} />
      <CardContent className="p-4 pl-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className={cn("text-sm font-semibold", styles.label)}>{title}</p>
            <p className={cn("text-2xl font-semibold tracking-tight", styles.value)} data-typography="metric">{value}</p>
            {change !== undefined && (
              <div className="flex items-center gap-1.5 pt-1">
                {isPositive && <TrendingUp className="h-4 w-4 text-success" />}
                {isNegative && <TrendingDown className="h-4 w-4 text-destructive" />}
                {isNeutral && <Minus className="h-4 w-4 text-muted-foreground" />}
                <span
                  className={cn(
                    "text-sm font-semibold",
                    isPositive && "text-success",
                    isNegative && "text-destructive",
                    isNeutral && "text-muted-foreground"
                  )}
                >
                  {isPositive && "+"}
                  {change}%
                </span>
                {changeLabel && (
                  <span className="text-xs text-muted-foreground">{changeLabel}</span>
                )}
              </div>
            )}
          </div>
          <div className={cn("rounded-lg p-2.5", styles.iconBg)}>
            <Icon className={cn("h-5 w-5", styles.iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (!href) {
    return card
  }

  return (
    <Link href={href} className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
      {card}
    </Link>
  )
}
