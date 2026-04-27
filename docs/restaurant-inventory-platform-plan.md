# Restaurant Inventory Platform Implementation Plan

**Date:** 2026-04-13
**Status:** Planned
**Scope:** React/Next.js localhost demo for an internal restaurant inventory platform
**Implementation:** `src/app`, `src/features`, `src/components`, `src/server`, `prisma`

---

## Overview

Internal inventory management platform for a restaurant chain, designed around day-to-day restaurant operations rather than a generic SaaS dashboard. The first build should support a polished localhost demo for a premium Korean BBQ brand: location-aware navigation, inventory views for ingredients/supplies/tools, drag-and-drop CSV ingestion, manual stock adjustments, reorder recommendations, and an activity trail using mock data.

The architecture should be ready to grow into authenticated multi-location inventory, supplier ordering, Sysco integration, forecasting, and durable audit history without overbuilding those systems in the demo phase.

---

## Repo Architecture Summary

Current repo:

```
DropYourPantry/
|-- README.md
|-- examplePlan.md
`-- docs/
    `-- restaurant-inventory-platform-plan.md
```

The repo is otherwise greenfield on branch `demo/localhost-website`. There is no package manager, app framework, source directory, test setup, database schema, or build tooling yet.

Recommended target architecture:

```
DropYourPantry/
|-- README.md
|-- package.json
|-- next.config.ts
|-- tsconfig.json
|-- eslint.config.mjs
|-- postcss.config.mjs
|-- prisma/
|   |-- schema.prisma
|   `-- seed.ts
|-- public/
|   `-- brand/
|-- src/
|   |-- app/
|   |-- components/
|   |-- features/
|   |-- lib/
|   |-- server/
|   |-- styles/
|   `-- types/
|-- tests/
|   |-- unit/
|   `-- e2e/
`-- docs/
    `-- restaurant-inventory-platform-plan.md
```

---

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js App Router + React + TypeScript | Good fit for responsive internal app, server-rendered data views, route handlers, and future authenticated workflows |
| Styling | Tailwind CSS plus small app-specific CSS variables | Fast demo iteration, consistent spacing, easy brand theming without adding a large UI framework |
| UI library | Start with hand-rolled focused components; consider Radix UI for dialogs/sheets/selects | Keeps the demo visually distinct while using proven primitives when accessibility complexity is high |
| Data source, phase 1 | Centralized mock fixtures, typed lists, JSON-like fixtures, or `.txt` sample files | Keeps localhost demo fast while CSV format, inventory semantics, and supplier needs are still unsettled |
| Database, later | PostgreSQL with Prisma or Drizzle | Strong relational model for inventory, orders, mappings, audit events, and supplier data |
| State management | Server state first; React local state for UI workflows | Avoids premature global state; CSV ingestion and drawers can stay local until persistence exists |
| Forms and mutations | Server Actions later, mock handlers first | Clean path from demo UI to real database writes |
| Auth, phase 1 | Password-protected demo shell or mocked session | Satisfies internal access expectations without blocking the demo on full RBAC |
| Brand direction | Premium Korean BBQ operations console | Avoid generic SaaS styling; emphasize service day, locations, prep, suppliers, stock health, and action queues |

---

## Recommended App Folder Structure

