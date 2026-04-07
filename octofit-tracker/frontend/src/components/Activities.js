import React, { useEffect, useMemo, useState } from 'react';

const activityIcons = {
  Flying: '✈️',
  'Web Swinging': '🕸️',
  'Hammer Throw': '🔨',
  'Batarang Training': '🦇',
  'Laser Vision Practice': '👁️',
  'Lasso Training': '🪢',
};

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedActivity, setSelectedActivity] = useState(null);

  const fetchActivities = () => {
    setLoading(true);
    const isCodespace = window.location.hostname.includes('.app.github.dev');
    const endpoint = isCodespace
      ? `https://${window.location.hostname.split('-')[0]}-8000.app.github.dev/api/activities/`
      : 'http://localhost:8000/api/activities/';
    console.log('[Activities] Fetch endpoint:', endpoint);

    fetch(endpoint)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('[Activities] Fetched data:', data);
        const normalized = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : [];
        setActivities(normalized);
      })
      .catch((fetchError) => {
        console.error('[Activities] Fetch error:', fetchError);
        setError('Failed to load activities.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return activities;
    return activities.filter((activity) => `${activity.user?.username || ''} ${activity.activity_type || ''}`.toLowerCase().includes(q));
  }, [activities, search]);

  if (loading) return <div className="text-center mt-4"><div className="spinner-border" /></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <section>
      <h2 className="section-heading h3 mb-3">Activity Log</h2>
      <div className="card shadow-sm">
        <div className="card-header d-flex flex-wrap gap-2 justify-content-between align-items-center">
          <span>Activities</span>
          <form className="d-flex gap-2" onSubmit={(event) => event.preventDefault()}>
            <input
              type="search"
              className="form-control form-control-sm"
              placeholder="Search hero or activity"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button type="button" className="btn btn-sm btn-outline-light" onClick={fetchActivities}>Refresh</button>
          </form>
        </div>
        <div className="card-body p-0 table-wrap">
          <table className="table table-striped table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Hero</th>
                <th>Activity</th>
                <th>Duration</th>
                <th>Date</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((activity, index) => (
                <tr key={activity.id ?? `activity-${index}`}>
                  <td>
                    <a
                      href="#activity-details"
                      className="link-primary text-decoration-none fw-semibold"
                      onClick={(event) => {
                        event.preventDefault();
                        setSelectedActivity(activity);
                      }}
                    >
                      {activity.user?.username || 'Unknown'}
                    </a>
                  </td>
                  <td>{activityIcons[activity.activity_type] || '💪'} {activity.activity_type || 'N/A'}</td>
                  <td><span className="badge text-bg-success">{activity.duration ?? 'N/A'} min</span></td>
                  <td>{activity.date || 'N/A'}</td>
                  <td className="text-end">
                    <button type="button" className="btn btn-sm btn-primary" onClick={() => setSelectedActivity(activity)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedActivity && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Activity Details</h5>
                  <button type="button" className="btn-close" onClick={() => setSelectedActivity(null)} />
                </div>
                <div className="modal-body">
                  <p className="mb-1"><strong>Hero:</strong> {selectedActivity.user?.username || 'Unknown'}</p>
                  <p className="mb-1"><strong>Activity:</strong> {selectedActivity.activity_type || 'N/A'}</p>
                  <p className="mb-1"><strong>Duration:</strong> {selectedActivity.duration ?? 'N/A'} min</p>
                  <p className="mb-0"><strong>Date:</strong> {selectedActivity.date || 'N/A'}</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedActivity(null)}>Close</button>
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

export default Activities;
