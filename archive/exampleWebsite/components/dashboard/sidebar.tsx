"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Flame, LayoutDashboard } from "lucide-react"

import { cn } from "@/lib/utils"

const navigation = [
  { name: "Shell Reference", href: "/dashboard", icon: LayoutDashboard },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-sidebar">
      <div className="flex h-20 items-center border-b border-border px-5">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-foreground/10 p-1">
            <Image
              src="/images/gen-logo.png"
              alt="GEN Korean BBQ"
              width={48}
              height={48}
              className="h-full w-full object-contain invert"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-foreground">GEN</span>
            <span className="text-xs font-medium text-muted-foreground">Shell Reference</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary/15 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="rounded-lg bg-gradient-to-br from-secondary to-accent p-4">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-primary" />
            <p className="text-xs font-semibold text-muted-foreground">REFERENCE COPY</p>
          </div>
          <p className="mt-2 text-sm font-medium text-foreground">Shell and UI only</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Build product workflows in the repository root app.
          </p>
        </div>
      </div>
    </aside>
  )
}
