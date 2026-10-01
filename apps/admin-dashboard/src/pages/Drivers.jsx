import React from 'react';
import { Plus } from 'lucide-react';
import './Drivers.css';

const driversData = [
  { id: 'DRV-001', name: 'Rajesh Kumar', initial: 'R', phone: '98765 43210', bus: 'RJ-14-AB-1234', route: 'Route 03', trip: 'TRIP-1024', status: 'Online' },
  { id: 'DRV-002', name: 'Suresh Meena', initial: 'S', phone: '97654 32109', bus: 'RJ-14-AB-1088', route: 'Route 01', trip: 'TRIP-1022', status: 'Online' },
  { id: 'DRV-003', name: 'Mohan Sharma', initial: 'M', phone: '96543 21098', bus: 'RJ-14-AB-2231', route: 'Route 02', trip: '—', status: 'Offline' },
  { id: 'DRV-004', name: 'Dinesh Yadav', initial: 'D', phone: '95432 10987', bus: 'RJ-14-AB-4512', route: 'Route 04', trip: 'TRIP-1026', status: 'Online' },
  { id: 'DRV-005', name: 'Ramesh Verma', initial: 'R', phone: '94321 09876', bus: '—', route: '—', trip: '—', status: 'On Leave' },
];

const Drivers = () => {
  return (
    <div className="drivers-page">
      {/* Summary Cards */}
      <div className="drivers-summary-grid">
        <div className="summary-card">
          <h2 className="text-blue-primary">28</h2>
          <p>Total Drivers</p>
        </div>
        <div className="summary-card">
          <h2 className="text-green-primary">18</h2>
          <p>Active / Online</p>
        </div>
        <div className="summary-card">
          <h2 className="text-purple-primary">8</h2>
          <p>Available</p>
        </div>
        <div className="summary-card">
          <h2 className="text-orange-primary">2</h2>
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
            <button className="add-driver-btn">
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
              {driversData.map((driver, index) => (
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
                      <a href="#" className="trip-link">{driver.trip}</a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>
                    <span className={`badge ${driver.status === 'Online' ? 'bg-green-light text-green' : driver.status === 'On Leave' ? 'bg-orange-light text-orange' : 'bg-gray-light text-gray'}`}>
                      {driver.status}
                    </span>
                  </td>
                  <td className="actions">
                    <a href="#">Profile</a>
                    <a href="#" className="text-gray-dark">Assign</a>
                    <a href="#" className="text-red">Disable</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Drivers;
