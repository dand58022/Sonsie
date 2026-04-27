"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  FileUp,
  ShoppingCart,
  TrendingUp,
  History,
  Settings,
  RefreshCw,
  Wine,
} from "lucide-react"

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Sonsie Inventory", href: "/dashboard/inventory", icon: Package },
  { name: "CSV Import", href: "/dashboard/csv-import", icon: FileUp },
  { name: "Vendor Orders", href: "/dashboard/reorder", icon: RefreshCw },
  { name: "Order Review", href: "/dashboard/orders", icon: ShoppingCart },
  { name: "Service Forecast", href: "/dashboard/forecast", icon: TrendingUp },
  { name: "Activity Log", href: "/dashboard/activity", icon: History },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-dashboard-border-strong/70 bg-dashboard-surface p-3 shadow-sm shadow-black/5 dark:shadow-black/30">
      {/* Logo Section */}
      <div className="flex h-20 items-center rounded-lg border border-border/70 bg-dashboard-surface-raised px-4 shadow-xs">
        <Link href="/dashboard" className="flex h-full w-full items-center" aria-label="Sonsie dashboard">
          <div className="relative h-14 w-full overflow-hidden rounded-lg bg-transparent">
            <Image
              src="/images/sonsie-logo.png"
              alt="Sonsie logo"
              fill
              sizes="220px"
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="mt-3 flex-1 space-y-1 rounded-lg border border-border/70 bg-dashboard-surface-raised p-2 shadow-xs">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/dashboard" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.name}
              href={item.href}
              data-demo-nav-route={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "border border-primary/25 bg-primary/12 text-primary shadow-xs"
                  : "border border-transparent text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="mt-3 rounded-lg border border-border/70 bg-dashboard-surface-raised p-3 shadow-xs">
        <div className="rounded-lg border border-border/70 bg-dashboard-surface-inner p-4">
          <div className="flex items-center gap-2">
            <Wine className="h-4 w-4 text-primary" />
            <p className="text-xs font-semibold text-muted-foreground">SERVICE READINESS</p>
          </div>
          <p className="mt-2 text-sm font-medium text-foreground">Weekend and event prep</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            <span className="text-xs text-muted-foreground">Perishable review active</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
