import React, { useEffect, useState } from 'react';
import { getUsers } from '../api';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getUsers()
      .then(res => setUsers(res.data))
      .catch(() => setError('Failed to load users.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-4"><div className="spinner-border" /></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h2 className="mb-4">👤 User Profiles</h2>
      <div className="row">
        {users.map(user => (
          <div className="col-md-4" key={user.id}>
            <div className="card">
              <div className="card-header">🦸 {user.username}</div>
              <div className="card-body">
                <p className="mb-1"><strong>Email:</strong> {user.email}</p>
                <p className="mb-0 text-muted" style={{ fontSize: '0.85rem' }}>
                  Joined: {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Users;