```
src/
|-- app/
|   |-- layout.tsx
|   |-- globals.css
|   |-- (auth)/
|   |   `-- login/
|   |       `-- page.tsx
|   |-- (app)/
|   |   |-- layout.tsx
|   |   |-- page.tsx
|   |   |-- inventory/
|   |   |   |-- ingredients/
|   |   |   |   `-- page.tsx
|   |   |   |-- supplies/
|   |   |   |   `-- page.tsx
|   |   |   |-- tools/
|   |   |   |   `-- page.tsx
|   |   |   `-- [itemId]/
|   |   |       `-- page.tsx
|   |   |-- ingest/
|   |   |   `-- page.tsx
|   |   |-- mappings/
|   |   |   `-- page.tsx
|   |   |-- recommendations/
|   |   |   `-- page.tsx
|   |   |-- suppliers/
|   |   |   `-- page.tsx
|   |   |-- forecasting/
|   |   |   `-- page.tsx
|   |   |-- activity/
|   |   |   `-- page.tsx
|   |   `-- settings/
|   |       `-- locations/
|   |           `-- page.tsx
|   `-- api/
|       |-- ingest/
|       |   `-- csv/
|       |       `-- route.ts
|       `-- suppliers/
|           `-- sysco/
|               `-- route.ts
|
|-- components/
|   |-- app-shell/
|   |-- ui/
|   |-- data-display/
|   `-- forms/
|
|-- features/
|   |-- activity/
|   |-- auth/
|   |-- forecasting/
|   |-- ingest/
|   |-- inventory/
|   |-- mappings/
|   |-- recommendations/
|   `-- suppliers/
|
|-- lib/
|   |-- csv/
|   |-- dates/
|   |-- money/
|   |-- units/
|   `-- validation/
|
|-- server/
|   |-- actions/
|   |-- auth/
|   |-- db/
|   |-- repositories/
|   `-- services/
|
|-- styles/
`-- types/
```

---

## Recommended Component Hierarchy

### App Shell

```
RootLayout
`-- AuthBoundary
    `-- RestaurantAppShell
        |-- SidebarNav
        |-- MobileNav
        |-- LocationSwitcher
        |-- ServiceDatePicker
        |-- UserMenu
        `-- PageFrame
            |-- PageHeader
            |-- PageActions
            `-- PageContent
```

### Inventory

```
InventoryPage
|-- InventoryHealthSummary
|-- InventoryToolbar
|   |-- CategoryTabs
|   |-- SearchInput
|   |-- StorageAreaFilter
|   `-- StockStatusFilter
|-- InventoryTable
|   `-- InventoryItemRow
|       |-- StockStatusBadge
|       |-- QuantityCell
|       |-- ReorderSignal
|       `-- ItemActionsMenu
`-- ManualAdjustmentSheet
```

### CSV Ingestion

```
IngestPage
|-- CsvDropzone
|-- ImportPreviewTable
|-- ColumnMappingPanel
|-- ImportValidationSummary
`-- ImportCommitPanel
```

### Recommendations

```
RecommendationsPage
|-- ReorderQueue
|   `-- RecommendationCard
|       |-- RecommendationReasonList
|       `-- SupplierMatchBadge
`-- SupplierDraftOrderPanel
```

### Activity

```
ActivityPage
|-- ActivityFilters
|-- AuditTimeline
`-- ActivityDetailDrawer
```

---

## Data Models

### Core Restaurant Context

```ts
type RestaurantGroup = {
  id: string;
  name: string;
};

type Location = {
  id: string;
  groupId: string;
  name: string;
  timezone: string;
  address?: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "procurement" | "viewer";
  locationIds: string[];
};
```

### Inventory

```ts
type InventoryCategory = "ingredient" | "supply" | "tool";

type InventoryItem = {
  id: string;
  locationId: string;
  category: InventoryCategory;
  name: string;
  sku?: string;
  storageArea: "walk_in" | "freezer" | "dry_storage" | "bar" | "office" | "service_floor";
  unit: "each" | "case" | "pack" | "lb" | "oz" | "kg" | "g" | "gal" | "qt" | "liter";
  quantityOnHand: number;
  parLevel: number;
  reorderPoint: number;
  preferredSupplierId?: string;
  lastCountedAt?: string;
};

type StockAdjustment = {
  id: string;
  itemId: string;
  locationId: string;
  previousQuantity: number;
  newQuantity: number;
  delta: number;
  reason: "count" | "waste" | "transfer" | "received" | "prep_use" | "correction";
  note?: string;
  createdByUserId: string;
  createdAt: string;
};
```

### Menu and Ingredient Mapping

```ts
type MenuItem = {
  id: string;
  locationId: string;
  posName: string;
  displayName: string;
  category: "bbq_set" | "meat" | "banchan" | "beverage" | "dessert" | "other";
};

type MenuItemIngredientMapping = {
  id: string;
  menuItemId: string;
  inventoryItemId: string;
  quantityPerUnitSold: number;
  unit: string;
  yieldFactor?: number;
};
```

### CSV Ingestion and Orders

