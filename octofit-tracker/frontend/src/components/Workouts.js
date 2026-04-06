import React, { useEffect, useState } from 'react';
import { getWorkouts } from '../api';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getWorkouts()
      .then(res => setWorkouts(res.data))
      .catch(() => setError('Failed to load workouts.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-4"><div className="spinner-border" /></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h2 className="mb-4">💪 Workout Suggestions</h2>
      <div className="row">
        {workouts.map(workout => (
          <div className="col-md-6 col-lg-4" key={workout.id}>
            <div className="card h-100">
              <div className="card-header">🏋️ {workout.name}</div>
              <div className="card-body">
                <p className="card-text text-muted">{workout.description}</p>
                <h6 className="mt-3">Exercises:</h6>
                <ul className="list-group list-group-flush">
                  {workout.exercises.map((ex, i) => (
                    <li className="list-group-item px-0" key={i}>
                      <strong>{ex.name}</strong>
                      <span className="text-muted ms-2" style={{ fontSize: '0.85rem' }}>
                        {ex.sets && `${ex.sets} sets`}
                        {ex.reps && ` × ${ex.reps} reps`}
                        {ex.duration && ` — ${ex.duration}`}
                        {ex.unit && ` (${ex.unit})`}
                      </span>
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

export default Workouts;

