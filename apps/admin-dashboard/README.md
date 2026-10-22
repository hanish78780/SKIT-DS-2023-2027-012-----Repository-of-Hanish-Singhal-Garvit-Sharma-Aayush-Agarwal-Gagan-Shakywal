# UniTransit Admin Dashboard

React and Vite administration interface for the UniTransit college transport project.

## Current behavior

- Demo sign-in accepts a non-empty email and password. Authentication is held in memory and resets on reload.
- The dashboard shows sample trips and map illustrations. These are not live GPS positions.
- Students, Drivers, and Buses pages support the existing assignment and management dialogs.
- `TransportProvider` stores demo buses, drivers, students, and trips in this browser's `localStorage`; this module does not call the backend yet.
- Routes, Trips, and Reports currently show work-in-progress placeholders. Other planned sidebar destinations do not yet have page implementations.

## Run locally

Use Node.js 22.12 or newer in the Node 22 release line, or Node.js 24, with npm.

```powershell
cd apps/admin-dashboard
npm ci
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

```powershell
npm run lint
npm run build
npm run preview
```

`build` writes the production bundle to the ignored `dist/` directory. `preview` serves that bundle locally. To reset demo records, remove the `unitransit_drivers`, `unitransit_buses`, `unitransit_students`, and `unitransit_trips` keys from this site's local storage.

## Structure

```text
public/              Images used by the app and browser icon
src/
  components/        Shared layout, sidebar, and navigation bar
  context/           Transport data context, provider, and consumer hook
  pages/             Page components with their styles
  App.jsx            Demo authentication and routes
  App.css            App-wide typography and resets
  index.css          Root sizing
  main.jsx           React entry point
```

React Router handles page navigation, Lucide supplies icons, and styles use plain CSS. Keep this module's changes within the repository's feature-branch and pull-request workflow.
