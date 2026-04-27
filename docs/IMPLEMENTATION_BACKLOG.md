# Sonsie Implementation Backlog

**Date:** 2026-04-13 01:08 -04:00
**Audience:** Project team
**Status:** Planned
**Scope:** Phased frontend-first backlog starting from the current root-level Next.js scaffold
**Implementation:** `app`, `components`, `lib`

---

## Overview

This backlog starts from the existing v0-generated root-level Next.js app. It does not rebuild the app shell, introduce backend logic, or assume a blank project. The first iterations should improve structure and usability while preserving the working dashboard routes.

Unless the project maintainers explicitly request otherwise, all website data input/output stays mocked for every iteration. Store mock data in centralized lists, typed fixture modules, JSON-like fixture structures, or `.txt` sample data files for testing. Do not hardcode data directly in route pages or UI components because the final data flow is not set in stone.

---

## Current Foundation

```
./
|-- app/dashboard/page.tsx
|-- app/dashboard/inventory/page.tsx
|-- app/dashboard/inventory/[id]/page.tsx
|-- app/dashboard/csv-import/page.tsx
|-- app/dashboard/reorder/page.tsx
|-- app/dashboard/orders/page.tsx
|-- app/dashboard/forecast/page.tsx
|-- app/dashboard/audit/page.tsx
|-- app/dashboard/settings/page.tsx
|-- components/dashboard/
|-- components/ui/
`-- lib/mock-data.ts
```

---

## Phase 1: Stabilize the Existing Scaffold

| Task | Purpose | Dependencies | Difficulty | Data | Type |
|------|---------|--------------|------------|------|------|
| Normalize inventory categories | Fix the mismatch between `InventoryItem.category` values and inventory page tabs | Existing `mock-data.ts`, `inventory/page.tsx`, `inventory-table.tsx` | Medium | Mock | Refactor |
| Add Sonsie-specific mock items | Replace generic restaurant examples with Sonsie inventory, supplies, and tools stored in fixtures or sample files | Normalized category model | Low | Mock | Refactor |
| Extract shared status helpers | Stop duplicating status color rules across inventory, supplies, orders, audit, reorder | Existing status helpers in `mock-data.ts` | Low | Mock | Refactor |
| Add empty states to inventory tabs | Make filtered/no-data states clear | Inventory category normalization | Low | Mock | Refactor |
| Verify current build/lint | Catch v0 scaffold type or lint issues before larger work | Dependencies installed | Low | N/A | Refactor |

---

## Phase 2: Dashboard Operational Improvements

| Task | Purpose | Dependencies | Difficulty | Data | Type |
|------|---------|--------------|------------|------|------|
| Reframe overview as service readiness | Make dashboard answer whether the restaurant is ready for service | Existing `dashboard/page.tsx`, `KitchenReadiness`, `AlertsPanel` | Medium | Mock | Refactor |
| Add supplies visibility to dashboard | Ensure supplies inventory is visible alongside ingredients | Existing `SuppliesTable`, normalized mock supplies | Low | Mock | New feature |
| Add daily CSV import status card | Show whether today's order history was imported | Existing CSV route, activity mock data | Low | Mock | New feature |
| Improve alert hierarchy | Sort critical items first and add direct next actions | Existing `AlertsPanel`, inventory mock data | Medium | Mock | Refactor |
| Add location/service date context | Ground the dashboard in restaurant operations | Existing `Header`, `mockLocations` | Medium | Mock | New feature |

---

## Phase 3: Inventory System Expansion

| Task | Purpose | Dependencies | Difficulty | Data | Type |
|------|---------|--------------|------------|------|------|
| Split inventory fixtures | Move inventory, supplies, tools, locations, and users into mock modules | Category normalization | Medium | Mock | Refactor |
| Add full supplies inventory view | Make supplies a first-class inventory category, not only a dashboard widget | Inventory table patterns | Medium | Mock | New feature |
| Add tools inventory data | Support durable tools such as tongs, scissors, grill plates, burners, thermometers | Category normalization | Low | Mock | New feature |
| Standardize quantity editor | Reuse inline edit behavior across ingredients, supplies, and tools | Existing `InventoryTable`, `SuppliesTable` | Medium | Mock | Refactor |
| Add manual adjustment metadata | Capture reason and note in mock UI | Standard quantity editor | Medium | Mock | New feature |

---

## Phase 4: Item Detail Views

| Task | Purpose | Dependencies | Difficulty | Data | Type |
|------|---------|--------------|------------|------|------|
| Replace generic related menu items | Align item detail with Sonsie menu mapping | Normalized inventory data | Low | Mock | Refactor |
| Add stock history section | Show mock adjustments, imports, and orders affecting the item | Activity mock modules | Medium | Mock | New feature |
| Add supplier panel | Show preferred supplier, unit cost, lead time, and Sysco placeholder | Supplier mock data | Low | Mock | New feature |
| Add mapping panel | Preview item-to-menu ingredient usage | Menu item mock data | Medium | Mock | New feature |

---

## Phase 5: CSV Ingestion UI Flow

| Task | Purpose | Dependencies | Difficulty | Data | Type |
|------|---------|--------------|------------|------|------|
| Extract CSV dropzone | Move upload UI out of route page | Existing `csv-import/page.tsx` | Low | Mock | Refactor |
| Extract import preview table | Make parsed row preview reusable and testable | CSV dropzone extraction | Medium | Mock | Refactor |
| Add column mapping step | Support real-world CSV format variation without backend | Import preview table | Medium | Mock | New feature |
| Replace generic parsed rows | Use Sonsie order history examples | Feature mock data | Low | Mock | Refactor |
| Add import summary and warnings | Clarify valid, warning, skipped, and unmapped rows | Validation mock helper | Medium | Mock | New feature |

---

## Phase 6: Reorder Recommendations UI

| Task | Purpose | Dependencies | Difficulty | Data | Type |
|------|---------|--------------|------------|------|------|
| Add recommendation explanations | Explain why each item is recommended | Normalized inventory mock data | Medium | Mock | New feature |
| Add supplier grouping | Group recommendations by supplier for order creation | Supplier mock data | Medium | Mock | New feature |
| Improve quantity editing | Keep selected item totals stable while editing | Existing reorder table | Medium | Mock | Refactor |
| Add draft order preview | Show what will be sent to supplier before route change | Orders mock data | Medium | Mock | New feature |
| Label Sysco as placeholder | Avoid implying real order submission | Existing orders/settings pages | Low | Mock | Refactor |

---

## Phase 7: Supplier Orders and Sysco Placeholder

| Task | Purpose | Dependencies | Difficulty | Data | Type |
|------|---------|--------------|------------|------|------|
| Add supplier account mock data | Centralize suppliers, lead times, integration status | Mock data split | Low | Mock | New feature |
| Extract order detail sheet | Reduce `orders/page.tsx` size and reuse detail presentation | Existing orders page | Medium | Mock | Refactor |
| Add Sysco placeholder states | Show connected, not configured, sync pending, sync failed as mock states | Supplier data | Medium | Mock | New feature |
| Add receive order flow polish | Clarify that receiving affects inventory later, not now | Existing orders state | Low | Mock | Refactor |

---

## Phase 8: Activity Log and Forecasting UI

| Task | Purpose | Dependencies | Difficulty | Data | Type |
|------|---------|--------------|------------|------|------|
| Centralize activity mock data | Unify dashboard feed, audit log, and item detail history | Mock data split | Medium | Mock | Refactor |
| Add activity event types | Model adjustment, import, order, supplier sync, mapping update | Activity mock module | Low | Mock | New feature |
| Reframe forecasting copy | Make it clear forecast data is mocked and operational | Existing forecasting page | Low | Mock | Refactor |
| Replace generic forecast items | Use Sonsie ingredients and supply categories | Inventory mock data | Low | Mock | Refactor |
| Add forecast-to-reorder path | Link projected shortages to reorder recommendations | Reorder route | Medium | Mock | New feature |

---

## Phase 9: Auth Placeholder and Responsive Optimization

| Task | Purpose | Dependencies | Difficulty | Data | Type |
|------|---------|--------------|------------|------|------|
| Clean mock login contract | Document and simplify fake auth behavior | Existing `app/page.tsx` | Low | Mock | Refactor |
| Add dashboard mobile nav | Make app shell usable on iOS and tablets | Existing sidebar/header | Medium | Mock | New feature |
| Add responsive table strategy | Ensure inventory/order/audit tables work on small screens | Shared table shell | High | Mock | Refactor |
| Add touch-friendly adjustment controls | Improve inline quantity edits on tablet | Standard quantity editor | Medium | Mock | Refactor |

---

## Single Best Next Coding Task

Normalize the inventory category model and mock data, then update the existing inventory page/dashboard supplies usage to use that model.

Why this is the best next task:

- It builds directly on the current v0 scaffold.
- It does not require backend logic.
- It fixes a real current issue: `inventory/page.tsx` expects `Ingredients` and `Tools`, while `mock-data.ts` contains `Meats`, `Seafood`, `Vegetables`, `Supplies`, and `Sauces`.
- It improves structure by creating a clearer inventory taxonomy.
- It improves usability because the inventory tabs will accurately show ingredients, supplies, and tools.
- It is realistically completable in one iteration.

Suggested scope:

- Update `InventoryItem.category` to `ingredient | supply | tool`.
- Add `subcategory` for `meat | seafood | vegetable | sauce | produce | disposable | serviceware | bar_tool | equipment`.
- Update centralized mock fixtures with Sonsie-focused ingredients, supplies, and tools.
- Do not add new hardcoded page/component data; route all sample input/output through fixtures or `.txt` sample files.
- Update `inventory/page.tsx` tab filters to use the normalized categories.
- Ensure `SuppliesTable` either consumes the same supply mock source or remains clearly dashboard-specific until extracted.
- Run `pnpm lint` from the repository root.

---

*Backlog drafted: 2026-04-13 01:08 -04:00 for the project team*
