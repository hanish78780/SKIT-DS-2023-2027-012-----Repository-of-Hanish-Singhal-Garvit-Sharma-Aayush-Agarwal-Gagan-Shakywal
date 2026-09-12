# UniTransit - Admin Dashboard 🚍

This is the central administrative portal for the **UniTransit College Transportation Management System**. It allows administrators to manage buses, drivers, students, routes, and track live trips.

## Tech Stack
- **Framework:** React.js + Vite
- **Styling:** Vanilla CSS (Responsive, matching Figma designs)
- **Icons:** `lucide-react`
- **Routing:** React Router (v6+)

## How to Run Locally

1. Make sure you have Node.js installed.
2. Navigate to this directory (`apps/admin-dashboard`).
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser to the local address provided (usually `http://localhost:5173`).

## Project Progress

### ✅ Week 1: Foundation
- Monorepo setup initialized.
- Created the basic `admin-dashboard` React/Vite app.
- Built the initial static layout shell (Sidebar, Navbar, Dashboard overview) with mock data.

### 🚧 Week 2: Advanced UI & Routing
- **Day 1:** Built the standalone Admin Login (Sign-In) screen with a split-screen design, perfectly matching the official Figma design. Added mock authentication state to protect the dashboard.
- *(Upcoming)* **Day 2:** Refactoring the monolithic layout into reusable components (`Sidebar.jsx`, `Navbar.jsx`, `Layout.jsx`) and introducing React Router for page navigation.
- *(Upcoming)* **Days 3-7:** Building out dedicated pages for Students, Drivers, Buses, Routes, and Live Tracking.

## Team Guidelines
- This module is maintained exclusively by the Admin Dashboard developer.
- Do NOT make direct changes to the `driver-app` or `student-app` folders.
- Ensure all UI changes are responsive (mobile and tablet friendly) before committing.
