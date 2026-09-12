# UniTransit 🚌

> **Smart College Transportation Management System for SKIT Jaipur**

UniTransit is a college-focused transportation management platform designed for **Swami Keshwanand Institute of Technology & Management (SKIT Jaipur)**. It connects students, drivers, and college transport administrators through a unified system for bus management, route management, trip operations, and real-time transportation tracking.

## 🎯 Project Goal

The goal of UniTransit is to make college transportation safer, more transparent, and easier to manage by providing:

- Live bus tracking
- Driver trip management
- Student bus and route information
- Route and stop management
- Bus and driver administration
- Transport notifications
- Trip monitoring and history
- Centralized college transport operations

## 🏗️ System Architecture

```text
                         UniTransit
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
       Student App       Driver App      Admin Dashboard
       React Native      React Native        React + Vite
             │                │                │
             └────────────────┼────────────────┘
                              ▼
                     Node.js + Express
                              │
                              ▼
                           MongoDB
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
              GPS / Location       Transport Data
```

### Applications

| Application | Platform | Purpose |
|---|---|---|
| **Student App** | React Native / Android | Bus tracking, routes, stops, trip status and notifications |
| **Driver App** | React Native / Android | Driver login, assigned bus/route, trip control and GPS location |
| **Admin Dashboard** | React + Vite / Web | Manage buses, drivers, students, routes, trips and transport operations |
| **Backend** | Node.js + Express | API, authentication, business logic and communication between clients |
| **Database** | MongoDB | Stores application and transportation data |

## 📱 Student App

The Student App is designed around the student's daily transportation needs.

### Planned / Implemented Features

- Student authentication
- Student profile
- Assigned bus information
- Assigned route and pickup stop
- Live bus tracking
- Estimated arrival information
- Route and stop timeline
- Driver information relevant to transportation
- Trip status
- Transport notifications
- Report transport issue
- Help and safety information

### Student Flow

```text
Login
  ↓
Student Home
  ↓
View Assigned Bus / Route
  ↓
Track Bus
  ↓
View ETA / Stops
  ↓
Trip Updates & Notifications
```

## 🚍 Driver App

The Driver App helps authorized college transport personnel operate assigned trips.

### Current Features

- Driver login
- Driver dashboard
- Driver profile
- Assigned bus information
- Assigned route information
- Trip status management
- Start Trip
- Active Trip state
- Stop Trip
- Logout
- Route / student view
- Notification view
- Profile and support screens
- Mock GPS/map interface for UI development

### Driver Flow

```text
Splash
  ↓
Login
  ↓
Driver Dashboard
  ↓
Start Trip
  ↓
Active Trip
  ↓
Route / Students
  ↓
Stop Trip
  ↓
Trip Summary
  ↓
Dashboard / Logout
```

> **Current limitation:** Real GPS location tracking, background location, backend location APIs, and real-time WebSocket updates are being developed separately. Current GPS/map elements may use mock data for UI testing.

## 🖥️ Admin Dashboard

The Admin Dashboard is the central control panel for authorized SKIT Jaipur transport administrators.

### Responsibilities

- Transport overview
- Live bus monitoring
- Bus management
- Driver management
- Student management
- Route and stop management
- Driver-to-bus assignment
- Bus-to-route assignment
- Student-to-route/stop assignment
- Trip management
- Transport notifications
- Reports and analytics
- Admin settings

### Admin Dashboard Flow

```text
Admin Login
    ↓
Transport Overview
    ├── Live Tracking
    ├── Buses
    ├── Drivers
    ├── Students
    ├── Routes & Stops
    ├── Trips
    ├── Notifications
    ├── Reports & Analytics
    └── Settings
```

## 🔄 How the Apps Work Together

```text
Driver App
    │
    │  Trip + GPS Location
    ▼
Backend API
    │
    ├──────────────► Admin Dashboard
    │                    │
    │                    └── Monitor & Manage
    │
    └──────────────► Student App
                         │
                         └── Bus Location / ETA / Route
```

