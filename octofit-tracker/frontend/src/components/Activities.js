import React, { useEffect, useState } from 'react';
import { getActivities } from '../api';

const activityIcons = {
  'Flying': '✈️',
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

  useEffect(() => {
    getActivities()
      .then(res => setActivities(res.data))
      .catch(() => setError('Failed to load activities.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-4"><div className="spinner-border" /></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h2 className="mb-4">🏃 Activity Log</h2>
      <div className="card">
        <div className="card-header">All Activities</div>
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Hero</th>
                <th>Activity</th>
                <th>Duration (min)</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {activities.map(activity => (
                <tr key={activity.id}>
                  <td>🦸 <strong>{activity.user.username}</strong></td>
                  <td>{activityIcons[activity.activity_type] || '💪'} {activity.activity_type}</td>
                  <td><span className="badge bg-success">{activity.duration} min</span></td>
                  <td>{activity.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Activities;

