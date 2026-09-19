# Testing

## Required checks
For mobile app changes:
- `npx tsc --noEmit`
- `npm test`
- Android build
- Android emulator/device smoke test

For backend/dashboard changes, run the project's TypeScript/lint/test/build commands applicable to the changed package.

## Definition of done
A feature should have a focused implementation, tests where practical, a successful local build, and a clean reviewed diff before its PR is merged.

## Current verified driver baseline
The Driver App dashboard work was validated with TypeScript, tests, Android build, and emulator testing before integration.