```ts
type CsvImport = {
  id: string;
  locationId: string;
  fileName: string;
  status: "uploaded" | "mapped" | "validated" | "committed" | "failed";
  rowCount: number;
  importedByUserId: string;
  importedAt: string;
};

type DailyOrder = {
  id: string;
  locationId: string;
  businessDate: string;
  source: "csv" | "pos_api" | "manual";
  importId?: string;
};

type DailyOrderLine = {
  id: string;
  orderId: string;
  menuItemName: string;
  menuItemId?: string;
  quantitySold: number;
  grossSales?: number;
};
```

### Suppliers, Recommendations, Forecasting, Audit

```ts
type Supplier = {
  id: string;
  name: string;
  integrationType: "none" | "sysco" | "email" | "csv_export";
};

type ReorderRecommendation = {
  id: string;
  locationId: string;
  itemId: string;
  recommendedQuantity: number;
  reason: string;
  confidence: "low" | "medium" | "high";
  status: "open" | "dismissed" | "added_to_order";
};

type ForecastOutput = {
  id: string;
  locationId: string;
  itemId: string;
  forecastDate: string;
  expectedUsage: number;
  recommendedParLevel?: number;
};

type AuditEvent = {
  id: string;
  locationId: string;
  actorUserId?: string;
  entityType: string;
  entityId: string;
  action: string;
  summary: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
};
```

---

## State Management Recommendation

Use the URL and server data as the primary state boundaries. Inventory category, location, search, filters, and date should be represented in routes or query params where practical so screens are shareable and refresh-safe.

Until the project maintainers explicitly request otherwise, all website data input/output should remain mocked for each implementation iteration. Mock data should live in centralized lists, typed fixture modules, JSON-like fixture structures, or `.txt` sample data files for testing. Do not hardcode data directly inside route pages or UI components, because the final data flow is not set in stone.

Use React local state for:

| UI Area | State |
|---------|-------|
| CSV upload | Drag state, selected file, preview rows, mapped columns, validation messages |
| Manual adjustments | Open sheet state, draft quantity, selected reason, note |
| Mobile navigation | Open/closed state |
| Tables | Temporary sorting, focused row, row action menus |

Avoid adding Zustand, Redux, or TanStack Query in the first demo unless a real interaction requires cross-page client cache or optimistic updates. When persistence is added, prefer Server Components for read-heavy pages and Server Actions or route handlers for mutations.

---

## Routing and Page Plan

| Route | Purpose | Demo Data |
|-------|---------|-----------|
| `/login` | Password-protected entry | Mock login form or static demo password |
| `/` | Operational overview | Redirect to `/inventory/ingredients` or show stock health summary |
| `/inventory/ingredients` | Meat, banchan, sauces, prep ingredients | Mock stock table with Korean BBQ-focused items |
| `/inventory/supplies` | Disposables, cleaning, packaging, service supplies | Mock supply table |
| `/inventory/tools` | Durable tools and equipment | Mock tools table |
| `/inventory/[itemId]` | Item detail, history, mappings, supplier info | Mock item detail by ID |
| `/ingest` | Drag-and-drop daily order CSV upload | Mock parsing and validation |
| `/mappings` | POS item to ingredient mapping | Mock mapping table and unmapped item queue |
| `/recommendations` | Reorder recommendation queue | Mock recommendations and draft supplier order |
| `/suppliers` | Supplier accounts and Sysco status | Mock suppliers and disabled integration controls |
| `/forecasting` | Usage forecast and variance review | Mock forecast cards/charts |
| `/activity` | Audit and import history | Mock event timeline |
| `/settings/locations` | Locations, roles, units, integration config | Mock settings cards |

---

## Mock First vs Build Later

### Mock First

| Area | Mock Behavior |
|------|---------------|
| Authentication | Single demo session or password gate |
| Locations | 2-3 mock restaurant locations stored in a fixture list |
| Inventory | Centralized fixture arrays or sample files for ingredients, supplies, tools |
| Manual stock modifications | Client-side update plus mock audit event |
| CSV ingestion | Parse preview from selected file or use sample rows; do not persist |
| Recommendations | Static recommendations with clear operational reasons |
| Activity history | Static timeline generated from mock stock adjustments and imports |
| Supplier ordering | Draft order panel with disabled submit state |
| Forecasting | Mock expected usage values and variance labels |

