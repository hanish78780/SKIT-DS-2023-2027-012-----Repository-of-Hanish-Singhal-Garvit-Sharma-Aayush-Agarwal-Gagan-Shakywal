import { useState } from 'react';
import { Bus, Navigation, Phone, CheckCircle, Radio, X } from 'lucide-react';
import { useTransport } from '../context/useTransport';
import { sanitizeRouteString } from '../context/TransportProvider';
import './Trips.css';

// Default enriched trips for realistic demonstration across all tabs
const FALLBACK_TRIPS = [
  {
    id: 'TRIP-1024',
    bus: 'RJ-14-AB-1234',
    driver: 'Rajesh Kumar',
    phone: '98765 43210',
    route: 'SKIT → Jaipur',
    students: 42,
    startTime: '08:00 AM',
    status: 'Active',
    speed: '38 km/h',
    eta: '12 mins',
    nextStop: 'Tonk Phatak',
  },
  {
    id: 'TRIP-1023',
    bus: 'RJ-14-AB-1088',
    driver: 'Suresh Meena',
    phone: '97654 32109',
    route: 'SKIT → Tonk Rd',
    students: 38,
    startTime: '08:05 AM',
    status: 'Active',
    speed: '42 km/h',
    eta: '18 mins',
    nextStop: 'Gopalpura',
  },
  {
    id: 'TRIP-1025',
    bus: 'RJ-14-AB-5501',
    driver: 'Dinesh Yadav',
    phone: '95432 10987',
    route: 'SKIT → Mansarovar',
    students: 36,
    startTime: '02:30 PM',
    status: 'Scheduled',
    speed: '0 km/h',
    eta: 'Scheduled',
    nextStop: 'SKIT Main Gate',
  },
  {
    id: 'TRIP-1026',
    bus: 'RJ-14-AB-1234',
    driver: 'Rajesh Kumar',
    phone: '98765 43210',
    route: 'SKIT → Jagatpura',
    students: 40,
    startTime: '03:15 PM',
    status: 'Scheduled',
    speed: '0 km/h',
    eta: 'Scheduled',
    nextStop: 'SKIT Main Gate',
  },
  {
    id: 'TRIP-1022',
    bus: 'RJ-14-AB-4512',
    driver: 'Dinesh Yadav',
    phone: '95432 10987',
    route: 'SKIT → Mansarovar',
    students: 31,
    startTime: '07:55 AM',
    status: 'Completed',
    speed: '0 km/h',
    eta: 'Arrived',
    nextStop: 'Trip Completed',
  },
  {
    id: 'TRIP-1020',
    bus: 'RJ-14-AB-2231',
    driver: 'Mohan Sharma',
    phone: '96543 21098',
    route: 'SKIT → C-Scheme',
    students: 0,
    startTime: '08:15 AM',
    status: 'Cancelled',
    speed: '0 km/h',
    eta: 'Cancelled',
    nextStop: '—',
  },
];

const cleanDisplayRoute = (routeStr) => {
  if (!routeStr) return 'SKIT → Campus';
  const match = routeStr.match(/\(([^)]+)\)/);
  if (match && match[1]) {
    return match[1].trim();
  }
  return routeStr.replace(/Route\s*\d+\s*:?/i, '').trim() || routeStr;
};

