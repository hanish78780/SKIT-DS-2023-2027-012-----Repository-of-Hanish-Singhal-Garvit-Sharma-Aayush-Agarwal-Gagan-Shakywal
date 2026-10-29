import { useState, useEffect } from 'react';
import { Bus, Navigation, Phone, CheckCircle, Radio, X } from 'lucide-react';
import { useTransport } from '../context/useTransport';
import { sanitizeRouteString } from '../context/TransportProvider';
import './LiveTracking.css';

const DEFAULT_TELEMETRY = {
  'RJ-14-AB-1234': {
    speed: '28 km/h',
    distance: '4.2 km',
    duration: '14 min',
    nextStop: 'Stop 03',
    students: 42,
    tripId: 'TRIP-1024',
  },
  'RJ-14-AB-1088': {
    speed: '35 km/h',
    distance: '6.8 km',
    duration: '18 min',
    nextStop: 'Stop 01',
    students: 38,
    tripId: 'TRIP-1023',
  },
  'RJ-14-AB-2231': {
    speed: '0 km/h',
    distance: '—',
    duration: '—',
    nextStop: 'Maintenance Depo',
    students: 0,
    tripId: 'TRIP-1020',
  },
  'RJ-14-AB-5501': {
    speed: '32 km/h',
    distance: '3.5 km',
    duration: '11 min',
    nextStop: 'Stop 04',
    students: 36,
    tripId: 'TRIP-1026',
  },
  'RJ-14-AB-4512': {
    speed: '0 km/h',
    distance: '0.0 km',
    duration: '0 min',
    nextStop: 'SKIT Campus',
    students: 0,
    tripId: 'TRIP-1022',
  },
};

