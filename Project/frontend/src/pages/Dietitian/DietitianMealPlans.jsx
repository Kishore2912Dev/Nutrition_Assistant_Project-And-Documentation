import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FaCalendarAlt, FaPlus, FaTrash, FaClipboardList } from 'react-icons/fa';

const DietitianMealPlans = () => {
  const [clients, setClients] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  // Dynamic meals checklist state
  const [meals, setMeals] = useState([
    { mealType: 'Breakfast', food: '', quantity: 100, calories: 300, protein: 15, carbs: 40, fat: 8, fiber: 4 }
  ]);

  const [message, setMessage] = useState({ text: '', type: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      // Fetch clients list
      const clientsRes = await api.get('/users/clients');
      if (clientsRes.data.success) {
        setClients(clientsRes.data.clients);
        if (clientsRes.data.clients.length > 0) {
          setAssignedTo(clientsRes.data.clients[0]._id);
        }
      }

      // Fetch meal plans created
      const plansRes = await api.get('/plans/dietitian');
      if (plansRes.data.success) {
        setPlans(plansRes.data.plans);
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMealRow = () => {
    setMeals([
      ...meals,
      { mealType: 'Lunch', food: '', quantity: 100, calories: 400, protein: 25, carbs: 50, fat: 10, fiber: 5 }
    ]);
  };

  const handleRemoveMealRow = (index) => {
    const updated = meals.filter((_, idx) => idx !== index);
    setMeals(updated);
  };

  const handleMealChange = (index, field, value) => {
    const updated = [...meals];
    if (field === 'mealType' || field === 'food') {
      updated[index][field] = value;
    } else {
      updated[index][field] = Number(value);
    }
    setMeals(updated);
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    if (!title || !assignedTo || meals.length === 0) {
      alert('Please fill out plan title, select client and add at least one meal.');
      return;
    }

    setSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      const payload = {
        title,
        description,
        assignedTo,
        startDate,
        endDate,
        meals
      };

      const res = await api.post('/plans', payload);
      if (res.data.success) {
        setMessage({ text: 'Meal plan created and assigned successfully!', type: 'success' });
        // Clear form
        setTitle('');
        setDescription('');
        setMeals([{ mealType: 'Breakfast', food: '', quantity: 100, calories: 300, protein: 15, carbs: 40, fat: 8, fiber: 4 }]);

        // Refetch plans
        const plansRes = await api.get('/plans/dietitian');
        if (plansRes.data.success) {
          setPlans(plansRes.data.plans);
        }
      }
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to create plan.', type: 'danger' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePlan = async (id) => {
    if (!window.confirm('Delete this meal plan assignment?')) return;
    try {
      const res = await api.delete(`/plans/${id}`);
      if (res.data.success) {
        setPlans(plans.filter(p => p._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete meal plan:', err);
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
        {/* Left: Creator Form */}
        <div className="col-lg-7">
          <div className="health-card">
            <h4 className="fw-bold text-dark-green mb-4">Create Custom Meal Plan</h4>

            {message.text && (
              <div className={`alert alert-${message.type} py-2 mb-3`} role="alert">
                {message.text}
              </div>
            )}

            <form onSubmit={handleCreatePlan}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Assign Client</label>
                <select className="form-select" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} required>
                  {clients.length > 0 ? (
                    clients.map(c => <option key={c._id} value={c._id}>{c.name} ({c.email})</option>)
                  ) : (
                    <option value="">No clients assigned. Link clients first.</option>
                  )}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Meal Plan Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Muscle Gain Macro Plan"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Dietary Instructions (Notes)</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="Add hydration guidelines, vitamins instructions, or restrictions..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="row g-3 mb-4">
                <div className="col-6">
                  <label className="form-label fw-semibold">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label fw-semibold">End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-dark-green m-0">Meals List</h5>
                <button type="button" onClick={handleAddMealRow} className="btn btn-outline-green btn-sm">
                  + Add Meal
                </button>
              </div>

              {meals.map((meal, index) => (
                <div key={index} className="p-3 mb-3 border rounded bg-light">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="fw-bold m-0 text-secondary">Meal #{index + 1}</h6>
                    {meals.length > 1 && (
                      <button type="button" onClick={() => handleRemoveMealRow(index)} className="btn btn-link text-danger p-0">
                        <FaTrash /> Remove
                      </button>
                    )}
                  </div>

                  <div className="row g-2 mb-2">
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Session</label>
                      <select
                        className="form-select form-select-sm"
                        value={meal.mealType}
                        onChange={(e) => handleMealChange(index, 'mealType', e.target.value)}
                      >
                        <option value="Breakfast">Breakfast</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Dinner">Dinner</option>
                        <option value="Snack">Snack</option>
                      </select>
                    </div>
                    <div className="col-md-5">
                      <label className="form-label small fw-semibold">Food Item</label>
                      <input
                        type="text"
                        className="form-control form-select-sm"
                        placeholder="e.g. Scrambled Eggs with toast"
                        value={meal.food}
                        onChange={(e) => handleMealChange(index, 'food', e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small fw-semibold">Weight (g)</label>
                      <input
                        type="number"
                        className="form-control form-select-sm"
                        value={meal.quantity}
                        onChange={(e) => handleMealChange(index, 'quantity', e.target.value)}
                        min={1}
                        required
                      />
                    </div>
                  </div>

                  <div className="row g-2">
                    <div className="col-2">
                      <label className="form-label small text-muted mb-0">Calories</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={meal.calories}
                        onChange={(e) => handleMealChange(index, 'calories', e.target.value)}
                        min={0}
                        required
                      />
                    </div>
                    <div className="col-2">
                      <label className="form-label small text-muted mb-0">Protein</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={meal.protein}
                        onChange={(e) => handleMealChange(index, 'protein', e.target.value)}
                        min={0}
                        required
                      />
                    </div>
                    <div className="col-2">
                      <label className="form-label small text-muted mb-0">Carbs</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={meal.carbs}
                        onChange={(e) => handleMealChange(index, 'carbs', e.target.value)}
                        min={0}
                        required
                      />
                    </div>
                    <div className="col-2">
                      <label className="form-label small text-muted mb-0">Fat</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={meal.fat}
                        onChange={(e) => handleMealChange(index, 'fat', e.target.value)}
                        min={0}
                        required
                      />
                    </div>
                    <div className="col-2">
                      <label className="form-label small text-muted mb-0">Fiber</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={meal.fiber}
                        onChange={(e) => handleMealChange(index, 'fiber', e.target.value)}
                        min={0}
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button type="submit" className="btn btn-primary-green w-100 py-2 fs-5 mt-3" disabled={submitting}>
                {submitting ? 'Submitting meal plan...' : 'Create & Assign Plan'}
              </button>
            </form>
          </div>
        </div>

        {/* Right: Created Plans List */}
        <div className="col-lg-5">
          <div className="health-card">
            <h5 className="fw-bold text-dark-green mb-3 d-flex align-items-center gap-2">
              <FaClipboardList />
              <span>Created Diet Plans ({plans.length})</span>
            </h5>

            {plans.length > 0 ? (
              <div className="list-group list-group-flush" style={{ maxHeight: '700px', overflowY: 'auto' }}>
                {plans.map((plan) => (
                  <div key={plan._id} className="list-group-item border-0 p-3 rounded bg-light mb-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <strong className="text-dark-green fs-6">{plan.title}</strong>
                      <button
                        onClick={() => handleDeletePlan(plan._id)}
                        className="btn btn-sm btn-outline-danger p-1 border-0"
                        title="Delete Plan"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    <span className="small text-muted d-block mb-1">
                      Assigned to: <strong className="text-dark">{plan.assignedTo?.name || 'Client'}</strong>
                    </span>
                    <span className="small text-muted d-block">
                      Duration: {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
                    </span>
                    <hr className="my-2" />
                    <span className="small text-secondary d-block">
                      Includes {plan.meals?.length || 0} meals | Total Cal: {plan.meals?.reduce((s, m) => s + m.calories, 0)} kcal
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted text-center py-4">No meal plans created yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietitianMealPlans;
