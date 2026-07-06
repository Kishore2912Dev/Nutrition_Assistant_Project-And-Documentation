import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaAppleAlt } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, login } = useAuth();
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

    const result = await login(email, password);
    setLoading(false);

    if (!result || !result.success) {
      setError(result?.message || 'Login failed');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="health-card p-4 shadow-sm bg-white" style={{ marginTop: '10%' }}>
            <div className="text-center mb-4">
              <FaAppleAlt className="text-primary-green fs-1 mb-2" />
              <h2 className="fw-bold">Sign In to NutriGuide</h2>
              <p className="text-muted">Enter your credentials to access your account</p>
            </div>

            {error && <div className="alert alert-danger p-2 fs-6">{error}</div>}

            <form onSubmit={handleSubmit}>
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

              <div className="mb-4">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary-green w-100 py-2 fs-5 mb-3" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="text-center">
              <span className="text-muted">Don't have an account? </span>
              <Link to="/register" className="text-primary-green fw-semibold text-decoration-none">
                Register here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
