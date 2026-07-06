import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaAppleAlt, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-navbar px-3 py-2 shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold text-dark-green fs-4" to="/">
          <FaAppleAlt className="text-primary-green fs-3" />
          <span>NutriGuide</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-2 mt-2 mt-lg-0">
            {user ? (
              <>
                <li className="nav-item d-flex align-items-center gap-2 me-3">
                  <FaUserCircle className="text-gray-text fs-4" />
                  <div className="d-flex flex-column">
                    <span className="fw-semibold text-dark lh-1 fs-6">{user.name}</span>
                    <span className="badge bg-light-green text-dark-green fw-bold mt-1" style={{ fontSize: '10px', width: 'fit-content' }}>
                      {user.role}
                    </span>
                  </div>
                </li>
                <li className="nav-item">
                  <button onClick={handleLogout} className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1">
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="btn btn-outline-green me-2" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-primary-green" to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
