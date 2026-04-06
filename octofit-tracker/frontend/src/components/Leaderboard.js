import React, { useEffect, useState } from 'react';
import { getLeaderboard } from '../api';

const medals = ['🥇', '🥈', '🥉'];

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getLeaderboard()
      .then(res => setEntries(res.data))
      .catch(() => setError('Failed to load leaderboard.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-4"><div className="spinner-border" /></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h2 className="mb-4">🏅 Leaderboard</h2>
      <div className="card">
        <div className="card-header">Hero Rankings</div>
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Hero</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={entry.id} className={index === 0 ? 'table-warning' : ''}>
                  <td className="fw-bold">
                    {medals[index] || `#${entry.rank}`}
                  </td>
                  <td>🦸 <strong>{entry.user.username}</strong></td>
                  <td>
                    <span className="badge bg-primary badge-score fs-6">{entry.score}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;

