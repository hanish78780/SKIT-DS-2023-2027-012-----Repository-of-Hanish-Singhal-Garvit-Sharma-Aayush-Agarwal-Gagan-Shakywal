import React, { useState } from 'react';
import { Search, ChevronDown, X, User, Bus, MapPin, CheckCircle } from 'lucide-react';
import './Students.css';

const initialStudentsData = [
  { id: '23CSE101', name: 'Aarav Sharma', initial: 'A', course: 'B.Tech CSE', year: '3rd Year', stop: 'Stop 03', route: 'Route 03', bus: 'RJ-14-AB-1234', status: 'Active' },
  { id: '23CSE204', name: 'Priya Verma', initial: 'P', course: 'B.Tech CSE', year: '3rd Year', stop: 'Stop 02', route: 'Route 03', bus: 'RJ-14-AB-1234', status: 'Active' },
  { id: '23ME105', name: 'Rahul Singh', initial: 'R', course: 'B.Tech ME', year: '2nd Year', stop: 'Stop 05', route: 'Route 01', bus: 'RJ-14-AB-1088', status: 'Active' },
  { id: '23EE302', name: 'Neha Gupta', initial: 'N', course: 'B.Tech EE', year: '3rd Year', stop: 'Stop 01', route: 'Route 02', bus: '—', status: 'Unassigned' },
  { id: '23CE201', name: 'Arjun Mehta', initial: 'A', course: 'B.Tech CE', year: '1st Year', stop: 'Stop 04', route: 'Route 04', bus: 'RJ-14-AB-4512', status: 'Active' },
];

