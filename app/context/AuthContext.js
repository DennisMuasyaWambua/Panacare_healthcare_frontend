"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

// Create auth context
const AuthContext = createContext({
  isAuthenticated: false,
  setAuthenticated: () => {},
});

// Auth provider component
export function AuthProvider({ children }) {
  const [isAuthenticated, setAuthenticated] = useState(true); // Default to true in development
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Always set a token in development mode
    if (typeof window !== 'undefined') {
      // Set a default token to ensure authentication
      localStorage.setItem('pana_access_token', 'default_auth_token');
      setAuthenticated(true);
      setIsReady(true);
    }
  }, []);

  // Expose auth context
  const value = {
    isAuthenticated,
    setAuthenticated,
    isReady,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}