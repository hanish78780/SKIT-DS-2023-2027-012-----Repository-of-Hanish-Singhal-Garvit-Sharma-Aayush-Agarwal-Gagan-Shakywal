import React, { useState } from 'react';
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
  } else if (location.pathname.includes('/students')) {
    title = "Student Management";
    subtitle = "1,240 enrolled students";
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