const LiveTracking = () => {
  const { buses, trips, drivers } = useTransport();

  // Find or default to RJ-14-AB-1234
  const [selectedBusId, setSelectedBusId] = useState('RJ-14-AB-1234');
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [secondsAgo, setSecondsAgo] = useState(10);

  // Auto-increment seconds ticker to give live feel
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsAgo((prev) => (prev >= 55 ? 5 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Display buses: Show the 4 buses from the mockup (or all available)
  const displayBuses = [
    buses.find((b) => b.id === 'RJ-14-AB-1234') || {
      id: 'RJ-14-AB-1234',
      driver: 'Rajesh Kumar',
      route: 'Route 03',
      capacity: '40 seats',
      type: 'AC',
      status: 'Active',
    },
    buses.find((b) => b.id === 'RJ-14-AB-1088') || {
      id: 'RJ-14-AB-1088',
      driver: 'Suresh Meena',
      route: 'Route 01',
      capacity: '52 seats',
      type: 'Non-AC',
      status: 'Active',
    },
    buses.find((b) => b.id === 'RJ-14-AB-2231') || {
      id: 'RJ-14-AB-2231',
      driver: 'Mohan Sharma',
      route: 'Route 02',
      capacity: '40 seats',
      type: 'AC',
      status: 'Maintenance',
    },
    buses.find((b) => b.id === 'RJ-14-AB-5501') || {
      id: 'RJ-14-AB-5501',
      driver: 'Dinesh Yadav',
      route: 'Route 04',
      capacity: '36 seats',
      type: 'AC',
      status: 'Active',
    },
  ];

  const activeBuses = displayBuses.filter((b) => b.status === 'Active');

  const selectedBus =
    displayBuses.find((b) => b.id === selectedBusId) || displayBuses[0];

  const selectedTrip = trips.find((t) => t.bus === selectedBus.id) || {
    id: DEFAULT_TELEMETRY[selectedBus.id]?.tripId || 'TRIP-1024',
    driver: selectedBus.driver,
    route: selectedBus.route,
    speed: DEFAULT_TELEMETRY[selectedBus.id]?.speed || '28 km/h',
    distance: DEFAULT_TELEMETRY[selectedBus.id]?.distance || '4.2 km',
    duration: DEFAULT_TELEMETRY[selectedBus.id]?.duration || '14 min',
    nextStop: DEFAULT_TELEMETRY[selectedBus.id]?.nextStop || 'Stop 03',
    students: DEFAULT_TELEMETRY[selectedBus.id]?.students ?? 42,
    phone: drivers.find((d) => d.name === selectedBus.driver)?.phone || '98765 43210',
    startTime: '08:00 AM',
    status: selectedBus.status,
  };

  const telemetry = {
    speed: selectedTrip.speed || DEFAULT_TELEMETRY[selectedBus.id]?.speed || '28 km/h',
    distance: selectedTrip.distance || DEFAULT_TELEMETRY[selectedBus.id]?.distance || '4.2 km',
    duration: selectedTrip.duration || DEFAULT_TELEMETRY[selectedBus.id]?.duration || '14 min',
    nextStop: selectedTrip.nextStop || DEFAULT_TELEMETRY[selectedBus.id]?.nextStop || 'Stop 03',
    students: selectedTrip.students ?? DEFAULT_TELEMETRY[selectedBus.id]?.students ?? 42,
  };

  return (
    <div className="live-tracking-page">
      <div className="tracking-layout">
        {/* ================= LEFT COLUMN: BUS CARDS ================= */}
        <div className="tracking-bus-list">
          {displayBuses.map((bus) => {
            const isSelected = bus.id === selectedBus.id;
            const isBusActive = bus.status === 'Active';

            return (
              <div
                key={bus.id}
                className={`tracking-bus-card ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedBusId(bus.id)}
              >
                <div className="bus-card-header">
                  <span className="bus-card-id">{bus.id}</span>
                  <span className={`bus-status-badge ${bus.status.toLowerCase()}`}>
                    {bus.status}
                  </span>
                </div>
                <div className="bus-card-driver">{bus.driver}</div>
                <div className="bus-card-route">{bus.route}</div>
                {isBusActive && (
                  <div className="bus-card-live-tag">
                    <span className="live-green-dot"></span>
                    <span>Live GPS</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ================= CENTER COLUMN: LIVE MAP ================= */}
        <div className="tracking-map-container">
          {/* Top Floating Card */}
          <div className="map-floating-info">
            <strong>Live Bus Tracking</strong>
            <span>{activeBuses.length} buses active · Updated just now</span>
          </div>

          {/* SVG Map Canvas with Roads & Routes */}
          <svg className="tracking-map-svg" viewBox="0 0 1000 600" preserveAspectRatio="none">
            {/* Subtle city grid streets */}
            <path
              d="M 565 0 L 565 600"
              fill="none"
              stroke="#ffffff"
              strokeWidth="28"
            />
            <path
              d="M 565 0 L 565 600"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="2"
            />
            <path
              d="M 670 0 L 670 600"
              fill="none"
              stroke="#ffffff"
              strokeWidth="20"
            />
            <path
              d="M 670 0 L 670 600"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="2"
            />
            <path
              d="M 400 270 L 1000 270"
              fill="none"
              stroke="#ffffff"
              strokeWidth="24"
            />
            <path
              d="M 400 270 L 1000 270"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="2"
            />

            {/* Red / Brown Dashed Route (SKIT curving south-east) */}
            <path
              d="M 565 270 Q 640 258 720 282 T 840 310"
              fill="none"
              stroke="#991b1b"
              strokeWidth="4"
              strokeDasharray="8 8"
            />

            {/* Blue Dashed Route (SKIT curving north-east to Jaipur) */}
            <path
              d="M 565 270 Q 635 216 725 156 T 850 90"
              fill="none"
              stroke="#2563eb"
              strokeWidth="4"
              strokeDasharray="8 8"
            />
          </svg>

          {/* Map Markers */}
          {/* 1. SKIT Campus Marker */}
          <div className="map-marker" style={{ left: '56.5%', top: '45%' }}>
            <div className="skit-map-marker">
              <span className="skit-red-dot"></span>
              <span>SKIT</span>
            </div>
          </div>

          {/* 2. Bus 1234 Marker */}
          <div
            className={`map-marker bus-map-marker ${selectedBus.id === 'RJ-14-AB-1234' ? 'is-selected' : ''}`}
            style={{ left: '63.5%', top: '36%' }}
            onClick={() => setSelectedBusId('RJ-14-AB-1234')}
            title="RJ-14-AB-1234 · Rajesh Kumar"
          >
            {selectedBus.id === 'RJ-14-AB-1234' && <div className="bus-radar-pulse"></div>}
            <div className="bus-marker-bubble">
              <Bus size={15} />
            </div>
            <div className="bus-marker-label">...1234</div>
          </div>

          {/* 3. Bus 4512 Marker (on red route) */}
          <div
            className={`map-marker bus-map-marker inactive-marker ${selectedBus.id === 'RJ-14-AB-4512' ? 'is-selected' : ''}`}
            style={{ left: '72%', top: '47%' }}
            onClick={() => setSelectedBusId('RJ-14-AB-4512')}
            title="RJ-14-AB-4512"
          >
            {selectedBus.id === 'RJ-14-AB-4512' && <div className="bus-radar-pulse"></div>}
            <div className="bus-marker-bubble">
              <Bus size={15} />
            </div>
            <div className="bus-marker-label">-4...</div>
          </div>

          {/* 4. Bus 1088 Marker (on upper right) */}
          <div
            className={`map-marker bus-map-marker ${selectedBus.id === 'RJ-14-AB-1088' ? 'is-selected' : ''}`}
            style={{ left: '72.5%', top: '26%' }}
            onClick={() => setSelectedBusId('RJ-14-AB-1088')}
            title="RJ-14-AB-1088 · Suresh Meena"
          >
            {selectedBus.id === 'RJ-14-AB-1088' && <div className="bus-radar-pulse"></div>}
            <div className="bus-marker-bubble">
              <Bus size={15} />
            </div>
            <div className="bus-marker-label">...1088</div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: BUS DETAILS & TELEMETRY ================= */}
        <div className="tracking-telemetry-col">
          {/* Main Selected Bus Details Card */}
          <div className="telemetry-card">
            <div className="telemetry-header">
              <h3>{selectedBus.id}</h3>
              <span className={`bus-status-badge ${selectedBus.status.toLowerCase()}`}>
                {selectedBus.status}
              </span>
            </div>

            <div className="telemetry-rows">
              <div className="telemetry-row">
                <span className="telemetry-label">Driver</span>
                <span className="telemetry-value">{selectedBus.driver}</span>
              </div>
              <div className="telemetry-row">
                <span className="telemetry-label">Route</span>
                <span className="telemetry-value">{sanitizeRouteString(selectedBus.route)}</span>
              </div>
              <div className="telemetry-row">
                <span className="telemetry-label">Capacity</span>
                <span className="telemetry-value">{selectedBus.capacity}</span>
              </div>
              <div className="telemetry-row">
                <span className="telemetry-label">Type</span>
                <span className="telemetry-value">{selectedBus.type}</span>
              </div>
              <div className="telemetry-row">
                <span className="telemetry-label">Speed</span>
                <span className="telemetry-value">{telemetry.speed}</span>
              </div>
              <div className="telemetry-row">
                <span className="telemetry-label">Distance</span>
                <span className="telemetry-value">{telemetry.distance}</span>
              </div>
              <div className="telemetry-row">
                <span className="telemetry-label">Duration</span>
                <span className="telemetry-value">{telemetry.duration}</span>
              </div>
              <div className="telemetry-row">
                <span className="telemetry-label">Next Stop</span>
                <span className="telemetry-value">{telemetry.nextStop}</span>
              </div>
              <div className="telemetry-row">
                <span className="telemetry-label">Students</span>
                <span className="telemetry-value">{telemetry.students}</span>
              </div>
            </div>

            <button
              type="button"
              className="btn-view-trip-details"
              onClick={() => setIsTripModalOpen(true)}
            >
              View Trip Details
            </button>
          </div>

          {/* Last Update Card */}
          <div className="last-update-card">
            <span className="last-update-title">LAST UPDATE</span>
            <span className="last-update-time">{secondsAgo} seconds ago</span>
            <span className="last-update-signal">
              <span className="signal-dot"></span>
              GPS signal: Strong
            </span>
          </div>
        </div>
      </div>

      {/* TRIP DETAILS MODAL */}
      {isTripModalOpen && (
        <div className="modal-overlay" onClick={() => setIsTripModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2>Trip Details · {selectedTrip.id}</h2>
                <span
                  className="badge bg-green-light text-green"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <Radio size={12} /> Live
                </span>
              </div>
              <button className="close-modal-btn" onClick={() => setIsTripModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="view-profile-card" style={{ marginBottom: '16px' }}>
                <div className="view-avatar-large">
                  <Navigation size={22} />
                </div>
                <div className="view-profile-info">
                  <h3>{selectedBus.id} · {sanitizeRouteString(selectedBus.route)}</h3>
                  <p>Driver: {selectedBus.driver} · Tel: {selectedTrip.phone}</p>
                </div>
              </div>

              {/* Telemetry Grid */}
              <div className="track-metrics-grid">
                <div className="track-metric-box">
                  <div className="metric-label">Current Speed</div>
                  <div className="metric-val">{telemetry.speed}</div>
                </div>
                <div className="track-metric-box">
                  <div className="metric-label">Students</div>
                  <div className="metric-val">{telemetry.students} onboard</div>
                </div>
                <div className="track-metric-box">
                  <div className="metric-label">Estimated ETA</div>
                  <div className="metric-val text-blue">{telemetry.duration}</div>
                </div>
              </div>

              {/* Stop Progress Timeline */}
              <div className="timeline-card" style={{ marginTop: '16px' }}>
                <div className="timeline-title">Route Progress & Stops</div>
                <div className="stop-timeline">
                  <div className="stop-item">
                    <div className="stop-dot completed">
                      <CheckCircle size={12} color="white" />
                    </div>
                    <span className="stop-name">SKIT Main Gate (Origin)</span>
                    <span className="stop-time">08:00 AM</span>
                  </div>
                  <div className="stop-item">
                    <div className="stop-dot completed">
                      <CheckCircle size={12} color="white" />
                    </div>
                    <span className="stop-name">Jagatpura Circle</span>
                    <span className="stop-time">08:14 AM</span>
                  </div>
                  <div className="stop-item">
                    <div className="stop-dot current">
                      <Bus size={10} color="white" />
                    </div>
                    <span className="stop-name font-bold" style={{ color: '#2563eb' }}>
                      {telemetry.nextStop} (Next)
                    </span>
                    <span className="stop-time text-blue font-bold">{telemetry.duration}</span>
                  </div>
                  <div className="stop-item">
                    <div className="stop-dot"></div>
                    <span className="stop-name" style={{ color: '#94a3b8' }}>Final Destination</span>
                    <span className="stop-time">Scheduled</span>
                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ marginTop: '20px' }}>
                <button className="btn-cancel" onClick={() => setIsTripModalOpen(false)}>
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

export default LiveTracking;
