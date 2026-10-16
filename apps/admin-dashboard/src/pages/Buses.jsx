import { useState } from 'react';
import { Plus, X, Bus as BusIcon, Wrench, CheckCircle } from 'lucide-react';
import { useTransport } from '../context/useTransport';
import './Buses.css';

const Buses = () => {
  const {
    buses: busesList,
    assignBus,
    unassignBus,
    toggleBusMaintenance,
    editBus,
    addBus,
  } = useTransport();

  const [modalType, setModalType] = useState(null); // 'view' | 'edit' | 'assign' | 'maintenance' | 'add' | null
  const [currentBus, setCurrentBus] = useState(null);

  const [formData, setFormData] = useState({
    busNumber: '',
    regNo: '',
    type: 'AC',
    capacity: '40 seats',
    driver: 'Rajesh Kumar',
    route: 'Route 01',
    status: 'Active',
    maintenanceReason: 'Routine Inspection & Service',
  });

  // Open Handlers
  const handleOpenView = (bus) => {
    setCurrentBus(bus);
    setModalType('view');
  };

  const handleOpenEdit = (bus) => {
    setCurrentBus(bus);
    setFormData({
      busNumber: bus.id,
      regNo: bus.regNo || 'RJ14-2022-XXXX',
      type: bus.type,
      capacity: bus.capacity,
      driver: bus.driver,
      route: bus.route,
      status: bus.status,
      maintenanceReason: 'Routine Inspection & Service',
    });
    setModalType('edit');
  };

  const handleOpenAssign = (bus) => {
    setCurrentBus(bus);
    setFormData({
      driver: bus.driver === 'Unassigned' ? 'Rajesh Kumar' : bus.driver,
      route: bus.route === '—' ? 'Route 01' : bus.route,
    });
    setModalType('assign');
  };

  const handleOpenMaintenance = (bus) => {
    setCurrentBus(bus);
    setFormData({
      maintenanceReason: 'Routine Inspection & Service',
    });
    setModalType('maintenance');
  };

  const handleOpenAdd = () => {
    setFormData({
      busNumber: '',
      regNo: '',
      type: 'AC',
      capacity: '40 seats',
      driver: 'Unassigned',
      route: '—',
      status: 'Active',
      maintenanceReason: '',
    });
    setModalType('add');
  };

  const handleCloseModal = () => {
    setModalType(null);
    setCurrentBus(null);
  };

  // Action Submissions
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!currentBus) return;

    editBus(currentBus.id, {
      id: formData.busNumber || currentBus.id,
      regNo: formData.regNo || currentBus.regNo,
      type: formData.type,
      capacity: formData.capacity,
      status: formData.status,
    });
    handleCloseModal();
  };

  const handleSaveAssign = (e) => {
    e.preventDefault();
    if (!currentBus) return;

    assignBus(currentBus.id, {
      driver: formData.driver,
      route: formData.route,
    });
    handleCloseModal();
  };

  const handleUnassignBus = () => {
    if (!currentBus) return;

    unassignBus(currentBus.id);
    handleCloseModal();
  };

  const handleToggleMaintenance = () => {
    if (!currentBus) return;

    toggleBusMaintenance(currentBus.id);
    handleCloseModal();
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    const newBus = {
      id: formData.busNumber || `RJ-14-AB-${Math.floor(1000 + Math.random() * 9000)}`,
      regNo: formData.regNo || 'RJ14-2024-0012',
      type: formData.type,
      capacity: formData.capacity,
      driver: formData.driver,
      route: formData.route,
      status: formData.status,
      fitnessDate: '12 Dec 2028',
    };
    addBus(newBus);
    handleCloseModal();
  };

  return (
    <div className="buses-page">
      {/* Summary Cards */}
      <div className="buses-summary-grid">
        <div className="summary-card">
          <h2 className="text-blue-primary">{busesList.length}</h2>
          <p>Total Buses</p>
        </div>
        <div className="summary-card">
          <h2 className="text-green-primary">
            {busesList.filter((b) => b.status === 'Active').length}
          </h2>
          <p>Active</p>
        </div>
        <div className="summary-card">
          <h2 className="text-orange-primary">
            {busesList.filter((b) => b.status === 'Maintenance').length}
          </h2>
          <p>Maintenance</p>
        </div>
        <div className="summary-card">
          <h2 className="text-gray-dark">
            {busesList.filter((b) => b.status === 'Inactive').length}
          </h2>
          <p>Inactive</p>
        </div>
      </div>

      {/* Fleet Section */}
      <div className="fleet-card">
        <div className="fleet-header">
          <div className="fleet-title">
            <h3>Bus Fleet</h3>
            <p>All registered buses · SKIT Jaipur</p>
          </div>
          <button className="add-btn" onClick={handleOpenAdd}>
            <Plus size={16} />
            <span>Add Bus</span>
          </button>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>BUS NUMBER</th>
                <th>TYPE</th>
                <th>CAPACITY</th>
                <th>ASSIGNED DRIVER</th>
                <th>ROUTE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {busesList.map((bus, index) => (
                <tr key={index}>
                  <td className="bus-number">{bus.id}</td>
                  <td>
                    <span className="badge bg-blue-light text-blue-primary">
                      {bus.type}
                    </span>
                  </td>
                  <td>{bus.capacity}</td>
                  <td>{bus.driver}</td>
                  <td>{bus.route}</td>
                  <td>
                    <span className={`badge ${bus.status === 'Active' ? 'bg-green-light text-green' : bus.status === 'Maintenance' ? 'bg-orange-light text-orange' : 'bg-gray-light text-gray'}`}>
                      {bus.status}
                    </span>
                  </td>
                  <td className="actions">
                    <button type="button" onClick={() => handleOpenView(bus)}>View</button>
                    <button type="button" onClick={() => handleOpenEdit(bus)}>Edit</button>
                    <button type="button" onClick={() => handleOpenAssign(bus)}>Assign</button>
                    {bus.status === 'Maintenance' ? (
                      <button 
                        type="button" 
                        className="action-resume" 
                        onClick={() => handleOpenMaintenance(bus)}
                        title="Resume service for this bus"
                      >
                        Resume Service
                      </button>
                    ) : (
                      <button 
                        type="button" 
                        className="action-maintenance" 
                        onClick={() => handleOpenMaintenance(bus)}
                        title="Send bus to maintenance"
                      >
                        Maintenance
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW BUS MODAL */}
      {modalType === 'view' && currentBus && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Bus Details · {currentBus.id}</h2>
              <button className="close-modal-btn" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="view-profile-card">
                <div className="view-avatar-large">
                  <BusIcon size={26} />
                </div>
                <div className="view-profile-info">
                  <h3>{currentBus.id}</h3>
                  <p>Reg No: {currentBus.regNo || 'RJ14-2022-8812'} · {currentBus.type}</p>
                </div>
              </div>

              <div className="view-details-grid">
                <div className="detail-item">
                  <span className="label">Bus Type</span>
                  <span className="value">
                    <span className="badge bg-blue-light text-blue-primary">{currentBus.type}</span>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Seating Capacity</span>
                  <span className="value">{currentBus.capacity}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Assigned Driver</span>
                  <span className="value">{currentBus.driver}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Assigned Route</span>
                  <span className="value">{currentBus.route}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Operational Status</span>
                  <span className="value">
                    <span className={`badge ${currentBus.status === 'Active' ? 'bg-green-light text-green' : currentBus.status === 'Maintenance' ? 'bg-orange-light text-orange' : 'bg-gray-light text-gray'}`}>
                      {currentBus.status}
                    </span>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Fitness Certificate</span>
                  <span className="value">{currentBus.fitnessDate || 'Valid till 2027'}</span>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn-cancel" onClick={handleCloseModal}>
                  Close
                </button>
                <button 
                  className="btn-submit" 
                  onClick={() => handleOpenAssign(currentBus)}
                >
                  Change Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT BUS MODAL */}
      {modalType === 'edit' && currentBus && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Bus Details</h2>
              <button className="close-modal-btn" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveEdit}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Bus Number</label>
                    <input 
                      type="text" 
                      value={formData.busNumber} 
                      onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Registration No.</label>
                    <input 
                      type="text" 
                      value={formData.regNo} 
                      onChange={(e) => setFormData({ ...formData, regNo: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Bus Type</label>
                    <select 
                      value={formData.type} 
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="AC">AC</option>
                      <option value="Non-AC">Non-AC</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Seating Capacity</label>
                    <select 
                      value={formData.capacity} 
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    >
                      <option value="36 seats">36 seats</option>
                      <option value="40 seats">40 seats</option>
                      <option value="52 seats">52 seats</option>
                      <option value="60 seats">60 seats</option>
                    </select>
                  </div>
                  <div className="form-group full-width">
                    <label>Status</label>
                    <select 
                      value={formData.status} 
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Active">Active</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit">
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN DRIVER & ROUTE MODAL */}
      {modalType === 'assign' && currentBus && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Assign Driver & Route · {currentBus.id}</h2>
              <button className="close-modal-btn" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveAssign}>
              <div className="modal-body">
                <div className="view-profile-card" style={{ marginBottom: '18px' }}>
                  <div className="view-avatar-large">
                    <BusIcon size={24} />
                  </div>
                  <div className="view-profile-info">
                    <h3>{currentBus.id}</h3>
                    <p>{currentBus.type} · Capacity: {currentBus.capacity}</p>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Assign Driver</label>
                    <select 
                      value={formData.driver} 
                      onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                    >
                      <option value="Rajesh Kumar">Rajesh Kumar (Online)</option>
                      <option value="Suresh Meena">Suresh Meena (Online)</option>
                      <option value="Mohan Sharma">Mohan Sharma (Available)</option>
                      <option value="Dinesh Yadav">Dinesh Yadav (Online)</option>
                      <option value="Ramesh Verma">Ramesh Verma (On Leave)</option>
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label>Assign Route</label>
                    <select 
                      value={formData.route} 
                      onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                    >
                      <option value="Route 01">Route 01 (Malviya Nagar - Tonk Rd)</option>
                      <option value="Route 02">Route 02 (Mansarovar - Gopalpura)</option>
                      <option value="Route 03">Route 03 (Vaishali Nagar - Ajmer Rd)</option>
                      <option value="Route 04">Route 04 (Jagatpura - SKIT Direct)</option>
                      <option value="Route 05">Route 05 (Ajmer Road Express)</option>
                    </select>
                  </div>
                </div>

                <div className="modal-footer" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  {currentBus.driver !== 'Unassigned' && (
                    <button 
                      type="button" 
                      className="btn-unassign" 
                      onClick={handleUnassignBus}
                      title="Clear assigned driver and route"
                    >
                      Unassign Bus
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

      {/* MAINTENANCE CONFIRMATION MODAL */}
      {modalType === 'maintenance' && currentBus && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{currentBus.status === 'Maintenance' ? 'Resume Fleet Service' : 'Schedule Maintenance'}</h2>
              <button className="close-modal-btn" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ textAlign: 'center', padding: '12px 0 20px 0' }}>
                <div style={{ 
                  width: '56px', 
                  height: '56px', 
                  borderRadius: '50%', 
                  background: currentBus.status === 'Maintenance' ? '#f0fdf4' : '#fff7ed', 
                  color: currentBus.status === 'Maintenance' ? '#16a34a' : '#ea580c', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 16px auto' 
                }}>
                  {currentBus.status === 'Maintenance' ? <CheckCircle size={32} /> : <Wrench size={30} />}
                </div>
                <h3 style={{ fontSize: '17px', color: '#0f172a', marginBottom: '8px' }}>
                  {currentBus.status === 'Maintenance' ? `Resume service for ${currentBus.id}?` : `Send ${currentBus.id} to maintenance?`}
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                  {currentBus.status === 'Maintenance'
                    ? 'Confirming will mark this bus as Active and ready to resume scheduled transport trips.'
                    : 'This bus will be marked as Under Maintenance and temporarily taken off the active fleet roster.'}
                </p>
              </div>

              {currentBus.status !== 'Maintenance' && (
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label>Maintenance Reason</label>
                  <select 
                    value={formData.maintenanceReason} 
                    onChange={(e) => setFormData({ ...formData, maintenanceReason: e.target.value })}
                  >
                    <option value="Routine Inspection & Service">Routine Inspection & Service</option>
                    <option value="Brake & Tyre Inspection">Brake & Tyre Inspection</option>
                    <option value="Engine / Mechanical Checkup">Engine / Mechanical Checkup</option>
                    <option value="AC & Electrical Servicing">AC & Electrical Servicing</option>
                  </select>
                </div>
              )}

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button 
                  type="button" 
                  className={currentBus.status === 'Maintenance' ? 'btn-submit' : 'btn-danger'} 
                  onClick={handleToggleMaintenance}
                >
                  {currentBus.status === 'Maintenance' ? 'Yes, Resume Service' : 'Confirm Maintenance'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD BUS MODAL */}
      {modalType === 'add' && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Bus</h2>
              <button className="close-modal-btn" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveAdd}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Bus Number</label>
                    <input 
                      type="text" 
                      placeholder="e.g. RJ-14-AB-5502" 
                      value={formData.busNumber} 
                      onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Registration No.</label>
                    <input 
                      type="text" 
                      placeholder="Enter registration" 
                      value={formData.regNo} 
                      onChange={(e) => setFormData({ ...formData, regNo: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Bus Type</label>
                    <select 
                      value={formData.type} 
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="AC">AC</option>
                      <option value="Non-AC">Non-AC</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Capacity</label>
                    <select 
                      value={formData.capacity} 
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    >
                      <option value="36 seats">36 seats</option>
                      <option value="40 seats">40 seats</option>
                      <option value="52 seats">52 seats</option>
                      <option value="60 seats">60 seats</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Assign Driver</label>
                    <select 
                      value={formData.driver} 
                      onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                    >
                      <option value="Unassigned">Unassigned (—)</option>
                      <option value="Rajesh Kumar">Rajesh Kumar</option>
                      <option value="Suresh Meena">Suresh Meena</option>
                      <option value="Mohan Sharma">Mohan Sharma</option>
                      <option value="Dinesh Yadav">Dinesh Yadav</option>
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
                  <button type="button" className="btn-cancel" onClick={handleCloseModal}>Cancel</button>
                  <button type="submit" className="btn-submit">Add Bus</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Buses;
