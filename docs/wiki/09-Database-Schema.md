# Database Schema

MongoDB is the planned persistence layer.

## Core domain entities
- Student
- Driver
- Bus
- Route
- Stop
- Trip
- Location update
- Notification
- Issue/report

## Relationship concept
A student can be associated with a transport assignment. A driver operates a bus/trip. A route contains ordered stops. An active trip receives location updates that can be consumed by student and admin clients.

The production schema and indexes should be finalized together with the backend API contract. Use validation and authorization at the API boundary.
