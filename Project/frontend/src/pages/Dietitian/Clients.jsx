import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FaUserPlus, FaUsers, FaWeight, FaChartLine, FaTimes } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [clientEmail, setClientEmail] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [progressHistory, setProgressHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users/clients');
      if (res.data.success) {
        setClients(res.data.clients);
      }
    } catch (err) {
      console.error('Failed to load dietitian clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    if (!clientEmail) return;
    setMessage({ text: '', type: '' });

    try {
      const res = await api.post('/users/clients/assign', { clientEmail });
      if (res.data.success) {
        setMessage({ text: 'Client linked successfully!', type: 'success' });
        setClientEmail('');
        fetchClients();
      }
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Failed to link client. Ensure user is registered and has standard client role.',
        type: 'danger'
      });
    }
  };

  const handleViewClientProgress = async (client) => {
    setSelectedClient(client);
    setProgressHistory([]);
    setHistoryLoading(true);

    try {
      const res = await api.get(`/progress/client/${client._id}`);
      if (res.data.success) {
        const formatted = res.data.history.map(item => ({
          ...item,
          formattedDate: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          weight: Number(item.weight),
          bmi: Number(item.bmi)
        }));
        setProgressHistory(formatted);
      }
    } catch (err) {
      console.error('Failed to load client weight logs:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container py-2">
      <div className="row g-4">
        {/* Left Column: Client List and Assigner */}
        <div className="col-lg-5">
          {/* Assigner */}
          <div className="health-card mb-4">
            <h5 className="fw-bold text-dark-green mb-3 d-flex align-items-center gap-2">
              <FaUserPlus />
              <span>Link Client Account</span>
            </h5>
            {message.text && (
              <div className={`alert alert-${message.type} py-1 px-2 small mb-3`} role="alert">
                {message.text}
              </div>
            )}
            <form onSubmit={handleAddClient} className="d-flex gap-2">
              <input
                type="email"
                className="form-control"
                placeholder="client@example.com"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary-green px-3 d-flex align-items-center gap-1">
                <span>Link</span>
              </button>
            </form>
          </div>

          {/* Client List */}
          <div className="health-card">
            <h5 className="fw-bold text-dark-green mb-3 d-flex align-items-center gap-2">
              <FaUsers />
              <span>Client Portfolio ({clients.length})</span>
            </h5>

            {clients.length > 0 ? (
              <div className="list-group list-group-flush">
                {clients.map((client) => (
                  <button
                    key={client._id}
                    className={`list-group-item list-group-item-action border-0 px-2 py-3 rounded mb-2 text-start ${
                      selectedClient?._id === client._id ? 'bg-light-green text-dark-green active' : ''
                    }`}
                    onClick={() => handleViewClientProgress(client)}
                  >
                    <strong className="text-dark-green d-block fs-6">{client.name}</strong>
                    <span className="text-muted small d-block">{client.email}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-muted text-center py-4">No clients linked yet. Invite users by entering their email address above.</p>
            )}
          </div>
        </div>

        {/* Right Column: Detailed View Pane */}
        <div className="col-lg-7">
          {selectedClient ? (
            <div className="health-card">
              <div className="d-flex justify-content-between align-items-start border-bottom pb-3 mb-4">
                <div>
                  <h3 className="fw-bold text-dark-green m-0">{selectedClient.name}</h3>
                  <small className="text-muted d-block">{selectedClient.email}</small>
                </div>
                <button className="btn btn-sm btn-outline-secondary p-1 border-0" onClick={() => setSelectedClient(null)}>
                  <FaTimes className="fs-5" />
                </button>
              </div>

              {/* Profile parameters */}
              <div className="row g-3 mb-4 p-3 bg-light-bg rounded border">
                <div className="col-6 col-sm-3">
                  <small className="text-muted d-block">Age / Gender</small>
                  <strong>{selectedClient.age || 'N/A'} yrs / {selectedClient.gender || 'N/A'}</strong>
                </div>
                <div className="col-6 col-sm-3">
                  <small className="text-muted d-block">Height & Weight</small>
                  <strong>{selectedClient.height || 'N/A'}cm / {selectedClient.weight || 'N/A'}kg</strong>
                </div>
                <div className="col-6 col-sm-3">
                  <small className="text-muted d-block">Diet Preference</small>
                  <strong>{selectedClient.dietaryPreference || 'Any'}</strong>
                </div>
                <div className="col-6 col-sm-3">
                  <small className="text-muted d-block">BMI Status</small>
                  <span className="badge bg-primary-green">{selectedClient.bmi || 'N/A'}</span>
                </div>
              </div>

              <div className="mb-4">
                <strong className="text-dark-green d-block mb-1">Medical Conditions:</strong>
                <p className="text-muted bg-light p-2 rounded small m-0">
                  {selectedClient.medicalConditions || 'No conditions declared.'}
                </p>
              </div>

              {/* Weight trend charts */}
              <h5 className="fw-bold text-dark-green mb-3 d-flex align-items-center gap-2">
                <FaChartLine />
                <span>Client Progress Trend</span>
              </h5>

              <div style={{ width: '100%', height: '240px' }}>
                {historyLoading ? (
                  <div className="d-flex align-items-center justify-content-center h-100">
                    <div className="spinner-border text-success" role="status"></div>
                  </div>
                ) : progressHistory.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis dataKey="formattedDate" stroke="#9CA3AF" />
                      <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="#9CA3AF" />
                      <Tooltip contentStyle={{ borderRadius: '8px' }} />
                      <Line type="monotone" dataKey="weight" stroke="#16A34A" strokeWidth={3} dot={{ r: 4 }} name="Weight (kg)" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="d-flex align-items-center justify-content-center h-100 text-muted border rounded bg-light">
                    <p className="m-0 small">No weight progress logs available for this client.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="health-card text-center py-5 text-muted h-100 d-flex flex-column justify-content-center">
              <FaUsers className="fs-1 mb-3" />
              <h4>Select a client to inspect profile details & trends.</h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Clients;
