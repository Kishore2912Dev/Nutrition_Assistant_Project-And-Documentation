import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FaWeight, FaChartLine, FaCalendarAlt, FaPlus } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const ProgressTracker = () => {
  const [weight, setWeight] = useState('');
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/progress/history');
      if (res.data.success) {
        // Map and sort history by date
        const formatted = res.data.history.map(item => ({
          ...item,
          formattedDate: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          weight: Number(item.weight),
          bmi: Number(item.bmi)
        }));
        setHistory(formatted);
      }
    } catch (err) {
      console.error('Failed to load weight logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogWeight = async (e) => {
    e.preventDefault();
    if (!weight) return;
    setSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await api.post('/progress/weight', {
        weight: Number(weight),
        date: logDate
      });

      if (res.data.success) {
        setMessage({ text: 'Weight logged successfully!', type: 'success' });
        setWeight('');
        fetchHistory();
      }
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Logging weight failed.', type: 'danger' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-2">
      <div className="row g-4">
        {/* Left Side: Logger Form & History List */}
        <div className="col-lg-4">
          <div className="health-card mb-4">
            <h5 className="fw-bold text-dark-green mb-3 d-flex align-items-center gap-2">
              <FaWeight />
              <span>Log Current Weight</span>
            </h5>

            {message.text && (
              <div className={`alert alert-${message.type} py-1 px-2 small mb-3`} role="alert">
                {message.text}
              </div>
            )}

            <form onSubmit={handleLogWeight}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Log Date</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold">Weight (kg)</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  placeholder="e.g. 72.5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  step="0.1"
                  min="20"
                  max="300"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary-green btn-sm w-100 py-2 d-flex align-items-center justify-content-center gap-1" disabled={submitting}>
                <FaPlus />
                <span>{submitting ? 'Logging...' : 'Log Weight'}</span>
              </button>
            </form>
          </div>

          <div className="health-card" style={{ maxHeight: '350px', overflowY: 'auto' }}>
            <h5 className="fw-bold text-dark-green mb-3">Weight History</h5>
            {loading ? (
              <div className="text-center py-3">
                <div className="spinner-border spinner-border-sm text-success" role="status"></div>
              </div>
            ) : history.length > 0 ? (
              <ul className="list-group list-group-flush">
                {[...history].reverse().map((item, idx) => (
                  <li key={idx} className="list-group-item px-1 py-2 d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted d-block">{item.formattedDate}</small>
                      <strong className="text-dark">{item.weight} kg</strong>
                    </div>
                    <span className="badge bg-light-green text-dark-green fw-semibold">
                      BMI: {item.bmi}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted text-center py-4 small">No history logged yet.</p>
            )}
          </div>
        </div>

        {/* Right Side: Charts */}
        <div className="col-lg-8">
          <div className="health-card mb-4">
            <h5 className="fw-bold text-dark-green mb-4 d-flex align-items-center gap-2">
              <FaChartLine />
              <span>Weight Trendline</span>
            </h5>
            <div style={{ width: '100%', height: '240px' }}>
              {history.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="formattedDate" stroke="#9CA3AF" />
                    <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                    <Line type="monotone" dataKey="weight" stroke="#16A34A" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Weight (kg)" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
                  <p className="m-0">Log your weights to build visual trend charts.</p>
                </div>
              )}
            </div>
          </div>

          <div className="health-card">
            <h5 className="fw-bold text-dark-green mb-4 d-flex align-items-center gap-2">
              <FaChartLine />
              <span>BMI Progression</span>
            </h5>
            <div style={{ width: '100%', height: '240px' }}>
              {history.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="formattedDate" stroke="#9CA3AF" />
                    <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                    <Line type="monotone" dataKey="bmi" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="BMI Score" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
                  <p className="m-0">Log height and weights to compile BMI records.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