### Build Later

| Area | Real Implementation |
|------|---------------------|
| Authentication | User accounts, sessions, password policy, RBAC |
| Database | PostgreSQL schema, migrations, seed data |
| CSV ingestion | File upload, schema mapping, row validation, import commit transaction |
| Unit conversion | Canonical unit system and conversion rules |
| Item mapping | Persistent menu item to inventory item mapping |
| Recommendations | Rules engine using par levels, forecasted usage, and lead time |
| Sysco integration | API credentials, catalog mapping, order submission, error handling |
| Forecasting | Daily order history model and scheduled forecast runs |
| Audit | Immutable event log for imports, adjustments, mapping changes, supplier orders |

---

## Data Flow

### Localhost Demo Flow

1. User opens `/login` and enters the demo password.
2. App routes to the authenticated shell on `/inventory/ingredients`.
3. Inventory pages load mock fixture data filtered by selected location.
4. User opens the manual adjustment sheet and changes stock quantity.
5. UI updates the mock inventory state and appends a mock audit event.
6. User opens `/ingest`, drops a CSV, and sees preview/validation output.
7. User opens `/recommendations` and sees reorder suggestions based on mock low-stock items.

### Future Persistent Flow

1. User authenticates and receives a session.
2. Server Components fetch inventory by location and category from the database.
3. CSV upload route stores the raw import, validates rows, and creates a preview.
4. Import commit creates daily orders, daily order lines, mapping warnings, and audit events in one transaction.
5. Recommendation service reads stock, par levels, forecast outputs, supplier lead times, and open purchase orders.
6. Supplier order service creates draft purchase orders and optionally submits through Sysco.

---

## API and Server Actions

### Demo Phase

No real API is required for the first static localhost demo. Use mock modules under `src/features/*/data`, `src/server/mock`, or `.txt` sample files for input/output testing. Do not hardcode demo data directly inside UI components.

### Persistence Phase

```
POST /api/ingest/csv
  Body: multipart/form-data
  Response: { importId, rowCount, previewRows, validationMessages }

POST /api/suppliers/sysco
  Body: { purchaseOrderId }
  Response: { status, externalOrderId?, errors? }
```

Server actions:

```
adjustStock(input)
  Creates StockAdjustment and AuditEvent

updateMenuItemMapping(input)
  Creates or updates MenuItemIngredientMapping and AuditEvent

dismissRecommendation(input)
  Updates ReorderRecommendation status and AuditEvent

createDraftPurchaseOrder(input)
  Creates PurchaseOrder and PurchaseOrderLine records from recommendations
```

---

## Testing Plan

| Layer | Tool | First Tests |
|-------|------|-------------|
| Unit | Vitest | Unit conversion helpers, recommendation rule helpers, CSV row validation |
| Component | React Testing Library | Inventory table, CSV dropzone, manual adjustment sheet |
| E2E | Playwright | Login to inventory, adjust stock, upload CSV preview, mobile navigation |
| Accessibility | Playwright/aXe later | Dialogs, sheets, keyboard navigation, table controls |

For the first demo, prioritize one or two smoke tests after scaffolding:

```
npm run test
npm run lint
npm run build
npm run e2e
```

---

## Risks and Unclear Areas

| Risk | Why It Matters | Mitigation |
|------|----------------|------------|
| CSV format unknown | Ingestion depends on POS export columns and naming conventions | Build a flexible column mapping UI and keep sample CSV fixtures editable |
| Unit semantics | Restaurant inventory mixes cases, pounds, ounces, packs, and prep yields | Model units explicitly from the start; defer complex conversion rules until data is known |
| Korean BBQ domain specifics | Generic stock screens may miss prep realities like banchan, marinades, cuts, and grill supplies | Seed demo data with real operational categories and service workflows |
| Sysco API access | Integration details may require credentials, sandbox access, and catalog matching | Mock supplier ordering first; isolate integration behind `server/services/suppliers` |
| Forecasting scope | Forecasting can become a separate analytics product | Start with explainable rule-based recommendations before predictive modeling |
| Auth scope | Password-protected may mean shared password, full user accounts, or RBAC | Use demo password first; design routes so real auth can replace it |
| Mobile/iOS support | Tables and dense inventory screens often break on phones | Design responsive cards or compressed rows for small screens from phase 1 |

