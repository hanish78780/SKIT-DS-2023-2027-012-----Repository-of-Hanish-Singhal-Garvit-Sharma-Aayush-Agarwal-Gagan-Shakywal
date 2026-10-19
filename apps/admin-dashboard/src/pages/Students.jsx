import { useState } from 'react';
import { Search, ChevronDown, X, Plus } from 'lucide-react';
import { useTransport } from '../context/useTransport';
import './Students.css';

const Students = () => {
  const { students: studentsList, buses, updateStudent, unassignStudent, addStudent } = useTransport();
  const [selectedRoute, setSelectedRoute] = useState('All Routes');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [modalType, setModalType] = useState(null); // 'view' | 'edit' | 'assign' | 'add' | null
  const [currentStudent, setCurrentStudent] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    course: 'B.Tech CSE',
    year: '1st Year',
    stop: 'Stop 01',
    route: 'Route 01',
    bus: 'RJ-14-AB-1234',
    status: 'Active',
  });

  // Dynamically extract all assigned routes from the student list
  const assignedRoutes = Array.from(
    new Set(
      studentsList
        .map((s) => s.route)
        .filter((r) => r && r.trim() !== '' && r !== '—')
    )
  ).sort();

  // Combine default routes with any custom/assigned routes for the assign modal
  const allAvailableRoutes = Array.from(
    new Set([
      'Route 01',
      'Route 02',
      'Route 03',
      'Route 04',
      'Route 05',
      ...assignedRoutes,
    ])
  ).sort();

  // Reset an invalid selection before rendering the updated route options.
  if (selectedRoute !== 'All Routes' && !assignedRoutes.includes(selectedRoute)) {
    setSelectedRoute('All Routes');
  }

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
      id: student.id,
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
      id: student.id,
      name: student.name,
      course: student.course,
      year: student.year,
      stop: student.stop === '—' ? 'Stop 01' : student.stop,
      route: student.route === '—' ? 'Route 01' : student.route,
      bus: student.bus === '—' ? (buses[0]?.id || 'RJ-14-AB-1234') : student.bus,
      status: 'Active',
    });
    setModalType('assign');
  };

  const handleOpenAdd = () => {
    setFormData({
      id: '',
      name: '',
      course: 'B.Tech CSE',
      year: '1st Year',
      stop: 'Stop 01',
      route: 'Route 01',
      bus: buses[0]?.id || 'RJ-14-AB-1234',
      status: 'Active',
    });
    setModalType('add');
  };

  const handleCloseModal = () => {
    setModalType(null);
    setCurrentStudent(null);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!currentStudent) return;

    updateStudent(currentStudent.id, {
      name: formData.name,
      initial: formData.name.charAt(0).toUpperCase() || currentStudent.initial,
      course: formData.course,
      year: formData.year,
      stop: formData.stop,
      route: formData.route,
      bus: formData.bus,
      status: formData.status,
    });
    handleCloseModal();
  };

  const handleSaveAssign = (e) => {
    e.preventDefault();
    if (!currentStudent) return;

    updateStudent(currentStudent.id, {
      route: formData.route,
      stop: formData.stop,
      bus: formData.bus,
      status: 'Active',
    });
    handleCloseModal();
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter student name.');
      return;
    }

    const generatedId = formData.id.trim() || `24CSE${Math.floor(100 + Math.random() * 900)}`;
    const isUnassigned = formData.status === 'Unassigned' || formData.route === '—';

    const newStudent = {
      id: generatedId,
      name: formData.name.trim(),
      initial: formData.name.trim().charAt(0).toUpperCase() || 'S',
      course: formData.course || 'B.Tech CSE',
      year: formData.year || '1st Year',
      stop: isUnassigned ? '—' : (formData.stop || 'Stop 01'),
      route: isUnassigned ? '—' : (formData.route || 'Route 01'),
      bus: isUnassigned ? '—' : (formData.bus || '—'),
      status: isUnassigned ? 'Unassigned' : (formData.status || 'Active'),
    };

    addStudent(newStudent);
    handleCloseModal();
  };

  const handleUnassign = () => {
    if (!currentStudent) return;

    unassignStudent(currentStudent.id);
    handleCloseModal();
  };

  return (
    <div className="students-page">
      {/* Summary Cards */}
      <div className="students-summary-grid">
        <div className="summary-card">
          <h2 className="text-blue-primary">{(1235 + studentsList.length).toLocaleString()}</h2>
          <p>Total Students</p>
        </div>
        <div className="summary-card">
          <h2 className="text-green-primary">
            {(1182 + studentsList.filter((s) => s.status === 'Active').length).toLocaleString()}
          </h2>
          <p>Active</p>
        </div>
        <div className="summary-card">
          <h2 className="text-purple-primary">
            {(1222 + studentsList.filter((s) => s.route && s.route !== '—').length).toLocaleString()}
          </h2>
          <p>Assigned</p>
        </div>
        <div className="summary-card">
          <h2 className="text-orange-primary">
            {(13 + studentsList.filter((s) => !s.route || s.route === '—' || s.status === 'Unassigned').length).toLocaleString()}
          </h2>
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
                {assignedRoutes.map((route) => (
                  <option key={route} value={route}>{route}</option>
                ))}
              </select>
              <ChevronDown size={16} className="dropdown-icon" />
            </div>
            <button className="add-student-btn" onClick={handleOpenAdd}>
              <Plus size={16} />
              <span>Add Student</span>
            </button>
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
                    <select 
                      value={formData.route} 
                      onChange={(e) => setFormData({ ...formData, route: e.target.value })} 
                    >
                      <option value="—">Unassigned (—)</option>
                      {allAvailableRoutes.map((route) => (
                        <option key={route} value={route}>{route}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Bus Number</label>
                    <select 
                      value={formData.bus} 
                      onChange={(e) => setFormData({ ...formData, bus: e.target.value })} 
                    >
                      <option value="—">Unassigned (—)</option>
                      {buses.map((b) => (
                        <option key={b.id} value={b.id}>{b.id} ({b.type})</option>
                      ))}
                    </select>
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
                      {allAvailableRoutes.map((route) => (
                        <option key={route} value={route}>{route}</option>
                      ))}
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
                      value={formData.bus === '—' ? (buses[0]?.id || 'RJ-14-AB-1234') : formData.bus} 
                      onChange={(e) => setFormData({ ...formData, bus: e.target.value })}
                    >
                      {buses.map((b) => (
                        <option key={b.id} value={b.id}>{b.id} ({b.type})</option>
                      ))}
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

      {/* ADD STUDENT MODAL */}
      {modalType === 'add' && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Student</h2>
              <button className="close-modal-btn" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveAdd}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Rahul Sharma" 
                      value={formData.name} 
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Roll Number (ID)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 24CSE105 (Auto-generated if blank)" 
                      value={formData.id} 
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })} 
                    />
                  </div>
                  <div className="form-group">
                    <label>Course</label>
                    <select 
                      value={formData.course} 
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    >
                      <option value="B.Tech CSE">B.Tech CSE</option>
                      <option value="B.Tech ME">B.Tech ME</option>
                      <option value="B.Tech EE">B.Tech EE</option>
                      <option value="B.Tech CE">B.Tech CE</option>
                      <option value="B.Tech IT">B.Tech IT</option>
                      <option value="BCA">BCA</option>
                      <option value="MCA">MCA</option>
                    </select>
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
                    <label>Assign Route</label>
                    <select 
                      value={formData.route} 
                      onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                    >
                      <option value="—">Unassigned (—)</option>
                      {allAvailableRoutes.map((route) => (
                        <option key={route} value={route}>{route}</option>
                      ))}
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
                  <div className="form-group full-width">
                    <label>Assigned Bus</label>
                    <select 
                      value={formData.bus} 
                      onChange={(e) => setFormData({ ...formData, bus: e.target.value })}
                    >
                      <option value="—">Unassigned (—)</option>
                      {buses.map((b) => (
                        <option key={b.id} value={b.id}>{b.id} ({b.type})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit">
                    Add Student
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
