import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FaCalendarAlt, FaUserMd, FaUtensils, FaArrowRight } from 'react-icons/fa';

const DietPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePlan, setActivePlan] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await api.get('/plans/client');
      if (res.data.success) {
        setPlans(res.data.plans);
        if (res.data.plans.length > 0) {
          setActivePlan(res.data.plans[0]); // Select latest by default
        }
      }
    } catch (err) {
      console.error('Failed to fetch assigned diet plans:', err);
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

  // Helper to calculate total plan macros
  const calculatePlanTotals = (meals) => {
    return (meals || []).reduce(
      (totals, meal) => {
        totals.calories += meal.calories;
        totals.protein += meal.protein;
        totals.carbs += meal.carbs;
        totals.fat += meal.fat;
        totals.fiber += meal.fiber;
        return totals;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );
  };

  return (
    <div className="container py-2">
      <div className="row g-4">
        {/* Left Side: Plans Sidebar List */}
        <div className="col-md-4">
          <div className="health-card">
            <h5 className="fw-bold text-dark-green mb-4 d-flex align-items-center gap-2">
              <FaCalendarAlt />
              <span>Assigned Diet Plans</span>
            </h5>

            {plans.length > 0 ? (
              <div className="list-group list-group-flush">
                {plans.map((plan) => (
                  <button
                    key={plan._id}
                    className={`list-group-item list-group-item-action border-0 px-2 py-3 rounded mb-2 text-start ${
                      activePlan?._id === plan._id ? 'bg-light-green text-dark-green active' : ''
                    }`}
                    onClick={() => setActivePlan(plan)}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <strong className="text-dark-green d-block fs-6">{plan.title}</strong>
                      {new Date(plan.endDate) > new Date() ? (
                        <span className="badge bg-success" style={{ fontSize: '10px' }}>Active</span>
                      ) : (
                        <span className="badge bg-secondary" style={{ fontSize: '10px' }}>Expired</span>
                      )}
                    </div>
                    <small className="text-muted d-block mt-1" style={{ fontSize: '11px' }}>
                      Range: {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
                    </small>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-muted m-0 text-center py-4">No diet plans have been assigned by a dietitian yet.</p>
            )}
          </div>
        </div>

        {/* Right Side: Plan Detail Pane */}
        <div className="col-md-8">
          {activePlan ? (
            <div className="health-card">
              <div className="d-flex justify-content-between align-items-start border-bottom pb-3 mb-4">
                <div>
                  <h3 className="fw-bold text-dark-green m-0">{activePlan.title}</h3>
                  <small className="text-muted d-block mt-1">
                    Validity: {new Date(activePlan.startDate).toLocaleDateString()} to {new Date(activePlan.endDate).toLocaleDateString()}
                  </small>
                </div>
                <div className="d-flex align-items-center gap-2 text-end">
                  <div className="p-2 bg-light-green rounded text-primary-green fs-4">
                    <FaUserMd />
                  </div>
                  <div>
                    <span className="small text-muted d-block">Created By</span>
                    <strong className="text-dark">{activePlan.createdBy?.name || 'Dietitian'}</strong>
                  </div>
                </div>
              </div>

              {activePlan.description && (
                <div className="bg-light p-3 rounded mb-4">
                  <h6 className="fw-bold text-dark-green">Dietitian Notes:</h6>
                  <p className="m-0 text-muted" style={{ whiteSpace: 'pre-line' }}>{activePlan.description}</p>
                </div>
              )}

              {/* Aggregated Totals Card */}
              {(() => {
                const totals = calculatePlanTotals(activePlan.meals);
                return (
                  <div className="p-3 bg-dark-green text-white rounded-3 mb-4">
                    <h6 className="fw-bold text-light mb-2">Total Daily Target Summary</h6>
                    <div className="row text-center g-2 mt-2">
                      <div className="col-4">
                        <small className="text-light d-block">Calories</small>
                        <strong className="fs-5">{totals.calories} kcal</strong>
                      </div>
                      <div className="col-2">
                        <small className="text-light d-block">Protein</small>
                        <strong>{totals.protein}g</strong>
                      </div>
                      <div className="col-2">
                        <small className="text-light d-block">Carbs</small>
                        <strong>{totals.carbs}g</strong>
                      </div>
                      <div className="col-2">
                        <small className="text-light d-block">Fat</small>
                        <strong>{totals.fat}g</strong>
                      </div>
                      <div className="col-2">
                        <small className="text-light d-block">Fiber</small>
                        <strong>{totals.fiber}g</strong>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <h5 className="fw-bold text-dark-green mb-3">Meal Schedule Plan</h5>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>Session</th>
                      <th>Food & Description</th>
                      <th>Qty (g)</th>
                      <th>Calories</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activePlan.meals.map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <span className="badge bg-light-green text-dark-green fw-bold">
                            {item.mealType}
                          </span>
                        </td>
                        <td>
                          <strong className="text-dark d-block">{item.food}</strong>
                          <span className="text-muted small" style={{ fontSize: '11px' }}>
                            P: {item.protein}g | C: {item.carbs}g | F: {item.fat}g | Fib: {item.fiber}g
                          </span>
                        </td>
                        <td>{item.quantity}g</td>
                        <td className="fw-bold text-dark-green">{item.calories} kcal</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="health-card text-center py-5 text-muted">
              <FaUtensils className="fs-1 mb-3" />
              <h4>Select a diet plan from the list to display details.</h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DietPlans;
