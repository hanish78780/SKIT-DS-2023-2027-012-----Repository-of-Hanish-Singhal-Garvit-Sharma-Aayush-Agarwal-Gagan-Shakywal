import React, { useState } from 'react';
import { Plus, X, Phone, User, Bus, MapPin, CheckCircle, AlertTriangle } from 'lucide-react';
import { useTransport } from '../context/TransportContext';
import './Drivers.css';

const Drivers = () => {
  const { 
    drivers: driversList, 
    assignDriver, 
    unassignDriver, 
    toggleDriverDisabled, 
    addDriver 
  } = useTransport();

  const [modalType, setModalType] = useState(null); // 'profile' | 'assign' | 'disable' | 'add' | null
  const [currentDriver, setCurrentDriver] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    license: '',
    bus: 'RJ-14-AB-1234',
    route: 'Route 01',
    trip: 'TRIP-1024',
    status: 'Online',
  });

  // Open Handlers
  const handleOpenProfile = (driver) => {
    setCurrentDriver(driver);
    setModalType('profile');
  };

  const handleOpenAssign = (driver) => {
    setCurrentDriver(driver);
    setFormData({
      bus: driver.bus === '—' ? 'RJ-14-AB-1234' : driver.bus,
      route: driver.route === '—' ? 'Route 01' : driver.route,
      trip: driver.trip === '—' ? 'TRIP-1024' : driver.trip,
    });
    setModalType('assign');
  };

  const handleOpenDisable = (driver) => {
    setCurrentDriver(driver);
    setModalType('disable');
  };

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      phone: '',
      license: '',
      bus: 'RJ-14-AB-1234',
      route: 'Route 01',
      trip: '—',
      status: 'Available',
    });
    setModalType('add');
  };

  const handleCloseModal = () => {
    setModalType(null);
    setCurrentDriver(null);
  };

  // Action Handlers
  const handleSaveAssign = (e) => {
    e.preventDefault();
    if (!currentDriver) return;

    assignDriver(currentDriver.id, {
      bus: formData.bus,
      route: formData.route,
      trip: formData.trip,
    });
    handleCloseModal();
  };

  const handleUnassignDriver = () => {
    if (!currentDriver) return;

    unassignDriver(currentDriver.id);
    handleCloseModal();
  };

  const handleConfirmToggleDisable = () => {
    if (!currentDriver) return;

    toggleDriverDisabled(currentDriver.id);
    handleCloseModal();
  };

  const handlePhoneChange = (e) => {
    // Keep only numbers and max 10 digits
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData((prev) => ({ ...prev, phone: digitsOnly }));
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      alert('Mobile number must be exactly 10 digits.');
      return;
    }
    const formattedPhone = `${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`;
    const newId = `DRV-${String(driversList.length + 1).padStart(3, '0')}`;
    const newDriver = {
      id: newId,
      name: formData.name,
      initial: formData.name.charAt(0).toUpperCase() || 'D',
      phone: formattedPhone,
      license: formData.license || 'RJ14-2023-XXXX',
      bus: formData.bus,
      route: formData.route,
      trip: formData.trip || '—',
      status: formData.status,
    };
    addDriver(newDriver);
    handleCloseModal();
  };

  // Helper for badges
  const getBadgeClass = (status) => {
    switch (status) {
      case 'Online':
        return 'bg-green-light text-green';
      case 'Available':
        return 'bg-blue-light text-blue-primary';
      case 'On Leave':
        return 'bg-orange-light text-orange';
      case 'Disabled':
        return 'bg-red-light text-red';
      default:
        return 'bg-gray-light text-gray';
    }
  };

  return (
    <div className="drivers-page">
      {/* Summary Cards */}
      <div className="drivers-summary-grid">
        <div className="summary-card">
          <h2 className="text-blue-primary">{driversList.length}</h2>
          <p>Total Drivers</p>
        </div>
        <div className="summary-card">
          <h2 className="text-green-primary">
            {driversList.filter((d) => d.status === 'Online').length}
          </h2>
          <p>Active / Online</p>
        </div>
        <div className="summary-card">
          <h2 className="text-purple-primary">
            {driversList.filter((d) => d.status === 'Available').length}
          </h2>
          <p>Available</p>
        </div>
        <div className="summary-card">
          <h2 className="text-orange-primary">
            {driversList.filter((d) => d.status === 'On Leave').length}
          </h2>
          <p>On Leave</p>
        </div>
      </div>

      {/* Roster Section */}
      <div className="roster-card">
        <div className="roster-header">
          <div className="roster-title">
            <h3>Driver Roster</h3>
            <p>All registered drivers</p>
          </div>
          <div className="roster-actions">
            <button className="add-driver-btn" onClick={handleOpenAdd}>
              <Plus size={16} />
              <span>Add Driver</span>
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>DRIVER</th>
                <th>ID</th>
                <th>PHONE</th>
                <th>BUS</th>
                <th>ROUTE</th>
                <th>TRIP</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {driversList.map((driver, index) => (
                <tr key={index}>
                  <td>
                    <div className="driver-profile">
                      <div className="driver-avatar bg-blue-light text-blue-primary">
                        {driver.initial}
                      </div>
                      <span className="driver-name">{driver.name}</span>
                    </div>
                  </td>
                  <td className="text-gray-light">{driver.id}</td>
                  <td>{driver.phone}</td>
                  <td>{driver.bus}</td>
                  <td>{driver.route}</td>
                  <td>
                    {driver.trip !== '—' ? (
                      <span className="trip-link">{driver.trip}</span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>
                    <span className={`badge ${getBadgeClass(driver.status)}`}>
                      {driver.status}
                    </span>
                  </td>
                  <td className="actions">
                    <button 
                      type="button" 
                      className="action-profile" 
                      onClick={() => handleOpenProfile(driver)}
                    >
                      Profile
                    </button>
                    <button 
                      type="button" 
                      className="action-assign" 
                      onClick={() => handleOpenAssign(driver)}
                    >
                      Assign
                    </button>
                    <button 
                      type="button" 
                      className={driver.status === 'Disabled' ? 'action-enable' : 'action-disable'} 
                      onClick={() => handleOpenDisable(driver)}
                    >
                      {driver.status === 'Disabled' ? 'Enable' : 'Disable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PROFILE MODAL */}
      {modalType === 'profile' && currentDriver && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Driver Profile</h2>
              <button className="close-modal-btn" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="view-profile-card">
                <div className="view-avatar-large">
                  {currentDriver.initial}
                </div>
                <div className="view-profile-info">
                  <h3>{currentDriver.name}</h3>
                  <p>{currentDriver.id} · Contact: {currentDriver.phone}</p>
                </div>
              </div>

              <div className="view-details-grid">
                <div className="detail-item">
                  <span className="label">License Number</span>
                  <span className="value">{currentDriver.license || 'RJ14-2019-XXXX'}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Status</span>
                  <span className="value">
                    <span className={`badge ${getBadgeClass(currentDriver.status)}`}>
                      {currentDriver.status}
                    </span>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Assigned Bus</span>
                  <span className="value">{currentDriver.bus}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Assigned Route</span>
                  <span className="value">{currentDriver.route}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Current Trip</span>
                  <span className="value text-blue-primary">{currentDriver.trip}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Duty Shift</span>
                  <span className="value">Morning (7:30 AM - 1:30 PM)</span>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn-cancel" onClick={handleCloseModal}>
                  Close
                </button>
                <button 
                  className="btn-submit" 
                  onClick={() => handleOpenAssign(currentDriver)}
                >
                  Change Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ASSIGN MODAL */}
      {modalType === 'assign' && currentDriver && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Assign Bus & Route - {currentDriver.name}</h2>
              <button className="close-modal-btn" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveAssign}>
              <div className="modal-body">
                <div className="view-profile-card" style={{ marginBottom: '18px' }}>
                  <div className="view-avatar-large">
                    {currentDriver.initial}
                  </div>
                  <div className="view-profile-info">
                    <h3>{currentDriver.name}</h3>
                    <p>Driver ID: {currentDriver.id} · Status: {currentDriver.status}</p>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Select Bus</label>
                    <select 
                      value={formData.bus} 
                      onChange={(e) => setFormData({ ...formData, bus: e.target.value })}
                    >
                      <option value="RJ-14-AB-1234">RJ-14-AB-1234 (Bus 01 - AC)</option>
                      <option value="RJ-14-AB-1088">RJ-14-AB-1088 (Bus 02 - Non-AC)</option>
                      <option value="RJ-14-AB-2231">RJ-14-AB-2231 (Bus 03 - AC)</option>
                      <option value="RJ-14-AB-4512">RJ-14-AB-4512 (Bus 04 - Non-AC)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Select Route</label>
                    <select 
                      value={formData.route} 
                      onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                    >
                      <option value="Route 01">Route 01 (Malviya Nagar)</option>
                      <option value="Route 02">Route 02 (Mansarovar)</option>
                      <option value="Route 03">Route 03 (Vaishali Nagar)</option>
                      <option value="Route 04">Route 04 (Jagatpura)</option>
                      <option value="Route 05">Route 05 (Ajmer Road)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Active Trip ID</label>
                    <select 
                      value={formData.trip} 
                      onChange={(e) => setFormData({ ...formData, trip: e.target.value })}
                    >
                      <option value="TRIP-1024">TRIP-1024</option>
                      <option value="TRIP-1022">TRIP-1022</option>
                      <option value="TRIP-1026">TRIP-1026</option>
                      <option value="—">No Active Trip (—)</option>
                    </select>
                  </div>
                </div>

                <div className="modal-footer" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  {currentDriver.bus !== '—' && (
                    <button 
                      type="button" 
                      className="btn-unassign" 
                      onClick={handleUnassignDriver}
                      title="Clear bus and route assignment"
                    >
                      Unassign Driver
                    </button>
                  )}
                  <button type="submit" className="btn-submit">
                    Confirm Assignment
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DISABLE / ENABLE CONFIRMATION MODAL */}
      {modalType === 'disable' && currentDriver && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{currentDriver.status === 'Disabled' ? 'Enable Driver' : 'Disable Driver'}</h2>
              <button className="close-modal-btn" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ 
                  width: '56px', 
                  height: '56px', 
                  borderRadius: '50%', 
                  background: currentDriver.status === 'Disabled' ? '#f0fdf4' : '#fef2f2', 
                  color: currentDriver.status === 'Disabled' ? '#16a34a' : '#ef4444', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 16px auto' 
                }}>
                  {currentDriver.status === 'Disabled' ? <CheckCircle size={32} /> : <AlertTriangle size={32} />}
                </div>
                <h3 style={{ fontSize: '17px', color: '#0f172a', marginBottom: '8px' }}>
                  {currentDriver.status === 'Disabled' ? `Re-enable ${currentDriver.name}?` : `Disable ${currentDriver.name}?`}
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                  {currentDriver.status === 'Disabled'
                    ? 'This driver will be marked as Available and can be assigned to buses and routes again.'
                    : 'Disabling will remove this driver from duty rosters and pause any active bus assignments.'}
                </p>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button 
                  type="button" 
                  className={currentDriver.status === 'Disabled' ? 'btn-submit' : 'btn-danger'} 
                  onClick={handleConfirmToggleDisable}
                >
                  {currentDriver.status === 'Disabled' ? 'Yes, Enable Driver' : 'Yes, Disable Driver'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD DRIVER MODAL */}
      {modalType === 'add' && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Driver</h2>
              <button className="close-modal-btn" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveAdd}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Ramesh Chandra" 
                      value={formData.name} 
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label>Phone Number</label>
                      <span style={{ fontSize: '11px', color: formData.phone.length === 10 ? '#16a34a' : '#64748b', fontWeight: 600 }}>
                        {formData.phone.length}/10 digits
                      </span>
                    </div>
                    <input 
                      type="tel" 
                      placeholder="Enter 10-digit mobile number" 
                      value={formData.phone} 
                      onChange={handlePhoneChange} 
                      maxLength={10}
                      pattern="[0-9]{10}"
                      title="Please enter a valid 10-digit mobile number"
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>License Number</label>
                    <input 
                      type="text" 
                      placeholder="e.g. RJ14-2022-8812" 
                      value={formData.license} 
                      onChange={(e) => setFormData({ ...formData, license: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Assign Bus (Optional)</label>
                    <select 
                      value={formData.bus} 
                      onChange={(e) => setFormData({ ...formData, bus: e.target.value })}
                    >
                      <option value="—">Unassigned (—)</option>
                      <option value="RJ-14-AB-1234">RJ-14-AB-1234</option>
                      <option value="RJ-14-AB-1088">RJ-14-AB-1088</option>
                      <option value="RJ-14-AB-2231">RJ-14-AB-2231</option>
                      <option value="RJ-14-AB-4512">RJ-14-AB-4512</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Assign Route</label>
                    <select 
                      value={formData.route} 
                      onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                    >
                      <option value="—">Unassigned (—)</option>
                      <option value="Route 01">Route 01</option>
                      <option value="Route 02">Route 02</option>
                      <option value="Route 03">Route 03</option>
                      <option value="Route 04">Route 04</option>
                      <option value="Route 05">Route 05</option>
                    </select>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit">
                    Add Driver
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

export default Drivers;
