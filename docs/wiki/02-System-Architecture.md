# System Architecture

```text
Student App ─┐
             ├── HTTPS/API ──> Node.js + Express ──> MongoDB
Driver App ──┤                     │
             │                     └── Real-time tracking layer
Admin Web ───┘

Driver Android GPS ──> Backend ──> Student live tracking UI
                              └──> Admin monitoring
```

## Components
1. Student Android app — React Native.
2. Driver Android app — React Native.
3. Admin dashboard — React + Vite.
4. Backend — Node.js + Express.
5. Database — MongoDB.
6. Maps/location — Google Maps and Android GPS.

## Principle
Keep business logic and persistence behind the backend API. The mobile/web clients consume API responses and should not access MongoDB directly.
