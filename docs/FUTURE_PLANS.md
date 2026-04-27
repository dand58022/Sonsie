# Sonsie Future Plans

**Date:** 2026-04-13 04:00 -04:00
**Audience:** Project team
**Status:** Active future roadmap reference
**Scope:** Production-phase features that are not implemented in the current frontend mock app

---

## Purpose

This file tracks future production features that the current mock-data-first app should leave room for without implementing prematurely. Agents and contributors should reference this file before brainstorming, planning, or implementation so current frontend work does not block later production architecture.

The current app uses frontend-only mock data and CSV ingestion workflows. Production integrations may replace or augment these workflows later, but they are not active now.

---

## Production-Phase Features

| Feature | Status | Description |
|---------|--------|-------------|
| Supplier ordering: Sysco and other suppliers | [In Production - Not Implemented] | Enable real supplier order submission, order status retrieval, catalog lookup, vendor-specific order constraints, and integration-safe error handling. Current draft order UI must remain mock-only until this is explicitly requested. |
| Multi-supplier integration framework | [In Production - Not Implemented] | Introduce a provider-neutral integration layer for Sysco, US Foods, local farms, specialty vendors, and future suppliers. Current mock supplier grouping should not assume one supplier API or one submission path. |
| Revel API ingestion | [In Production - Not Implemented] | Replace or augment manual CSV ingestion with direct Revel POS data ingestion for sales and order history. Current CSV flow should stay modular so Revel can become a future source without rewriting inventory workflows. |
| Automated data syncing | [In Production - Not Implemented] | Support scheduled sync jobs, retry handling, sync status, conflict review, and import audit history for supplier and POS data. Current frontend mock states must not imply real background sync exists. |
| DeepSeek AI-assisted reorder logic and forecasting | [In Production - Not Implemented] | Use DeepSeek or another approved model to assist reorder recommendations, demand explanation, and forecast review after production data contracts exist. Current reorder recommendations should remain deterministic mock data and must not claim AI-backed decisions. |
| Demo Walkthrough Mode | [In Production - Not Implemented] | Add a guided step-by-step onboarding and demo experience that highlights CSV ingestion, reorder recommendations, draft order staging, prepared order review, and activity history. Useful for demos, onboarding, and restaurant manager training. |
| Command palette and keyboard shortcuts | [In Production - Not Implemented] | Add fast keyboard-driven navigation and common operations such as upload CSV, open reorders, jump to forecast, search inventory, and open draft order review. |
| Bulk inventory editing and review queues | [In Production - Not Implemented] | Add safer bulk-edit flows for counts, reorder quantities, mapping review, and supplier packet adjustments with clear before/after confirmation. |
| Advanced filtering and saved operational views | [In Production - Not Implemented] | Add saved filters for managers such as critical stock, supplier-specific prep, today in service, unmatched imports, and ready-to-order packets. |
| Multi-location operating mode | [In Production - Not Implemented] | Add location-aware inventory, forecast, activity, and ordering views once production auth and data contracts exist. Current mock views should not assume a single permanent location model. |

---

## Current Implementation Boundary

- Inventory, CSV ingestion, reorder recommendations, draft order prep, prepared order review, activity history, forecasting, and mock auth are frontend-only mock workflows.
- No production supplier submission, POS ingestion, automated syncing, auth, payment, or AI forecasting is implemented.
- New UI work should keep data inputs and outputs replaceable through typed fixtures and local state.
- Any future production feature identified during planning must be added to this file, even as a short placeholder entry.
