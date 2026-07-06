import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FaUsers, FaCalendarAlt, FaPlus, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const DietitianDashboard = () => {
  const [clientsCount, setClientsCount] = useState(0);
  const [plansCount, setPlansCount] = useState(0);
  const [recentClients, setRecentClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Get assigned clients
      const clientsRes = await api.get('/users/clients');
      if (clientsRes.data.success) {
        setClientsCount(clientsRes.data.clients.length);
        setRecentClients(clientsRes.data.clients.slice(-4)); // last 4 client adds
      }

      // Get dietitian meal plans
      const plansRes = await api.get('/plans/dietitian');
      if (plansRes.data.success) {
        setPlansCount(plansRes.data.plans.length);
      }
    } catch (err) {
      console.error('Failed to load dietitian overview stats:', err);
    } finally {
      setLoading(false);
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
    <div className="container-fluid py-2">
      <div className="row g-4 mb-4">
        {/* Total Clients Card */}
        <div className="col-md-6 col-lg-4">
          <div className="health-card d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted small d-block">Active Clients</span>
              <strong className="display-5 fw-bold text-dark-green">{clientsCount}</strong>
            </div>
            <div className="bg-light-green p-3 rounded-circle text-primary-green fs-2">
              <FaUsers />
            </div>
          </div>
        </div>

        {/* Assigned Plans Card */}
        <div className="col-md-6 col-lg-4">
          <div className="health-card d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted small d-block">Diet Plans Created</span>
              <strong className="display-5 fw-bold text-dark-green">{plansCount}</strong>
            </div>
            <div className="bg-light-green p-3 rounded-circle text-primary-green fs-2">
              <FaCalendarAlt />
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Recent Client Interactions */}
        <div className="col-lg-7">
          <div className="health-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold text-dark-green m-0">Recent Clients</h5>
              <Link to="/dietitian/clients" className="text-primary-green fw-semibold text-decoration-none d-flex align-items-center gap-1">
                <span>Manage Clients</span>
                <FaArrowRight />
              </Link>
            </div>
            {recentClients.length > 0 ? (
              <div className="list-group list-group-flush">
                {recentClients.map((client) => (
                  <div key={client._id} className="list-group-item px-0 py-3 d-flex justify-content-between align-items-center">
                    <div>
                      <strong className="text-dark d-block">{client.name}</strong>
                      <span className="text-muted small">{client.email}</span>
                    </div>
                    <span className="badge bg-light-green text-dark-green">
                      {client.goal || 'No goal set'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5 text-muted">
                <FaUsers className="fs-1 mb-2" />
                <p className="m-0">No clients assigned to your portfolio yet.</p>
                <Link to="/dietitian/clients" className="btn btn-primary-green btn-sm mt-3">
                  Link Client Email
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Action Panel */}
        <div className="col-lg-5">
          <div className="health-card h-100">
            <h5 className="fw-bold text-dark-green mb-4">Quick Operations</h5>
            <div className="d-grid gap-3">
              <Link to="/dietitian/plans" className="btn btn-primary-green py-3 text-start d-flex align-items-center justify-content-between">
                <span>Create & Assign Meal Plan</span>
                <FaPlus />
              </Link>
              <Link to="/dietitian/clients" className="btn btn-outline-green py-3 text-start d-flex align-items-center justify-content-between">
                <span>View Clients Progress Tracking</span>
                <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietitianDashboard;
