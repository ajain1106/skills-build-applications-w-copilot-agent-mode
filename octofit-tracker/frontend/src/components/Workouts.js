import React, { useEffect, useState } from 'react';

const API_URL = 'https://legendary-lamp-jj9x6x6rgw45cqp6q-8000.app.github.dev/api/workouts/';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ description: '', date: '' });

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setWorkouts(data));
  }, []);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleInputChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleAddWorkout = (e) => {
    e.preventDefault();
    // Example POST, update as needed for your backend
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        setWorkouts([...workouts, data]);
        setForm({ description: '', date: '' });
        handleCloseModal();
      });
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="card-title mb-0">Workouts</h2>
          <button className="btn btn-primary" onClick={handleShowModal}>Add Workout</button>
        </div>
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-primary">
              <tr>
                <th scope="col">Description</th>
                <th scope="col">Date</th>
              </tr>
            </thead>
            <tbody>
              {workouts.map((workout, idx) => (
                <tr key={idx}>
                  <td>{workout.description}</td>
                  <td>{workout.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Modal for adding a workout */}
        {showModal && (
          <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add New Workout</h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseModal}></button>
                </div>
                <form onSubmit={handleAddWorkout}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label htmlFor="workoutDescription" className="form-label">Description</label>
                      <input type="text" className="form-control" id="workoutDescription" name="description" value={form.description} onChange={handleInputChange} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="workoutDate" className="form-label">Date</label>
                      <input type="date" className="form-control" id="workoutDate" name="date" value={form.date} onChange={handleInputChange} required />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Add Workout</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Workouts;
