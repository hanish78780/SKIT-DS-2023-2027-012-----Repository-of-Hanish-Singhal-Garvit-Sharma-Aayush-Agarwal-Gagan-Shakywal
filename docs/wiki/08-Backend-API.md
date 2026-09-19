# Backend API

## Role
The Node.js + Express backend is the service boundary between clients and persistent data.

## Responsibilities
- Authentication and authorization
- Student, driver, bus, route, and trip APIs
- GPS/location ingestion
- Real-time tracking distribution
- Notifications and issue/report APIs
- Database access and validation

## Data flow
`React Native / React clients → Express API → MongoDB`

The exact endpoint contract should be documented here as APIs are implemented. Do not expose secrets, credentials, or private institutional data in source control.
