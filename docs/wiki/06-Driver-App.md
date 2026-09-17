# Driver App

## Responsibilities
The Driver App handles driver authentication, trip state, bus/route information, Android location permissions, GPS acquisition, location updates, and eventually backend location publishing.

## Current implementation
Driver login and dashboard/trip flows are implemented in React Native. GPS work is organized as a separate feature branch so location functionality can be integrated incrementally.

## GPS sequence
1. Request Android location permission.
2. Acquire foreground GPS position.
3. Subscribe to location updates.
4. Add background location behavior where required.
5. Associate GPS updates with the active trip.
6. Send location to the backend.
7. Feed real-time tracking to student/admin consumers.
