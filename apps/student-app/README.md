# UniTransit — Student App 🚌

> **Smart Student Transportation & Live Bus Tracking Application for SKIT Jaipur**

The **UniTransit Student App** is a React Native mobile application built for students of **Swami Keshwanand Institute of Technology & Management (SKIT Jaipur)** to track their assigned college buses in real-time, view route stop timelines, check estimated arrival times (ETA), receive transport notifications, and report transit issues.

**Current status: Android UI prototype using `MockApiService`.** Login accepts a non-empty ID and password without checking a real account. Student, bus, route, contact and alert details are sample data. The map animates a simulated bus; it does not receive Driver App GPS. Issue reports generate demo tickets locally and are not delivered to the transport office. Settings are local prototype toggles that reset when the screen remounts; notification read status lasts only for the current app process. Backend authentication, live tracking, FCM delivery and real report submission remain separate integration work.

---

## 🌟 Core Features

- **Student Login Demo**: Student ID or college email input with required-field validation (`SKIT/2023/CS/012`).
- **Student Home Dashboard**: Immediate visibility of assigned bus (`RJ-14-AB-1234`), route number (`Route 03`), pickup stop (`Stop 03 - Mansarovar Metro Station`), pickup time (`08:00 AM`), and live status (`ON THE WAY`).
- **Bus Tracking Demo**: Animated vector map displaying simulated movement and sample speed, distance and ETA.
- **Route & Stop Timeline**: Vertical route stop sequence highlighting the student's assigned pickup point (`YOUR STOP`).
- **Bus & Driver Details**: View vehicle specifications, seating capacity, driver experience, ratings, and one-tap emergency call options.
- **Transport Notifications**: Categorized alerts (`All`, `Important`, `Route`, `Trip`) with unread counters.
- **Report Transport Issue Demo**: Validate a description and generate a sample reference ticket.
- **Help & Safety Center**: Sample contact details and FAQs; verify real college contacts before production use.
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
├── android/                   # Native Android project and Gradle wrapper
├── docs/                      # Android validation record
├── __tests__/                 # Automated test suites
│   ├── App.test.tsx
│   ├── AppNavigator.test.tsx
│   ├── LoginScreen.test.tsx
│   ├── MockData.test.tsx
│   ├── MockApiService.test.tsx
│   ├── Notifications.test.tsx
│   └── StudentScreens.test.tsx
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
    │   └── EmptyState.tsx
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
    ├── theme/                 # Colors and shared shadows
    └── types/                 # TypeScript interfaces & types
```

---

## ⚙️ Development & Testing

### Run on Android (PowerShell)

Use Node, JDK 17 and an Android SDK matching `android/build.gradle`. Start an emulator or connect a device, then use two terminals:

```powershell
cd C:\UniTransit\apps\student-app
npm ci
npm start -- --port 8082
```

```powershell
cd C:\UniTransit\apps\student-app
npm run android -- --port 8082 --no-packager --active-arch-only
```

Port 8082 keeps the Student App separate from a Driver App server on 8081. Use the same port in both commands. `--active-arch-only` builds for the connected emulator/device. On launch, enter any non-empty demo password with the prefilled Student ID. Android Back returns from detail screens to the selected tab, then Home.

For an Android build without installing:

```powershell
cd C:\UniTransit\apps\student-app\android
.\gradlew.bat assembleDebug
```

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
