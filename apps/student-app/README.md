# UniTransit — Student App 🚌

> **Smart Student Transportation & Live Bus Tracking Application for SKIT Jaipur**

The **UniTransit Student App** is a React Native mobile application built for students of **Swami Keshwanand Institute of Technology & Management (SKIT Jaipur)** to track their assigned college buses in real-time, view route stop timelines, check estimated arrival times (ETA), receive transport notifications, and report transit issues.

---

## 🌟 Core Features

- **Student Authentication**: Secure login supporting Student ID or SKIT College Email (`SKIT/2023/CS/012`).
- **Student Home Dashboard**: Immediate visibility of assigned bus (`RJ-14-AB-1234`), route number (`Route 03`), pickup stop (`Stop 03 - Mansarovar Metro Station`), pickup time (`08:00 AM`), and live status (`ON THE WAY`).
- **Live GPS Bus Tracking**: Interactive 3D-styled vector map displaying bus movement, speed, distance remaining, and dynamic ETA updates.
- **Route & Stop Timeline**: Vertical route stop sequence highlighting the student's assigned pickup point (`YOUR STOP`).
- **Bus & Driver Details**: View vehicle specifications, seating capacity, driver experience, ratings, and one-tap emergency call options.
- **Transport Notifications**: Categorized alerts (`All`, `Important`, `Route`, `Trip`) with unread counters.
- **Report Transport Issue**: Submit reports regarding bus delays, missed stops, or vehicle condition with generated reference ticket IDs.
- **Help & Safety Center**: 24/7 campus emergency helpline, transport office contact details, and FAQs.
- **Profile & Settings**: Manage student transit credentials and customize notification alert preferences.

---

## 🏗️ Architecture & Directory Structure

```text
apps/student-app/
├── App.tsx                    # Main App entry with SafeAreaProvider
├── index.js                   # App registry
├── package.json               # Dependencies & test scripts
├── tsconfig.json              # TypeScript configuration
├── jest.config.js             # Jest test configuration
├── __tests__/                 # Automated test suites
│   ├── App.test.tsx
│   ├── MockData.test.tsx
│   └── MockApiService.test.tsx
└── src/
    ├── components/            # Reusable UI components
    │   ├── StudentHeader.tsx
    │   ├── StudentProfileCard.tsx
    │   ├── LiveBusCard.tsx
    │   ├── MockMap.tsx        # Interactive vector mock tracking map
    │   ├── RouteTimeline.tsx  # Vertical route stop timeline
    │   ├── NotificationCard.tsx
    │   ├── QuickAction.tsx
    │   ├── StatusBadge.tsx
    │   ├── PrimaryButton.tsx
    │   ├── SecondaryButton.tsx
    │   ├── LoadingState.tsx
    │   ├── EmptyState.tsx
    │   └── ErrorState.tsx
    ├── screens/               # App screen views
    │   ├── auth/LoginScreen.tsx
    │   ├── home/HomeScreen.tsx
    │   ├── tracking/LiveTrackingScreen.tsx
    │   ├── route/MyRouteScreen.tsx
    │   ├── bus/BusDetailsScreen.tsx
    │   ├── notifications/NotificationsScreen.tsx
    │   ├── issue/ReportIssueScreen.tsx
    │   ├── help/HelpSafetyScreen.tsx
    │   ├── profile/ProfileScreen.tsx
    │   └── settings/SettingsScreen.tsx
    ├── navigation/
    │   └── AppNavigator.tsx   # Bottom tab bar & screen router
    ├── data/
    │   └── mockData.ts        # Centralized mock data
    ├── services/
    │   └── mockApi.ts         # Service layer ready for API integration
    ├── theme/                 # Design tokens (colors, typography, shadows)
    └── types/                 # TypeScript interfaces & types
```

---

## ⚙️ Development & Testing

### TypeScript Typechecking
```bash
npx tsc --noEmit
```

### Running Test Suite
```bash
npm test
```

---

## 🎨 Design System

Aligned with the primary UniTransit Figma design system:
- **Primary Color**: `#1769FF` (UniTransit Blue)
- **Background**: `#F8FAFC` (Light modern surface)
- **Status Badges**:
  - `ON THE WAY` / `BUS STARTED`: Emerald Green (`#10B981`)
  - `DELAYED` / `SCHEDULED`: Amber Yellow (`#F59E0B`)
  - `CANCELLED` / `OFFLINE`: Red Alert (`#EF4444`)
