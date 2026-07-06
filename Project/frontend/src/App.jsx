import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout & Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';

// Pages
import Landing from './pages/Landing/Landing';
import Login from './pages/Authentication/Login';
import Register from './pages/Authentication/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/Profile/Profile';
import MealLogger from './pages/Meals/MealLogger';
import DietPlans from './pages/Plans/DietPlans';
import ProgressTracker from './pages/Progress/Progress';
import Reports from './pages/Reports/Reports';

// Dietitian Pages
import DietitianDashboard from './pages/Dietitian/DietitianDashboard';
import Clients from './pages/Dietitian/Clients';
import DietitianMealPlans from './pages/Dietitian/DietitianMealPlans';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import UsersList from './pages/Admin/UsersList';
import AllPlans from './pages/Admin/AllPlans';

// Protected Route Guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Role mismatch: redirect to their respective dashboard
    if (user.role === 'Admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'Dietitian') return <Navigate to="/dietitian/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Syncing Session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <div className={user ? "dashboard-layout flex-grow-1" : "flex-grow-1"}>
        <Sidebar />
        <main className={user ? "main-content" : ""}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Client/User Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['User']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['User']}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/meals"
              element={
                <ProtectedRoute allowedRoles={['User']}>
                  <MealLogger />
                </ProtectedRoute>
              }
            />
            <Route
              path="/plans"
              element={
                <ProtectedRoute allowedRoles={['User']}>
                  <DietPlans />
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress"
              element={
                <ProtectedRoute allowedRoles={['User']}>
                  <ProgressTracker />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute allowedRoles={['User']}>
                  <Reports />
                </ProtectedRoute>
              }
            />

            {/* Protected Dietitian Routes */}
            <Route
              path="/dietitian/dashboard"
              element={
                <ProtectedRoute allowedRoles={['Dietitian']}>
                  <DietitianDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dietitian/clients"
              element={
                <ProtectedRoute allowedRoles={['Dietitian']}>
                  <Clients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dietitian/plans"
              element={
                <ProtectedRoute allowedRoles={['Dietitian']}>
                  <DietitianMealPlans />
                </ProtectedRoute>
              }
            />

            {/* Protected Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <UsersList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/plans"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AllPlans />
                </ProtectedRoute>
              }
            />

            {/* Fallback Catch-All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
