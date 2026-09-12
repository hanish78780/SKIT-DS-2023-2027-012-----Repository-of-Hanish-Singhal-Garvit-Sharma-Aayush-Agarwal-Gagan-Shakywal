import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock login handling
    if (email && password) {
      onLogin();
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="left-content">
          <div className="brand-header">
            <div className="logo-box">
              <img src="/skit-logo.png" alt="SKIT Logo" className="skit-logo" />
            </div>
            <h2>Swami Keshvanand<br/>Institute of Technology,</h2>
            <p>Management & Gramothan, Jaipur</p>
            <hr className="divider" />
          </div>
          
          <div className="stats-list">
            <div className="stat-card">
              <div className="stat-icon">
                <img src="/bus-icon.png" alt="Bus Icon" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
              </div>
              <div className="stat-info">
                <h3>24 Buses</h3>
                <p>Actively managed</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <img src="/driver-icon.png" alt="Driver Icon" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
              </div>
              <div className="stat-info">
                <h3>28 Drivers</h3>
                <p>Registered & trained</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <img src="/student-icon.png" alt="Student Icon" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
              </div>
              <div className="stat-info">
                <h3>1,240 Students</h3>
                <p>Enrolled in transport</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="login-card-header">
            <div className="small-logo">
              <img src="/skit-logo.png" alt="SKIT Logo" className="skit-logo-small" />
            </div>
            <div className="app-titles">
              <h4>UniTransit</h4>
              <p>Transport Administration Portal</p>
            </div>
          </div>

          <div className="login-title">
            <h2>Sign In</h2>
            <p>Access the UniTransit Admin Dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Admin Email</label>
              <input 
                type="email" 
                id="email" 
                placeholder="admin@skit.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password" 
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <button 
                  type="button" 
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-actions">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>

            <button type="submit" className="login-button">
              Sign In
            </button>
            
            <p className="footer-text">
              Authorized college transport administrators only.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
