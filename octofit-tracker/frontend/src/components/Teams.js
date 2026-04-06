import React, { useEffect, useState } from 'react';
import { getTeams } from '../api';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTeams()
      .then(res => setTeams(res.data))
      .catch(() => setError('Failed to load teams.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-4"><div className="spinner-border" /></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const teamColors = { 'Team Marvel': 'danger', 'Team DC': 'primary' };

  return (
    <div>
      <h2 className="mb-4">🏆 Teams</h2>
      <div className="row">
        {teams.map(team => (
          <div className="col-md-6" key={team.id}>
            <div className="card">
              <div className={`card-header bg-${teamColors[team.name] || 'secondary'}`}>
                🛡️ {team.name}
              </div>
              <div className="card-body">
                <h6 className="card-subtitle mb-3 text-muted">Members ({team.members.length})</h6>
                <ul className="list-group list-group-flush">
                  {team.members.map(member => (
                    <li className="list-group-item px-0" key={member.id}>
                      🦸 <strong>{member.username}</strong>
                      <span className="text-muted ms-2" style={{ fontSize: '0.85rem' }}>{member.email}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Teams;

