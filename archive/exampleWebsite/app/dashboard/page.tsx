import { Flame, LayoutDashboard, PanelLeft, Search } from "lucide-react"

import { Header } from "@/components/dashboard/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const shellReferenceCards = [
  {
    title: "Dashboard Shell",
    description: "Fixed sidebar, sticky header, and padded content region.",
    icon: LayoutDashboard,
  },
  {
    title: "Navigation Pattern",
    description: "Reference spacing, active state, and warm dark sidebar treatment.",
    icon: PanelLeft,
  },
  {
    title: "UI Primitives",
    description: "shadcn/ui cards, buttons, badges, inputs, dropdowns, and tabs.",
    icon: Flame,
  },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <Header title="Shell Reference" subtitle="Reference-only v0 dashboard shell and UI primitives" />
      <div className="flex-1 space-y-6 p-6">
        <section className="grid gap-4 lg:grid-cols-3">
          {shellReferenceCards.map((card) => (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-start justify-between gap-3">
                <div className="grid gap-1">
                  <CardTitle>{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </div>
                <card.icon className="h-5 w-5 text-primary" />
              </CardHeader>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_20rem]">
          <Card>
            <CardHeader>
              <CardTitle>Reference Layout</CardTitle>
              <CardDescription>
                Use this folder for shell and UI comparison only. Build product features in the active app folder.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Reference search input" className="bg-secondary pl-9" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">
                  Active state
                </Badge>
                <Badge variant="outline" className="border-warning/20 bg-warning/10 text-warning">
                  Warning state
                </Badge>
                <Badge variant="outline" className="border-destructive/20 bg-destructive/10 text-destructive">
                  Critical state
                </Badge>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button>Primary Action</Button>
                <Button variant="outline">Secondary Action</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reference Boundary</CardTitle>
              <CardDescription>
                This copy intentionally excludes inventory, ordering, import, forecasting, and activity workflows.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Active development belongs in <span className="font-medium text-foreground">the repository root app</span>.
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
