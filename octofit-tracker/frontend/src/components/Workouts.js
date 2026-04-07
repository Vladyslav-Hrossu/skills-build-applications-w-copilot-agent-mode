import React, { useEffect, useMemo, useState } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  const fetchWorkouts = () => {
    setLoading(true);
    const endpoint = 'http://localhost:8000/api/workouts/';
    console.log('[Workouts] Fetch endpoint:', endpoint);

    fetch(endpoint)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('[Workouts] Fetched data:', data);
        const normalized = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : [];
        setWorkouts(normalized);
      })
      .catch((fetchError) => {
        console.error('[Workouts] Fetch error:', fetchError);
        setError('Failed to load workouts.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return workouts;
    return workouts.filter((workout) => `${workout.name || ''} ${workout.description || ''}`.toLowerCase().includes(q));
  }, [workouts, search]);

  if (loading) return <div className="text-center mt-4"><div className="spinner-border" /></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <section>
      <h2 className="section-heading h3 mb-3">Workouts</h2>
      <div className="card shadow-sm">
        <div className="card-header d-flex flex-wrap gap-2 justify-content-between align-items-center">
          <span>Workout Suggestions</span>
          <form className="d-flex gap-2" onSubmit={(event) => event.preventDefault()}>
            <input
              type="search"
              className="form-control form-control-sm"
              placeholder="Search workout"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button type="button" className="btn btn-sm btn-outline-light" onClick={fetchWorkouts}>Refresh</button>
          </form>
        </div>
        <div className="card-body p-0 table-wrap">
          <table className="table table-striped table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Workout</th>
                <th>Description</th>
                <th>Exercises</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((workout, index) => {
                const exercises = Array.isArray(workout.exercises) ? workout.exercises : [];
                return (
                  <tr key={workout.id ?? `workout-${index}`}>
                    <td>
                      <a
                        href="#workout-details"
                        className="link-primary text-decoration-none fw-semibold"
                        onClick={(event) => {
                          event.preventDefault();
                          setSelectedWorkout(workout);
                        }}
                      >
                        {workout.name || 'Unnamed Workout'}
                      </a>
                    </td>
                    <td>{workout.description || 'No description available.'}</td>
                    <td><span className="badge text-bg-secondary">{exercises.length}</span></td>
                    <td className="text-end">
                      <button type="button" className="btn btn-sm btn-primary" onClick={() => setSelectedWorkout(workout)}>View</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedWorkout && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{selectedWorkout.name || 'Workout'} Details</h5>
                  <button type="button" className="btn-close" onClick={() => setSelectedWorkout(null)} />
                </div>
                <div className="modal-body">
                  <p className="mb-3">{selectedWorkout.description || 'No description available.'}</p>
                  <table className="table table-sm table-striped align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Exercise</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(Array.isArray(selectedWorkout.exercises) ? selectedWorkout.exercises : []).map((exercise, index) => (
                        <tr key={`${exercise.name || 'exercise'}-${index}`}>
                          <td>{exercise.name || 'Exercise'}</td>
                          <td>
                            {exercise.sets && `${exercise.sets} sets `}
                            {exercise.reps && `x ${exercise.reps} reps `}
                            {exercise.duration && `- ${exercise.duration} `}
                            {exercise.unit && `(${exercise.unit})`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedWorkout(null)}>Close</button>
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

export default Workouts;
