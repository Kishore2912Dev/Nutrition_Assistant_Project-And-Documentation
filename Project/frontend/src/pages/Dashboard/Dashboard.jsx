import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { FaUtensils, FaTint, FaWeight, FaArrowRight, FaExclamationTriangle } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
  const [recs, setRecs] = useState(null);
  const [history, setHistory] = useState([]);
  const [waterToday, setWaterToday] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];

      // Fetch daily meal summary
      const sumRes = await api.get(`/meals/summary?date=${todayStr}`);
      if (sumRes.data.success) {
        setSummary(sumRes.data.summary);
      }

      // Fetch AI recommendations
      const recsRes = await api.get('/users/recommendations');
      if (recsRes.data.success) {
        setRecs(recsRes.data.recommendations);
      }

      // Fetch progress history for the chart
      const historyRes = await api.get('/progress/history');
      if (historyRes.data.success) {
        // Map history to simple format for chart
        const formatted = historyRes.data.history.map(item => ({
          date: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
          calories: item.dailyCalories
        })).slice(-7); // Last 7 days
        setHistory(formatted);

        // Find today's progress entry for water
        const todayBoundsStart = new Date();
        todayBoundsStart.setHours(0,0,0,0);
        const todayBoundsEnd = new Date();
        todayBoundsEnd.setHours(23,59,59,999);

        const todayProgObj = historyRes.data.history.find(item => {
          const itemD = new Date(item.date);
          return itemD >= todayBoundsStart && itemD <= todayBoundsEnd;
        });
        if (todayProgObj) {
          setWaterToday(todayProgObj.waterIntake || 0);
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAddWater = async (amount) => {
    try {
      const res = await api.post('/progress/water', { amount });
      if (res.data.success) {
        setWaterToday(prev => prev + amount);
        fetchDashboardData(); // Refresh history log sum
      }
    } catch (error) {
      console.error('Error logging water:', error);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading Dashboard...</span>
        </div>
      </div>
    );
  }

  // Check if profile is complete
  const isProfileIncomplete = !user?.weight || !user?.height || !user?.age;
  const targetCal = recs?.dailyCalories || 2000;
  const consumedCal = summary.calories;
  const remainingCal = targetCal - consumedCal;
  const targetProtein = recs?.macros?.protein || 120;
  const targetCarbs = recs?.macros?.carbs || 230;
  const targetFat = recs?.macros?.fat || 65;
  const targetWater = recs?.waterIntake || 2500;

  // Percentage Calculations
  const proteinPercent = Math.min(Math.round((summary.protein / targetProtein) * 100), 100);
  const carbsPercent = Math.min(Math.round((summary.carbs / targetCarbs) * 100), 100);
  const fatPercent = Math.min(Math.round((summary.fat / targetFat) * 100), 100);
  const waterPercent = Math.min(Math.round((waterToday / targetWater) * 100), 100);
  const caloriePercent = Math.min(Math.round((consumedCal / targetCal) * 100), 100);

  return (
    <div className="container-fluid py-2">
      {isProfileIncomplete && (
        <div className="alert alert-warning border-warning d-flex align-items-center gap-3 p-3 mb-4 rounded-3 shadow-sm" role="alert">
          <FaExclamationTriangle className="fs-3 text-warning" />
          <div>
            <h5 className="alert-heading fw-bold mb-1">Onboarding Incomplete</h5>
            <p className="m-0 text-dark">
              Please fill in your age, height, and weight in the <Link to="/profile" className="fw-bold text-decoration-underline text-warning-emphasis">Profile Settings</Link> so the AI Nutrition Assistant can compile accurate calorie goals and diet recommendations.
            </p>
          </div>
        </div>
      )}

      <div className="row g-4 mb-4">
        {/* Calorie Card */}
        <div className="col-lg-6">
          <div className="health-card h-100">
            <h5 className="fw-bold text-dark-green mb-4 d-flex align-items-center gap-2">
              <FaUtensils />
              <span>Calorie Tracking Today</span>
            </h5>
            <div className="row align-items-center">
              <div className="col-sm-6 text-center position-relative mb-3 mb-sm-0">
                {/* Visual circle percentage representation */}
                <div className="d-inline-flex flex-column align-items-center justify-content-center rounded-circle border border-5 border-success" style={{ width: '150px', height: '150px', backgroundColor: '#F0FDF4' }}>
                  <span className="fs-6 text-muted">Remaining</span>
                  <span className={`fs-3 fw-bold ${remainingCal < 0 ? 'text-danger' : 'text-dark-green'}`}>
                    {remainingCal}
                  </span>
                  <span className="fs-6 text-muted">kcal</span>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="mb-2">
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>Consumed</span>
                    <span>{consumedCal} / {targetCal} kcal</span>
                  </div>
                  <div className="progress" style={{ height: '10px' }}>
                    <div className="progress-bar bg-success" role="progressbar" style={{ width: `${caloriePercent}%` }} aria-valuenow={caloriePercent} aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-muted d-block small">Daily Formula:</span>
                  <span className="fw-semibold text-dark">{targetCal} kcal (Goal: {user?.goal || 'Maintain'})</span>
                </div>
                <Link to="/meals" className="btn btn-outline-green btn-sm mt-3 d-inline-flex align-items-center gap-2">
                  <span>Log Food</span>
                  <FaArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Water & Weight Card */}
        <div className="col-lg-6">
          <div className="health-card h-100">
            <h5 className="fw-bold text-dark-green mb-4 d-flex align-items-center gap-2">
              <FaTint />
              <span>Hydration Tracker</span>
            </h5>
            <div className="d-flex align-items-center gap-4 mb-4">
              <div className="d-inline-flex flex-column align-items-center justify-content-center rounded-circle border border-5 border-info" style={{ width: '100px', height: '100px', backgroundColor: '#ECFEFF' }}>
                <strong className="fs-5 text-info">{waterToday}</strong>
                <span className="text-muted" style={{ fontSize: '12px' }}>ml</span>
              </div>
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between small text-muted mb-1">
                  <span>Daily Hydration Goal</span>
                  <span>{waterToday} / {targetWater} ml</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div className="progress-bar bg-info" role="progressbar" style={{ width: `${waterPercent}%` }} aria-valuenow={waterPercent} aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <div className="d-flex gap-2 mt-3">
                  <button onClick={() => handleAddWater(250)} className="btn btn-sm btn-outline-info">+250ml Glass</button>
                  <button onClick={() => handleAddWater(500)} className="btn btn-sm btn-outline-info">+500ml Bottle</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Macronutrient Distribution Card */}
        <div className="col-lg-5">
          <div className="health-card h-100">
            <h5 className="fw-bold text-dark-green mb-4">Macronutrient Targets</h5>
            <div className="d-flex flex-column gap-3">
              {/* Protein */}
              <div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="fw-semibold">Protein (Yellow)</span>
                  <span className="text-muted">{Math.round(summary.protein)}g / {targetProtein}g</span>
                </div>
                <div className="macro-bar">
                  <div className="macro-bar-fill macro-protein" style={{ width: `${proteinPercent}%` }}></div>
                </div>
              </div>

              {/* Carbs */}
              <div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="fw-semibold">Carbs (Blue)</span>
                  <span className="text-muted">{Math.round(summary.carbs)}g / {targetCarbs}g</span>
                </div>
                <div className="macro-bar">
                  <div className="macro-bar-fill macro-carbs" style={{ width: `${carbsPercent}%` }}></div>
                </div>
              </div>

              {/* Fat */}
              <div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="fw-semibold">Fats (Red)</span>
                  <span className="text-muted">{Math.round(summary.fat)}g / {targetFat}g</span>
                </div>
                <div className="macro-bar">
                  <div className="macro-bar-fill macro-fat" style={{ width: `${fatPercent}%` }}></div>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-top bg-light-bg p-3 rounded-3" style={{ fontSize: '13px' }}>
              <strong>Dietary Type:</strong> {user?.dietaryPreference || 'Any'} <br />
              <strong>Health Goal:</strong> {user?.goal || 'Maintain'}
            </div>
          </div>
        </div>

        {/* Weekly Charts */}
        <div className="col-lg-7">
          <div className="health-card h-100">
            <h5 className="fw-bold text-dark-green mb-3">Weekly Calorie Trends</h5>
            <div style={{ width: '100%', height: '240px' }}>
              {history.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={history}>
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                    <Bar dataKey="calories" fill="#16A34A" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
                  <FaWeight className="fs-2 mb-2" />
                  <p className="m-0 text-center">No calorie trends recorded yet. <br />Meals logged will populate daily snapshots.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
