"use client";
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

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
  const [isInitialized, setIsInitialized] = useState(false);

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      // Use synchronous localStorage access to prevent race conditions
      const token = localStorage.getItem('access_token');
      const userData = localStorage.getItem('user_data');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Auth check error:', error);
      // Clear any corrupted data
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('user_roles');
      localStorage.removeItem('role_data');
      setUser(null);
    } finally {
      setLoading(false);
      setIsInitialized(true);
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
    // First clear the user state to prevent protected route redirects
    setUser(null);
    
    // Then clear localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_roles');
    localStorage.removeItem('role_data');
    
    // Router navigation will happen in the component that calls logout
    // This prevents flickering by avoiding direct window.location changes
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

  // Use useMemo to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    loading,
    login,
    logout,
    getAuthHeaders,
    hasRole,
    getRoleData,
    isAuthenticated: !!user,
    isInitialized,
    // Keep backward compatibility
    isReady: !loading,
    setAuthenticated: (value) => setUser(value ? user : null)
  }), [user, loading, isInitialized]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};