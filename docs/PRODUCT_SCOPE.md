# Sonsie Product Scope

**Date:** 2026-04-13 01:08 -04:00
**Audience:** Project team
**Status:** Planned
**Scope:** Product definition for the current root-level inventory platform
**Implementation:** `app/dashboard`, `components/dashboard`, `lib/mock-data.ts`

---

## Overview

Sonsie is an internal inventory operations platform demo for a restaurant team. The current root-level Next.js app already represents the product shape: login, dashboard, inventory, CSV import, reorder recommendations, supplier orders, forecasting, audit log, and settings.

The product should help restaurant managers and operations staff understand whether the kitchen is ready for service, what needs to be counted or adjusted, what needs to be reordered, and what changed recently.

---

## Target Users

| User | Needs | Primary Screens |
|------|-------|-----------------|
| Restaurant manager | See readiness, low stock, pending orders, and recent changes before service | Overview, Inventory, Reorder, Orders, Activity Log |
| Kitchen lead | Adjust counts quickly and identify shortages | Inventory, Item Detail, Alerts |
| Operations staff | Compare locations, review usage, prepare orders | Overview, Forecasting, Reorder, Orders |
| Procurement/admin | Manage supplier ordering and integration placeholders | Orders, Settings, Reorder |
| Future auditor/admin | Review who changed inventory and when | Activity Log, Item Detail |

---

## Product Purpose

The app exists to answer operational questions quickly:

- Are we ready for today or tomorrow service?
- Which ingredients, supplies, or tools need attention?
- What should be reordered now?
- Which supplier order should be created or reviewed?
- What changed since the last count or import?
- Which menu items are driving usage?
- Which data came from CSV imports versus manual adjustments?

---

## Core Workflows

### Inventory Management

1. Manager opens dashboard and checks readiness.
2. Manager drills into inventory.
3. Manager filters by category, status, and search.
4. Manager updates quantity inline or opens item detail.
5. App reflects updated status and later records an audit event.

### Daily CSV Ingestion

1. Staff opens CSV import page.
2. Staff drags in daily order history CSV.
3. App previews parsed rows and validation messages.
4. Staff reviews warnings/errors.
5. In the demo, import completes locally; later it commits order history and inventory usage.

### Reorder Planning

1. Manager opens reorder recommendations.
2. Manager filters by urgency or supplier.
3. Manager selects items and edits recommended quantities.
4. Manager creates a draft supplier order.
5. Later, Sysco integration can submit or export the order.

### Supplier Orders

1. Manager reviews draft/submitted/received orders.
2. Manager opens order detail.
3. Manager submits a draft or marks delivery received in the mock UI.
4. Later, this flow writes purchase orders and supplier sync status.

### Audit and Activity

1. Manager reviews recent dashboard activity.
2. Manager opens full audit log.
3. Manager filters by user, action, item, and date.
4. Later, every import, adjustment, order, and mapping change writes immutable audit events.

---

## MVP Features

| Feature | Current Scaffold Status | MVP Direction |
|---------|-------------------------|---------------|
| Login/password gate | Mock login exists | Keep mock auth, clean copy, route into dashboard |
| Dashboard shell | Exists | Make responsive and add location/service context |
| Overview dashboard | Exists | Prioritize readiness, alerts, supplies visibility, reorder queue |
| Ingredients inventory | Partially exists | Fix category model and table behavior |
| Supplies inventory | Exists as dashboard widget and mixed inventory category | Promote to full inventory category and dashboard visibility |
| Tools inventory | Route tab exists but data model is missing | Add mock tool data and use same inventory table patterns |
| Manual stock edits | Inline quantity edits exist | Standardize edit behavior and mock audit events |
| CSV import | Exists | Refactor into components and make Sonsie sample data realistic |
| Reorder recommendations | Exists | Add explanation and draft-order clarity |
| Supplier orders | Exists | Keep Sysco as placeholder, not real integration |
| Activity/audit | Exists | Connect mock activity to inventory actions where possible |
| Forecasting | Exists | Keep mocked, reduce overclaiming |
| iOS/tablet support | Weak due to fixed sidebar | Add responsive app shell and table treatment |

---

## Later Features

| Feature | Later Scope |
|---------|-------------|
| Real authentication | User accounts, roles, sessions, password policy |
| Persistent database | Inventory, users, locations, suppliers, orders, imports, audit events |
| Item-to-ingredient mapping | POS menu item mapping to inventory depletion rules |
| Unit conversion | Cases, packs, pounds, ounces, grams, trays, portions, yields |
| Real CSV ingestion | Upload, validate, preview, commit, import history |
| Forecasting engine | Demand projections from order history and calendar context |
| Sysco integration | API credentials, catalog matching, draft/submit/sync lifecycle |
| Multi-location operations | Location comparison, transfers, regional alerts |
| Advanced auditing | Immutable event log and exportable reports |

---

## How the Current Dashboard Fits

The current dashboard is the product's command center, not a landing page. It should stay focused on operational readiness:

- KPI cards should summarize inventory value, low stock, pending orders, and usage.
- Kitchen readiness should become the dominant readiness signal.
- Supplies table belongs on the dashboard because service supplies directly affect restaurant readiness.
- Alerts panel should rank urgent blockers before informational updates.
- Quick actions should route to the most common manager actions: upload CSV, adjust stock, create order, review reorder queue.
- Activity feed should explain recent changes and link to the full audit log.

---

## Out of Scope Until Requested

- Real backend and database.
- Real Sysco calls or supplier API credentials.
- Real forecasting model.
- Production auth provider.
- Multi-tenant billing or public SaaS account management.
- Marketing landing pages.

---

*Product scope drafted: 2026-04-13 01:08 -04:00 for the project team*
