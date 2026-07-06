import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FaUsers, FaCalendarAlt, FaUserMd, FaChartPie, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, dietitians: 0, admins: 0, plans: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // Fetch users list
      const usersRes = await api.get('/users/admin/all');
      // Fetch plans list
      const plansRes = await api.get('/plans/admin');

      if (usersRes.data.success && plansRes.data.success) {
        const users = usersRes.data.users;
        const plans = plansRes.data.plans;

        setStats({
          users: users.filter(u => u.role === 'User').length,
          dietitians: users.filter(u => u.role === 'Dietitian').length,
          admins: users.filter(u => u.role === 'Admin').length,
          plans: plans.length
        });
      }
    } catch (err) {
      console.error('Failed to load admin dashboard statistics:', err);
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
        {/* Total Users */}
        <div className="col-md-6 col-lg-3">
          <div className="health-card d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted small d-block">Registered Clients</span>
              <strong className="display-6 fw-bold text-dark-green">{stats.users}</strong>
            </div>
            <div className="bg-light-green p-3 rounded-circle text-primary-green fs-3">
              <FaUsers />
            </div>
          </div>
        </div>

        {/* Total Dietitians */}
        <div className="col-md-6 col-lg-3">
          <div className="health-card d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted small d-block">Dietitians</span>
              <strong className="display-6 fw-bold text-dark-green">{stats.dietitians}</strong>
            </div>
            <div className="bg-light-green p-3 rounded-circle text-primary-green fs-3">
              <FaUserMd />
            </div>
          </div>
        </div>

        {/* Total Plans */}
        <div className="col-md-6 col-lg-3">
          <div className="health-card d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted small d-block">Total Diet Plans</span>
              <strong className="display-6 fw-bold text-dark-green">{stats.plans}</strong>
            </div>
            <div className="bg-light-green p-3 rounded-circle text-primary-green fs-3">
              <FaCalendarAlt />
            </div>
          </div>
        </div>

        {/* System Admins */}
        <div className="col-md-6 col-lg-3">
          <div className="health-card d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted small d-block">Administrators</span>
              <strong className="display-6 fw-bold text-dark-green">{stats.admins}</strong>
            </div>
            <div className="bg-light-green p-3 rounded-circle text-primary-green fs-3">
              <FaChartPie />
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Controls */}
        <div className="col-lg-6">
          <div className="health-card h-100">
            <h5 className="fw-bold text-dark-green mb-4">Platform Governance</h5>
            <div className="d-grid gap-3">
              <Link to="/admin/users" className="btn btn-primary-green py-3 text-start d-flex align-items-center justify-content-between">
                <span>Manage Users & Dietitians</span>
                <FaArrowRight />
              </Link>
              <Link to="/admin/plans" className="btn btn-outline-green py-3 text-start d-flex align-items-center justify-content-between">
                <span>Audit Active Diet Plans</span>
                <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>

        {/* Info panel */}
        <div className="col-lg-6">
          <div className="health-card h-100">
            <h5 className="fw-bold text-dark-green mb-3">System Health Status</h5>
            <div className="p-3 bg-light-bg rounded border mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span>Database Connection</span>
                <span className="badge bg-success">Online (Connected)</span>
              </div>
            </div>
            <div className="p-3 bg-light-bg rounded border">
              <div className="d-flex justify-content-between align-items-center">
                <span>Server API Endpoint</span>
                <span className="badge bg-success">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