const Students = () => {
  const [studentsList, setStudentsList] = useState(initialStudentsData);
  const [selectedRoute, setSelectedRoute] = useState('All Routes');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [modalType, setModalType] = useState(null); // 'view' | 'edit' | 'assign' | null
  const [currentStudent, setCurrentStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    course: '',
    year: '3rd Year',
    stop: '',
    route: 'Route 01',
    bus: '',
    status: 'Active',
  });

  const filteredStudents = studentsList.filter((student) => {
    const matchesRoute = selectedRoute === 'All Routes' || student.route === selectedRoute;
    const matchesSearch =
      searchTerm.trim() === '' ||
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.stop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.course.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRoute && matchesSearch;
  });

  // Modal Handlers
  const handleOpenView = (student) => {
    setCurrentStudent(student);
    setModalType('view');
  };

  const handleOpenEdit = (student) => {
    setCurrentStudent(student);
    setFormData({
      name: student.name,
      course: student.course,
      year: student.year,
      stop: student.stop,
      route: student.route,
      bus: student.bus,
      status: student.status,
    });
    setModalType('edit');
  };

  const handleOpenAssign = (student) => {
    setCurrentStudent(student);
    setFormData({
      name: student.name,
      course: student.course,
      year: student.year,
      stop: student.stop === '—' ? 'Stop 01' : student.stop,
      route: student.route === '—' ? 'Route 01' : student.route,
      bus: student.bus === '—' ? 'RJ-14-AB-1234' : student.bus,
      status: 'Active',
    });
    setModalType('assign');
  };

  const handleCloseModal = () => {
    setModalType(null);
    setCurrentStudent(null);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!currentStudent) return;

    setStudentsList((prev) =>
      prev.map((s) =>
        s.id === currentStudent.id
          ? {
              ...s,
              name: formData.name,
              initial: formData.name.charAt(0).toUpperCase() || s.initial,
              course: formData.course,
              year: formData.year,
              stop: formData.stop,
              route: formData.route,
              bus: formData.bus,
              status: formData.status,
            }
          : s
      )
    );
    handleCloseModal();
  };

  const handleSaveAssign = (e) => {
    e.preventDefault();
    if (!currentStudent) return;

    setStudentsList((prev) =>
      prev.map((s) =>
        s.id === currentStudent.id
          ? {
              ...s,
              route: formData.route,
              stop: formData.stop,
              bus: formData.bus,
              status: 'Active',
            }
          : s
      )
    );
    handleCloseModal();
  };

  const handleUnassign = () => {
    if (!currentStudent) return;

    setStudentsList((prev) =>
      prev.map((s) =>
        s.id === currentStudent.id
          ? {
              ...s,
              route: '—',
              stop: '—',
              bus: '—',
              status: 'Unassigned',
            }
          : s
      )
    );
    handleCloseModal();
  };

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
              <input 
                type="text" 
                placeholder="Search students..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-dropdown">
              <select 
                className="route-select"
                value={selectedRoute}
                onChange={(e) => setSelectedRoute(e.target.value)}
              >
                <option value="All Routes">All Routes</option>
                <option value="Route 01">Route 01</option>
                <option value="Route 02">Route 02</option>
                <option value="Route 03">Route 03</option>
                <option value="Route 04">Route 04</option>
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
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                    No students found matching the selected filter.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, index) => (
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
                      <button type="button" onClick={() => handleOpenView(student)}>View</button>
                      <button type="button" onClick={() => handleOpenEdit(student)}>Edit</button>
                      <button type="button" onClick={() => handleOpenAssign(student)}>Assign</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW MODAL */}
      {modalType === 'view' && currentStudent && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Student Profile</h2>
              <button className="close-modal-btn" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="view-profile-card">
                <div className="view-avatar-large">
                  {currentStudent.initial}
                </div>
                <div className="view-profile-info">
                  <h3>{currentStudent.name}</h3>
                  <p>{currentStudent.id} · {currentStudent.course} ({currentStudent.year})</p>
                </div>
              </div>

              <div className="view-details-grid">
                <div className="detail-item">
                  <span className="label">Designated Stop</span>
                  <span className="value">{currentStudent.stop}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Assigned Route</span>
                  <span className="value">{currentStudent.route}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Assigned Bus</span>
                  <span className="value">{currentStudent.bus}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Transport Status</span>
                  <span className="value">
                    <span className={`badge ${currentStudent.status === 'Active' ? 'bg-green-light text-green' : 'bg-orange-light text-orange'}`}>
                      {currentStudent.status}
                    </span>
                  </span>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn-cancel" onClick={handleCloseModal}>
                  Close
                </button>
                <button 
                  className="btn-submit" 
                  onClick={() => handleOpenAssign(currentStudent)}
                >
                  Change Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {modalType === 'edit' && currentStudent && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Student Details</h2>
              <button className="close-modal-btn" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveEdit}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Roll Number (ID)</label>
                    <input type="text" value={currentStudent.id} disabled style={{ opacity: 0.7 }} />
                  </div>
                  <div className="form-group">
                    <label>Course</label>
                    <input 
                      type="text" 
                      value={formData.course} 
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Academic Year</label>
                    <select 
                      value={formData.year} 
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select 
                      value={formData.status} 
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Active">Active</option>
                      <option value="Unassigned">Unassigned</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Route</label>
                    <input 
                      type="text" 
                      value={formData.route} 
                      onChange={(e) => setFormData({ ...formData, route: e.target.value })} 
                    />
                  </div>
                  <div className="form-group">
                    <label>Bus Number</label>
                    <input 
                      type="text" 
                      value={formData.bus} 
                      onChange={(e) => setFormData({ ...formData, bus: e.target.value })} 
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Stop Name</label>
                    <input 
                      type="text" 
                      value={formData.stop} 
                      onChange={(e) => setFormData({ ...formData, stop: e.target.value })} 
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

      {/* ASSIGN MODAL */}
      {modalType === 'assign' && currentStudent && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Assign Transport Route & Bus</h2>
              <button className="close-modal-btn" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveAssign}>
              <div className="modal-body">
                <div className="view-profile-card" style={{ marginBottom: '18px' }}>
                  <div className="view-avatar-large">
                    {currentStudent.initial}
                  </div>
                  <div className="view-profile-info">
                    <h3>{currentStudent.name}</h3>
                    <p>Roll No: {currentStudent.id} · Current: {currentStudent.status}</p>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Select Route</label>
                    <select 
                      value={formData.route} 
                      onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                    >
                      <option value="Route 01">Route 01 (Malviya Nagar - Tonk Rd)</option>
                      <option value="Route 02">Route 02 (Mansarovar - Gopalpura)</option>
                      <option value="Route 03">Route 03 (Vaishali Nagar - Ajmer Rd)</option>
                      <option value="Route 04">Route 04 (Jagatpura - SKIT Direct)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Designated Stop</label>
                    <select 
                      value={formData.stop} 
                      onChange={(e) => setFormData({ ...formData, stop: e.target.value })}
                    >
                      <option value="Stop 01">Stop 01</option>
                      <option value="Stop 02">Stop 02</option>
                      <option value="Stop 03">Stop 03</option>
                      <option value="Stop 04">Stop 04</option>
                      <option value="Stop 05">Stop 05</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Assigned Bus</label>
                    <select 
                      value={formData.bus === '—' ? 'RJ-14-AB-1234' : formData.bus} 
                      onChange={(e) => setFormData({ ...formData, bus: e.target.value })}
                    >
                      <option value="RJ-14-AB-1234">RJ-14-AB-1234 (Bus 01)</option>
                      <option value="RJ-14-AB-1088">RJ-14-AB-1088 (Bus 02)</option>
                      <option value="RJ-14-AB-4512">RJ-14-AB-4512 (Bus 03)</option>
                      <option value="RJ-14-AB-2231">RJ-14-AB-2231 (Bus 04)</option>
                    </select>
                  </div>
                </div>

                <div className="modal-footer" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  {currentStudent.status === 'Active' && (
                    <button 
                      type="button" 
                      className="btn-unassign" 
                      onClick={handleUnassign}
                    >
                      Unassign Student
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
    </div>
  );
};

export default Students;
