import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MapPin, Bus, UserRound, Users, Route, Clock, Bell, BarChart3, Settings, Home, LogOut, X } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="brand">
          <img src="/skit-logo.png" alt="SKIT Logo" className="brand-logo" />
          <div className="brand-text">
            <h2>UniTransit</h2>
            <p>SKIT Jaipur Admin</p>
          </div>
        </div>
        <button className="mobile-close-btn" onClick={onClose}>
          <X size={24} />
        </button>
      </div>

      <div className="sidebar-scroll">
        <div className="menu-section">
          <span className="menu-label">MAIN MENU</span>
          <nav className="sidebar-nav">
            <NavLink to="/dashboard" onClick={onClose} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/live-tracking" onClick={onClose} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <MapPin size={20} />
              <span>Live Tracking</span>
            </NavLink>
            <NavLink to="/buses" onClick={onClose} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <Bus size={20} />
              <span>Buses</span>
            </NavLink>
            <NavLink to="/drivers" onClick={onClose} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <UserRound size={20} />
              <span>Drivers</span>
            </NavLink>
            <NavLink to="/students" onClick={onClose} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <Users size={20} />
              <span>Students</span>
            </NavLink>
            <NavLink to="/routes" onClick={onClose} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <Route size={20} />
              <span>Routes & Stops</span>
            </NavLink>
            <NavLink to="/trips" onClick={onClose} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <Clock size={20} />
              <span>Trips</span>
            </NavLink>
            <NavLink to="/notifications" onClick={onClose} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <Bell size={20} />
              <span>Notifications</span>
              <span className="badge-red">2</span>
            </NavLink>
            <NavLink to="/analytics" onClick={onClose} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <BarChart3 size={20} />
              <span>Analytics</span>
            </NavLink>
            <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <Settings size={20} />
              <span>Settings</span>
            </NavLink>
            <NavLink to="/system-overview" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <Home size={20} />
              <span>System Overview</span>
            </NavLink>
          </nav>
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="admin-profile-sidebar">
          <div className="avatar">A</div>
          <div className="admin-info">
            <strong>Admin User</strong>
            <span>Super Admin</span>
          </div>
          <button className="logout-btn">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
