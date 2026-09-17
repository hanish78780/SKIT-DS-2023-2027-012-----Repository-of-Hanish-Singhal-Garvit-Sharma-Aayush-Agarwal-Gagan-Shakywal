# Real-Time Tracking

## Intended flow
1. Driver starts an active trip.
2. Android location services provide GPS coordinates.
3. Driver App publishes location updates through the backend.
4. Backend validates and distributes current trip location.
5. Student App renders the bus position and ETA.
6. Admin Dashboard can monitor active transport.

## Important boundaries
- GPS collection belongs to the Driver App.
- Students consume tracking data; they do not collect the driver's GPS.
- Backend remains the trust and routing boundary.
- Location frequency, accuracy thresholds, stale-location handling, and transport protocols must be defined during implementation.

## Privacy
Only information required for transport operation should be exposed to each client. Avoid unnecessary driver personal information.
