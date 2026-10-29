import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './Layout.css';

const Layout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  let title = "Dashboard";
  let subtitle = "Welcome to UniTransit";

  if (location.pathname.includes('/dashboard')) {
    title = "Transport Overview";
    subtitle = "SKIT Jaipur Campus Transportation";
  } else if (location.pathname.includes('/live-tracking')) {
    title = "Live Tracking";
    subtitle = "Real-time bus positions";
  } else if (location.pathname.includes('/routes')) {
    title = "Routes & Stops";
    subtitle = "Campus transportation network";
  } else if (location.pathname.includes('/trips')) {
    title = "Trip Management";
    subtitle = "All trips · Today";
  } else if (location.pathname.includes('/students')) {
    title = "Student Management";
    subtitle = "1,240 enrolled students";
  } else if (location.pathname.includes('/drivers')) {
    title = "Driver Management";
    subtitle = "All registered drivers";
  } else if (location.pathname.includes('/buses')) {
    title = "Bus Management";
    subtitle = "All registered buses · SKIT Fleet";
  } else if (location.pathname.includes('/notifications')) {
    title = "Transport Notifications";
    subtitle = "Send & manage alerts";
  } else if (location.pathname.includes('/analytics') || location.pathname.includes('/reports')) {
    title = "Reports & Analytics";
    subtitle = "Transport performance insights";
  } else if (location.pathname.includes('/settings')) {
    title = "Settings";
    subtitle = "System configuration";
  }

  return (
    <div className="admin-layout">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}
      <main className="main-content">
        <Navbar title={title} subtitle={subtitle} onMenuClick={() => setIsSidebarOpen(true)} />
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
