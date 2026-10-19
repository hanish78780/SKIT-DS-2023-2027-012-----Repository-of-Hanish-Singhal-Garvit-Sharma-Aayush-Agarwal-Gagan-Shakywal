import React, { useState } from 'react';
import { Bus, UserRound, Users, Clock, X, Navigation, Phone, CheckCircle, Radio } from 'lucide-react';
import { useTransport, sanitizeRouteString } from '../context/TransportContext';
import './Dashboard.css';

const Dashboard = () => {
  const { trips: tripsList, buses, drivers, students } = useTransport();
  const [modalType, setModalType] = useState(null); // 'view' | 'track' | null
  const [selectedTrip, setSelectedTrip] = useState(null);

  const handleOpenView = (trip) => {
    setSelectedTrip(trip);
    setModalType('view');
  };

  const handleOpenTrack = (trip) => {
    setSelectedTrip(trip);
    setModalType('track');
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedTrip(null);
  };

  const getBadgeClass = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-light text-green';
      case 'Completed':
        return 'bg-blue-light text-blue';
      case 'Delayed':
        return 'bg-orange-light text-orange';
      case 'Cancelled':
        return 'bg-red-light text-red';
      default:
        return 'bg-gray-light text-gray';
    }
  };

  return (
    <div className="dashboard-wrapper">
      {/* Stats Row */}
      <div className="stats-container">
        <div className="stat-card">
           <div className="stat-icon-box bg-blue-light"><Bus size={22} className="text-blue" /></div>
           <div className="stat-info">
             <h3>24</h3>
             <p>Total Buses</p>
             <span className="trend-green">↑ 2 added this month</span>
           </div>
        </div>
        <div className="stat-card">
           <div className="stat-icon-box bg-green-light"><Bus size={22} className="text-green" /></div>
           <div className="stat-info">
             <h3>12</h3>
             <p>Active Buses</p>
           </div>
        </div>
        <div className="stat-card">
           <div className="stat-icon-box bg-red-light"><UserRound size={22} className="text-red" /></div>
           <div className="stat-info">
             <h3>28</h3>
             <p>Drivers</p>
             <span className="trend-green">↑ 3 online now</span>
           </div>
        </div>
        <div className="stat-card">
           <div className="stat-icon-box bg-orange-light"><Users size={22} className="text-orange" /></div>
           <div className="stat-info">
             <h3>1,240</h3>
             <p>Students</p>
           </div>
        </div>
        <div className="stat-card">
           <div className="stat-icon-box bg-purple-light"><Clock size={22} className="text-purple" /></div>
           <div className="stat-info">
             <h3>36</h3>
             <p>Today's Trips</p>
             <span className="trend-green">↑ 4 active now</span>
           </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Left Column */}
        <div className="dashboard-left">
          <div className="card live-tracking-card">
            <div className="card-header">
              <h2>Live Bus Tracking</h2>
              <p>Real-time positions · SKIT Jaipur Campus</p>
            </div>
            <div className="map-area">
               <svg className="map-svg" viewBox="0 0 800 400" preserveAspectRatio="none">
                 <path d="M 120 280 Q 250 120, 450 50" stroke="#2563eb" strokeWidth="4" strokeDasharray="8 8" fill="none" />
                 <path d="M 120 280 Q 300 320, 450 280" stroke="#991b1b" strokeWidth="4" strokeDasharray="8 8" fill="none" />
               </svg>
               <div className="marker skit-marker" style={{ top: '70%', left: '15%' }}>
                 <span className="dot bg-red"></span> SKIT
               </div>
               <div 
                 className="marker bus-marker" 
                 style={{ top: '48%', left: '27.5%', cursor: 'pointer' }}
                 onClick={() => handleOpenTrack(tripsList[0])}
                 title="Click to track RJ-14-AB-1234"
               >
                 <div className="bus-icon bg-blue"><Bus size={14}/></div>
                 <div className="marker-label">-1234</div>
               </div>
               <div 
                 className="marker bus-marker" 
                 style={{ top: '23%', left: '43.75%', cursor: 'pointer' }}
                 onClick={() => handleOpenTrack(tripsList[1])}
                 title="Click to track RJ-14-AB-1088"
               >
                 <div className="bus-icon bg-blue"><Bus size={14}/></div>
                 <div className="marker-label">-1088</div>
               </div>
               <div 
                 className="marker bus-marker" 
                 style={{ top: '74%', left: '41.25%', cursor: 'pointer' }}
                 onClick={() => handleOpenTrack(tripsList[2])}
                 title="Click to track RJ-14-AB-4512"
               >
                 <div className="bus-icon bg-gray"><Bus size={14}/></div>
                 <div className="marker-label">-4512</div>
               </div>

               <div className="map-info-box">
                 <strong>Live Bus Tracking</strong>
                 <span>3 buses active · Updated just now</span>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="dashboard-right">
          <div className="card active-trips-card">
             <div className="card-header space-between">
                <div>
                  <h2>Active Trips</h2>
                  <p>Currently running</p>
                </div>
                <div className="live-indicator"><span className="dot bg-green"></span> Live</div>
             </div>
             
             <div className="trips-feed">
                <div 
                  className="feed-item" 
                  style={{ cursor: 'pointer' }} 
                  onClick={() => handleOpenTrack(tripsList[0])}
                  title="Click to track TRIP-1024"
                >
                  <div className="feed-info">
                    <h4>TRIP-1024</h4>
                    <p>RJ-14-AB-1234 · Rajesh Kumar</p>
                    <p className="feed-route">SKIT → Jaipur · 42 students</p>
                  </div>
                  <div><span className="badge bg-green-light text-green">Active</span></div>
                </div>
                <div className="feed-divider"></div>
                <div 
                  className="feed-item" 
                  style={{ cursor: 'pointer' }} 
                  onClick={() => handleOpenTrack(tripsList[1])}
                  title="Click to track TRIP-1023"
                >
                  <div className="feed-info">
                    <h4>TRIP-1023</h4>
                    <p>RJ-14-AB-1088 · Suresh Meena</p>
                    <p className="feed-route">SKIT → Tonk Rd · 38 students</p>
                  </div>
                  <div><span className="badge bg-green-light text-green">Active</span></div>
                </div>
             </div>
          </div>

          <div className="summary-grid">
            <div className="summary-card">
              <h2 className="text-orange">2</h2>
              <p>Buses on Maintenance</p>
            </div>
            <div className="summary-card">
              <h2 className="text-green">8</h2>
              <p>Drivers Available</p>
            </div>
            <div className="summary-card">
              <h2 className="text-orange-dark">1</h2>
              <p>Delayed Trips</p>
            </div>
            <div className="summary-card">
              <h2 className="text-red">14</h2>
              <p>Unassigned Students</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card table-card">
        <div className="card-header">
           <h2>All Trips Today</h2>
           <p>36 trips scheduled</p>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>TRIP ID</th>
                <th>BUS</th>
                <th>DRIVER</th>
                <th>ROUTE</th>
                <th>STUDENTS</th>
                <th>START TIME</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {tripsList.map((trip) => (
                <tr key={trip.id}>
                  <td 
                    className="text-blue font-bold" 
                    style={{ cursor: 'pointer' }} 
                    onClick={() => handleOpenView(trip)}
                    title="Click to view details"
                  >
                    {trip.id}
                  </td>
                  <td>{trip.bus}</td>
                  <td>{trip.driver}</td>
                  <td>{sanitizeRouteString(trip.route)}</td>
                  <td>{trip.students}</td>
                  <td>{trip.startTime}</td>
                  <td><span className={`badge ${getBadgeClass(trip.status)}`}>{trip.status}</span></td>
                  <td className="actions">
                    <button type="button" onClick={() => handleOpenView(trip)}>View</button>
                    <button type="button" onClick={() => handleOpenTrack(trip)}>Track</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW TRIP MODAL */}
      {modalType === 'view' && selectedTrip && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Trip Details</h2>
              <button className="close-modal-btn" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="view-profile-card">
                <div className="view-avatar-large">
                  <Bus size={24} />
                </div>
                <div className="view-profile-info">
                  <h3>{selectedTrip.id}</h3>
                  <p>{sanitizeRouteString(selectedTrip.route)} · Bus {selectedTrip.bus}</p>
                </div>
              </div>

              <div className="view-details-grid">
                <div className="detail-item">
                  <span className="label">Assigned Driver</span>
                  <span className="value">{selectedTrip.driver}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Driver Phone</span>
                  <span className="value">{selectedTrip.phone}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Departure Time</span>
                  <span className="value">{selectedTrip.startTime}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Total Students</span>
                  <span className="value">{selectedTrip.students} onboard</span>
                </div>
                <div className="detail-item">
                  <span className="label">Trip Status</span>
                  <span className="value">
                    <span className={`badge ${getBadgeClass(selectedTrip.status)}`}>
                      {selectedTrip.status}
                    </span>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Current ETA</span>
                  <span className="value text-blue font-bold">{selectedTrip.eta}</span>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn-cancel" onClick={handleCloseModal}>
                  Close
                </button>
                <button 
                  className="btn-submit" 
                  onClick={() => handleOpenTrack(selectedTrip)}
                >
                  Live Radar / Track
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LIVE TRACK TRIP MODAL */}
      {modalType === 'track' && selectedTrip && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2>Live Tracking · {selectedTrip.id}</h2>
                <span className="badge bg-green-light text-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Radio size={12} /> Live
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

              {/* Live telemetry metrics */}
              <div className="track-metrics-grid">
                <div className="track-metric-box">
                  <div className="metric-label">Current Speed</div>
                  <div className="metric-val">{selectedTrip.speed}</div>
                </div>
                <div className="track-metric-box">
                  <div className="metric-label">Students</div>
                  <div className="metric-val">{selectedTrip.students} onboard</div>
                </div>
                <div className="track-metric-box">
                  <div className="metric-label">Estimated ETA</div>
                  <div className="metric-val text-blue">{selectedTrip.eta}</div>
                </div>
              </div>

              {/* Stop Progress Timeline */}
              <div className="timeline-card">
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
                      {selectedTrip.nextStop} (Next)
                    </span>
                    <span className="stop-time text-blue font-bold">{selectedTrip.eta}</span>
                  </div>
                  <div className="stop-item">
                    <div className="stop-dot"></div>
                    <span className="stop-name" style={{ color: '#94a3b8' }}>Final Destination</span>
                    <span className="stop-time">Scheduled</span>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn-cancel" onClick={handleCloseModal}>
                  Close
                </button>
                <a 
                  href={`tel:${selectedTrip.phone.replace(/\s+/g, '')}`} 
                  className="btn-submit"
                  style={{ textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
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
}

export default Dashboard;
