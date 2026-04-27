# Sonsie Mock Inventory System

Sonsie Mock Inventory System is a frontend-only Next.js demo for an internal restaurant inventory platform. It is designed around an American bistro and wine bar workflow where managers can review stock levels, import order history, stage vendor draft orders, prepare internal review packets, and audit what happened during the session.

## Fastest Windows Launch

Open Windows Terminal, paste this single line, and press `Enter`:

```powershell
winget install --id Git.Git -e --source winget --accept-package-agreements --accept-source-agreements; winget install --id OpenJS.NodeJS.LTS -e --source winget --accept-package-agreements --accept-source-agreements; $git=@("$env:ProgramFiles\Git\cmd\git.exe","$env:LocalAppData\Programs\Git\cmd\git.exe") | Where-Object { Test-Path $_ } | Select-Object -First 1; if (-not $git) { throw "Git was not found after installation. Close Windows Terminal, reopen it, and run this command again." }; if (Test-Path .\Sonsie) { throw "A .\Sonsie folder already exists here. Move or rename it, then run this command again." }; & $git clone https://github.com/dand58022/Sonsie; Set-Location .\Sonsie; powershell -ExecutionPolicy Bypass -File .\scripts\start-sales-demo.ps1
```

## What To Expect

- Windows may ask you to approve the Git and Node.js installs. Accept those prompts.
- The first launch can take a few minutes because it installs everything automatically.
- A second PowerShell window opens and keeps the app running.
- Your browser opens to `http://localhost:3000` automatically when the app is ready.

## Every Time After

After the first setup, open the `Sonsie` folder and double-click `Start Sonsie.bat`.

That file:

- checks that Git, Node.js, and npm are available
- pulls the latest repo updates with `git pull --ff-only`
- makes sure dependencies are installed correctly
- starts the app
- opens `http://localhost:3000`

## If The First Install Failed

If the first one-line setup command already created a `Sonsie` folder but failed partway through:

1. Open Windows Terminal.
2. Go into the existing `Sonsie` folder.
3. Run `git pull`.
4. Double-click `Start Sonsie.bat` in that folder, or run `.\Start Sonsie.bat`.

If the existing `Sonsie` folder is incomplete or broken and `git pull` does not work:

1. Delete that `Sonsie` folder.
2. Open Windows Terminal again.
3. Run the one-line setup command from this README one more time.

## Demo Credentials

Username: `SonsieAdmin`

Password: `SONSIE`

## Demo Flow

1. Log in with the demo credentials.
2. Open CSV Import and simulate uploading today's order history.
3. Review Inventory to see the operational ingredient, supply, and tool views.
4. Navigate to Reorder Recommendations.
5. Add one or more recommendations to the draft order.
6. Adjust quantities or remove an item to create session activity.
7. Open Prepare Order to review supplier-grouped order packets.
8. Mark the prepared order as ready.
9. Open Activity Log to see static mock history plus the session events you just created.
10. Open Prep Forecast to review deterministic mock stock projections and risk levels.
11. Use the header account menu to switch between light and dark mode or log out.

## Features

- Mock authentication for protected dashboard routes
- Inventory views for ingredients, supplies, and tools
- CSV ingestion demo for daily order history
- Reorder recommendations with mock rationale and urgency
- Draft order staging from reorder recommendations
- Prepared order review grouped by supplier
- Activity log with static mock history plus current-session draft order events
- Forecasting page with deterministic mock depletion logic and Recharts visualizations
- Dashboard quick actions for CSV upload, reorders, draft orders, and forecast review
- Light/dark theme support with light mode as the default
- Toast feedback for login, CSV import, reorder, draft order, and order review actions
- Polished empty states, sticky table headers, table overflow handling, and responsive dashboard layouts

## Manual Run

If Git and Node.js are already installed, use:

```powershell
git clone https://github.com/dand58022/Sonsie
cd .\Sonsie
powershell -ExecutionPolicy Bypass -File .\scripts\start-sales-demo.ps1
```

## Notes

This is a frontend-only demo. It uses mock data and session-only React state, with no backend, persistence, API calls, supplier submission, or real authentication service.

Future integrations such as supplier ordering, supplier APIs, Revel ingestion, automated syncing, and AI-assisted forecasting are documented in `docs/FUTURE_PLANS.md` and are not implemented in this demo.
