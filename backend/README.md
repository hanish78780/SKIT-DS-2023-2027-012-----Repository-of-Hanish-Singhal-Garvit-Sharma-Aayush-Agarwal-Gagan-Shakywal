# UniTransit Backend

Express and MongoDB API for UniTransit. The implemented routes provide health checks, password-based authentication, and authenticated student record operations. The mobile apps currently use their own demo services; backend integration is separate work.

## Structure

```text
backend/
  src/
    app.js                Express application and route mounting
    server.js             Environment loading, database connection, HTTP startup
    config/               Database configuration
    controllers/          Student request handlers
    middleware/           JWT authentication and role-check helper
    models/               Mongoose schemas, including planned transport resources
    routes/               Authentication and student routes
  test/                   Offline HTTP and model-registration checks
  .env.example            Required local configuration template
  package.json            Dependency and script entry point
  package-lock.json       Locked dependency versions
```

`Student` imports `Route` so the existing route-population queries resolve a registered model. Bus, Driver, Trip, and Attendance schemas are retained for the planned transport API; they do not yet have HTTP routes.

## Local setup

Requirements: Node.js 20 or newer, npm, and an accessible MongoDB instance.

From `backend/`, install the locked dependencies:

```bash
npm ci
```

Copy `.env.example` to `.env`, set `MONGODB_URI` to your development database, and replace `JWT_SECRET` with a long random value. The `.env` file is ignored by Git. Never commit real credentials.

```bash
npm run dev
```

For a regular process without automatic restart:

```bash
npm start
```

The server connects to MongoDB before listening on `PORT` (default `5000`). Missing `JWT_SECRET`, missing `MONGODB_URI`, or a failed database connection stops startup. CORS currently uses the middleware's default policy; there is no environment-based origin allowlist yet.

## Current endpoints

| Method | Path | Access |
| --- | --- | --- |
| GET | `/` | Public service information |
| GET | `/api/health` | Public process-health response |
| POST | `/api/auth/register` | Public registration |
| POST | `/api/auth/login` | Public credentials login, returns a JWT |
| GET | `/api/auth/me` | Bearer token required |
| GET, POST | `/api/students` | Bearer token required |
| GET, PUT, DELETE | `/api/students/:id` | Bearer token required |

The health response confirms that the HTTP application can respond; it does not perform a fresh database query. Student routes currently require authentication but do not enforce role or record-ownership restrictions. Public registration currently accepts the defined student, driver, and admin role values. Review these authorization rules before deploying beyond local development.

## Validation

```bash
npm test
```

These tests start the real Express application on an ephemeral local port, verify health and unauthenticated access handling, and check that the Student route model can be resolved. They do not connect to MongoDB or create users or student records. Database-backed CRUD and authentication flows still require separate integration testing.

Use a feature branch from `develop`, validate changes, and open a pull request targeting `develop`, following the repository contribution guide.
