import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FaTrash, FaUsers, FaSearch } from 'react-icons/fa';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users/admin/all');
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error('Failed to fetch user directory:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id, name, role) => {
    if (role === 'Admin') {
      alert('Administrator accounts cannot be deleted.');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete user ${name}?`)) return;

    try {
      const res = await api.delete(`/users/admin/${id}`);
      if (res.data.success) {
        setMessage({ text: `User ${name} has been deleted.`, type: 'success' });
        setUsers(users.filter(u => u._id !== id));
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      }
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Delete failed.', type: 'danger' });
    }
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container py-2">
      <div className="health-card mb-4">
        <h5 className="fw-bold text-dark-green mb-4 d-flex align-items-center gap-2">
          <FaUsers />
          <span>User Directory Governance</span>
        </h5>

        {message.text && (
          <div className={`alert alert-${message.type} py-2 mb-3`} role="alert">
            {message.text}
          </div>
        )}

        <div className="row g-3">
          <div className="col-sm-6">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <FaSearch className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-sm-6">
            <select className="form-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="All">All Roles</option>
              <option value="User">User (Client)</option>
              <option value="Dietitian">Dietitian</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </div>
      </div>

      <div className="health-card">
        {filteredUsers.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>BMI</th>
                  <th>Joined Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <strong className="text-dark">{u.name}</strong>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span
                        className={`badge ${
                          u.role === 'Admin'
                            ? 'bg-danger text-white'
                            : u.role === 'Dietitian'
                            ? 'bg-warning text-dark'
                            : 'bg-light-green text-dark-green'
                        } fw-semibold`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td>{u.bmi || 'N/A'}</td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteUser(u._id, u.name, u.role)}
                        className="btn btn-outline-danger btn-sm p-1 border-0"
                        title="Delete User"
                        disabled={u.role === 'Admin'}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted text-center py-4 m-0">No users match your criteria.</p>
        )}
      </div>
    </div>
  );
};

export default UsersList;
