import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FaCalendarAlt, FaTrash, FaUser, FaUserMd } from 'react-icons/fa';

const AllPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await api.get('/plans/admin');
      if (res.data.success) {
        setPlans(res.data.plans);
      }
    } catch (err) {
      console.error('Failed to load system meal plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete meal plan "${title}"?`)) return;
    try {
      const res = await api.delete(`/plans/${id}`);
      if (res.data.success) {
        setMessage({ text: `Meal plan "${title}" removed successfully.`, type: 'success' });
        setPlans(plans.filter(p => p._id !== id));
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      }
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Delete failed.', type: 'danger' });
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
      <div className="health-card mb-4">
        <h5 className="fw-bold text-dark-green mb-1 d-flex align-items-center gap-2">
          <FaCalendarAlt />
          <span>Active Meal Plans Audit</span>
        </h5>
        <p className="text-muted small m-0">Monitor all assigned nutrition schedules created by active dietitians.</p>
        {message.text && (
          <div className={`alert alert-${message.type} py-2 mt-3 mb-0`} role="alert">
            {message.text}
          </div>
        )}
      </div>

      {plans.length > 0 ? (
        <div className="row g-4">
          {plans.map((plan) => (
            <div key={plan._id} className="col-md-6 col-lg-4">
              <div className="health-card h-100 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <strong className="text-dark-green fs-5">{plan.title}</strong>
                  <button
                    onClick={() => handleDeletePlan(plan._id, plan.title)}
                    className="btn btn-outline-danger btn-sm p-1 border-0"
                    title="Audit and Delete"
                  >
                    <FaTrash />
                  </button>
                </div>

                <div className="mb-2">
                  <span className="small text-muted d-block">
                    <FaUser className="me-1" /> Client:
                  </span>
                  <strong className="text-dark small">{plan.assignedTo?.name || 'Unknown'} ({plan.assignedTo?.email})</strong>
                </div>

                <div className="mb-3">
                  <span className="small text-muted d-block">
                    <FaUserMd className="me-1" /> Created By:
                  </span>
                  <strong className="text-dark small">
                    {plan.createdBy?.name || 'System'} ({plan.createdBy?.role || 'Dietitian'})
                  </strong>
                </div>

                <div className="mt-auto border-top pt-3 text-secondary small bg-light-bg p-2 rounded">
                  <span>
                    Range: {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
                  </span>
                  <div className="mt-1 fw-bold text-dark-green">
                    Total Meals: {plan.meals?.length || 0} items
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="health-card text-center py-5 text-muted">
          <p className="m-0">No active meal plans found in the system database.</p>
        </div>
      )}
    </div>
  );
};

export default AllPlans;
