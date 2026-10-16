import React from 'react';
import { Search, ChevronDown } from 'lucide-react';
import './Students.css';

const studentsData = [
  { id: '23CSE101', name: 'Aarav Sharma', initial: 'A', course: 'B.Tech CSE', year: '3rd Year', stop: 'Stop 03', route: 'Route 03', bus: 'RJ-14-AB-1234', status: 'Active' },
  { id: '23CSE204', name: 'Priya Verma', initial: 'P', course: 'B.Tech CSE', year: '3rd Year', stop: 'Stop 02', route: 'Route 03', bus: 'RJ-14-AB-1234', status: 'Active' },
  { id: '23ME105', name: 'Rahul Singh', initial: 'R', course: 'B.Tech ME', year: '2nd Year', stop: 'Stop 05', route: 'Route 01', bus: 'RJ-14-AB-1088', status: 'Active' },
  { id: '23EE302', name: 'Neha Gupta', initial: 'N', course: 'B.Tech EE', year: '3rd Year', stop: 'Stop 01', route: 'Route 02', bus: '—', status: 'Unassigned' },
  { id: '23CE201', name: 'Arjun Mehta', initial: 'A', course: 'B.Tech CE', year: '1st Year', stop: 'Stop 04', route: 'Route 04', bus: 'RJ-14-AB-4512', status: 'Active' },
];

const Students = () => {
  return (
    <div className="students-page">
      {/* Summary Cards */}
      <div className="students-summary-grid">
        <div className="summary-card">
          <h2 className="text-blue-primary">1,240</h2>
          <p>Total Students</p>
        </div>
        <div className="summary-card">
          <h2 className="text-green-primary">1,186</h2>
          <p>Active</p>
        </div>
        <div className="summary-card">
          <h2 className="text-purple-primary">1,226</h2>
          <p>Assigned</p>
        </div>
        <div className="summary-card">
          <h2 className="text-orange-primary">14</h2>
          <p>Unassigned</p>
        </div>
      </div>

      {/* Directory Section */}
      <div className="directory-card">
        <div className="directory-header">
          <div className="dir-title">
            <h3>Student Directory</h3>
            <p>Search by name, roll number or stop</p>
          </div>
          <div className="dir-actions">
            <div className="search-box">
              <Search size={16} className="search-icon" />
              <input type="text" placeholder="Search students..." />
            </div>
            <div className="filter-dropdown">
              <select className="route-select">
                <option value="all">All Routes</option>
                <option value="route1">Route 01</option>
                <option value="route2">Route 02</option>
                <option value="route3">Route 03</option>
              </select>
              <ChevronDown size={16} className="dropdown-icon" />
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>STUDENT</th>
                <th>ROLL NO.</th>
                <th>COURSE</th>
                <th>YEAR</th>
                <th>STOP</th>
                <th>ROUTE</th>
                <th>BUS</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {studentsData.map((student, index) => (
                <tr key={index}>
                  <td>
                    <div className="student-profile">
                      <div className="student-avatar bg-blue-light text-blue-primary">
                        {student.initial}
                      </div>
                      <span className="student-name">{student.name}</span>
                    </div>
                  </td>
                  <td className="text-gray-light">{student.id}</td>
                  <td>{student.course}</td>
                  <td>{student.year}</td>
                  <td>{student.stop}</td>
                  <td>{student.route}</td>
                  <td>{student.bus}</td>
                  <td>
                    <span className={`badge ${student.status === 'Active' ? 'bg-green-light text-green' : 'bg-orange-light text-orange'}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="actions">
                    <a href="#">View</a>
                    <a href="#">Edit</a>
                    <a href="#">Assign</a>
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

export default Students;
