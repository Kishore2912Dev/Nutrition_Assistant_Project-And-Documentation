import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaChartPie,
  FaUser,
  FaUtensils,
  FaCalendarAlt,
  FaWeight,
  FaFileAlt,
  FaUsers,
  FaChartBar,
  FaAddressBook
} from 'react-icons/fa';

const Sidebar = () => {
  const { user } = useAuth();

  if (!user) return null;

  const renderLinks = () => {
    switch (user.role) {
      case 'User':
        return (
          <>
            <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <FaChartPie />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <FaUser />
              <span>Profile</span>
            </NavLink>
            <NavLink to="/meals" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <FaUtensils />
              <span>Meal Logger</span>
            </NavLink>
            <NavLink to="/plans" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <FaCalendarAlt />
              <span>Diet Plans</span>
            </NavLink>
            <NavLink to="/progress" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <FaWeight />
              <span>Progress Tracker</span>
            </NavLink>
            <NavLink to="/reports" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <FaFileAlt />
              <span>Reports</span>
            </NavLink>
          </>
        );
      case 'Dietitian':
        return (
          <>
            <NavLink to="/dietitian/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <FaChartPie />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/dietitian/clients" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <FaUsers />
              <span>Clients</span>
            </NavLink>
            <NavLink to="/dietitian/plans" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <FaCalendarAlt />
              <span>Meal Plans</span>
            </NavLink>
          </>
        );
      case 'Admin':
        return (
          <>
            <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <FaChartPie />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/admin/users" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <FaUsers />
              <span>Users</span>
            </NavLink>
            <NavLink to="/admin/plans" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <FaCalendarAlt />
              <span>All Plans</span>
            </NavLink>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="sidebar shadow-sm no-print">
      <div className="d-flex flex-column h-100">
        <div className="mb-4 px-2 text-white">
          <h6 className="text-uppercase tracking-wider text-muted m-0" style={{ fontSize: '12px' }}>
            Menu Navigation
          </h6>
        </div>
        <nav className="nav flex-column">
          {renderLinks()}
        </nav>
        <div className="mt-auto pt-3 border-top border-secondary text-muted px-2" style={{ fontSize: '11px' }}>
          <p className="mb-1">NutriGuide Client Portal</p>
          <p className="mb-0">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
