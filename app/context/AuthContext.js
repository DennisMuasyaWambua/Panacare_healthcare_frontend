"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const token = localStorage.getItem('access_token');
      const userData = localStorage.getItem('user_data');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Auth check error:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (loginResponse) => {
    try {
      // Store tokens
      localStorage.setItem('access_token', loginResponse.access);
      localStorage.setItem('refresh_token', loginResponse.refresh);
      
      // Store user data
      localStorage.setItem('user_data', JSON.stringify(loginResponse.user));
      
      // Store roles for easy access
      localStorage.setItem('user_roles', JSON.stringify(loginResponse.roles));
      
      // Store role data if needed
      localStorage.setItem('role_data', JSON.stringify(loginResponse.role_data));
      
      // Set user state
      setUser(loginResponse.user);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_roles');
    localStorage.removeItem('role_data');
    setUser(null);
    window.location.href = '/login';
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const hasRole = (roleName) => {
    const roles = JSON.parse(localStorage.getItem('user_roles') || '[]');
    return roles.includes(roleName);
  };

  const getRoleData = (roleName) => {
    const roleData = JSON.parse(localStorage.getItem('role_data') || '{}');
    return roleData[roleName] || null;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    getAuthHeaders,
    hasRole,
    getRoleData,
    isAuthenticated: !!user,
    // Keep backward compatibility
    isReady: !loading,
    setAuthenticated: (value) => setUser(value ? user : null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};