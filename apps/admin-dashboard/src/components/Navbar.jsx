import React from 'react';
import { Search, Bell } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ title = "Transport Overview", subtitle = "SKIT Jaipur Campus Transportation" }) => {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="navbar-right">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search..." />
        </div>
        
        <button className="notif-btn">
          <Bell size={20} />
          <span className="notif-badge">2</span>
        </button>

        <div className="campus-pill">
          <span className="campus-dot"></span>
          <span>SKIT Jaipur Campus</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
