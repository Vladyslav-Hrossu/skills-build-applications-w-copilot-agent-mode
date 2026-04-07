import React, { useEffect, useMemo, useState } from 'react';

const medals = ['🥇', '🥈', '🥉'];

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);

  const fetchLeaderboard = () => {
    setLoading(true);
    const isCodespace = window.location.hostname.includes('.app.github.dev');
    const endpoint = isCodespace
      ? `https://${window.location.hostname.split('-')[0]}-8000.app.github.dev/api/leaderboard/`
      : 'http://localhost:8000/api/leaderboard/';
    console.log('[Leaderboard] Fetch endpoint:', endpoint);

    fetch(endpoint)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('[Leaderboard] Fetched data:', data);
        const normalized = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : [];
        setEntries(normalized);
      })
      .catch((fetchError) => {
        console.error('[Leaderboard] Fetch error:', fetchError);
        setError('Failed to load leaderboard.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((entry) => `${entry.user?.username || ''} ${entry.score ?? ''}`.toLowerCase().includes(q));
  }, [entries, search]);

  if (loading) return <div className="text-center mt-4"><div className="spinner-border" /></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <section>
      <h2 className="section-heading h3 mb-3">Leaderboard</h2>
      <div className="card shadow-sm">
        <div className="card-header d-flex flex-wrap gap-2 justify-content-between align-items-center">
          <span>Hero Rankings</span>
          <form className="d-flex gap-2" onSubmit={(event) => event.preventDefault()}>
            <input
              type="search"
              className="form-control form-control-sm"
              placeholder="Search hero or score"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button type="button" className="btn btn-sm btn-outline-light" onClick={fetchLeaderboard}>Refresh</button>
          </form>
        </div>
        <div className="card-body p-0 table-wrap">
          <table className="table table-striped table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Rank</th>
                <th>Hero</th>
                <th>Score</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry, index) => (
                <tr key={entry.id ?? `${entry.rank ?? 'rank'}-${index}`} className={index === 0 ? 'table-warning' : ''}>
                  <td className="fw-bold">{medals[index] || `#${entry.rank ?? index + 1}`}</td>
                  <td>
                    <a
                      href="#leaderboard-details"
                      className="link-primary text-decoration-none fw-semibold"
                      onClick={(event) => {
                        event.preventDefault();
                        setSelectedEntry(entry);
                      }}
                    >
                      {entry.user?.username || 'Unknown'}
                    </a>
                  </td>
                  <td><span className="badge text-bg-primary">{entry.score ?? 0}</span></td>
                  <td className="text-end">
                    <button type="button" className="btn btn-sm btn-primary" onClick={() => setSelectedEntry(entry)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedEntry && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Leaderboard Entry</h5>
                  <button type="button" className="btn-close" onClick={() => setSelectedEntry(null)} />
                </div>
                <div className="modal-body">
                  <p className="mb-1"><strong>Hero:</strong> {selectedEntry.user?.username || 'Unknown'}</p>
                  <p className="mb-1"><strong>Rank:</strong> {selectedEntry.rank ?? 'N/A'}</p>
                  <p className="mb-0"><strong>Score:</strong> {selectedEntry.score ?? 0}</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedEntry(null)}>Close</button>
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

export default Leaderboard;

