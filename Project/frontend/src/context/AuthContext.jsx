import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user details on load if token exists
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
          } else {
            localStorage.removeItem('token');
            setUser(null);
          }
        } catch (err) {
          console.error('Error fetching auth user', err);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data); // Contains email, name, role, token, _id
        // Refetch complete user details to populate profile details
        const meRes = await api.get('/auth/me');
        if (meRes.data.success) {
          setUser(meRes.data.user);
        }
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed. Please check credentials.'
      };
    }
  };

  // Register handler
  const register = async (name, email, password, role) => {
    try {
      const res = await api.post('/auth/register', { name, email, password, role });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data);
        // Refetch user details
        const meRes = await api.get('/auth/me');
        if (meRes.data.success) {
          setUser(meRes.data.user);
        }
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed.'
      };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Update profile details
  const updateProfile = async (profileData) => {
    try {
      const res = await api.put('/users/profile', profileData);
      if (res.data.success) {
        setUser(res.data.user);
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Profile update failed.'
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
