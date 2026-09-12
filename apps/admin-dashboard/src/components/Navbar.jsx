import React from 'react';
import './Navbar.css';

const Navbar = ({ title = "Dashboard", subtitle = "Welcome to UniTransit Admin Panel" }) => {
  return (
    <header className="navbar">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="admin-profile">
        <div className="profile-avatar">
          A
        </div>
        <div>
          <strong>Admin</strong>
          <span>Administrator</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
