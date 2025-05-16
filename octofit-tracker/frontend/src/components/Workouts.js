import React, { useEffect, useState } from 'react';

const API_URL = 'https://legendary-lamp-jj9x6x6rgw45cqp6q-8000.app.github.dev/api/workouts/';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ workout_id: '', user: '', description: '', date: '' });
  const [users, setUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '' });
  const [userError, setUserError] = useState('');

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setWorkouts(data));
    // Fetch users for the dropdown
    fetch('https://legendary-lamp-jj9x6x6rgw45cqp6q-8000.app.github.dev/api/users/')
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleInputChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleAddWorkout = (e) => {
    e.preventDefault();
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        // Normalize user field to id if it's an object
        const workoutData = typeof data.user === 'object' && data.user !== null
          ? { ...data, user: data.user.id || data.user._id }
          : data;
        setWorkouts([...workouts, workoutData]);
        setForm({ workout_id: '', user: '', description: '', date: '' });
        handleCloseModal();
      });
  };

  const handleShowUserModal = () => setShowUserModal(true);
  const handleCloseUserModal = () => setShowUserModal(false);
  const handleUserInputChange = (e) => setUserForm({ ...userForm, [e.target.name]: e.target.value });
  const handleAddUser = (e) => {
    e.preventDefault();
    setUserError('');
    fetch('https://legendary-lamp-jj9x6x6rgw45cqp6q-8000.app.github.dev/api/users/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userForm)
    })
      .then(async res => {
        const data = await res.json();
        // Map _id to id if needed
        const userData = data._id ? { ...data, id: data._id } : data;
        if (!res.ok || !userData.id) {
          setUserError(userData?.email?.[0] || userData?.detail || 'Failed to add user.');
        } else {
          setUsers([...users, userData]);
          setForm({ ...form, user: userData.id }); // select new user
          setUserForm({ name: '', email: '', password: '' });
          setUserError('');
          handleCloseUserModal();
        }
      })
      .catch(() => setUserError('Network error.'));
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
                <th scope="col">Workout ID</th>
                <th scope="col">User</th>
                <th scope="col">Description</th>
                <th scope="col">Date</th>
              </tr>
            </thead>
            <tbody>
              {workouts.map((workout, idx) => (
                <tr key={idx}>
                  <td>{workout.workout_id}</td>
                  <td>
                    {typeof workout.user === 'object'
                      ? workout.user.name
                      : users.find(u => u.id === workout.user)?.name || workout.user}
                  </td>
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
                      <label htmlFor="workoutId" className="form-label">Workout ID</label>
                      <input type="text" className="form-control" id="workoutId" name="workout_id" value={form.workout_id} onChange={handleInputChange} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="user" className="form-label">User</label>
                      <div className="input-group">
                        <select className="form-select" id="user" name="user" value={form.user} onChange={handleInputChange} required>
                          <option value="">Select User</option>
                          {users.map(user => (
                            <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                          ))}
                        </select>
                        <button type="button" className="btn btn-outline-secondary" onClick={handleShowUserModal}>Add User</button>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">Description</label>
                      <input type="text" className="form-control" id="description" name="description" value={form.description} onChange={handleInputChange} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="date" className="form-label">Date</label>
                      <input type="date" className="form-control" id="date" name="date" value={form.date} onChange={handleInputChange} required />
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
        {/* Modal for adding a user */}
        {showUserModal && (
          <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add New User</h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseUserModal}></button>
                </div>
                <form onSubmit={handleAddUser}>
                  <div className="modal-body">
                    {userError && <div className="alert alert-danger">{userError}</div>}
                    <div className="mb-3">
                      <label htmlFor="userName" className="form-label">Name</label>
                      <input type="text" className="form-control" id="userName" name="name" value={userForm.name} onChange={handleUserInputChange} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="userEmail" className="form-label">Email</label>
                      <input type="email" className="form-control" id="userEmail" name="email" value={userForm.email} onChange={handleUserInputChange} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="userPassword" className="form-label">Password</label>
                      <input type="password" className="form-control" id="userPassword" name="password" value={userForm.password} onChange={handleUserInputChange} required placeholder="Enter password" autoComplete="new-password" />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleCloseUserModal}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Add User</button>
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
