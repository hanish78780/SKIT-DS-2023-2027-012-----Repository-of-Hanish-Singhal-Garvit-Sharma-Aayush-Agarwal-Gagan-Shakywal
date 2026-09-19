import React from 'react';
import { UserRound, Bus, Activity, GraduationCap, Route, MapPin, CheckCircle2, Clock } from 'lucide-react';
import './Dashboard.css';

const stats = [
  { title: "Total Students", value: "1,250", description: "Enrolled in transport", icon: GraduationCap, color: "purple" },
  { title: "Total Drivers", value: "48", description: "Registered & trained", icon: UserRound, color: "gray" },
  { title: "Total Buses", value: "32", description: "Actively managed", icon: Bus, color: "yellow" },
  { title: "Total Routes", value: "12", description: "Active routes", icon: Route, color: "blue" },
  { title: "Active Trips", value: "18", description: "Currently running", icon: Activity, color: "green" },
];

const activeTrips = [
  { id: "TRP-1001", bus: "UP-32-AB-1234", driver: "Ramesh Kumar", route: "Route A (Jaipur Central)", status: "On Time", time: "10 mins away" },
  { id: "TRP-1002", bus: "RJ-14-CD-5678", driver: "Suresh Singh", route: "Route B (Malviya Nagar)", status: "Delayed", time: "25 mins away" },
  { id: "TRP-1003", bus: "RJ-14-XY-9012", driver: "Amit Sharma", route: "Route C (Mansarovar)", status: "On Time", time: "5 mins away" },
];

const recentTrips = [
  { id: "TRP-0998", date: "Oct 24, 2026", route: "Route A", driver: "Ramesh Kumar", students: 45, status: "Completed" },
  { id: "TRP-0999", date: "Oct 24, 2026", route: "Route B", driver: "Suresh Singh", students: 38, status: "Completed" },
  { id: "TRP-1000", date: "Oct 24, 2026", route: "Route C", driver: "Amit Sharma", students: 42, status: "Completed" },
];

const Dashboard = () => {
  return (
    <section className="dashboard-content">
      <div className="dashboard-header">
        <h2>Overview</h2>
        <p>Monitor your fleet's daily performance and active trips.</p>
      </div>

      {/* 5 Metric Cards */}
      <div className="stats-grid-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div className={`metric-card border-${stat.color}`} key={idx}>
              <div className="metric-header">
                <div className={`metric-icon-box bg-${stat.color}`}>
                  <Icon size={20} />
                </div>
                <span className="metric-title">{stat.title}</span>
              </div>
              <h3>{stat.value}</h3>
              <p>{stat.description}</p>
            </div>
          );
        })}
      </div>

      <div className="dashboard-main-grid">
        {/* Map Placeholder */}
        <div className="dashboard-panel map-panel">
          <div className="panel-header">
            <h3>Live Fleet Tracking</h3>
            <button className="view-map-btn">View Full Map</button>
          </div>
          <div className="map-placeholder">
            <div className="map-grid-bg"></div>
            <div className="map-center-content">
              <div className="pulse-dot"></div>
              <MapPin size={48} className="map-pin-icon" />
              <p>Map Integration Pending</p>
              <span>Google Maps API will be loaded here</span>
            </div>
          </div>
        </div>

        {/* Active Trips List */}
        <div className="dashboard-panel active-trips-panel">
          <div className="panel-header">
            <h3>Active Trips</h3>
            <span className="live-badge"><span className="dot"></span> Live</span>
          </div>
          <div className="active-trips-list">
            {activeTrips.map((trip) => (
              <div className="active-trip-card" key={trip.id}>
                <div className="trip-info">
                  <h4>{trip.route}</h4>
                  <p>Bus {trip.bus} • {trip.driver}</p>
                </div>
                <div className="trip-status-box">
                  <span className={`status-text ${trip.status === 'Delayed' ? 'delayed' : 'on-time'}`}>
                    {trip.status}
                  </span>
                  <span className="time-eta"><Clock size={12} /> ETA: {trip.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trips Table */}
      <div className="dashboard-panel full-width">
        <div className="panel-header">
          <h3>Recent Trips</h3>
          <button className="view-all-btn">View All</button>
        </div>
        <div className="table-responsive">
          <table className="trips-table">
            <thead>
              <tr>
                <th>Trip ID</th>
                <th>Date</th>
                <th>Route</th>
                <th>Driver</th>
                <th>Students Boarded</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTrips.map(trip => (
                <tr key={trip.id}>
                  <td><strong>{trip.id}</strong></td>
                  <td>{trip.date}</td>
                  <td>{trip.route}</td>
                  <td>{trip.driver}</td>
                  <td>{trip.students}</td>
                  <td>
                    <span className="badge success"><CheckCircle2 size={14}/> {trip.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
