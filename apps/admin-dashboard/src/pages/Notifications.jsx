import React, { useState } from 'react';
import { Plus, Bell, X, Send } from 'lucide-react';
import { useTransport } from '../context/useTransport';
import './Notifications.css';

const Notifications = () => {
  const { notifications, addNotification } = useTransport();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Route Update',
    priority: 'Medium',
    audience: 'All Students',
    message: '',
  });

  const handleOpenModal = () => {
    setFormData({
      title: '',
      category: 'Route Update',
      priority: 'Medium',
      audience: 'All Students',
      message: '',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveNotification = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.message.trim()) {
      alert('Please fill in title and message.');
      return;
    }

    // Determine type for color coding
    let type = 'warning';
    if (formData.priority === 'High') type = 'alert';
    if (formData.priority === 'Low') type = 'info';

    addNotification({
      title: formData.title.trim(),
      category: formData.category,
      priority: formData.priority,
      audience: formData.audience,
      message: formData.message.trim(),
      type: type,
    });

    handleCloseModal();
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'priority-high';
      case 'Low':
        return 'priority-low';
      case 'Medium':
      default:
        return 'priority-medium';
    }
  };

  const getBadgeClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'badge-high';
      case 'Low':
        return 'badge-low';
      case 'Medium':
      default:
        return 'badge-medium';
    }
  };

  return (
    <div className="notifications-page">
      {/* Top Action Bar */}
      <div className="notifications-top-bar">
        <button className="new-notif-btn" onClick={handleOpenModal}>
          <Plus size={18} />
          <span>New Notification</span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="notifications-container">
        {notifications.length === 0 ? (
          <div className="notif-page-empty">
            <div className="notif-page-empty-icon">
              <Bell size={28} />
            </div>
            <h3>No Transport Alerts</h3>
            <p>You have not published any alerts yet. Click "+ New Notification" to broadcast one.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div key={notif.id} className="notif-card">
              {/* Left section: Icon & text content */}
              <div className="notif-card-left">
                <div className={`notif-bell-box ${getPriorityClass(notif.priority)}`}>
                  <Bell size={22} />
                </div>
                <div className="notif-card-details">
                  <h3 className="notif-card-title">{notif.title}</h3>
                  <span className="notif-card-category">{notif.category || 'Route Update'}</span>
                  <p className="notif-card-desc">{notif.message}</p>
                  <p className="notif-card-audience">
                    Audience: {notif.audience || 'All Students'}
                  </p>
                </div>
              </div>

              {/* Right section: Priority badge and timestamp */}
              <div className="notif-card-right">
                <span className={`priority-badge ${getBadgeClass(notif.priority)}`}>
                  {notif.priority || 'Medium'}
                </span>
                <span className="notif-card-time">{notif.time || 'Just now'}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE NEW NOTIFICATION MODAL */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>New Transport Alert</h2>
              <button className="close-modal-btn" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveNotification}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Alert Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Route 03 Stop Updated" 
                      value={formData.title} 
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>Category</label>
                    <select 
                      value={formData.category} 
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Route Update">Route Update</option>
                      <option value="Trip Delay">Trip Delay</option>
                      <option value="Bus Issue">Bus Issue</option>
                      <option value="College Announcement">College Announcement</option>
                      <option value="General Alert">General Alert</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Priority Level</label>
                    <select 
                      value={formData.priority} 
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label>Target Audience</label>
                    <select 
                      value={formData.audience} 
                      onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                    >
                      <option value="All Students">All Students</option>
                      <option value="Route 01 Students">Route 01 Students</option>
                      <option value="Route 02 Students">Route 02 Students</option>
                      <option value="Route 03 Students">Route 03 Students</option>
                      <option value="Route 04 Students">Route 04 Students</option>
                      <option value="Route 05 Students">Route 05 Students</option>
                      <option value="All Drivers">All Drivers</option>
                      <option value="All Staff">All Staff</option>
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label>Message / Description</label>
                    <textarea 
                      placeholder="Enter the alert announcement message..." 
                      value={formData.message} 
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })} 
                      required 
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit">
                    Send Notification
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
