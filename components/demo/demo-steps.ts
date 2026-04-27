"use client"

import type { Step } from "react-joyride"

export type DemoStepAction = "scroll" | "click"

export interface DemoStep extends Step {
  route: string
  delay?: number
  action?: DemoStepAction
  actionTarget?: string
}

export const DEMO_STEP_DELAY_MS = 10000

export const demoSteps: DemoStep[] = [
  {
    route: "/dashboard",
    target: "[data-demo-target='kpi-critical']",
    title: "Service risk starts here",
    content: "Start with the daily service risk snapshot to see what may affect brunch, dinner, bar, or event prep.",
    placement: "bottom",
    skipBeacon: true,
  },
  {
    route: "/dashboard",
    target: "[data-demo-target='overview-usage-chart']",
    title: "Service usage",
    content: "The usage chart compares produce, seafood, and bar demand so managers can read the next service window quickly.",
    placement: "top",
    skipBeacon: true,
  },
  {
    route: "/dashboard",
    target: "[data-demo-target='overview-supplies']",
    title: "Private event support",
    content: "This table keeps service supplies and event-readiness items visible from the overview.",
    placement: "top",
    skipBeacon: true,
  },
  {
    route: "/dashboard/inventory",
    target: "[data-demo-target='inventory-toolbar']",
    title: "Sonsie inventory",
    content: "Managers can filter by Seafood, Produce, Bar, or Tools and review service-impacting stock from one page.",
    placement: "bottom",
    skipBeacon: true,
  },
  {
    route: "/dashboard/inventory",
    target: "[data-demo-target='inventory-table']",
    title: "Dense count review",
    content: "Inventory rows are designed for fast scanning and drill-in count adjustments.",
    placement: "top",
    skipBeacon: true,
  },
  {
    route: "/dashboard/inventory",
    target: "[data-demo-target='inventory-detail-count-editor']",
    action: "click",
    actionTarget: "[data-demo-target='inventory-table'] tbody tr:first-child",
    title: "Manual count adjustments",
    content: "This panel lets staff review item details and manually update inventory quantities when counts need correction.",
    placement: "left",
    skipBeacon: true,
  },
  {
    route: "/dashboard/reorder",
    target: "[data-demo-target='reorder-recommendations']",
    title: "Suggested vendor orders",
    content: "This workflow stages perishable priority, weekend prep, event prep, and bar restock orders without submitting anything live.",
    placement: "top",
    skipBeacon: true,
  },
  {
    route: "/dashboard/orders",
    target: "[data-demo-target='orders-table']",
    title: "Vendor order review",
    content: "Draft, active, and received mock vendor orders stay grouped for operational follow-up.",
    placement: "top",
    skipBeacon: true,
  },
  {
    route: "/dashboard/csv-import",
    target: "[data-demo-target='csv-upload']",
    title: "CSV ingestion",
    content: "Upload your daily order log (CSV) to automatically process and map items to ingredients, updating inventory based on actual usage for the day.",
    placement: "bottom",
    skipBeacon: true,
  },
  {
    route: "/dashboard/forecast",
    target: "[data-demo-target='forecast-basis']",
    title: "Service forecast",
    content: "Forecasting highlights brunch, dinner, bar, and private event demand to reduce ordering guesswork before service.",
    placement: "top",
    skipBeacon: true,
  },
  {
    route: "/dashboard/activity",
    target: "[data-demo-target='activity-log']",
    title: "Activity log",
    content: "Track order activity, adjustments, and manager actions to maintain visibility and support audit and follow-up.",
    placement: "top",
    skipBeacon: true,
  },
  {
    route: "/dashboard/settings",
    target: "[data-demo-target='settings-overview']",
    title: "Settings",
    content: "Settings shows how the dashboard can be customized per restaurant without enabling production connections.",
    placement: "bottom",
    skipBeacon: true,
  },
]
