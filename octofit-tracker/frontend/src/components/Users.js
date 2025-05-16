import React, { useEffect, useState } from 'react';

const API_URL = 'https://legendary-lamp-jj9x6x6rgw45cqp6q-8000.app.github.dev/api/users/';

function Users() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleInputChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleAddUser = (e) => {
    e.preventDefault();
    // Example POST, update as needed for your backend
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        setUsers([...users, data]);
        setForm({ name: '', email: '' });
        handleCloseModal();
      });
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="card-title mb-0">Users</h2>
          <button className="btn btn-primary" onClick={handleShowModal}>Add User</button>
        </div>
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-primary">
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={idx}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Modal for adding a user */}
        {showModal && (
          <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add New User</h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseModal}></button>
                </div>
                <form onSubmit={handleAddUser}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label htmlFor="userName" className="form-label">Name</label>
                      <input type="text" className="form-control" id="userName" name="name" value={form.name} onChange={handleInputChange} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="userEmail" className="form-label">Email</label>
                      <input type="email" className="form-control" id="userEmail" name="email" value={form.email} onChange={handleInputChange} required />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
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

export default Users;
