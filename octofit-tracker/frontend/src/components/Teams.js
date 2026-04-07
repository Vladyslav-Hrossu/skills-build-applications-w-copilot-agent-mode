import React, { useEffect, useMemo, useState } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);

  const fetchTeams = () => {
    setLoading(true);
    const isCodespace = window.location.hostname.includes('.app.github.dev');
    const endpoint = isCodespace
      ? `https://${window.location.hostname.split('-')[0]}-8000.app.github.dev/api/teams/`
      : 'http://localhost:8000/api/teams/';
    console.log('[Teams] Fetch endpoint:', endpoint);

    fetch(endpoint)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('[Teams] Fetched data:', data);
        const normalized = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : [];
        setTeams(normalized);
      })
      .catch((fetchError) => {
        console.error('[Teams] Fetch error:', fetchError);
        setError('Failed to load teams.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return teams;
    return teams.filter((team) => `${team.name || ''}`.toLowerCase().includes(q));
  }, [teams, search]);

  if (loading) return <div className="text-center mt-4"><div className="spinner-border" /></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <section>
      <h2 className="section-heading h3 mb-3">Teams</h2>
      <div className="card shadow-sm">
        <div className="card-header d-flex flex-wrap gap-2 justify-content-between align-items-center">
          <span>Team Directory</span>
          <form className="d-flex gap-2" onSubmit={(event) => event.preventDefault()}>
            <input
              type="search"
              className="form-control form-control-sm"
              placeholder="Search team"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button type="button" className="btn btn-sm btn-outline-light" onClick={fetchTeams}>Refresh</button>
          </form>
        </div>
        <div className="card-body p-0 table-wrap">
          <table className="table table-striped table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Team Name</th>
                <th>Members</th>
                <th>Top Member</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((team, index) => {
                const members = Array.isArray(team.members) ? team.members : [];
                return (
                  <tr key={team.id ?? `team-${index}`}>
                    <td>
                      <a
                        href="#team-details"
                        className="link-primary text-decoration-none fw-semibold"
                        onClick={(event) => {
                          event.preventDefault();
                          setSelectedTeam(team);
                        }}
                      >
                        {team.name || 'Unnamed Team'}
                      </a>
                    </td>
                    <td><span className="badge text-bg-secondary">{members.length}</span></td>
                    <td>{members[0]?.username || 'N/A'}</td>
                    <td className="text-end">
                      <button type="button" className="btn btn-sm btn-primary" onClick={() => setSelectedTeam(team)}>View</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTeam && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{selectedTeam.name || 'Team'} Members</h5>
                  <button type="button" className="btn-close" onClick={() => setSelectedTeam(null)} />
                </div>
                <div className="modal-body">
                  <table className="table table-sm table-striped align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Username</th>
                        <th>Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(Array.isArray(selectedTeam.members) ? selectedTeam.members : []).map((member, index) => (
                        <tr key={member.id ?? `member-${index}`}>
                          <td>{member.username || 'Unknown'}</td>
                          <td>
                            <a className="link-primary" href={`mailto:${member.email || ''}`}>{member.email || 'No email'}</a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedTeam(null)}>Close</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}
    </section>
  );
}

export default Teams;

