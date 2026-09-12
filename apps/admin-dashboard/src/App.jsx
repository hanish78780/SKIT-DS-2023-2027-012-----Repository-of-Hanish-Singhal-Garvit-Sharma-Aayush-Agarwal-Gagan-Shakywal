import React, { useState } from "react";
import "./App.css";
import Login from "./pages/Login";
import {
  LayoutDashboard,
  Users,
  UserRound,
  Bus,
  Route,
  Map,
  BarChart3,
  GraduationCap,
  Activity,
} from "lucide-react";

const stats = [
  {
    title: "Total Students",
    value: "1,250",
    description: "Registered students",
    icon: GraduationCap,
  },
  {
    title: "Total Drivers",
    value: "48",
    description: "Active drivers",
    icon: UserRound,
  },
  {
    title: "Total Buses",
    value: "32",
    description: "Registered buses",
    icon: Bus,
  },
  {
    title: "Active Trips",
    value: "18",
    description: "Currently running",
    icon: Activity,
  },
];

const activities = [
  {
    title: "Bus UP-32-AB-1234 started a trip",
    description: "Route: Jaipur → SKIT Campus",
    time: "10 min ago",
  },
  {
    title: "New driver registered",
    description: "Driver ID: DRV-104",
    time: "25 min ago",
  },
  {
    title: "New student added",
    description: "Student ID: STU-1245",
    time: "1 hour ago",
  },
];
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="admin-layout">

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <h2>UniTransit</h2>
          <p>Admin Panel</p>
        </div>

        <nav className="sidebar-menu">
  <a href="#" className="active">
    <LayoutDashboard size={20} />
    <span>Dashboard</span>
  </a>

  <a href="#">
    <Users size={20} />
    <span>Students</span>
  </a>

  <a href="#">
    <UserRound size={20} />
    <span>Drivers</span>
  </a>

  <a href="#">
    <Bus size={20} />
    <span>Buses</span>
  </a>

  <a href="#">
    <Route size={20} />
    <span>Routes</span>
  </a>

  <a href="#">
    <Map size={20} />
    <span>Trips</span>
  </a>

  <a href="#">
    <BarChart3 size={20} />
    <span>Reports</span>
  </a>
</nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">

        {/* Navbar */}
        <header className="navbar">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome to UniTransit Admin Panel</p>
          </div>

          <div className="admin-profile">
            <div className="profile-avatar">
              A
            </div>

            <div>
              <strong>Admin</strong>
              <span>Administrator</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <section className="dashboard-content">

          {/* Statistics */}
          <div className="stats-grid">
  {stats.map((stat) => {
    const Icon = stat.icon;

    return (
      <div className="stat-card" key={stat.title}>
        <div className="stat-icon">
          <Icon size={24} />
        </div>

        <span className="stat-title">{stat.title}</span>

        <h2>{stat.value}</h2>

        <p>{stat.description}</p>
      </div>
    );
  })}
</div>

          {/* Recent Activity */}
          <div className="activity-section">

            <div className="section-header">
              <div>
                <h2>Recent Activity</h2>
                <p>Latest transportation activities</p>
              </div>
            </div>

            <div className="activity-list">
  {activities.map((activity) => (
    <div className="activity-item" key={activity.title}>
      <div>
        <strong>{activity.title}</strong>
        <p>{activity.description}</p>
      </div>

      <span>{activity.time}</span>
    </div>
  ))}
</div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default App;