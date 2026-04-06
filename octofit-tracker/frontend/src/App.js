import React, { useState } from 'react';
import Users from './components/Users';
import Teams from './components/Teams';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Workouts from './components/Workouts';

const NAV_ITEMS = [
  { key: 'leaderboard', label: '🏅 Leaderboard' },
  { key: 'activities', label: '🏃 Activities' },
  { key: 'teams', label: '🛡️ Teams' },
  { key: 'users', label: '👤 Users' },
  { key: 'workouts', label: '💪 Workouts' },
];

function App() {
  const [active, setActive] = useState('leaderboard');

  const renderPage = () => {
    switch (active) {
      case 'users': return <Users />;
      case 'teams': return <Teams />;
      case 'activities': return <Activities />;
      case 'leaderboard': return <Leaderboard />;
      case 'workouts': return <Workouts />;
      default: return <Leaderboard />;
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <div className="container">
          <span className="navbar-brand">🐙 OctoFit Tracker</span>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navMenu"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navMenu">
            <ul className="navbar-nav ms-auto">
              {NAV_ITEMS.map(item => (
                <li className="nav-item" key={item.key}>
                  <button
                    className={`nav-link btn btn-link ${active === item.key ? 'fw-bold text-white' : 'text-light'}`}
                    onClick={() => setActive(item.key)}
                    style={{ textDecoration: 'none' }}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="hero-banner">
          <h1 className="mb-1">OctoFit Tracker</h1>
          <p className="mb-0 opacity-75">Track activities, compete with your team, and stay fit!</p>
        </div>
        {renderPage()}
      </div>
    </div>
  );
}

export default App;

