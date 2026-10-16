# UniTransit

College transportation management system for SKIT Jaipur, with separate Student and Driver mobile apps, an Admin dashboard, and an Express API.

## Current implementation

| Package | Stack | Current scope |
| --- | --- | --- |
| [Student App](apps/student-app/README.md) | React Native / TypeScript | Student screens, route timeline, simulated bus tracking and sample notifications. Backend integration is pending. |
| [Driver App](apps/driver-app/README.md) | React Native / TypeScript | Trip UI and Android foreground GPS. Map, transport records and server broadcasts are still prototypes. |
| [Admin dashboard](apps/admin-dashboard/README.md) | React / Vite | Transport management screens backed by local mock state. |
| [Backend](backend/README.md) | Node.js / Express / Mongoose | Health endpoints, JWT authentication and student API foundation; domain schemas are retained for further integration. |

Clients access persistent data through the backend API. They must not connect directly to MongoDB. Development data is synthetic; live GPS uploads, cross-app tracking and FCM delivery remain integration work.

## Repository layout

```text
.
├── apps/
│   ├── admin-dashboard/      # Web client: src/, public/, package/config files
│   ├── driver-app/           # Mobile client: src/, android/, ios/, __tests__/, docs/
│   └── student-app/          # Mobile client: src/, android/, __tests__/
├── backend/
│   ├── src/
│   │   ├── config/           # Database connection
│   │   ├── controllers/      # Request handlers
│   │   ├── middleware/       # Authentication and authorization
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # Express routes
│   │   ├── app.js            # Express app
│   │   └── server.js         # Server entry point
│   ├── .env.example
│   └── package.json
├── docs/
│   ├── wiki/                 # Architecture, workflows and project guides
│   ├── reports/weekly/       # Historical college progress reports
│   └── repository-cleanup.md # Cleanup decisions and validation
├── scripts/reports/          # Progress report generator and Python requirements
├── .github/workflows/        # Scheduled report generation
├── .gitignore
└── README.md
```

Each app and the backend owns its dependencies and configuration. There is no root npm workspace or shared runtime package. Add shared code only when it has real consumers; create provider configuration when that integration is implemented.

## Getting started

Use Node.js 22.18 or later in the supported Node 22 release line. Android work also needs JDK 17, Android Studio and the SDK/NDK versions declared by the selected app. iOS work needs macOS, Xcode and CocoaPods.

Install dependencies inside the package you are working on:

```powershell
cd apps/admin-dashboard
npm ci
npm run dev
```

For a mobile app, start its development server and run Android in a second terminal. Use a separate port for each app:

```powershell
cd apps/driver-app
npm ci
npm start -- --port 8081
```

```powershell
cd apps/driver-app
npm run android -- --port 8081 --no-packager --active-arch-only
```

For the Student App use `apps/student-app` and port `8082`. The backend requires its own dependency install and environment configuration; follow its [setup guide](backend/README.md).

## Validation

Run checks from the package directory:

| Package | Checks |
| --- | --- |
| Admin dashboard | `npm run lint` and `npm run build` |
| Driver App | `npx tsc --noEmit`, `npm test -- --runInBand`, `npm run lint` |
| Student App | `npm run typecheck`, `npm test -- --runInBand`, `npm run lint` |
| Backend | Commands in [backend/README.md](backend/README.md) |

Mobile changes affecting native configuration also require an Android build and relevant emulator/device checks. See the [Driver GPS validation record](apps/driver-app/docs/foreground-gps-validation.md) and [project testing guide](docs/wiki/12-Testing.md).

## Progress reports

The reporting tool lives in [scripts/reports](scripts/reports/README.md). GitHub Actions generates the weekly report and archives it in [docs/reports/weekly](docs/reports/weekly). Existing PDFs are project records and remain versioned.

## Git workflow

Use `feature/*` or `docs/*` branches, open a pull request into `develop`, and promote tested releases to `main`. Keep feature work separate from cleanup and documentation. Do not push directly to `main` or `develop`, or merge without review.

## Team

| Member | Responsibility |
| --- | --- |
| Hanish Singhal | Driver App, GPS and technical coordination |
| Garvit Sharma | Backend and API |
| Gagan Shakywal | Student App |
| Aayush Agarwal | Admin dashboard and QA |

## Documentation and configuration

The [project wiki](docs/wiki/README.md) contains architecture, data models, environment setup, responsibilities and roadmap. These plans describe intended integrations; an unimplemented feature is not evidence that its supporting domain model is unnecessary.

Use each package's `.env.example` for local configuration. Keep credentials, generated builds, caches and installed dependencies out of Git.
