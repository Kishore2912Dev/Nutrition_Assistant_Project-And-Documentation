import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaAppleAlt } from 'react-icons/fa';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, register } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'Admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'Dietitian') {
        navigate('/dietitian/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register(name, email, password, role);
    setLoading(false);

    if (!result || !result.success) {
      setError(result?.message || 'Registration failed');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="health-card p-4 shadow-sm bg-white" style={{ marginTop: '5%' }}>
            <div className="text-center mb-4">
              <FaAppleAlt className="text-primary-green fs-1 mb-2" />
              <h2 className="fw-bold">Create Account</h2>
              <p className="text-muted">Start tracking your health journey with us</p>
            </div>

            {error && <div className="alert alert-danger p-2 fs-6">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Account Role</label>
                <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="User">User (Client)</option>
                  <option value="Dietitian">Dietitian (Practioner)</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary-green w-100 py-2 fs-5 mb-3" disabled={loading}>
                {loading ? 'Creating Account...' : 'Register'}
              </button>
            </form>

            <div className="text-center">
              <span className="text-muted">Already have an account? </span>
              <Link to="/login" className="text-primary-green fw-semibold text-decoration-none">
                Sign In here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
