import React, { useEffect, useMemo, useState } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = () => {
    setLoading(true);
    const endpoint = 'http://localhost:8000/api/users/';
    console.log('[Users] Fetch endpoint:', endpoint);

    fetch(endpoint)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('[Users] Fetched data:', data);
        const normalized = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : [];
        setUsers(normalized);
      })
      .catch((fetchError) => {
        console.error('[Users] Fetch error:', fetchError);
        setError('Failed to load users.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((user) => `${user.username || ''} ${user.email || ''}`.toLowerCase().includes(q));
  }, [users, search]);

  if (loading) return <div className="text-center mt-4"><div className="spinner-border" /></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <section>
      <h2 className="section-heading h3 mb-3">Users</h2>
      <div className="card shadow-sm">
        <div className="card-header d-flex flex-wrap gap-2 justify-content-between align-items-center">
          <span>User Profiles</span>
          <form className="d-flex gap-2" onSubmit={(event) => event.preventDefault()}>
            <input
              type="search"
              className="form-control form-control-sm"
              placeholder="Search username or email"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button type="button" className="btn btn-sm btn-outline-light" onClick={fetchUsers}>Refresh</button>
          </form>
        </div>
        <div className="card-body p-0 table-wrap">
          <table className="table table-striped table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Joined</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, index) => (
                <tr key={user.id ?? `user-${index}`}>
                  <td>
                    <a
                      href="#user-details"
                      className="link-primary text-decoration-none fw-semibold"
                      onClick={(event) => {
                        event.preventDefault();
                        setSelectedUser(user);
                      }}
                    >
                      {user.username || 'Unknown User'}
                    </a>
                  </td>
                  <td><a className="link-primary" href={`mailto:${user.email || ''}`}>{user.email || 'No email'}</a></td>
                  <td>{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</td>
                  <td className="text-end">
                    <button type="button" className="btn btn-sm btn-primary" onClick={() => setSelectedUser(user)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">User Details</h5>
                  <button type="button" className="btn-close" onClick={() => setSelectedUser(null)} />
                </div>
                <div className="modal-body">
                  <p className="mb-1"><strong>Username:</strong> {selectedUser.username || 'Unknown User'}</p>
                  <p className="mb-1"><strong>Email:</strong> {selectedUser.email || 'No email'}</p>
                  <p className="mb-0"><strong>Joined:</strong> {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleString() : 'N/A'}</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedUser(null)}>Close</button>
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

export default Users;

