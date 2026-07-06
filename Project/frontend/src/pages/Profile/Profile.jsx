import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaWeight, FaRulerVertical, FaCalendar, FaHeartbeat } from 'react-icons/fa';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [age, setAge] = useState(user?.age || '');
  const [gender, setGender] = useState(user?.gender || 'Male');
  const [height, setHeight] = useState(user?.height || '');
  const [weight, setWeight] = useState(user?.weight || '');
  const [activityLevel, setActivityLevel] = useState(user?.activityLevel || 'Sedentary');
  const [goal, setGoal] = useState(user?.goal || 'Maintain Weight');
  const [dietaryPreference, setDietaryPreference] = useState(user?.dietaryPreference || 'Any');
  const [medicalConditions, setMedicalConditions] = useState(user?.medicalConditions || '');

  const [message, setMessage] = useState({ text: '', type: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    setSubmitting(true);

    const result = await updateProfile({
      age: age ? Number(age) : null,
      gender,
      height: height ? Number(height) : null,
      weight: weight ? Number(weight) : null,
      activityLevel,
      goal,
      dietaryPreference,
      medicalConditions
    });

    setSubmitting(false);

    if (result && result.success) {
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } else {
      setMessage({ text: result?.message || 'Failed to update profile.', type: 'danger' });
    }
  };

  return (
    <div className="container py-2">
      <div className="row g-4">
        {/* Left Side: Summary and BMI */}
        <div className="col-md-4">
          <div className="health-card text-center mb-4">
            <div className="d-flex justify-content-center mb-3">
              <div className="bg-light-green p-4 rounded-circle text-primary-green fs-1">
                <FaUser />
              </div>
            </div>
            <h3 className="fw-bold">{user?.name}</h3>
            <p className="text-muted">{user?.email}</p>
            <span className="badge bg-primary-green px-3 py-2 rounded-pill fs-6">{user?.role}</span>
          </div>

          <div className="health-card text-center">
            <h5 className="fw-bold text-dark-green mb-3">Body Mass Index (BMI)</h5>
            {user?.bmi ? (
              <div>
                <span className="display-4 fw-bold text-dark-green">{user.bmi}</span>
                <p className="mt-2 text-muted">
                  Category:{' '}
                  <strong className="text-dark">
                    {user.bmi < 18.5
                      ? 'Underweight'
                      : user.bmi < 24.9
                      ? 'Normal weight'
                      : user.bmi < 29.9
                      ? 'Overweight'
                      : 'Obese'}
                  </strong>
                </p>
                {/* Visual scale */}
                <div className="progress mt-3" style={{ height: '8px' }}>
                  <div className="progress-bar bg-warning" role="progressbar" style={{ width: '18.5%' }} aria-label="Underweight"></div>
                  <div className="progress-bar bg-success" role="progressbar" style={{ width: '30%' }} aria-label="Normal"></div>
                  <div className="progress-bar bg-warning" role="progressbar" style={{ width: '25%' }} aria-label="Overweight"></div>
                  <div className="progress-bar bg-danger" role="progressbar" style={{ width: '26.5%' }} aria-label="Obese"></div>
                </div>
              </div>
            ) : (
              <p className="text-muted m-0">Provide height & weight to calculate your BMI.</p>
            )}
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="col-md-8">
          <div className="health-card">
            <h4 className="fw-bold text-dark-green mb-4">Health & Fitness Profile</h4>

            {message.text && (
              <div className={`alert alert-${message.type} py-2 mb-4`} role="alert">
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-3">
                <div className="col-sm-6">
                  <label className="form-label fw-semibold">
                    <FaCalendar className="me-2 text-muted" /> Age
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g. 28"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min={1}
                    max={120}
                  />
                </div>
                <div className="col-sm-6">
                  <label className="form-label fw-semibold">Gender</label>
                  <select className="form-select" value={gender || 'Male'} onChange={(e) => setGender(e.target.value)}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-sm-6">
                  <label className="form-label fw-semibold">
                    <FaRulerVertical className="me-2 text-muted" /> Height (cm)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g. 175"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    min={50}
                    max={250}
                  />
                </div>
                <div className="col-sm-6">
                  <label className="form-label fw-semibold">
                    <FaWeight className="me-2 text-muted" /> Weight (kg)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g. 70"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    min={10}
                    max={300}
                    step="0.1"
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-sm-6">
                  <label className="form-label fw-semibold">Activity Level</label>
                  <select
                    className="form-select"
                    value={activityLevel || 'Sedentary'}
                    onChange={(e) => setActivityLevel(e.target.value)}
                  >
                    <option value="Sedentary">Sedentary (Little/no exercise)</option>
                    <option value="Lightly Active">Lightly Active (1-3 days/week)</option>
                    <option value="Moderately Active">Moderately Active (3-5 days/week)</option>
                    <option value="Very Active">Very Active (6-7 days/week)</option>
                  </select>
                </div>
                <div className="col-sm-6">
                  <label className="form-label fw-semibold">Health Goal</label>
                  <select
                    className="form-select"
                    value={goal || 'Maintain Weight'}
                    onChange={(e) => setGoal(e.target.value)}
                  >
                    <option value="Lose Weight">Lose Weight (Caloric Deficit)</option>
                    <option value="Maintain Weight">Maintain Weight</option>
                    <option value="Gain Muscle">Gain Muscle (Caloric Surplus)</option>
                    <option value="Improve Health">Improve Health (Balanced Metabolic)</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Dietary Preference</label>
                <select
                  className="form-select"
                  value={dietaryPreference || 'Any'}
                  onChange={(e) => setDietaryPreference(e.target.value)}
                >
                  <option value="Any">No Preference / Any</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Vegan">Vegan (Plant-based)</option>
                  <option value="Keto">Keto (High fat, low carb)</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">
                  <FaHeartbeat className="me-2 text-muted" /> Medical Conditions
                </label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="e.g. Hypertension, Type 2 Diabetes, Lactose Intolerance (comma separated)"
                  value={medicalConditions}
                  onChange={(e) => setMedicalConditions(e.target.value)}
                ></textarea>
                <small className="text-muted">
                  Our system adapts nutritional recommendations and foods to avoid based on medical warnings.
                </small>
              </div>

              <button type="submit" className="btn btn-primary-green w-100 py-2 fs-5" disabled={submitting}>
                {submitting ? 'Saving Profile...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
