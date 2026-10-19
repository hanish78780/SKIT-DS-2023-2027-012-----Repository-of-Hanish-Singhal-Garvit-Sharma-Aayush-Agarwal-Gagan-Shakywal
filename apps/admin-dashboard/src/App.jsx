import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
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
            <Route path="students" element={<Students />} />
            <Route path="drivers" element={<Drivers />} />
            <Route path="buses" element={<Buses />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
            <Route path="routes" element={<div style={{padding: '30px'}}><h2>Routes Page (WIP)</h2></div>} />
            <Route path="trips" element={<div style={{padding: '30px'}}><h2>Trips Page (WIP)</h2></div>} />
            <Route path="reports" element={<div style={{padding: '30px'}}><h2>Reports Page (WIP)</h2></div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TransportProvider>
  );
}

export default App;
