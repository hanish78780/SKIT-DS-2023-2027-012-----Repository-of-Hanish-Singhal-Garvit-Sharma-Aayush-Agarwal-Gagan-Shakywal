import React, { useState, useEffect } from 'react';
import { Plus, X, Check, CheckCircle2 } from 'lucide-react';
import './Settings.css';

const initialAdmins = [
  {
    id: '1',
    name: 'Dr. Aayush Sharma',
    email: 'aayush@skit.ac.in',
    role: 'Super Admin',
    status: 'Active',
    lastLogin: 'Today 09:12 AM',
  },
  {
    id: '2',
    name: 'Priya Joshi',
    email: 'priya@skit.ac.in',
    role: 'Transport Admin',
    status: 'Active',
    lastLogin: 'Today 08:45 AM',
  },
  {
    id: '3',
    name: 'Rahul Gupta',
    email: 'rahul@skit.ac.in',
    role: 'Viewer',
    status: 'Inactive',
    lastLogin: '3 days ago',
  },
];

const Settings = () => {
  // College Information State
  const [collegeInfo, setCollegeInfo] = useState(() => {
    const saved = localStorage.getItem('unitransit_college_info');
    return saved
      ? JSON.parse(saved)
      : {
          name: 'Swami Keshvanand Institute of Technology, Management & Gramothan',
          shortName: 'SKIT Jaipur',
          campus: 'Jaipur, Rajasthan',
          contact: 'transport@skit.ac.in',
        };
  });

  // Transport Configuration State
  const [transportConfig, setTransportConfig] = useState(() => {
    const saved = localStorage.getItem('unitransit_transport_config');
    return saved
      ? JSON.parse(saved)
      : {
          maxBuses: '30',
          gpsInterval: '10 seconds',
          pickupBuffer: '5 minutes',
          autoCompleteAfter: '30 minutes idle',
        };
  });

  // Admin Users State
  const [adminUsers, setAdminUsers] = useState(() => {
    const saved = localStorage.getItem('unitransit_admin_users');
    return saved ? JSON.parse(saved) : initialAdmins;
  });

  // Modals & Feedback
  const [modalType, setModalType] = useState(null); // 'add' | 'edit' | null
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Transport Admin',
    status: 'Active',
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('unitransit_college_info', JSON.stringify(collegeInfo));
  }, [collegeInfo]);

  useEffect(() => {
    localStorage.setItem('unitransit_transport_config', JSON.stringify(transportConfig));
  }, [transportConfig]);

  useEffect(() => {
    localStorage.setItem('unitransit_admin_users', JSON.stringify(adminUsers));
  }, [adminUsers]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleSaveCollegeInfo = (e) => {
    e.preventDefault();
    showToast('College Information saved successfully!');
  };

  const handleSaveTransportConfig = (e) => {
    e.preventDefault();
    showToast('Transport Configuration saved successfully!');
  };

  // Admin Handlers
  const handleOpenAdd = () => {
    setFormData({
      name: '',
      email: '',
      role: 'Transport Admin',
      status: 'Active',
    });
    setModalType('add');
  };

  const handleOpenEdit = (admin) => {
    setCurrentAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      role: admin.role,
      status: admin.status,
    });
    setModalType('edit');
  };

  const handleCloseModal = () => {
    setModalType(null);
    setCurrentAdmin(null);
  };

  const handleSaveAdmin = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Please fill out name and email.');
      return;
    }

    if (modalType === 'add') {
      const newAdmin = {
        id: String(Date.now()),
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        status: formData.status,
        lastLogin: 'Never logged in',
      };
      setAdminUsers((prev) => [...prev, newAdmin]);
      showToast(`Admin ${newAdmin.name} added successfully!`);
    } else if (modalType === 'edit' && currentAdmin) {
      setAdminUsers((prev) =>
        prev.map((adm) =>
          adm.id === currentAdmin.id
            ? {
                ...adm,
                name: formData.name.trim(),
                email: formData.email.trim(),
                role: formData.role,
                status: formData.status,
              }
            : adm
        )
      );
      showToast('Admin user details updated!');
    }

    handleCloseModal();
  };

  const handleToggleDisable = (adminId) => {
    setAdminUsers((prev) =>
      prev.map((adm) => {
        if (adm.id === adminId) {
          const nextStatus = adm.status === 'Active' ? 'Inactive' : 'Active';
          showToast(`${adm.name} marked as ${nextStatus}!`);
          return { ...adm, status: nextStatus };
        }
        return adm;
      })
    );
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'Super Admin':
        return 'role-super';
      case 'Transport Admin':
        return 'role-transport';
      case 'Viewer':
      default:
        return 'role-viewer';
    }
  };

  const getStatusBadgeClass = (status) => {
    return status === 'Active' ? 'status-active' : 'status-inactive';
  };

  return (
    <div className="settings-page">
      {/* Top 2-Column Grid */}
      <div className="settings-grid">
        {/* Card 1: College Information */}
        <div className="settings-card">
          <div className="settings-card-header">
            <h3>College Information</h3>
            <button className="btn-card-save" onClick={handleSaveCollegeInfo}>
              Save
            </button>
          </div>
          <form className="settings-form" onSubmit={handleSaveCollegeInfo}>
            <div className="settings-field">
              <label>College Name</label>
              <input
                type="text"
                value={collegeInfo.name}
                onChange={(e) => setCollegeInfo({ ...collegeInfo, name: e.target.value })}
              />
            </div>
            <div className="settings-field">
              <label>Short Name</label>
              <input
                type="text"
                value={collegeInfo.shortName}
                onChange={(e) => setCollegeInfo({ ...collegeInfo, shortName: e.target.value })}
              />
            </div>
            <div className="settings-field">
              <label>Campus</label>
              <input
                type="text"
                value={collegeInfo.campus}
                onChange={(e) => setCollegeInfo({ ...collegeInfo, campus: e.target.value })}
              />
            </div>
            <div className="settings-field">
              <label>Transport Contact</label>
              <input
                type="email"
                value={collegeInfo.contact}
                onChange={(e) => setCollegeInfo({ ...collegeInfo, contact: e.target.value })}
              />
            </div>
          </form>
        </div>

        {/* Card 2: Transport Configuration */}
        <div className="settings-card">
          <div className="settings-card-header">
            <h3>Transport Configuration</h3>
            <button className="btn-card-save" onClick={handleSaveTransportConfig}>
              Save
            </button>
          </div>
          <form className="settings-form" onSubmit={handleSaveTransportConfig}>
            <div className="settings-field">
              <label>Max Buses</label>
              <input
                type="text"
                value={transportConfig.maxBuses}
                onChange={(e) => setTransportConfig({ ...transportConfig, maxBuses: e.target.value })}
              />
            </div>
            <div className="settings-field">
              <label>GPS Update Interval</label>
              <input
                type="text"
                value={transportConfig.gpsInterval}
                onChange={(e) => setTransportConfig({ ...transportConfig, gpsInterval: e.target.value })}
              />
            </div>
            <div className="settings-field">
              <label>Default Pickup Buffer</label>
              <input
                type="text"
                value={transportConfig.pickupBuffer}
                onChange={(e) => setTransportConfig({ ...transportConfig, pickupBuffer: e.target.value })}
              />
            </div>
            <div className="settings-field">
              <label>Trip Auto-complete After</label>
              <input
                type="text"
                value={transportConfig.autoCompleteAfter}
                onChange={(e) => setTransportConfig({ ...transportConfig, autoCompleteAfter: e.target.value })}
              />
            </div>
          </form>
        </div>
      </div>

      {/* Bottom Card: Admin Users */}
      <div className="admin-users-card">
        <div className="admin-users-header">
          <div className="admin-users-title">
            <h3>Admin Users</h3>
            <p>Manage dashboard access</p>
          </div>
          <button className="add-admin-btn" onClick={handleOpenAdd}>
            <Plus size={16} />
            <span>Add Admin</span>
          </button>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ADMIN</th>
                <th>EMAIL</th>
                <th>ROLE</th>
                <th>STATUS</th>
                <th>LAST LOGIN</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {adminUsers.map((admin) => (
                <tr key={admin.id}>
                  <td className="admin-name">{admin.name}</td>
                  <td className="admin-email">{admin.email}</td>
                  <td>
                    <span className={`role-badge ${getRoleBadgeClass(admin.role)}`}>
                      {admin.role}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(admin.status)}`}>
                      {admin.status}
                    </span>
                  </td>
                  <td className="admin-lastlogin">{admin.lastLogin}</td>
                  <td className="settings-actions">
                    <button
                      className="btn-action-edit"
                      onClick={() => handleOpenEdit(admin)}
                    >
                      Edit
                    </button>
                    <button
                      className={admin.status === 'Active' ? 'btn-action-disable' : 'btn-action-enable'}
                      onClick={() => handleToggleDisable(admin.id)}
                    >
                      {admin.status === 'Active' ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT ADMIN MODAL */}
      {modalType && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalType === 'add' ? 'Add New Admin' : 'Edit Admin Details'}</h2>
              <button className="close-modal-btn" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveAdmin}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Aayush Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. aayush@skit.ac.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>System Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option value="Super Admin">Super Admin</option>
                      <option value="Transport Admin">Transport Admin</option>
                      <option value="Viewer">Viewer</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Account Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit">
                    {modalType === 'add' ? 'Add Admin' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="save-toast">
          <CheckCircle2 size={18} color="#22c55e" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default Settings;
