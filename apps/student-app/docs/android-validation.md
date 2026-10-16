# Student App Android validation

Validated on **17 October 2026** on branch `feature/student-android-fixes`.

## Repository scope

The branch starts from latest `origin/develop` at `d3a5839`. The Student App native configuration corrections from `origin/feature/student-app` at `1a4268f` were applied selectively; unrelated branch changes were not included. The existing React Native components, manual tab navigation and mock service architecture are retained.

## Environment and automated checks

- Node.js 22.18.0, npm 10.9.3, JDK 17.
- Pixel 4 Android emulator, Android 17 / API 37, `x86_64`.
- `npm run typecheck`: passed.
- `npm test -- --runInBand`: **7 suites, 35 tests passed**.
- `npm run lint`: no errors; 7 existing inline-style warnings.
- `android\gradlew.bat assembleDebug`: passed for all four configured ABIs (`armeabi-v7a`, `arm64-v8a`, `x86`, `x86_64`).
- `npm run android -- --port 8082 --no-packager --active-arch-only`: built, installed and launched the Student App on the emulator.

## Emulator checks completed

| Action | Observed result |
| --- | --- |
| Launch Student App | Login opens before the dashboard. |
| Submit with a blank password | Required-password validation appears. |
| Sign in with prefilled Student ID and `demo123` | Home dashboard opens. This is demo validation, not account authentication. |
| Open Track | Bus Tracking Demo opens and identifies the bus as simulated. |
| Android Back from Track | Returns to Home. |
| Open Route | Route and stop timeline are displayed. |
| Alerts → Mark all read → Home | Home unread badge disappears. |
| Profile → Settings → Android Back | Returns to Profile. |
| Open Help | Sample contacts and FAQ render; no calls were made. |
| Profile → Help → Android Back | Returns to Profile. |
| Submit an issue with a blank description | Required Field validation appears. |
| Submit `Emulator test report` | Generates demo ticket `TICK-751204`; no report is sent externally. |
| Submit while the report input is focused | One tap on Create Demo Report submits after the keyboard-tap fix. |

Bus Info and logout are not included in this completed-check list until their emulator results are recorded. Physical-device testing and real GPS/backend integration were not performed in this validation.

The issue form initially consumed the first submit tap to dismiss the keyboard. Setting `keyboardShouldPersistTaps="handled"` on its scroll view allowed a single submit tap while the input was focused; this was verified after resetting the form.

## Run again in PowerShell

Start the emulator, then open a terminal for the Student App's Metro server:

```powershell
cd C:\UniTransit\apps\student-app
npm ci
npm start -- --port 8082
```

In a second terminal:

```powershell
cd C:\UniTransit\apps\student-app
npm run android -- --port 8082 --no-packager --active-arch-only
```

Use the same port in both commands. Student App port **8082** keeps its JavaScript bundle separate from the Driver App server on **8081**. Enter the prefilled Student ID and a non-empty demo password, such as `demo123`.

For checks and a complete debug build:

```powershell
cd C:\UniTransit\apps\student-app
npm run typecheck
npm test -- --runInBand
npm run lint
cd android
.\gradlew.bat assembleDebug
```

During validation, Metro temporarily stalled while serving the bundle. Restarting the owned Student App Metro server with the following options resolved it; no dependency changes were needed:

```powershell
cd C:\UniTransit\apps\student-app
npm start -- --port 8082 --reset-cache --max-workers 2
```

Stop the existing Student App Metro process before restarting it. Keep the Driver App's server separate.

## Current prototype limits

- Login accepts a non-empty Student ID/email and password; no backend account is checked.
- Student, bus, route, ETA, contacts and alerts are sample data. Bus movement is a local animation and does not use Driver App broadcasts or emulator GPS.
- Help contacts are sample details. Opening a call action does not establish that a contact is correct or reachable.
- Issue reports generate demo ticket references locally; they are not sent to a transport office.
- Notification read state is shared in memory for the current app process. It survives screen changes and resets when the app process restarts; no backend or device storage is used.
- Notification delivery and settings do not establish working FCM or persisted preferences.
