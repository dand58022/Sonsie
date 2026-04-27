# Sonsie UI Rules

**Date:** 2026-04-13 01:08 -04:00
**Audience:** Project team
**Status:** Active guidance
**Scope:** UI evolution rules for the current root-level v0 scaffold
**Implementation:** `app/globals.css`, `components/dashboard`, `components/ui`

---

## Overview

The current UI already has a useful warm dark base, Sonsie logo, sidebar shell, dashboard widgets, alert panels, tables, and charts. Evolve it toward a premium bistro and wine bar operations tool. Do not make it feel like a generic SaaS admin dashboard.

---

## Design Direction

| Principle | Rule |
|-----------|------|
| Restaurant operations first | Prioritize readiness, shortages, counts, supplier actions, and service-day context |
| Premium Sonsie feel | Use charcoal, wine, brass, restrained depth, and brand imagery |
| Dense but calm | Tables should be compact and fast to scan without looking cramped |
| Actionable alerts | Every critical alert should suggest the next operational action |
| Mock honesty | Label mock integrations and forecasting states clearly |
| Reuse the shell | Improve the current sidebar/header layout rather than replacing it |

---

## Visual System

Use the current `app/globals.css` warm dark palette as the source of truth:

| Token | Intended Use |
|-------|--------------|
| `--background` | Charcoal app background |
| `--card` | Raised operational panels |
| `--primary` | Fire/ember primary actions |
| `--warning` | Low stock and near-term issues |
| `--destructive` | Critical shortages and blockers |
| `--success` | Ready, received, above par |
| `--gold` / `--ember` | Premium accent, not large background fills |

Avoid:

- Purple/blue SaaS gradients.
- Marketing hero sections.
- Decorative orbs or generic startup visuals.
- Excessively rounded cards beyond existing shadcn style.
- Full-page copy that explains the app instead of helping the user act.

---

## Dashboard Priorities

The dashboard should answer these in order:

1. Is the kitchen ready for service?
2. What is critical or out of stock?
3. Which supplies could block service?
4. What needs to be reordered?
5. What changed recently?
6. Was today's order history imported?

Recommended dashboard sections:

```
Overview
|-- Service Readiness Summary
|-- Critical Alerts
|-- Ingredients and Supplies At Risk
|-- Reorder Queue Preview
|-- Daily CSV Import Status
|-- Recent Activity
`-- Usage / Forecast Snapshot
```

---

## Table Behavior

Inventory and operations tables should be dense, editable, and stable.

Rules:

- Keep row height compact.
- Keep numeric columns right-aligned when useful.
- Support inline quantity editing for count adjustments.
- Show units next to quantities.
- Keep par level, reorder point, supplier, and status visible.
- Preserve row width and layout during edit mode.
- Add empty states for filtered tables.
- Use horizontal scroll or card-like row summaries on mobile instead of squeezing columns into unreadable text.
- Do not hide critical status or action columns on tablet/mobile.

Recommended shared pattern:

```
TableToolbar
|-- SearchInput
|-- CategoryFilter
|-- StatusFilter
`-- PrimaryAction

DataTableShell
|-- Table
|-- EmptyState
`-- TableFooterSummary
```

---

## Alert Hierarchy

| Level | Meaning | UI Treatment |
|-------|---------|--------------|
| Critical | Out of stock or service-blocking shortage | Destructive badge, first in lists, direct action button |
| Warning | Below reorder point or forecasted shortage | Warning badge, visible but below critical |
| Info | Import complete, sync update, nonblocking order status | Muted or chart accent badge |
| Success | Ready, received, above par | Success badge, never more visually dominant than critical alerts |

Critical alerts should include:

- Item name.
- Current quantity or out-of-stock state.
- Time pressure when available.
- Suggested action: adjust stock, create order, review details.

---

## Branding and Tone

Use product copy that sounds internal and operational:

Good:

- "Kitchen Readiness"
- "Prep Forecast"
- "Supplier Orders"
- "Count Adjustment"
- "Below Par"
- "Service Risk"
- "Daily Order Import"
- "Needs Attention"

Avoid:

- "AI-powered" unless the feature is real or explicitly mocked.
- Generic "Dashboard Analytics" language.
- Marketing copy.
- Vague SaaS labels like "Insights", "Growth", or "Workspace" unless tied to a specific workflow.

---

## Component Rules

- Keep `components/ui` as primitive components only.
- Keep business-specific components outside `components/ui`.
- Prefer `features/inventory/components` once inventory components grow beyond generic dashboard use.
- Reuse `Header`, `Sidebar`, `KPICard`, table primitives, badges, dialogs, and sheets before creating alternatives.
- Extract repeated status color logic into shared helpers.
- Keep charts secondary to operational tables and alerts.

---

## Responsive Rules

The current fixed sidebar layout needs responsive evolution.

Requirements:

- Desktop keeps persistent sidebar.
- Tablet can use collapsed sidebar or drawer navigation.
- iOS/mobile uses top bar plus sheet/drawer navigation.
- Tables must remain usable with horizontal scroll or compact row summaries.
- Dialogs/sheets must fit on mobile height and support scrolling content.
- Search/filter bars must wrap cleanly.

---

*UI rules drafted: 2026-04-13 01:08 -04:00 for the project team*
