# Repository Structure

The repository contains four independently installed packages. Runtime code belongs to its app or to `backend/src`; documentation and reporting tools live outside those packages.

```text
apps/
├── admin-dashboard/          # React web client
├── driver-app/               # React Native client, Android/iOS projects, tests
└── student-app/              # React Native client, Android project, tests
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── app.js
│   └── server.js
├── .env.example
└── package.json
docs/
├── wiki/
├── reports/weekly/
└── repository-cleanup.md
scripts/reports/
├── generate_report.py
├── requirements.txt
└── README.md
.github/workflows/
README.md
```

- Keep each package's source, dependencies and tests together. Install from its own package directory.
- Keep all backend Mongoose schemas under `backend/src/models` and connection setup under `backend/src/config`.
- Keep static web assets under the Admin dashboard's `public/` directory and importable source assets beside their consumers.
- Keep the React Native entry points, Android/iOS resources, Gradle wrappers and build configuration required by their toolchains.
- Keep historical college reports in `docs/reports/weekly`; the workflow uses `scripts/reports/generate_report.py` to create new reports.
- Empty `shared` and `firebase` placeholder trees are omitted. Add them when there is implemented shared code or provider configuration with an actual consumer.
- Installed dependencies, native build output, caches, local credentials and editor settings are ignored.

## Branch model

- `main`: stable/college-demo code.
- `develop`: integration branch.
- `feature/*`: individual development branches.
- `docs/*`: documentation work.

Use pull requests to move reviewed work into `develop`, then promote tested releases to `main`.