const Trips = () => {
  const { trips = [] } = useTransport();

  const [activeTab, setActiveTab] = useState('Active'); // 'Active' | 'Scheduled' | 'Completed' | 'Cancelled'
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Combine live trips with fallbacks so all tabs have rich records
  const allTrips = trips.length > 0 ? trips : FALLBACK_TRIPS;

  // Ensure scheduled trips exist if not present in context
  const hasScheduled = allTrips.some((t) => t.status === 'Scheduled');
  const enrichedTrips = hasScheduled
    ? allTrips
    : [
        ...allTrips,
        {
          id: 'TRIP-1025',
          bus: 'RJ-14-AB-5501',
          driver: 'Dinesh Yadav',
          phone: '95432 10987',
          route: 'SKIT → Mansarovar',
          students: 36,
          startTime: '02:30 PM',
          status: 'Scheduled',
          speed: '0 km/h',
          eta: 'Scheduled',
          nextStop: 'SKIT Main Gate',
        },
      ];

  // Filter based on active tab
  const filteredTrips = enrichedTrips.filter((trip) => {
    if (activeTab === 'Active') {
      return trip.status === 'Active' || trip.status === 'Delayed';
    }
    return trip.status.toLowerCase() === activeTab.toLowerCase();
  });

  const handleOpenDetails = (trip) => {
    setSelectedTrip(trip);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTrip(null);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Active':
        return 'active';
      case 'Scheduled':
        return 'scheduled';
      case 'Completed':
        return 'completed';
      case 'Cancelled':
        return 'cancelled';
      case 'Delayed':
        return 'delayed';
      default:
        return 'active';
    }
  };

  return (
    <div className="trips-page">
      {/* Filter Tabs Bar */}
      <div className="trips-tabs-bar">
        {['Active', 'Scheduled', 'Completed', 'Cancelled'].map((tab) => (
          <button
            key={tab}
            type="button"
            className={`trip-tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Trip Records Table Card */}
      <div className="trip-records-card">
        <div className="trip-records-header">
          <h3>Trip Records</h3>
          <p>
            {filteredTrips.length} {activeTab.toLowerCase()} trips
          </p>
        </div>

        <div className="trips-table-wrapper">
          <table className="trips-table">
            <thead>
              <tr>
                <th>TRIP ID</th>
                <th>BUS</th>
                <th>DRIVER</th>
                <th>ROUTE</th>
                <th>STUDENTS</th>
                <th>START</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrips.length === 0 ? (
                <tr>
                  <td colSpan="8" className="trips-empty-row">
                    No {activeTab.toLowerCase()} trips found for today.
                  </td>
                </tr>
              ) : (
                filteredTrips.map((trip) => (
                  <tr key={trip.id}>
                    <td>
                      <button
                        type="button"
                        className="trip-id-link"
                        onClick={() => handleOpenDetails(trip)}
                        title="Click to view trip details"
                      >
                        {trip.id}
                      </button>
                    </td>
                    <td className="trip-bus-text">{trip.bus}</td>
                    <td className="trip-driver-text">{trip.driver}</td>
                    <td className="trip-route-text">
                      {cleanDisplayRoute(trip.route)}
                    </td>
                    <td className="trip-students-text">{trip.students}</td>
                    <td className="trip-start-text">{trip.startTime}</td>
                    <td>
                      <span className={`trip-status-badge ${getStatusClass(trip.status)}`}>
                        {trip.status}
                      </span>
                    </td>
                    <td>
                      <div className="trip-actions">
                        <button
                          type="button"
                          className="btn-action-view"
                          onClick={() => handleOpenDetails(trip)}
                        >
                          View
                        </button>
                        <button
                          type="button"
                          className="btn-action-details"
                          onClick={() => handleOpenDetails(trip)}
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* TRIP DETAILS MODAL */}
      {isModalOpen && selectedTrip && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2>Trip Details · {selectedTrip.id}</h2>
                <span
                  className={`trip-status-badge ${getStatusClass(selectedTrip.status)}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  {selectedTrip.status === 'Active' && <Radio size={12} />} {selectedTrip.status}
                </span>
              </div>
              <button className="close-modal-btn" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="view-profile-card" style={{ marginBottom: '16px' }}>
                <div className="view-avatar-large">
                  <Navigation size={22} />
                </div>
                <div className="view-profile-info">
                  <h3>{selectedTrip.bus} · {sanitizeRouteString(selectedTrip.route)}</h3>
                  <p>Driver: {selectedTrip.driver} · Tel: {selectedTrip.phone}</p>
                </div>
              </div>

              {/* Telemetry Metrics */}
              <div className="track-metrics-grid">
                <div className="track-metric-box">
                  <div className="metric-label">Current Speed</div>
                  <div className="metric-val">{selectedTrip.speed || '0 km/h'}</div>
                </div>
                <div className="track-metric-box">
                  <div className="metric-label">Students</div>
                  <div className="metric-val">{selectedTrip.students} onboard</div>
                </div>
                <div className="track-metric-box">
                  <div className="metric-label">ETA / Status</div>
                  <div className="metric-val text-blue">{selectedTrip.eta || selectedTrip.startTime}</div>
                </div>
              </div>

              {/* Route Stops Timeline */}
              <div className="timeline-card" style={{ marginTop: '16px' }}>
                <div className="timeline-title">Route Progress & Stops</div>
                <div className="stop-timeline">
                  <div className="stop-item">
                    <div className="stop-dot completed">
                      <CheckCircle size={12} color="white" />
                    </div>
                    <span className="stop-name">SKIT Main Gate (Origin)</span>
                    <span className="stop-time">{selectedTrip.startTime}</span>
                  </div>
                  <div className="stop-item">
                    <div className="stop-dot completed">
                      <CheckCircle size={12} color="white" />
                    </div>
                    <span className="stop-name">Jagatpura Circle</span>
                    <span className="stop-time">Mid-way</span>
                  </div>
                  <div className="stop-item">
                    <div className="stop-dot current">
                      <Bus size={10} color="white" />
                    </div>
                    <span className="stop-name font-bold" style={{ color: '#2563eb' }}>
                      {selectedTrip.nextStop || 'Next Stop'} (Next)
                    </span>
                    <span className="stop-time text-blue font-bold">{selectedTrip.eta || 'On Schedule'}</span>
                  </div>
                  <div className="stop-item">
                    <div className="stop-dot"></div>
                    <span className="stop-name" style={{ color: '#94a3b8' }}>Final Destination</span>
                    <span className="stop-time">Scheduled</span>
                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ marginTop: '20px' }}>
                <button className="btn-cancel" onClick={handleCloseModal}>
                  Close
                </button>
                <a
                  href={`tel:${(selectedTrip.phone || '').replace(/\s+/g, '')}`}
                  className="btn-submit"
                  style={{
                    textDecoration: 'none',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <Phone size={16} /> Call Driver
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trips;
