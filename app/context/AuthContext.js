"use client";
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/navigation';
import authUtils from '../utils/authUtils';

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
  const router = useRouter();

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = () => {
      try {
        // Always cleanup conflicting tokens first
        authUtils.cleanupConflictingTokens();
        
        // Check if we're in the process of logging out
        if (authUtils.isLoggingOut()) {
          setUser(null);
          authUtils.completeLogout();
          return;
        }
        
        // Check if we have an authenticated session
        if (authUtils.isAuthenticated()) {
          // Load user data
          const userData = authUtils.getUserData();
          setUser(userData);
        } else {
          // Not authenticated, clear user
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback((loginResponse) => {
    try {
      // Store authentication data
      const success = authUtils.storeAuthData(loginResponse);
      
      // Update local state
      if (success && loginResponse.user) {
        setUser(loginResponse.user);
      }
      
      return success;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    // Start by setting the logout flag
    authUtils.startLogout();
    
    // Clear user state immediately
    setUser(null);
    
    // Complete the logout (clear all data) 
    authUtils.completeLogout();
    
    // Force a clean page reload to avoid any stale state
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }, []);

  const getAuthHeaders = useCallback(() => {
    return authUtils.getAuthHeaders();
  }, []);

  const hasRole = useCallback((roleName) => {
    return authUtils.hasRole(roleName);
  }, []);

  const getRoleData = useCallback(() => {
    return {}; // Simplified for now, can be expanded if needed
  }, []);

  // Use useMemo to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    loading,
    login,
    logout,
    getAuthHeaders,
    hasRole,
    getRoleData,
    isAuthenticated: authUtils.isAuthenticated(),
    isLoggingOut: authUtils.isLoggingOut(),
    isInitialized,
    // Keep backward compatibility
    isReady: !loading,
    setAuthenticated: (value) => setUser(value ? user : null)
  }), [user, loading, login, logout, getAuthHeaders, hasRole, getRoleData, isInitialized]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};