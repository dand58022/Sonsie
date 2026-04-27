# Drop Your Pantry Agent Rules

**Date:** 2026-04-13 01:08 -04:00
**Audience:** Project team
**Status:** Active guidance
**Scope:** Future development rules for the root-level Next.js scaffold
**Implementation:** `app`, `components`, `lib`, `docs`

---

## Overview

This repo contains a single active React/Next.js app at the repository root. Treat the root-level `app`, `components`, `data`, `hooks`, `lib`, `public`, and `styles` folders as the current foundation of the product. Do not assume the app is blank, do not replace the app shell by default, and do not scaffold a separate competing app unless the project maintainers explicitly ask for it.

The `archive/exampleWebsite` folder is a reference-only v0 snapshot. Do not build new product work in `archive/exampleWebsite` unless the project maintainers explicitly ask to update the reference copy. It is not part of the active application runtime.

The product direction is an internal restaurant inventory platform for a premium Korean BBQ restaurant chain. The UI should feel like a restaurant operations tool: fast, dense, warm, alert-driven, and grounded in kitchen workflows.

---

## First-Read Rule

All agents working in this repo must read this `AGENTS.md` file first, before planning, editing, scaffolding, refactoring, or running broad implementation work. This file is the project rule file for agent behavior.

After reading this file, agents must also read `docs/FUTURE_PLANS.md` before any brainstorming, planning, or implementation. Current work must leave room for the production-phase features tracked there and must not accidentally imply those features are already implemented.

---

## Core Development Rules

| Rule | Required Behavior | Rationale |
|------|-------------------|-----------|
| Reuse first | Inspect existing root-level routes, dashboard components, mock data, and UI primitives before adding new files | The v0 scaffold already has a usable shell and domain-shaped pages |
| Evolve, do not rewrite | Refactor in place unless a component is actively blocking maintainability | Avoid churn and preserve working dashboard behavior |
| Mock-data first | Use local TypeScript fixture arrays or `.txt` sample data files until backend work is explicitly requested | The current goal is frontend-first product development and the real data flow is not set in stone |
| No backend by default | Do not add databases, API routes, auth providers, server actions, or integrations unless requested | Keeps iterations small and demoable |
| Operational UI | Favor restaurant operations language over generic SaaS copy | This is for managers and ops staff, not external SaaS buyers |
| Dense tables | Inventory, orders, recommendations, and audit views should support fast scanning and inline edits | Restaurant inventory work is table-heavy |
| Preserve app shell | Keep the dashboard shell, header, sidebar, route structure, and shadcn-style primitives unless there is a clear reason to adjust them | They are reusable foundations |
| Centralize mock data | Move page-local mock arrays into feature fixtures or `.txt` sample files when touched | Makes future replacement with real data easier |
| Avoid duplicate UI | Extract repeated table shells, filter bars, status badges, page headers, and empty states | v0 output tends to repeat patterns across pages |
| Keep features bounded | Add feature folders only when they clarify ownership and avoid large page files | Maintainability matters more than aesthetic folder churn |

---

## Current Foundation

Primary app location:

```
./
|-- app/
|-- components/
|-- hooks/
|-- lib/
|-- public/
|-- styles/
|-- package.json
`-- components.json
```

Important existing pieces:

| Area | Current Files | Guidance |
|------|---------------|----------|
| Login | `app/login/page.tsx`, `app/page.tsx` redirect | Keep as mock auth entry until real auth is requested |
| Dashboard shell | `app/dashboard/layout.tsx`, `components/dashboard/sidebar.tsx`, `header.tsx` | Reuse and improve responsiveness |
| Dashboard overview | `app/dashboard/page.tsx` | Treat as the operational command center |
| Inventory | `app/dashboard/inventory/page.tsx`, `[id]/page.tsx`, `components/dashboard/inventory-table.tsx` | Fix domain/category mismatches before expanding |
| CSV import | `app/dashboard/csv-import/page.tsx` | Keep frontend-only, extract reusable ingestion pieces when touched |
| Reorder | `app/dashboard/reorder/page.tsx` | Keep as recommendation-to-draft-order workflow |
| Orders | `app/dashboard/orders/page.tsx` | Treat Sysco as a placeholder until integration is requested |
| Forecasting | `app/dashboard/forecast/page.tsx`, `app/dashboard/forecasting/page.tsx` redirect | Keep mocked and label as forecast UI, not real AI |
| Audit | `app/dashboard/audit/page.tsx` | Use as activity/history foundation |
| Settings | `app/dashboard/settings/page.tsx` | Keep user/location/integration placeholders |
| Mock data | `lib/mock-data.ts` | Split into feature fixtures as features grow |

---

## UI Direction

Use the existing warm dark theme and brand assets as the base. Improve it toward premium Korean BBQ operations:

- Prefer labels like "Kitchen Readiness", "Prep Forecast", "Low Stock", "Supplier Orders", "Today in Service", and "Count Adjustment".
- Avoid generic labels like "AI-powered" unless there is a clear product reason and mock status is obvious.
- Keep colors warm and operational: charcoal background, fire/ember primary accents, restrained gold highlights, clear red/yellow/green alert hierarchy.
- Avoid adding generic marketing hero sections. This is an internal tool.
- Prioritize tables, alerts, readiness summaries, supplier actions, and fast adjustments.

---

## Mock Data Rules

Use mock data deliberately:

- Keep mock data typed.
- Unless the project maintainers explicitly request otherwise, all website data input/output must remain mock data for every iteration.
- Store mock data in centralized lists, TypeScript fixture modules, JSON-like fixture structures, or `.txt` sample data files for testing.
- Do not hardcode data directly inside route pages or UI components when adding or refactoring features.
- Keep the data flow open-ended because the final ingestion, backend, and integration contracts are not set yet.
- Keep generated fixtures realistic for Korean BBQ operations.
- Avoid mixing unrelated restaurant examples such as generic chicken parmesan or olive oil if the screen is supposed to represent Korean BBQ.
- Prefer feature-scoped fixtures like `features/inventory/mock-data.ts` once a page grows.
- Keep mock action handlers local and obvious until persistence is requested.
- Never imply that Sysco, auth, forecasting, or CSV import persistence is real unless it is implemented.

---

## Production-Only Feature Flags

The current system uses CSV ingestion and mock data. Future integrations may replace or augment ingestion sources, but they must not be implemented unless the project maintainers explicitly request production integration work. `docs/FUTURE_PLANS.md` is the source of truth for production-only roadmap items.

Do not implement these production-only features during frontend mock iterations:

- [In Production] Direct supplier ordering with Sysco or other suppliers.
- [In Production] Multi-supplier integration framework.
- [In Production] Direct Revel API integration.
- [In Production] Automatic sales/order ingestion from Revel.
- [In Production] DeepSeek AI-assisted reorder logic or forecasting.

Any newly identified future production feature must be added to `docs/FUTURE_PLANS.md`, even if only as a short reference entry.

---

## Change Workflow

Before editing:

1. Read the current route/page/component being changed.
2. Check whether an existing dashboard component can be reused.
3. Check `lib/mock-data.ts` for existing data shapes.
4. If adding a pattern used in multiple pages, extract a small reusable component.
5. Keep changes frontend-only unless the project maintainers explicitly request backend or integration work.

After editing:

1. Run the narrowest useful verification command from the repository root.
2. Prefer `pnpm lint` and `pnpm build` when dependencies are available.
3. Report any command that could not run and why.

---

*Guidance updated: 2026-04-13 01:08 -04:00 for the project team*
