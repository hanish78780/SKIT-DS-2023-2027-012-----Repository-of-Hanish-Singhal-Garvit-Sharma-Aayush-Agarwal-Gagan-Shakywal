import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserRound, Bus, Route, Map, BarChart3 } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="logo">
        <h2>UniTransit</h2>
        <p>Admin Panel</p>
      </div>

      <nav className="sidebar-menu">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/students" className={({ isActive }) => isActive ? 'active' : ''}>
          <Users size={20} />
          <span>Students</span>
        </NavLink>
        <NavLink to="/drivers" className={({ isActive }) => isActive ? 'active' : ''}>
          <UserRound size={20} />
          <span>Drivers</span>
        </NavLink>
        <NavLink to="/buses" className={({ isActive }) => isActive ? 'active' : ''}>
          <Bus size={20} />
          <span>Buses</span>
        </NavLink>
        <NavLink to="/routes" className={({ isActive }) => isActive ? 'active' : ''}>
          <Route size={20} />
          <span>Routes</span>
        </NavLink>
        <NavLink to="/trips" className={({ isActive }) => isActive ? 'active' : ''}>
          <Map size={20} />
          <span>Trips</span>
        </NavLink>
        <NavLink to="/reports" className={({ isActive }) => isActive ? 'active' : ''}>
          <BarChart3 size={20} />
          <span>Reports</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
