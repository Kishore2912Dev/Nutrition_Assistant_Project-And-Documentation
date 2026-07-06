import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FaSearch, FaPlus, FaTrash, FaUtensils, FaCalculator } from 'react-icons/fa';

const MealLogger = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(100); // in grams
  const [mealType, setMealType] = useState('Breakfast');
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);

  // For custom food entry
  const [isCustom, setIsCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customCal, setCustomCal] = useState('');
  const [customProt, setCustomProt] = useState('');
  const [customCarbs, setCustomCarbs] = useState('');
  const [customFat, setCustomFat] = useState('');
  const [customFib, setCustomFib] = useState('');

  // Daily logged meals state
  const [mealHistory, setMealHistory] = useState([]);
  const [dailyTotals, setDailyTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHistoryAndSummary();
  }, [logDate]);

  const fetchHistoryAndSummary = async () => {
    try {
      setLoading(true);
      // Get history
      const historyRes = await api.get(`/meals/history?date=${logDate}`);
      if (historyRes.data.success) {
        setMealHistory(historyRes.data.meals);
      }

      // Get daily summary
      const sumRes = await api.get(`/meals/summary?date=${logDate}`);
      if (sumRes.data.success) {
        setDailyTotals(sumRes.data.summary);
      }
    } catch (err) {
      console.error('Failed to fetch meal logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    try {
      const res = await api.get(`/meals/search?q=${searchQuery}`);
      if (res.data.success) {
        setSearchResults(res.data.foods);
        if (res.data.foods.length === 0) {
          setIsCustom(true); // Offer custom option directly
        }
      }
    } catch (err) {
      console.error('Food search failed:', err);
    }
  };

  const handleSelectFood = (food) => {
    setSelectedFood(food);
    setIsCustom(false);
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleLogMeal = async (e) => {
    e.preventDefault();
    try {
      let payload = {
        mealType,
        date: logDate
      };

      if (isCustom) {
        if (!customName || !customCal) {
          alert('Please insert custom food name and calorie estimation.');
          return;
        }
        payload.foodName = customName;
        payload.quantity = quantity;
        payload.calories = Number(customCal);
        payload.protein = Number(customProt || 0);
        payload.carbs = Number(customCarbs || 0);
        payload.fat = Number(customFat || 0);
        payload.fiber = Number(customFib || 0);
      } else {
        if (!selectedFood) return;
        payload.foodName = selectedFood.name;
        payload.quantity = Number(quantity);
      }

      const res = await api.post('/meals/log', payload);
      if (res.data.success) {
        // Reset states
        setSelectedFood(null);
        setIsCustom(false);
        setCustomName('');
        setCustomCal('');
        setCustomProt('');
        setCustomCarbs('');
        setCustomFat('');
        setCustomFib('');
        setQuantity(100);

        // Refresh lists
        fetchHistoryAndSummary();
      }
    } catch (err) {
      console.error('Failed to log meal:', err);
    }
  };

  const handleDeleteLog = async (id) => {
    if (!window.confirm('Are you sure you want to delete this log?')) return;
    try {
      const res = await api.delete(`/meals/${id}`);
      if (res.data.success) {
        fetchHistoryAndSummary();
      }
    } catch (err) {
      console.error('Failed to delete log:', err);
    }
  };

  return (
    <div className="container py-2">
      <div className="row g-4">
        {/* Left Side: Logger Forms */}
        <div className="col-lg-6">
          <div className="health-card mb-4">
            <h4 className="fw-bold text-dark-green mb-4">Log Your Meals</h4>

            {/* Date and Meal Type Picker */}
            <div className="row g-3 mb-4">
              <div className="col-6">
                <label className="form-label fw-semibold">Intake Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                />
              </div>
              <div className="col-6">
                <label className="form-label fw-semibold">Meal Session</label>
                <select className="form-select" value={mealType} onChange={(e) => setMealType(e.target.value)}>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snack">Snack</option>
                </select>
              </div>
            </div>

            {/* Search Option */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Search Food Database</label>
              <form onSubmit={handleSearch} className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search apple, chicken, salmon..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="btn btn-primary-green d-flex align-items-center gap-1">
                  <FaSearch />
                  <span>Search</span>
                </button>
              </form>

              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <ul className="list-group mt-2 border rounded shadow-sm" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {searchResults.map((food) => (
                    <button
                      key={food._id}
                      type="button"
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                      onClick={() => handleSelectFood(food)}
                    >
                      <strong className="text-dark-green">{food.name}</strong>
                      <span className="badge bg-light-green text-dark-green">
                        {food.calories} kcal / 100g
                      </span>
                    </button>
                  ))}
                </ul>
              )}
            </div>

            {/* Selected Food Logging Form */}
            {selectedFood && (
              <form onSubmit={handleLogMeal} className="p-3 bg-light-green rounded border mb-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="m-0 fw-bold text-dark-green">Selected: {selectedFood.name}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelectedFood(null)}
                    aria-label="Close"
                  ></button>
                </div>
                <p className="text-muted small mb-3">
                  Nutritional value (per 100g): {selectedFood.calories} kcal | P: {selectedFood.protein}g | C: {selectedFood.carbs}g | F: {selectedFood.fat}g
                </p>
                <div className="row g-3 align-items-end">
                  <div className="col-8">
                    <label className="form-label fw-semibold">Quantity consumed (grams)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      min={1}
                      required
                    />
                  </div>
                  <div className="col-4">
                    <button type="submit" className="btn btn-primary-green w-100 py-2 d-flex align-items-center justify-content-center gap-1">
                      <FaPlus />
                      <span>Log</span>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Custom Log Trigger */}
            <div className="text-end mb-3">
              <button
                type="button"
                className="btn btn-link text-decoration-none text-primary-green fw-semibold p-0"
                onClick={() => {
                  setIsCustom(!isCustom);
                  setSelectedFood(null);
                }}
              >
                {isCustom ? '← Log from Food database' : '+ Log Custom Food Item'}
              </button>
            </div>

            {/* Custom Logging Form */}
            {isCustom && (
              <form onSubmit={handleLogMeal} className="p-3 border rounded bg-light p-3">
                <h5 className="fw-bold mb-3">Custom Food Entry</h5>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Food Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Oatmeal Cookie"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    required
                  />
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label className="form-label fw-semibold">Calories (kcal)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={customCal}
                      onChange={(e) => setCustomCal(e.target.value)}
                      required
                      min={0}
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-semibold">Serving Weight (g)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      required
                      min={1}
                    />
                  </div>
                </div>
                <div className="row g-2 mb-4">
                  <div className="col-3">
                    <label className="form-label small fw-semibold">Protein (g)</label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={customProt}
                      onChange={(e) => setCustomProt(e.target.value)}
                      min={0}
                      step="0.1"
                    />
                  </div>
                  <div className="col-3">
                    <label className="form-label small fw-semibold">Carbs (g)</label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={customCarbs}
                      onChange={(e) => setCustomCarbs(e.target.value)}
                      min={0}
                      step="0.1"
                    />
                  </div>
                  <div className="col-3">
                    <label className="form-label small fw-semibold">Fat (g)</label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={customFat}
                      onChange={(e) => setCustomFat(e.target.value)}
                      min={0}
                      step="0.1"
                    />
                  </div>
                  <div className="col-3">
                    <label className="form-label small fw-semibold">Fiber (g)</label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={customFib}
                      onChange={(e) => setCustomFib(e.target.value)}
                      min={0}
                      step="0.1"
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary-green w-100 py-2 d-flex align-items-center justify-content-center gap-1">
                  <FaPlus />
                  <span>Log Custom Item</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Side: Log History and Totals */}
        <div className="col-lg-6">
          <div className="health-card mb-4 bg-dark-green text-white">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <FaCalculator />
              <span>Nutrition Summary: {logDate}</span>
            </h5>
            <div className="row text-center mt-3 g-2">
              <div className="col-4">
                <span className="small text-light d-block">Calories</span>
                <strong className="fs-4">{dailyTotals.calories} kcal</strong>
              </div>
              <div className="col-2">
                <span className="small text-light d-block">Protein</span>
                <strong>{dailyTotals.protein}g</strong>
              </div>
              <div className="col-2">
                <span className="small text-light d-block">Carbs</span>
                <strong>{dailyTotals.carbs}g</strong>
              </div>
              <div className="col-2">
                <span className="small text-light d-block">Fat</span>
                <strong>{dailyTotals.fat}g</strong>
              </div>
              <div className="col-2">
                <span className="small text-light d-block">Fiber</span>
                <strong>{dailyTotals.fiber}g</strong>
              </div>
            </div>
          </div>

          <div className="health-card">
            <h5 className="fw-bold text-dark-green mb-4">Meal Logs for {logDate}</h5>
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border spinner-border-sm text-success" role="status"></div>
              </div>
            ) : mealHistory.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>Time/Meal</th>
                      <th>Food</th>
                      <th>Qty</th>
                      <th>Kcal</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mealHistory.map((log) => (
                      <tr key={log._id}>
                        <td>
                          <span className="badge bg-light-green text-dark-green fw-bold">
                            {log.mealType}
                          </span>
                        </td>
                        <td>
                          <strong className="text-dark">{log.food}</strong>
                          <div className="text-muted" style={{ fontSize: '11px' }}>
                            P: {log.protein}g | C: {log.carbs}g | F: {log.fat}g
                          </div>
                        </td>
                        <td>{log.quantity}g</td>
                        <td className="fw-bold">{log.calories}</td>
                        <td>
                          <button
                            onClick={() => handleDeleteLog(log._id)}
                            className="btn btn-outline-danger btn-sm p-1 border-0"
                            title="Remove log"
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
              <div className="text-center py-5 text-muted">
                <FaUtensils className="fs-3 mb-2" />
                <p className="m-0">No meals logged for this date.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealLogger;
