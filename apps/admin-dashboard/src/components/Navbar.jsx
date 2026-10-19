import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Menu, AlertTriangle, Clock, CheckCircle, Info, CheckCheck, Trash2, X } from 'lucide-react';
import { useTransport } from '../context/TransportContext';
import './Navbar.css';

const Navbar = ({ title = "Transport Overview", subtitle = "SKIT Jaipur Campus Transportation", onMenuClick }) => {
  const {
    notifications = [],
    unreadNotificationsCount = 0,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
  } = useTransport();

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'
  const notifRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle size={16} className="notif-type-icon text-red" />;
      case 'warning':
        return <Clock size={16} className="notif-type-icon text-orange" />;
      case 'success':
        return <CheckCircle size={16} className="notif-type-icon text-green" />;
      case 'info':
      default:
        return <Info size={16} className="notif-type-icon text-blue" />;
    }
  };

  const displayedNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="mobile-menu-btn" onClick={onMenuClick}>
          <Menu size={24} />
        </button>
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="navbar-right">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search..." />
        </div>
        
        {/* Notification Bell & Dropdown */}
        <div className="notif-wrapper" ref={notifRef}>
          <button 
            className={`notif-btn ${isOpen ? 'active' : ''}`}
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="View notifications"
            title="Notifications"
          >
            <Bell size={20} />
            {unreadNotificationsCount > 0 && (
              <span className="notif-badge">
                {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
              </span>
            )}
          </button>

          {isOpen && (
            <div className="notif-dropdown">
              {/* Header */}
              <div className="notif-header">
                <div className="notif-title-area">
                  <h3>Notifications</h3>
                  {unreadNotificationsCount > 0 && (
                    <span className="notif-unread-tag">{unreadNotificationsCount} new</span>
                  )}
                </div>
                <div className="notif-header-actions">
                  {unreadNotificationsCount > 0 && (
                    <button 
                      className="notif-action-btn" 
                      onClick={markAllAsRead}
                      title="Mark all as read"
                    >
                      <CheckCheck size={14} />
                      <span>Read all</span>
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button 
                      className="notif-action-btn text-danger" 
                      onClick={clearAllNotifications}
                      title="Clear all notifications"
                    >
                      <Trash2 size={13} />
                      <span>Clear</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Tabs */}
              {notifications.length > 0 && (
                <div className="notif-filter-tabs">
                  <button 
                    className={`notif-tab ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                  >
                    All ({notifications.length})
                  </button>
                  <button 
                    className={`notif-tab ${filter === 'unread' ? 'active' : ''}`}
                    onClick={() => setFilter('unread')}
                  >
                    Unread ({unreadNotificationsCount})
                  </button>
                </div>
              )}

              {/* Notification Items List */}
              <div className="notif-body">
                {displayedNotifications.length === 0 ? (
                  <div className="notif-empty">
                    <div className="notif-empty-icon">
                      <Bell size={26} />
                    </div>
                    <h4>No Notifications</h4>
                    <p>
                      {filter === 'unread' 
                        ? "You've caught up with all alerts!" 
                        : "Everything is quiet. No active transport alerts right now."}
                    </p>
                  </div>
                ) : (
                  <div className="notif-list">
                    {displayedNotifications.map((n) => (
                      <div 
                        key={n.id} 
                        className={`notif-item ${!n.read ? 'unread' : ''}`}
                        onClick={() => markAsRead(n.id)}
                      >
                        <div className={`notif-icon-box bg-${n.type || 'info'}`}>
                          {getNotificationIcon(n.type)}
                        </div>
                        <div className="notif-content">
                          <div className="notif-top">
                            <span className="notif-item-title">{n.title}</span>
                            {!n.read && <span className="unread-dot" title="Unread alert"></span>}
                          </div>
                          <p className="notif-item-desc">{n.message}</p>
                          <span className="notif-time">{n.time}</span>
                        </div>
                        <button 
                          className="notif-dismiss-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            clearNotification(n.id);
                          }}
                          title="Dismiss notification"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="notif-footer">
                <span>UniTransit Live Fleet Alerts</span>
                <span className="live-pulse-dot" title="Live monitoring active"></span>
              </div>
            </div>
          )}
        </div>

        <div className="campus-pill">
          <span className="campus-dot"></span>
          <span>SKIT Jaipur Campus</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
