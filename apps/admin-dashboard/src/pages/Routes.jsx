import { useState } from 'react';
import { Plus, X, Route as RouteIcon, Bus, CheckCircle } from 'lucide-react';
import { useTransport } from '../context/useTransport';
import './Routes.css';

const Routes = () => {
  const {
    routes = [],
    buses = [],
    drivers = [],
    addRoute,
    updateRoute,
    addStopToRoute,
    assignBusToRoute,
  } = useTransport();

  const [modalType, setModalType] = useState(null); // 'add' | 'edit' | 'addStop' | 'assignBus' | null
  const [selectedRoute, setSelectedRoute] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    origin: 'SKIT Campus',
    destination: '',
    stopsCount: 8,
    studentsCount: 35,
    bus: '',
    driver: '',
    status: 'Active',
    newStopName: '',
  });

  const handleOpenAdd = () => {
    const nextRouteNum = `Route 0${routes.length + 1}`;
    const defaultBus = buses[0] || { id: 'RJ-14-AB-1234', driver: 'Rajesh Kumar' };
    setFormData({
      id: nextRouteNum,
      name: nextRouteNum,
      origin: 'SKIT Campus',
      destination: '',
      stopsCount: 8,
      studentsCount: 30,
      bus: defaultBus.id,
      driver: defaultBus.driver,
      status: 'Active',
      newStopName: '',
    });
    setModalType('add');
  };

  const handleOpenEdit = (route) => {
    setSelectedRoute(route);
    setFormData({
      id: route.id,
      name: route.name,
      origin: route.origin,
      destination: route.destination,
      stopsCount: route.stopsCount,
      studentsCount: route.studentsCount,
      bus: route.bus,
      driver: route.driver,
      status: route.status,
      newStopName: '',
    });
    setModalType('edit');
  };

  const handleOpenAddStop = (route) => {
    setSelectedRoute(route);
    setFormData({
      id: route.id,
      name: route.name,
      origin: route.origin,
      destination: route.destination,
      stopsCount: route.stopsCount,
      studentsCount: route.studentsCount,
      bus: route.bus,
      driver: route.driver,
      status: route.status,
      newStopName: '',
    });
    setModalType('addStop');
  };

  const handleOpenAssignBus = (route) => {
    setSelectedRoute(route);
    const initialBus = buses.find((b) => b.id === route.bus) || buses[0];
    setFormData({
      id: route.id,
      name: route.name,
      origin: route.origin,
      destination: route.destination,
      stopsCount: route.stopsCount,
      studentsCount: route.studentsCount,
      bus: route.bus !== '—' ? route.bus : initialBus?.id,
      driver: route.driver !== '—' ? route.driver : initialBus?.driver,
      status: route.status,
      newStopName: '',
    });
    setModalType('assignBus');
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedRoute(null);
  };

  const handleSubmitAdd = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.destination.trim()) {
      alert('Please fill in Route name and destination.');
      return;
    }

    const newRoute = {
      id: formData.name.trim(),
      name: formData.name.trim(),
      origin: formData.origin.trim() || 'SKIT Campus',
      destination: formData.destination.trim(),
      stopsCount: Number(formData.stopsCount) || 6,
      studentsCount: Number(formData.studentsCount) || 30,
      bus: formData.bus || '—',
      driver: formData.driver || '—',
      status: formData.status || 'Active',
      stopsList: [
        'SKIT Main Gate',
        formData.destination.trim(),
      ],
    };

    addRoute(newRoute);
    handleCloseModal();
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    if (!selectedRoute) return;

    updateRoute(selectedRoute.id, {
      name: formData.name.trim(),
      origin: formData.origin.trim(),
      destination: formData.destination.trim(),
      stopsCount: Number(formData.stopsCount) || selectedRoute.stopsCount,
      studentsCount: Number(formData.studentsCount) || selectedRoute.studentsCount,
      status: formData.status,
    });
    handleCloseModal();
  };

  const handleSubmitAddStop = (e) => {
    e.preventDefault();
    if (!selectedRoute || !formData.newStopName.trim()) {
      alert('Please enter a stop name.');
      return;
    }

    addStopToRoute(selectedRoute.id, formData.newStopName.trim());
    handleCloseModal();
  };

  const handleSubmitAssignBus = (e) => {
    e.preventDefault();
    if (!selectedRoute) return;

    const matchedBus = buses.find((b) => b.id === formData.bus);
    const assignedDriver = matchedBus ? matchedBus.driver : formData.driver;

    assignBusToRoute(selectedRoute.id, {
      bus: formData.bus,
      driver: assignedDriver,
    });
    handleCloseModal();
  };

  return (
    <div className="routes-page">
      {/* Top Header Action */}
      <div className="routes-header">
        <button type="button" className="add-route-btn" onClick={handleOpenAdd}>
          <Plus size={18} />
          <span>Add Route</span>
        </button>
      </div>

      {/* 2-Column Cards Grid */}
      <div className="routes-grid">
        {routes.map((route) => (
          <div key={route.id} className="route-card">
            {/* Header */}
            <div className="route-card-header">
              <div className="route-header-info">
                <h3 className="route-name">{route.name}</h3>
                <p className="route-destination">
                  {route.origin} → {route.destination}
                </p>
              </div>
              <span className={`route-badge ${route.status.toLowerCase()}`}>
                {route.status}
              </span>
            </div>

            {/* Timeline Track */}
            <div className="route-timeline">
              {/* Top Endpoint: SKIT Campus */}
              <div className="timeline-point">
                <div className="point-dot red"></div>
                <span className="point-label">{route.origin}</span>
              </div>

              {/* Middle Section with Track Line and Info */}
              <div className="timeline-middle">
                <div className="timeline-track-col">
                  <div className="timeline-track-line"></div>
                  <div className="track-step-dot"></div>
                  <div className="track-step-dot"></div>
                  <div className="track-step-dot"></div>
                </div>

                <div className="timeline-content-col">
                  <div className="route-meta-stats">
                    <span>{route.stopsCount} stops</span>
                    <span>{route.studentsCount} students</span>
                  </div>

                  <div className="route-meta-assignment">
                    <div>
                      <span className="assignment-label">Bus: </span>
                      <span>{route.bus}</span>
                    </div>
                    <div>
                      <span className="assignment-label">Driver: </span>
                      <span>{route.driver}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Endpoint: Destination */}
              <div className="timeline-point">
                <div className="point-dot blue"></div>
                <span className="point-label">{route.destination}</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="route-card-actions">
              <button
                type="button"
                className="btn-route-action edit"
                onClick={() => handleOpenEdit(route)}
              >
                Edit Route
              </button>
              <button
                type="button"
                className="btn-route-action neutral"
                onClick={() => handleOpenAddStop(route)}
              >
                Add Stop
              </button>
              <button
                type="button"
                className="btn-route-action neutral"
                onClick={() => handleOpenAssignBus(route)}
              >
                Assign Bus
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= MODALS ================= */}

      {/* 1. ADD ROUTE MODAL */}
      {modalType === 'add' && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Route</h2>
              <button className="close-modal-btn" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmitAdd}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Route Name / ID</label>
                    <input
                      type="text"
                      placeholder="e.g. Route 05"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Origin Point</label>
                    <input
                      type="text"
                      value={formData.origin}
                      onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Final Destination</label>
                    <input
                      type="text"
                      placeholder="e.g. Vaishali Nagar"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Assign Bus</label>
                    <select
                      value={formData.bus}
                      onChange={(e) => {
                        const selected = buses.find((b) => b.id === e.target.value);
                        setFormData({
                          ...formData,
                          bus: e.target.value,
                          driver: selected?.driver || formData.driver,
                        });
                      }}
                    >
                      <option value="—">Unassigned (—)</option>
                      {buses.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.id} ({b.type}) · {b.driver}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Assigned Driver</label>
                    <input type="text" value={formData.driver || '—'} disabled style={{ opacity: 0.7 }} />
                  </div>
                  <div className="form-group">
                    <label>Total Stops</label>
                    <input
                      type="number"
                      min="2"
                      max="30"
                      value={formData.stopsCount}
                      onChange={(e) => setFormData({ ...formData, stopsCount: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
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
                    Create Route
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. EDIT ROUTE MODAL */}
      {modalType === 'edit' && selectedRoute && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Route Details</h2>
              <button className="close-modal-btn" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmitEdit}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Route Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Origin Point</label>
                    <input
                      type="text"
                      value={formData.origin}
                      onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Destination</label>
                    <input
                      type="text"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Estimated Students</label>
                    <input
                      type="number"
                      value={formData.studentsCount}
                      onChange={(e) => setFormData({ ...formData, studentsCount: e.target.value })}
                    />
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

      {/* 3. ADD STOP MODAL */}
      {modalType === 'addStop' && selectedRoute && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Stop to {selectedRoute.name}</h2>
              <button className="close-modal-btn" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmitAddStop}>
              <div className="modal-body">
                <div className="view-profile-card" style={{ marginBottom: '16px' }}>
                  <div className="view-avatar-large">
                    <RouteIcon size={22} />
                  </div>
                  <div className="view-profile-info">
                    <h3>{selectedRoute.name}</h3>
                    <p>{selectedRoute.origin} → {selectedRoute.destination} ({selectedRoute.stopsCount} stops currently)</p>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>New Stop Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Malviya Nagar Sector 3"
                    value={formData.newStopName}
                    onChange={(e) => setFormData({ ...formData, newStopName: e.target.value })}
                    required
                    autoFocus
                  />
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit">
                    Add Stop
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. ASSIGN BUS MODAL */}
      {modalType === 'assignBus' && selectedRoute && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Assign Bus & Driver · {selectedRoute.name}</h2>
              <button className="close-modal-btn" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmitAssignBus}>
              <div className="modal-body">
                <div className="view-profile-card" style={{ marginBottom: '16px' }}>
                  <div className="view-avatar-large">
                    <Bus size={22} />
                  </div>
                  <div className="view-profile-info">
                    <h3>{selectedRoute.name}</h3>
                    <p>Current: Bus {selectedRoute.bus} · Driver {selectedRoute.driver}</p>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Select Bus</label>
                  <select
                    value={formData.bus}
                    onChange={(e) => {
                      const selected = buses.find((b) => b.id === e.target.value);
                      setFormData({
                        ...formData,
                        bus: e.target.value,
                        driver: selected?.driver || 'Unassigned',
                      });
                    }}
                  >
                    <option value="—">Unassigned (—)</option>
                    {buses.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.id} ({b.type}, {b.capacity}) — Driver: {b.driver}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit">
                    Confirm Assignment
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

export default Routes;
