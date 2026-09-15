import React from 'react';
import { UserRound, Bus, Activity, GraduationCap } from 'lucide-react';
import './Dashboard.css';

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

const Dashboard = () => {
  return (
    <section className="dashboard-content">
      <div className="stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div className="stat-card" key={stat.title}>
              <div className="stat-icon-dash">
                <Icon size={24} />
              </div>
              <span className="stat-title">{stat.title}</span>
              <h2>{stat.value}</h2>
              <p>{stat.description}</p>
            </div>
          );
        })}
      </div>

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
  );
};

export default Dashboard;
