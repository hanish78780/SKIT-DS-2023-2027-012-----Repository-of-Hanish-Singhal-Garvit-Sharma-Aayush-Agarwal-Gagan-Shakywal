import React from 'react';
import { Bus, UserRound, Users, Clock } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
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
                 <path d="M 150 300 Q 350 150, 500 100" stroke="#2563eb" strokeWidth="4" strokeDasharray="8 8" fill="none" />
                 <path d="M 150 300 Q 400 350, 450 320" stroke="#991b1b" strokeWidth="4" strokeDasharray="8 8" fill="none" />
               </svg>
               <div className="marker skit-marker" style={{ top: '300px', left: '150px' }}>
                 <span className="dot bg-red"></span> SKIT
               </div>
               <div className="marker bus-marker" style={{ top: '230px', left: '260px' }}>
                 <div className="bus-icon bg-blue"><Bus size={14}/></div>
                 <span>-1234</span>
               </div>
               <div className="marker bus-marker" style={{ top: '150px', left: '380px' }}>
                 <div className="bus-icon bg-blue"><Bus size={14}/></div>
                 <span>-1088</span>
               </div>
               <div className="marker bus-marker" style={{ top: '330px', left: '420px' }}>
                 <div className="bus-icon bg-gray"><Bus size={14}/></div>
                 <span>-4512</span>
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
                <div className="feed-item">
                  <div className="feed-info">
                    <h4>TRIP-1024</h4>
                    <p>RJ-14-AB-1234 · Rajesh Kumar</p>
                    <p className="feed-route">SKIT → Jaipur · 42 students</p>
                  </div>
                  <div className="feed-status bg-green-light text-green">Active</div>
                </div>
                <div className="feed-divider"></div>
                <div className="feed-item">
                  <div className="feed-info">
                    <h4>TRIP-1023</h4>
                    <p>RJ-14-AB-1088 · Suresh Meena</p>
                    <p className="feed-route">SKIT → Tonk Rd · 38 students</p>
                  </div>
                  <div className="feed-status bg-green-light text-green">Active</div>
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
              <tr>
                <td className="text-blue font-bold">TRIP-1024</td>
                <td>RJ-14-AB-1234</td>
                <td>Rajesh Kumar</td>
                <td>SKIT → Jaipur</td>
                <td>42</td>
                <td>08:00 AM</td>
                <td><span className="badge bg-green-light text-green">Active</span></td>
                <td className="actions"><a href="#">View</a> <a href="#">Track</a></td>
              </tr>
              <tr>
                <td className="text-blue font-bold">TRIP-1023</td>
                <td>RJ-14-AB-1088</td>
                <td>Suresh Meena</td>
                <td>SKIT → Tonk Rd</td>
                <td>38</td>
                <td>08:05 AM</td>
                <td><span className="badge bg-green-light text-green">Active</span></td>
                <td className="actions"><a href="#">View</a> <a href="#">Track</a></td>
              </tr>
              <tr>
                <td className="text-blue font-bold">TRIP-1022</td>
                <td>RJ-14-AB-4512</td>
                <td>Dinesh Yadav</td>
                <td>SKIT → Mansarovar</td>
                <td>31</td>
                <td>07:55 AM</td>
                <td><span className="badge bg-blue-light text-blue">Completed</span></td>
                <td className="actions"><a href="#">View</a> <a href="#">Track</a></td>
              </tr>
              <tr>
                <td className="text-blue font-bold">TRIP-1021</td>
                <td>RJ-14-AB-1088</td>
                <td>Suresh Meena</td>
                <td>SKIT → Vaishali</td>
                <td>44</td>
                <td>07:45 AM</td>
                <td><span className="badge bg-orange-light text-orange">Delayed</span></td>
                <td className="actions"><a href="#">View</a> <a href="#">Track</a></td>
              </tr>
              <tr>
                <td className="text-blue font-bold">TRIP-1020</td>
                <td>RJ-14-AB-2231</td>
                <td>Mohan Sharma</td>
                <td>SKIT → C-Scheme</td>
                <td>0</td>
                <td>08:15 AM</td>
                <td><span className="badge bg-red-light text-red">Cancelled</span></td>
                <td className="actions"><a href="#">View</a> <a href="#">Track</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
