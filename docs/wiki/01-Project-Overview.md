# Project Overview

## Objective
UniTransit is a college transportation management platform for SKIT Jaipur. It is designed to connect students, drivers, and transport administrators through dedicated applications and a central backend.

## Main capabilities
- Student login and transport information
- Assigned bus, route, stop, and ETA information
- Live bus tracking
- Driver trip and GPS workflow
- Admin transport management
- Notifications and issue reporting

## Technology
React Native for Android apps, React + Vite for the admin dashboard, Node.js + Express for the backend, MongoDB for persistence, and Google Maps/Android location services for mapping and GPS.

## Data boundary
Applications communicate with the backend API. Clients do not connect directly to MongoDB. Development uses mock data; personal or institutional data must only be introduced through authorized processes.
