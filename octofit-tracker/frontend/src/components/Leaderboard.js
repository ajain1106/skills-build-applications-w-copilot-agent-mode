import React, { useEffect, useState } from 'react';

const API_URL = 'https://legendary-lamp-jj9x6x6rgw45cqp6q-8000.app.github.dev/api/leaderboard/';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ leaderboard_id: '', team: '', points: '' });
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setLeaderboard(data));
    // Fetch teams for the dropdown
    fetch('https://legendary-lamp-jj9x6x6rgw45cqp6q-8000.app.github.dev/api/teams/')
      .then(res => res.json())
      .then(data => setTeams(data));
  }, []);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleInputChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleAddEntry = (e) => {
    e.preventDefault();
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        setLeaderboard([...leaderboard, data]);
        setForm({ leaderboard_id: '', team: '', points: '' });
        handleCloseModal();
      });
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="card-title mb-0">Leaderboard</h2>
          <button className="btn btn-primary" onClick={handleShowModal}>Add Entry</button>
        </div>
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-primary">
              <tr>
                <th scope="col">Leaderboard ID</th>
                <th scope="col">Team</th>
                <th scope="col">Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, idx) => (
                <tr key={idx}>
                  <td>{entry.leaderboard_id}</td>
                  <td>{teams.find(t => t.id === entry.team)?.name || entry.team}</td>
                  <td>{entry.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Modal for adding a leaderboard entry */}
        {showModal && (
          <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Leaderboard Entry</h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseModal}></button>
                </div>
                <form onSubmit={handleAddEntry}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label htmlFor="leaderboardId" className="form-label">Leaderboard ID</label>
                      <input type="text" className="form-control" id="leaderboardId" name="leaderboard_id" value={form.leaderboard_id} onChange={handleInputChange} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="team" className="form-label">Team</label>
                      <select className="form-select" id="team" name="team" value={form.team} onChange={handleInputChange} required>
                        <option value="">Select Team</option>
                        {teams.map(team => (
                          <option key={team.id} value={team.id}>{team.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="points" className="form-label">Points</label>
                      <input type="number" className="form-control" id="points" name="points" value={form.points} onChange={handleInputChange} required />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Add Entry</button>
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

export default Leaderboard;
