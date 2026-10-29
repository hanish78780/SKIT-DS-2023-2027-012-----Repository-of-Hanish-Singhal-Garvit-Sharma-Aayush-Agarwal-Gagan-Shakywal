import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import LiveTracking from "./pages/LiveTracking";
import RoutesPage from "./pages/Routes";
import Trips from "./pages/Trips";
import Students from "./pages/Students";
import Drivers from "./pages/Drivers";
import Buses from "./pages/Buses";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import { TransportProvider } from "./context/TransportProvider";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <TransportProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="live-tracking" element={<LiveTracking />} />
            <Route path="routes" element={<RoutesPage />} />
            <Route path="trips" element={<Trips />} />
            <Route path="students" element={<Students />} />
            <Route path="drivers" element={<Drivers />} />
            <Route path="buses" element={<Buses />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
            <Route path="reports" element={<div style={{padding: '30px'}}><h2>Reports Page (WIP)</h2></div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TransportProvider>
  );
}

export default App;