The clients communicate through the backend. **Mobile/web clients do not connect directly to MongoDB.**

## 🛠️ Technology Stack

### Frontend

- React Native
- TypeScript
- React
- Vite
- HTML / CSS

### Backend

- Node.js
- Express.js
- REST APIs
- Authentication

### Database

- MongoDB
- Mongoose

### Location & Maps

- Android GPS / Location Services
- Google Maps integration planned
- Real-time location updates planned

### Development Tools

- Git & GitHub
- Android Studio
- Android Emulator
- VS Code / Antigravity
- Postman

## 📂 Repository Structure

```text
UniTransit/
│
├── apps/
│   ├── student-app/       # Student mobile application
│   ├── driver-app/        # Driver mobile application
│   └── admin-dashboard/   # College admin web dashboard
│
├── backend/               # Node.js / Express backend
│
├── docs/                  # Project documentation
│
├── .github/
│   └── workflows/         # GitHub Actions
│
└── README.md
```

## 🌿 Git Workflow

The project follows a feature-branch workflow.

```text
main
  ↑
  │
 develop
  ↑
  │
feature/<feature-name>
```

### Branches

- `main` — stable/demo-ready code
- `develop` — integration branch
- `feature/*` — individual feature development

### Development Process

```text
Create Feature Branch
        ↓
Implement Small Feature
        ↓
Run Tests
        ↓
Commit Focused Change
        ↓
Push Feature Branch
        ↓
Create Pull Request
        ↓
Code Review
        ↓
Merge into develop
        ↓
Testing
        ↓
Release to main
```

Keep commits small and focused. Avoid mixing unrelated features in a single commit.

## 👥 Team Responsibilities

| Member | Responsibility |
|---|---|
| **Hanish Singhal** | Driver App, GPS/Location, technical coordination |
| **Garvit Sharma** | Backend / API development |
| **Gagan Shakywal** | Student App |
| **Aayush Agarwal** | Admin Dashboard / QA |

## 🗓️ Development Roadmap

### Driver / Transportation

- Driver UI — Completed / ongoing refinement
- GPS foundation — In progress
- Real-time tracking — Planned/in progress
- Route integration — Planned
- Testing — Planned
- Final integration — Planned

### Overall System

```text
UI Foundations
     ↓
Authentication
     ↓
Bus / Driver / Student / Route Management
     ↓
GPS Location
     ↓
Real-Time Tracking
     ↓
Backend Integration
     ↓
Cross-App Integration
     ↓
Testing
     ↓
College Demo / Deployment
```

## 🔐 Data & Privacy

UniTransit is being developed as a college transportation system. Development currently uses **mock/test data** unless authorized college data is explicitly provided through the appropriate process.

Do not commit:

- Passwords
- API keys
- Database credentials
- Private tokens
- Unnecessary personal information
- Production secrets

Use environment variables for sensitive configuration.

## 🧪 Testing

Before creating a pull request, run the relevant checks for the application being changed.

For the Driver App, for example:

```bash
npx tsc --noEmit
npm test
npx react-native run-android
```

Also verify the affected user flow on an Android emulator or physical test device when applicable.

## 🚀 Getting Started

Clone the repository:

```bash
git clone <repository-url>
cd <repository-folder>
```

Switch to the integration branch:

```bash
git checkout develop
git pull origin develop
```

Each application has its own dependencies and run instructions. Refer to the application's `package.json` and local documentation before starting it.

## 📌 Project Status

UniTransit is currently under active development.

Current focus:

- Building the three application interfaces
- Establishing backend APIs and data models
- Implementing driver GPS foundation
- Preparing real-time bus tracking
- Connecting student, driver, and admin workflows

## 📄 Documentation

Project documentation should be maintained under `docs/` and updated as the architecture, APIs, workflows, and development plans evolve.

## 🚌 UniTransit

**Smart transportation. Connected campus. Safer journeys.**

Built for **SKIT Jaipur — Swami Keshwanand Institute of Technology & Management**.
