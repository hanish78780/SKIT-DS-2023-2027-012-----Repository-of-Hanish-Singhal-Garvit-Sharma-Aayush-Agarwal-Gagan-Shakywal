# Android foreground GPS validation

This milestone collects location locally while the Driver App is visible and a
trip is active. The map, route, trip metrics and sign-in flow still use development
data. There is no backend location upload or student location broadcast yet.

## Run the app

1. In `C:\UniTransit`, run `git status --short --branch`. Protect existing changes
   and use a feature branch. This work continues on `feature/driver-gps`; PRs target
   `develop`. Do not push to or merge into `develop`/`main` directly.
2. In `apps/driver-app`, run `npx tsc --noEmit`,
   `npm test -- --runInBand` and `npm run lint`.
3. Start an Android emulator in Android Studio. Check `adb devices -l`.
4. In `apps/driver-app`, run `npm start` in one terminal, then
   `npm run android -- --no-packager` in another. A fresh native build/install is
   required after adding the geolocation package; reloading JavaScript alone will
   not add its Android module to an old installed app.
5. Sign in through the existing mock flow and select **START TRIP**. Choose
   **Precise** and **While using the app** in Android's permission dialog.
6. Expect **Acquiring** until Android provides a valid fix. The coordinates card
   appears only in the tracking state. Approximate-only and denied permissions
   display an explanation without starting the GPS watcher.

## Inject simulated coordinates

All coordinates here are emulator test data, not a driver's real location.
The emulator command takes **longitude before latitude**.

```powershell
adb -s emulator-5554 emu geo fix 75.7965 26.8678
adb -s emulator-5554 emu geo fix 75.8000 26.8700
```

Alternatively use emulator Extended Controls > Location > Set location.
Verify that the app shows the corresponding latitude/longitude, not merely an
`OK` response from the emulator. Check the GPS badge, coordinates and update time.
Use movement greater than five metres for continuous-watch validation.

## Verify failure and lifecycle behavior

- Deny location access: expect **Permission Required** with no coordinates.
- Grant approximate only: expect a precise-location explanation with no watcher.
- Repeatedly deny: expect **Permission Blocked** when Android disallows another
  prompt; enable permissions from app settings to recover.
- Turn system Location off before starting a trip: expect **Location Unavailable**.
- Turn Location off during tracking: expect **Location Unavailable**, or a GPS
  timeout error if a fix was already pending, and removal of current coordinates.
  The Android platform watch does not emit provider-disabled events, so a fresh
  health probe runs after 20 seconds without watch updates. A probe has a
  15-second timeout; detection can take up to about 35 seconds.
- Keep Location enabled without sending a fresh fix: the first request times out
  after 15 seconds, then the continuous watch can recover on a later injected fix.
  A silent watch is probed rather than automatically marking a stationary bus as
  unavailable.
- Press Home: tracking pauses while the app is in the background. Return during
  the same active trip: acquisition resumes. A new fix must restore the badge.
- Stop the trip or log out: the continuous watcher and probe timer stop, the
  coordinate state clears, and later injected positions must not restore tracking.
- Stop while acquisition/permission is pending, then restart: only the new session
  may receive results or start a watcher. The automated hook tests cover these
  timing-sensitive cases and unmount cleanup.

For native subscription evidence, inspect `adb shell dumpsys location`. Inspect
the **current registrations** for `com.driverapptemp`, not historical event-log
entries or aggregate usage statistics. A normal active watch requests GPS at a
one-second interval with a five-metre distance filter. During a health probe, one
additional bounded one-shot request can exist. This is not a duplicate watch.

The library cannot cancel an in-flight one-shot request. Stop/background/unmount
immediately invalidate its callbacks and clear continuous watchers/timers, while
the native one-shot finishes or times out within 15 seconds.

## Recorded validation

Run date: **16 October 2026**. Environment: Windows, Node 22.18.0, JDK 17,
React Native 0.87.1, geolocation 3.4.0, `Pixel_4` AVD / Android 17 API 37 x86_64.

| Check | Observed result |
| --- | --- |
| `npx tsc --noEmit` | Passed |
| `npm test -- --runInBand` | 4 suites, 61 tests passed |
| `npm run lint` | Passed; 4 existing map inline-style warnings, 0 errors |
| `android/gradlew.bat assembleDebug --console=plain` | Passed for configured ABIs |
| `npm run android -- --no-packager` | Built, installed and launched successfully |
| Precise foreground permission | Android dialog accepted; GPS acquired |
| Denied and repeated-denial/blocked permission | Correct badges, no coordinates or watcher |
| Approximate-only permission | Precise-location explanation; no coordinates or watcher |
| First simulated fix: latitude 26.8678, longitude 75.7965 | App displayed 26.867798, 75.796498, accuracy 5.0 m |
| Second simulated fix: latitude 26.8700, longitude 75.8000 | App displayed 26.870000, 75.799998, accuracy 5.0 m |
| Native subscription during tracking | One continuous GPS registration, 1-second interval / 5-metre filter |
| Home / return to app | Continuous watcher removed in background; foreground acquisition resumed with a fresh injected fix |
| System Location off / on | Unavailable badge and coordinates removed; tracking recovered after enabling Location and injecting another fix |
| Stop trip, then inject another fix | Idle, no coordinates, no current native registration |
| Logout during tracking, then inject another fix | Sign-in screen; no current native registration |
| Async cancellation, initial timeout, late callbacks, stale probes | Automated regression tests passed; native timeout not deliberately induced |

Small coordinate differences are the emulator's native representation of the
injected test values. The observed native module error from the old installed APK
was resolved by rebuilding and installing; no dependency upgrade was needed.
The run finished logged out with system Location enabled and precise/coarse
permissions restored for the next manual test.

Real-device GPS, physical signal conditions, other Android versions, background
tracking and backend integration require separate validation. Existing Gradle
deprecation and duplicate SDK backup-directory warnings did not fail the build.

Android's joint precise/approximate permission request requirement is documented
in the [official runtime location permission guide](https://developer.android.com/develop/sensors-and-location/location/permissions/runtime).
