# Repository cleanup review

Reviewed on 17 October 2026 on `feature/repository-cleanup`, starting from `develop` at `d3a5839` and then rebased onto `c7f04a0` after PR #40 merged. Each app retains its existing technology and dependency boundary. Student startup and navigation fixes are inherited from that merged work rather than duplicated in this cleanup.

## Decisions and evidence

| Area | Change | Reason |
| --- | --- | --- |
| Backend | Move six domain schemas from `backend/models` into `backend/src/models` | The Student controller already imports from `src/models`; the former layout prevented the Express app from importing. |
| Backend | Register Route when importing Student | Existing `populate('route')` queries require that model to be registered. |
| Backend | Remove `src/package.json`, the duplicate database config, editor workspace, unused CORS environment option and empty marker | One backend package and one database setup now describe the actual runtime. |
| Backend | Format compressed source and add a lockfile plus offline HTTP/model tests | Readable existing behavior and reproducible installs. Declared dependency ranges are unchanged. |
| Admin | Remove React/Vite starter images, unused CSS rules, unused imports and redundant placeholder | No remaining source references to these files, rules or imports. The existing college logo supplies the browser icon. |
| Admin | Split transport context, provider and hook | Removes the mixed-export Fast Refresh lint error while retaining the existing mock state and actions. |
| Admin | Replace the redundant route-filter effect with a guarded reset | Retains filtering behavior and avoids an effect that only adjusts local selection state. |
| Driver | Remove unused EmptyState, theme barrel and unused theme token exports | No source or test consumers remain; active shadows and all GPS code are retained. |
| Student | Remove unused ErrorState, theme barrel, spacing/typography modules and empty marker | No source or test consumers remain; active loading/empty states and screen styles are retained. |
| Android | Remove superseded duplicate `edgeToEdgeEnabled=true` declarations | Both apps already ended with `false`; their effective values stay the same. |
| Reporting | Move generator to `scripts/reports` and 13 historical PDFs to `docs/reports/weekly` | Separates tooling and records from runtime code. Script and PDF content are unchanged. |
| Workflow | Update generator/install/archive paths | Scheduled and manually dispatched reporting use the new layout. Schedule and commit behavior are preserved. |
| Root | Replace the generic ignore list with project-specific rules and remove empty `firebase`/`shared` scaffolding plus editor-only settings | Generated files and local configuration stay out of Git; future modules can be added with implemented consumers. |
| Documentation | Shorten the root guide and update package/layout instructions | Each implementation has a clear entry point and honest prototype status. |

## Deliberately retained

- Android resources, Gradle wrapper files, default debug keystores and Driver iOS support files required by the native toolchains.
- All dependency lockfiles, used library dependencies, active mock data, app screens and management actions.
- Domain schemas for Bus, Driver, Trip and Attendance: these record existing transport schema work, even though their HTTP routes are not implemented yet.
- Existing project wiki plans and all historical college reports. An old report is a record, not unused executable code.
- Planned Admin navigation and visible work-in-progress pages; removing their design intent is separate from removing unreachable source files.

## Validation

| Check | Result |
| --- | --- |
| Admin lint | Passed: zero errors/warnings; baseline had 27 errors. |
| Admin production build | Passed. |
| Admin browser smoke | Demo login, Dashboard, Students, Drivers and Buses render. Route 03 filters to Aarav/Priya; searching Priya narrows to one row. |
| Driver TypeScript, Jest, lint | Passed; 4 suites / 61 tests, no lint errors, 4 existing inline-style warnings. |
| Student TypeScript and Jest | Passed on the integrated version after PR #40 merged; 7 suites / 35 tests. |
| Student lint | Standard `npm run lint` passed with no errors and 7 existing inline-style warnings. |
| Driver Android debug build | Passed for emulator architecture `x86_64`. |
| Student Android debug build | Passed for emulator architecture `x86_64`. |
| Backend install and tests | `npm ci` passed; 4 offline HTTP/model tests passed, without MongoDB or external data writes. |
| Backend JavaScript syntax | Passed. |
| Reporting | Moved generator produced a weekly PDF. Hash checks confirm all 13 historical PDFs and the generator content are unchanged. |
| Diff whitespace and source references | Checked before publication. |

Build outputs, installed dependencies, the local report smoke-test PDF and browser test state are excluded from the pull request. Mobile apps were not reinstalled over the running Student App during cleanup validation. Physical-device/iOS testing and database-backed CRUD/authentication were not performed.

## Existing follow-up findings

- Backend registration currently accepts the admin role, and authenticated Student CRUD does not enforce role or record ownership. These require an authorization change before exposure beyond local development; cleanup has preserved existing behavior.
- Admin authentication and tracking remain demos. Some planned sidebar destinations do not have implemented routes, and stored demo data is not yet validated for corruption.
- Live GPS upload, cross-app tracking, notifications and transport report delivery remain integration work.
