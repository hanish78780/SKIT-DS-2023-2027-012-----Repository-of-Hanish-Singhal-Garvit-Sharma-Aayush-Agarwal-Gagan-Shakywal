# UniTransit — Milestone 1: Backend Setup

This milestone covers the first backend task from the UniTransit plan:

- Node.js environment
- Express server
- Basic middleware
- `.env.example`
- Health-check endpoint

Repository:

`https://github.com/hanish78780/UniTransit`

## 1. Install dependencies

From the `backend` directory:

```bash
npm install
```

## 2. Create environment file

```bash
cp .env.example .env
```

The `.env` file is intentionally ignored by Git.

## 3. Start development server

```bash
npm run dev
```

Expected output:

```text
UniTransit backend running at http://localhost:5000
```

## 4. Test the API

Open:

```text
http://localhost:5000/
```

or:

```text
http://localhost:5000/api/health
```

Expected health response:

```json
{
  "success": true,
  "service": "unitransit-backend",
  "status": "healthy"
}
```

## Git workflow

The project guide specifies a feature branch from `develop`:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/backend-setup
```

After testing:

```bash
git add backend
git commit -m "feat: initialize backend setup"
git push -u origin feature/backend-setup
```

Then create a Pull Request:

```text
feature/backend-setup → develop
```

## Milestone 1 definition of done

- [x] Express backend initialized
- [x] Server starts locally
- [x] Health endpoint works
- [x] `.env.example` added
- [x] Real `.env` excluded from Git
- [x] No database/authentication code yet

MongoDB schemas, Firebase authentication, RBAC, REST resources and GPS APIs belong to later milestones.
