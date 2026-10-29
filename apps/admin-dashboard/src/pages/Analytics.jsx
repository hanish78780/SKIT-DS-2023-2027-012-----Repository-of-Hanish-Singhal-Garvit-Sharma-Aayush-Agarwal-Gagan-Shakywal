import { useState } from 'react';
import './Analytics.css';

const Analytics = () => {
  // Trips This Week line data
  const weeklyTrips = [
    { day: 'Mon', count: 32, x: 50, y: 110 },
    { day: 'Tue', count: 36, x: 120, y: 88 },
    { day: 'Wed', count: 34, x: 190, y: 98 },
    { day: 'Thu', count: 38, x: 260, y: 78 },
    { day: 'Fri', count: 36, x: 330, y: 88 },
    { day: 'Sat', count: 20, x: 400, y: 165 },
  ];

  // Bus Utilization data
  const routeUtilization = [
    { route: 'R-01', percent: 85, x: 70, height: 136, y: 44 },
    { route: 'R-02', percent: 70, x: 160, height: 112, y: 68 },
    { route: 'R-03', percent: 95, x: 250, height: 152, y: 28 },
    { route: 'R-04', percent: 60, x: 340, height: 96, y: 84 },
  ];

  // Default selections to match user screenshots perfectly:
  // Screenshot 1: Wed (trips: 34)
  // Screenshot 2: R-01 (util: 85)
  // Screenshot 3: Completed: 28
  const [selectedTripDay, setSelectedTripDay] = useState(weeklyTrips[2]); // Wed
  const [selectedRouteBar, setSelectedRouteBar] = useState(routeUtilization[0]); // R-01
  const [selectedDonutSlice, setSelectedDonutSlice] = useState({
    label: 'Completed',
    count: 28,
    color: '#16a34a',
  });

  // Donut chart math (Radius = 60, Circumference = 2 * PI * 60 = 376.99)
  const totalTrips = 36;
  const circumference = 2 * Math.PI * 60; // 376.99
  const completedStroke = (28 / totalTrips) * circumference; // ~293.2
  const activeStroke = (5 / totalTrips) * circumference; // ~52.36
  const delayedStroke = (2 / totalTrips) * circumference; // ~20.94
  const cancelledStroke = (1 / totalTrips) * circumference; // ~10.47

  return (
    <div className="analytics-page">
      {/* 1. TOP KPI METRICS ROW */}
      <div className="analytics-metrics-grid">
        <div className="kpi-card">
          <span className="kpi-value green">94.4%</span>
          <p className="kpi-label">Completion Rate</p>
        </div>
        <div className="kpi-card">
          <span className="kpi-value blue">78%</span>
          <p className="kpi-label">Bus Utilization</p>
        </div>
        <div className="kpi-card">
          <span className="kpi-value purple">58 min</span>
          <p className="kpi-label">Avg. Trip Duration</p>
        </div>
        <div className="kpi-card">
          <span className="kpi-value orange">31 km/h</span>
          <p className="kpi-label">Avg. Speed</p>
        </div>
        <div className="kpi-card">
          <span className="kpi-value red">1,180</span>
          <p className="kpi-label">Students Transported</p>
        </div>
      </div>

      {/* 2. MIDDLE CHARTS ROW */}
      <div className="analytics-charts-grid">
        {/* Card 1: Trips This Week */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <h3>Trips This Week</h3>
            <p>Daily trip count</p>
          </div>

          <div className="chart-container">
            <svg className="chart-svg" viewBox="0 0 450 220">
              {/* Horizontal grid lines and Y-axis values */}
              <text x="30" y="44" className="chart-axis-label" textAnchor="end">40</text>
              <line x1="45" y1="40" x2="430" y2="40" className="chart-grid-line" />

              <text x="30" y="84" className="chart-axis-label" textAnchor="end">30</text>
              <line x1="45" y1="80" x2="430" y2="80" className="chart-grid-line" />

              <text x="30" y="124" className="chart-axis-label" textAnchor="end">20</text>
              <line x1="45" y1="120" x2="430" y2="120" className="chart-grid-line" />

              <text x="30" y="164" className="chart-axis-label" textAnchor="end">10</text>
              <line x1="45" y1="160" x2="430" y2="160" className="chart-grid-line" />

              <text x="30" y="200" className="chart-axis-label" textAnchor="end">0</text>
              <line x1="45" y1="195" x2="430" y2="195" className="chart-grid-line" />

              {/* X-axis labels */}
              {weeklyTrips.map((pt) => (
                <text
                  key={pt.day}
                  x={pt.x}
                  y="215"
                  className="chart-axis-label"
                  textAnchor="middle"
                >
                  {pt.day}
                </text>
              ))}

              {/* Vertical guideline for active/selected day */}
              {selectedTripDay && (
                <line
                  x1={selectedTripDay.x}
                  y1={selectedTripDay.y}
                  x2={selectedTripDay.x}
                  y2="195"
                  stroke="#cbd5e1"
                  strokeWidth="1.5"
                />
              )}

              {/* Smooth blue spline curve */}
              <path
                d="M 50 110 C 85 98, 95 90, 120 88 C 150 86, 165 96, 190 98 C 220 100, 235 80, 260 78 C 290 76, 305 86, 330 88 C 365 90, 375 145, 400 165"
                fill="none"
                stroke="#2563eb"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Data points */}
              {weeklyTrips.map((pt) => {
                const isSelected = selectedTripDay?.day === pt.day;
                return (
                  <circle
                    key={pt.day}
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected ? 6 : 4.5}
                    fill="#2563eb"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    className="chart-data-dot"
                    onClick={() => setSelectedTripDay(pt)}
                    onMouseEnter={() => setSelectedTripDay(pt)}
                  />
                );
              })}
            </svg>

            {/* Floating Tooltip Card (Matching Screenshot 1) */}
            {selectedTripDay && (
              <div
                className="chart-floating-tooltip"
                style={{
                  left: `${(selectedTripDay.x / 450) * 100}%`,
                  top: `${(selectedTripDay.y / 220) * 100}%`,
                  transform: 'translate(10px, 4px)',
                }}
              >
                <span className="tooltip-title">{selectedTripDay.day}</span>
                <span className="tooltip-value blue">trips : {selectedTripDay.count}</span>
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Bus Utilization */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <h3>Bus Utilization</h3>
            <p>By route (%)</p>
          </div>

          <div className="chart-container">
            <svg className="chart-svg" viewBox="0 0 450 220">
              {/* Horizontal grid lines & Y-axis labels */}
              <text x="35" y="24" className="chart-axis-label" textAnchor="end">100</text>
              <line x1="50" y1="20" x2="420" y2="20" className="chart-grid-line" />

              <text x="35" y="66" className="chart-axis-label" textAnchor="end">75</text>
              <line x1="50" y1="62" x2="420" y2="62" className="chart-grid-line" />

              <text x="35" y="108" className="chart-axis-label" textAnchor="end">50</text>
              <line x1="50" y1="104" x2="420" y2="104" className="chart-grid-line" />

              <text x="35" y="150" className="chart-axis-label" textAnchor="end">25</text>
              <line x1="50" y1="146" x2="420" y2="146" className="chart-grid-line" />

              <text x="35" y="190" className="chart-axis-label" textAnchor="end">0</text>
              <line x1="50" y1="185" x2="420" y2="185" className="chart-grid-line" />

              {/* X-axis labels */}
              {routeUtilization.map((bar) => (
                <text
                  key={bar.route}
                  x={bar.x + 16}
                  y="206"
                  className="chart-axis-label"
                  textAnchor="middle"
                >
                  {bar.route}
                </text>
              ))}

              {/* Background gray highlight column for selected bar (Matching Screenshot 2) */}
              {selectedRouteBar && (
                <rect
                  x={selectedRouteBar.x - 10}
                  y="20"
                  width="52"
                  height="165"
                  rx="6"
                  ry="6"
                  fill="#cbd5e1"
                  opacity="0.65"
                />
              )}

              {/* Blue Rounded Bars */}
              {routeUtilization.map((bar) => (
                <rect
                  key={bar.route}
                  x={bar.x}
                  y={bar.y}
                  width="32"
                  height={bar.height}
                  rx="8"
                  ry="8"
                  fill="#2563eb"
                  className="chart-bar"
                  onClick={() => setSelectedRouteBar(bar)}
                  onMouseEnter={() => setSelectedRouteBar(bar)}
                />
              ))}
            </svg>

            {/* Floating Tooltip Card (Matching Screenshot 2) */}
            {selectedRouteBar && (
              <div
                className="chart-floating-tooltip"
                style={{
                  left: `${((selectedRouteBar.x + 36) / 450) * 100}%`,
                  top: `${((selectedRouteBar.y + 60) / 220) * 100}%`,
                  transform: 'translate(4px, 4px)',
                }}
              >
                <span className="tooltip-title">{selectedRouteBar.route}</span>
                <span className="tooltip-value blue">util : {selectedRouteBar.percent}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. BOTTOM CARDS ROW */}
      <div className="analytics-charts-grid">
        {/* Card 3: Trip Status Breakdown */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <h3>Trip Status Breakdown</h3>
            <p>Today's 36 trips</p>
          </div>

          <div className="donut-layout">
            {/* Donut Chart */}
            <div className="donut-chart-wrapper">
              <svg className="donut-svg" viewBox="0 0 160 160">
                {/* Background track circle */}
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="22"
                />

                {/* 1. Completed (28 trips ~ 77.8%) -> Green */}
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="22"
                  strokeDasharray={`${completedStroke - 4} ${circumference}`}
                  strokeDashoffset="0"
                  className="donut-slice"
                  onClick={() =>
                    setSelectedDonutSlice({ label: 'Completed', count: 28, color: '#16a34a' })
                  }
                  onMouseEnter={() =>
                    setSelectedDonutSlice({ label: 'Completed', count: 28, color: '#16a34a' })
                  }
                />

                {/* 2. Active (5 trips ~ 13.9%) -> Blue */}
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="22"
                  strokeDasharray={`${activeStroke - 4} ${circumference}`}
                  strokeDashoffset={`-${completedStroke}`}
                  className="donut-slice"
                  onClick={() =>
                    setSelectedDonutSlice({ label: 'Active', count: 5, color: '#2563eb' })
                  }
                  onMouseEnter={() =>
                    setSelectedDonutSlice({ label: 'Active', count: 5, color: '#2563eb' })
                  }
                />

                {/* 3. Delayed (2 trips ~ 5.5%) -> Orange */}
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  fill="none"
                  stroke="#ea580c"
                  strokeWidth="22"
                  strokeDasharray={`${delayedStroke - 3} ${circumference}`}
                  strokeDashoffset={`-${completedStroke + activeStroke}`}
                  className="donut-slice"
                  onClick={() =>
                    setSelectedDonutSlice({ label: 'Delayed', count: 2, color: '#ea580c' })
                  }
                  onMouseEnter={() =>
                    setSelectedDonutSlice({ label: 'Delayed', count: 2, color: '#ea580c' })
                  }
                />

                {/* 4. Cancelled (1 trip ~ 2.8%) -> Red */}
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="22"
                  strokeDasharray={`${cancelledStroke - 2} ${circumference}`}
                  strokeDashoffset={`-${completedStroke + activeStroke + delayedStroke}`}
                  className="donut-slice"
                  onClick={() =>
                    setSelectedDonutSlice({ label: 'Cancelled', count: 1, color: '#dc2626' })
                  }
                  onMouseEnter={() =>
                    setSelectedDonutSlice({ label: 'Cancelled', count: 1, color: '#dc2626' })
                  }
                />
              </svg>
            </div>

            {/* Floating Tooltip Box over Donut (Matching Screenshot 3) */}
            {selectedDonutSlice && (
              <div
                className="donut-floating-tooltip"
                style={{
                  left: '12%',
                  top: '52%',
                }}
              >
                <span className="donut-tooltip-text" style={{ color: selectedDonutSlice.color }}>
                  {selectedDonutSlice.label} : {selectedDonutSlice.count}
                </span>
              </div>
            )}

            {/* Legend */}
            <div className="donut-legend">
              <div
                className="legend-item"
                onClick={() =>
                  setSelectedDonutSlice({ label: 'Completed', count: 28, color: '#16a34a' })
                }
              >
                <div className="legend-left">
                  <span className="legend-color-dot" style={{ background: '#16a34a' }}></span>
                  <span>Completed</span>
                </div>
                <span className="legend-value">28</span>
              </div>
              <div
                className="legend-item"
                onClick={() =>
                  setSelectedDonutSlice({ label: 'Active', count: 5, color: '#2563eb' })
                }
              >
                <div className="legend-left">
                  <span className="legend-color-dot" style={{ background: '#2563eb' }}></span>
                  <span>Active</span>
                </div>
                <span className="legend-value">5</span>
              </div>
              <div
                className="legend-item"
                onClick={() =>
                  setSelectedDonutSlice({ label: 'Delayed', count: 2, color: '#ea580c' })
                }
              >
                <div className="legend-left">
                  <span className="legend-color-dot" style={{ background: '#ea580c' }}></span>
                  <span>Delayed</span>
                </div>
                <span className="legend-value">2</span>
              </div>
              <div
                className="legend-item"
                onClick={() =>
                  setSelectedDonutSlice({ label: 'Cancelled', count: 1, color: '#dc2626' })
                }
              >
                <div className="legend-left">
                  <span className="legend-color-dot" style={{ background: '#dc2626' }}></span>
                  <span>Cancelled</span>
                </div>
                <span className="legend-value">1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Route Performance */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <h3>Route Performance</h3>
            <p>Average pickup compliance (%)</p>
          </div>

          <div className="performance-list">
            {/* Route 01 */}
            <div className="performance-item">
              <div className="perf-meta">
                <span className="perf-name">Route 01 — Tonk Road</span>
                <span className="perf-percent green">92%</span>
              </div>
              <div className="perf-track">
                <div className="perf-bar green" style={{ width: '92%' }}></div>
              </div>
            </div>

            {/* Route 02 */}
            <div className="performance-item">
              <div className="perf-meta">
                <span className="perf-name">Route 02 — C-Scheme</span>
                <span className="perf-percent orange">88%</span>
              </div>
              <div className="perf-track">
                <div className="perf-bar orange" style={{ width: '88%' }}></div>
              </div>
            </div>

            {/* Route 03 */}
            <div className="performance-item">
              <div className="perf-meta">
                <span className="perf-name">Route 03 — Jaipur City</span>
                <span className="perf-percent green">96%</span>
              </div>
              <div className="perf-track">
                <div className="perf-bar green" style={{ width: '96%' }}></div>
              </div>
            </div>

            {/* Route 04 */}
            <div className="performance-item">
              <div className="perf-meta">
                <span className="perf-name">Route 04 — Mansarovar</span>
                <span className="perf-percent orange">74%</span>
              </div>
              <div className="perf-track">
                <div className="perf-bar orange" style={{ width: '74%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
