import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          {/* Future routes will go here */}
          <Route path="students" element={<div style={{padding: '30px'}}><h2>Students Page (WIP)</h2></div>} />
          <Route path="drivers" element={<div style={{padding: '30px'}}><h2>Drivers Page (WIP)</h2></div>} />
          <Route path="buses" element={<div style={{padding: '30px'}}><h2>Buses Page (WIP)</h2></div>} />
          <Route path="routes" element={<div style={{padding: '30px'}}><h2>Routes Page (WIP)</h2></div>} />
          <Route path="trips" element={<div style={{padding: '30px'}}><h2>Trips Page (WIP)</h2></div>} />
          <Route path="reports" element={<div style={{padding: '30px'}}><h2>Reports Page (WIP)</h2></div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;