---

## Phased Build Order

### Phase 1: Next.js Localhost Demo Foundation

Create the Next.js TypeScript app, baseline styling, app shell, premium Korean BBQ brand direction, mock auth gate, location switcher, responsive navigation, and seeded mock data.

Deliverables:

- `package.json` scripts for `dev`, `build`, `lint`, and `test`
- `src/app/layout.tsx`
- `src/app/(auth)/login/page.tsx`
- `src/app/(app)/layout.tsx`
- `src/components/app-shell/*`
- `src/features/*/data/*.ts` mock fixtures

### Phase 2: Inventory Experience

Build ingredients, supplies, and tools inventory pages using shared inventory components. Add item detail routes and manual stock adjustment UI with mock audit history.

Deliverables:

- `src/app/(app)/inventory/ingredients/page.tsx`
- `src/app/(app)/inventory/supplies/page.tsx`
- `src/app/(app)/inventory/tools/page.tsx`
- `src/app/(app)/inventory/[itemId]/page.tsx`
- `src/features/inventory/components/*`
- `src/features/activity/data/mock-activity.ts`

### Phase 3: CSV Ingestion Prototype

Build drag-and-drop CSV ingestion with preview, column mapping, validation summary, and mock commit state.

Deliverables:

- `src/app/(app)/ingest/page.tsx`
- `src/features/ingest/components/CsvDropzone.tsx`
- `src/features/ingest/components/ImportPreviewTable.tsx`
- `src/features/ingest/components/ColumnMappingPanel.tsx`
- `src/features/ingest/lib/parse-csv.ts`
- `src/features/ingest/lib/validate-import.ts`

### Phase 4: Mappings and Recommendations

Build POS item to ingredient mapping and reorder recommendations based on mock inventory levels, par levels, and supplier preferences.

Deliverables:

- `src/app/(app)/mappings/page.tsx`
- `src/app/(app)/recommendations/page.tsx`
- `src/features/mappings/components/*`
- `src/features/recommendations/components/*`
- `src/features/recommendations/lib/recommendations.ts`

### Phase 5: Suppliers, Forecasting, and Activity

Build supplier pages, disabled Sysco integration affordances, forecast overview, and full activity timeline.

Deliverables:

- `src/app/(app)/suppliers/page.tsx`
- `src/app/(app)/forecast/page.tsx`
- `src/app/(app)/activity/page.tsx`
- `src/features/suppliers/components/*`
- `src/features/forecasting/components/*`
- `src/features/activity/components/*`

### Phase 6: Persistence Foundation

Add database schema, seed data, repositories, and server actions. Convert inventory reads, stock adjustments, and audit events from mock data to persisted data.

Deliverables:

- `prisma/schema.prisma` or equivalent Drizzle schema
- `prisma/seed.ts`
- `src/server/db/*`
- `src/server/repositories/*`
- `src/server/actions/inventory.ts`
- `src/server/actions/activity.ts`

### Phase 7: Real Ingestion and Supplier Ordering

Persist CSV imports and daily orders, add mapping warnings, generate reorder recommendations from real usage data, and implement supplier order drafts. Keep Sysco submission behind a service interface until credentials and API details are confirmed.

Deliverables:

- `src/app/api/ingest/csv/route.ts`
- `src/app/api/suppliers/sysco/route.ts`
- `src/server/services/ingest/*`
- `src/server/services/recommendations/*`
- `src/server/services/suppliers/*`

---

## Extension Points

| Component | Future Enhancement |
|-----------|-------------------|
| `features/ingest` | Support multiple POS CSV formats and saved column mappings |
| `features/recommendations` | Replace simple par-level logic with forecast-aware recommendations |
| `features/suppliers` | Add Sysco catalog lookup, order submission, and status sync |
| `features/forecasting` | Add scheduled forecast runs using order history and event calendars |
| `server/actions` | Add authorization checks and immutable audit writes |
| `features/inventory` | Add storage-area transfers, lot tracking, and prep batch tracking |

---

*Plan drafted: 2026-04-13*
