import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FaFileAlt, FaPrint, FaAppleAlt, FaUtensils, FaUserMd } from 'react-icons/fa';

const Reports = () => {
  const { user } = useAuth();
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [summary, setSummary] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
  const [meals, setMeals] = useState([]);
  const [recs, setRecs] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReportDetails();
  }, [reportDate]);

  const fetchReportDetails = async () => {
    try {
      setLoading(true);
      // Fetch meals logged for the date
      const mealsRes = await api.get(`/meals/history?date=${reportDate}`);
      if (mealsRes.data.success) {
        setMeals(mealsRes.data.meals);
      }

      // Fetch summary macros
      const sumRes = await api.get(`/meals/summary?date=${reportDate}`);
      if (sumRes.data.success) {
        setSummary(sumRes.data.summary);
      }

      // Fetch recommendations
      const recsRes = await api.get('/users/recommendations');
      if (recsRes.data.success) {
        setRecs(recsRes.data.recommendations);
      }
    } catch (err) {
      console.error('Failed to load report data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const targetCal = recs?.dailyCalories || 2000;
  const targetProtein = recs?.macros?.protein || 120;
  const targetCarbs = recs?.macros?.carbs || 230;
  const targetFat = recs?.macros?.fat || 65;
  const targetFiber = recs?.macros?.fiber || 25;

  return (
    <div className="container py-2">
      {/* Search Header Form - Hidden on print */}
      <div className="health-card mb-4 no-print">
        <div className="row align-items-center g-3">
          <div className="col-sm-6">
            <h5 className="fw-bold text-dark-green m-0 d-flex align-items-center gap-2">
              <FaFileAlt />
              <span>Generate Health & Nutrition Reports</span>
            </h5>
          </div>
          <div className="col-sm-4">
            <input
              type="date"
              className="form-control"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
            />
          </div>
          <div className="col-sm-2">
            <button onClick={handlePrint} className="btn btn-primary-green w-100 d-flex align-items-center justify-content-center gap-2">
              <FaPrint />
              <span>Print/PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Print Layout Document */}
      <div className="bg-white p-4 p-md-5 rounded shadow-sm border report-document">
        {/* Document Header */}
        <div className="d-flex justify-content-between align-items-center border-bottom pb-4 mb-4">
          <div>
            <h1 className="fw-bold text-dark-green m-0" style={{ fontSize: '28px' }}>NutriGuide Report</h1>
            <p className="text-muted m-0 mt-1">Generated Clinical Log Snapshot</p>
          </div>
          <div className="text-end">
            <h5 className="m-0 fw-bold">NutriGuide Client Portal</h5>
            <small className="text-muted">Date: {new Date(reportDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</small>
          </div>
        </div>

        {/* Patient Profile Sub-header */}
        <div className="row g-3 mb-4 p-3 bg-light-bg rounded border">
          <div className="col-sm-3">
            <small className="text-muted d-block">Client Name</small>
            <strong className="text-dark">{user?.name}</strong>
          </div>
          <div className="col-sm-3">
            <small className="text-muted d-block">Age / Gender</small>
            <strong className="text-dark">
              {user?.age ? `${user.age} yrs` : 'N/A'} / {user?.gender || 'N/A'}
            </strong>
          </div>
          <div className="col-sm-3">
            <small className="text-muted d-block">Height & Weight</small>
            <strong className="text-dark">
              {user?.height ? `${user.height} cm` : 'N/A'} | {user?.weight ? `${user.weight} kg` : 'N/A'}
            </strong>
          </div>
          <div className="col-sm-3 text-sm-end">
            <small className="text-muted d-block">Current BMI</small>
            <span className="badge bg-dark-green text-white fs-6 mt-1">
              {user?.bmi || 'N/A'}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status"></div>
          </div>
        ) : (
          <div className="row g-4">
            {/* Left Side: Nutrition Targets Comparison */}
            <div className="col-md-7">
              <h5 className="fw-bold text-dark-green mb-3 border-bottom pb-2">Macronutrient Accountability</h5>
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Nutrient</th>
                    <th>Target Goal</th>
                    <th>Actual Logged</th>
                    <th>Goal Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Calories</strong></td>
                    <td>{targetCal} kcal</td>
                    <td>{summary.calories} kcal</td>
                    <td>
                      <span className={`fw-bold ${summary.calories <= targetCal ? 'text-success' : 'text-danger'}`}>
                        {summary.calories <= targetCal ? 'Within Target' : 'Exceeded Target'}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Protein</strong></td>
                    <td>{targetProtein}g</td>
                    <td>{summary.protein}g</td>
                    <td>
                      <span className={`fw-bold ${summary.protein >= targetProtein ? 'text-success' : 'text-warning'}`}>
                        {summary.protein >= targetProtein ? 'Target Achieved' : 'Deficit'}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Carbs</strong></td>
                    <td>{targetCarbs}g</td>
                    <td>{summary.carbs}g</td>
                    <td>
                      <span>{Math.round(summary.carbs)}g / {targetCarbs}g</span>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Fat</strong></td>
                    <td>{targetFat}g</td>
                    <td>{summary.fat}g</td>
                    <td>
                      <span>{Math.round(summary.fat)}g / {targetFat}g</span>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Fiber</strong></td>
                    <td>{targetFiber}g</td>
                    <td>{summary.fiber}g</td>
                    <td>
                      <span>{Math.round(summary.fiber)}g / {targetFiber}g</span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <h5 className="fw-bold text-dark-green mt-4 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
                <FaUtensils />
                <span>Logged Meals Schedule</span>
              </h5>
              {meals.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Meal Session</th>
                        <th>Food Description</th>
                        <th>Serving</th>
                        <th>Cal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {meals.map((meal) => (
                        <tr key={meal._id}>
                          <td><span className="badge bg-light-green text-dark-green">{meal.mealType}</span></td>
                          <td>
                            <strong>{meal.food}</strong>
                            <div className="text-muted small" style={{ fontSize: '10px' }}>
                              P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fat}g | Fib: {meal.fiber}g
                            </div>
                          </td>
                          <td>{meal.quantity}g</td>
                          <td className="fw-semibold">{meal.calories} kcal</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted">No meal entries logged on this date.</p>
              )}
            </div>

            {/* Right Side: AI Assistant Diet Guidelines */}
            <div className="col-md-5">
              <div className="p-3 bg-light-bg rounded border mb-4">
                <h5 className="fw-bold text-dark-green mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
                  <FaAppleAlt />
                  <span>Diet Recommendations</span>
                </h5>
                <div className="mb-3">
                  <strong className="small text-muted d-block uppercase">Suggested Foods to Eat:</strong>
                  <ul className="ps-3 mt-1 small text-dark">
                    {recs?.foodsToEat?.map((f, i) => <li key={i}>{f}</li>) || <li>Green leafy vegetables</li>}
                  </ul>
                </div>
                <div>
                  <strong className="small text-danger d-block uppercase">Foods to Avoid:</strong>
                  <ul className="ps-3 mt-1 small text-dark">
                    {recs?.foodsToAvoid?.map((f, i) => <li key={i}>{f}</li>) || <li>Refined sugar products</li>}
                  </ul>
                </div>
              </div>

              {recs?.suggestedMeals?.length > 0 && (
                <div className="p-3 bg-light-bg rounded border">
                  <h5 className="fw-bold text-dark-green mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
                    <FaUserMd />
                    <span>Suggested Meal Guide</span>
                  </h5>
                  {recs.suggestedMeals.map((m, idx) => (
                    <div key={idx} className="mb-2 pb-2 border-bottom last-border-0">
                      <strong className="badge bg-dark-green text-white">{m.meal}</strong>
                      <p className="m-0 text-muted small mt-1">{m.menu}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Disclaimer */}
        <div className="border-top mt-5 pt-4 text-center text-muted" style={{ fontSize: '11px' }}>
          <p className="m-0">
            Disclaimer: NutriGuide Nutrition Assistant provides estimated dietary reports. Please consult with a physician or registered dietitian before beginning any intense restrictive diet.
          </p>
          <p className="m-0 mt-1">Lead support email: vanapallisuryaramakishore@gmail.com | Phone: 9391959683</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;
