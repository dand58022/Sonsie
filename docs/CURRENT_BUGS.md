# Current Bugs

**Updated:** 2026-04-13
**Scope:** Root Next.js Kitchen Inventory app

## Open Bugs

| Area | Bug | Impact | Notes |
| --- | --- | --- | --- |
| Header | The global "Search inventory..." input in the dashboard header is decorative and does not execute a search or navigate to results. | Users can type into a visible control that has no effect. | Either wire it to inventory search/navigation or remove it from the shared header. |
| Dashboard Supplies Inventory | The dashboard `SuppliesTable` keeps its own local `mockSupplies` state instead of using the shared inventory provider. | Editing supplies on the dashboard does not update the Inventory page, KPIs, reorder recommendations, or other inventory surfaces. | Move dashboard supplies to the shared session inventory model or clearly make it read-only. |
| Orders | Creating a draft order creates an empty order without a line-item entry flow. | Managers can create a draft order shell but cannot build the order contents from the Orders page. | Current workaround is to stage items from Reorder recommendations. |
| Activity / Audit | Inventory drawer edits show a toast but do not append a consistent activity or audit entry. | The app can show inventory changes without a matching history trail. | Add session-local activity events for inventory edit saves. |
| Persistence | Inventory, reorder, orders, activity, and settings changes are session-local/browser-local depending on the surface. | Reloading can lose app state or show different state across pages. | This is an accepted mock limitation for now, not a backend request. |
| Test Coverage | There is no automated browser regression test for inventory row selection and item editing. | UI freezes or focus-trap regressions can reappear without a failing test. | Add Playwright once the project has an approved browser test dependency. |

## Recently Fixed In This Pass

| Area | Fix |
| --- | --- |
| Inventory selection | Replaced the Radix sheet-based item detail drawer with a plain fixed side panel to remove focus-trap/body-lock behavior during row selection. |
| Dark mode | Shifted dark theme tokens from low-contrast brown surfaces to neutral charcoal surfaces with stronger borders and foreground contrast. |
| Branding | Removed the duplicate GEN logo from the dashboard header; the sidebar remains the only app-shell logo. |
