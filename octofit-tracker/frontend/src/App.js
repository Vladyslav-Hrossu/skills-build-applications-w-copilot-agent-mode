import React from 'react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import Users from './components/Users';
import Teams from './components/Teams';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Workouts from './components/Workouts';
import logo from './octofitapp-small.png';
import './App.css';

const NAV_ITEMS = [
  { path: '/leaderboard', label: '🏅 Leaderboard' },
  { path: '/activities', label: '🏃 Activities' },
  { path: '/teams', label: '🛡️ Teams' },
  { path: '/users', label: '👤 Users' },
  { path: '/workouts', label: '💪 Workouts' },
];

function App() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm mb-4">
        <div className="container">
          <span className="navbar-brand fw-bold">
            <img src={logo} alt="OctoFit logo" />
            OctoFit Tracker
          </span>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navMenu"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navMenu">
            <ul className="navbar-nav ms-auto gap-lg-2">
              {NAV_ITEMS.map((item) => (
                <li className="nav-item" key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => `nav-link px-3 rounded ${isActive ? 'active fw-semibold text-white bg-primary-subtle bg-opacity-25' : 'text-light'}`}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="hero-banner card border-0 mb-4">
          <div className="card-body d-flex align-items-center gap-3">
            <img src={logo} alt="OctoFit" className="hero-logo" />
            <div>
              <h1 className="display-6 fw-bold mb-1">OctoFit Tracker</h1>
              <p className="lead mb-0 opacity-75">Track activities, compete with your team, and stay fit.</p>
            </div>
          </div>
        </div>

        <Routes>
          <Route path="/" element={<Navigate to="/leaderboard" replace />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/users" element={<Users />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

