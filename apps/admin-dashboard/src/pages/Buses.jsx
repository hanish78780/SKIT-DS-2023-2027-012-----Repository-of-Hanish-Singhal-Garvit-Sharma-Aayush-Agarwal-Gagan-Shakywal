import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import './Buses.css';

const busesData = [
  { id: 'RJ-14-AB-1234', type: 'AC', capacity: '40 seats', driver: 'Rajesh Kumar', route: 'Route 03', status: 'Active' },
  { id: 'RJ-14-AB-1088', type: 'Non-AC', capacity: '52 seats', driver: 'Suresh Meena', route: 'Route 01', status: 'Active' },
  { id: 'RJ-14-AB-2231', type: 'AC', capacity: '40 seats', driver: 'Mohan Sharma', route: 'Route 02', status: 'Maintenance' },
  { id: 'RJ-14-AB-4512', type: 'Non-AC', capacity: '52 seats', driver: 'Unassigned', route: '—', status: 'Inactive' },
  { id: 'RJ-14-AB-5501', type: 'AC', capacity: '36 seats', driver: 'Dinesh Yadav', route: 'Route 04', status: 'Active' },
];

const Buses = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="buses-page">
      {/* Summary Cards */}
      <div className="buses-summary-grid">
        <div className="summary-card">
          <h2 className="text-blue-primary">24</h2>
          <p>Total Buses</p>
        </div>
        <div className="summary-card">
          <h2 className="text-green-primary">12</h2>
          <p>Active</p>
        </div>
        <div className="summary-card">
          <h2 className="text-orange-primary">2</h2>
          <p>Maintenance</p>
        </div>
        <div className="summary-card">
          <h2 className="text-gray-dark">10</h2>
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
          <button className="add-btn" onClick={() => setIsModalOpen(true)}>
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
              {busesData.map((bus, index) => (
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
                    <a href="#">View</a>
                    <a href="#">Edit</a>
                    <a href="#">Assign</a>
                    {bus.status !== 'Maintenance' && <a href="#" className="text-red">Maintenance</a>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Bus Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Bus</h2>
              <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Bus Number</label>
                  <input type="text" placeholder="e.g. RJ-14-AB-5502" />
                </div>
                <div className="form-group">
                  <label>Registration No.</label>
                  <input type="text" placeholder="Enter registration" />
                </div>
                <div className="form-group">
                  <label>Bus Type</label>
                  <input type="text" placeholder="AC / Non-AC" />
                </div>
                <div className="form-group">
                  <label>Capacity</label>
                  <input type="text" placeholder="e.g. 40" />
                </div>
                <div className="form-group">
                  <label>Assign Driver</label>
                  <input type="text" placeholder="Select driver" />
                </div>
                <div className="form-group">
                  <label>Assign Route</label>
                  <input type="text" placeholder="Select route" />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button className="btn-submit" onClick={() => setIsModalOpen(false)}>Add Bus</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Buses;
